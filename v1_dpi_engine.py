"""
╔══════════════════════════════════════════════════════════════════╗
║  DRIP POWER INDEX (DPI) — V1 ENGINE                            ║
║  The PocketFives of Prediction Markets                         ║
║                                                                ║
║  Ingests wallet CSV → Runs proprietary scoring → Outputs JSON  ║
║  for the Obsidian leaderboard component on thedrip.to          ║
║                                                                ║
║  Run: python v1_dpi_engine.py                                  ║
║  Cadence: Every Wednesday                                      ║
╚══════════════════════════════════════════════════════════════════╝

FORMULA ARCHITECTURE
────────────────────
base_dpi = (0.45 × Decay Score) + (0.35 × Yield Score) + (0.20 × Conviction Score)
final_dpi = base_dpi × Versatility Multiplier (1.00 – 1.12×)

Where:
  Decay Score     → Time-weighted P&L using PocketFives sliding window
                    (1.00× for 0-3mo, 0.75× for 3-6mo, 0.50× for 6-9mo, 0.25× for 9-12mo)
  Yield Score     → ROI = P&L / Capital Deployed (not volume — avoids wash-trade inflation)
  Conviction Score→ Median trade size × concentration ratio (top-5 trades as % of volume)
                    This is the BOT KILLER. Bots have low median sizes and flat distributions.
                    Whales have high medians and concentrated top trades.
  Versatility     → Multiplier only. +0.03× per profitable category beyond the first, capped at 1.12×.
                    Applied AFTER base scoring to avoid double-counting.

NOTES ON DATA
─────────────
- V1 ingests a flat CSV exported from Dune Analytics or PolymarketAnalytics
- Required columns documented in REQUIRED_COLUMNS below
- The template generator creates realistic test data if no CSV is found
- JSON output feeds directly into the React leaderboard component
"""

import pandas as pd
import numpy as np
import os
import json
import hashlib
from datetime import datetime

# ─── Configuration ───────────────────────────────────────────────

CSV_FILE = "raw_wallets_export.csv"
OUTPUT_JSON = "dpi_leaderboard.json"
OUTPUT_META = "dpi_meta.json"
TOP_N = 50

REQUIRED_COLUMNS = [
    "wallet_address",
    "total_volume_usd",
    "total_pnl_usd",
    "total_trades",
    "median_trade_usd",       # Median individual trade size — the bot-killer signal
    "top5_volume_usd",        # Sum of 5 largest trades — concentration signal
    "pnl_0_3mo",              # P&L from trades in last 0-3 months
    "pnl_3_6mo",              # P&L from trades 3-6 months ago
    "pnl_6_9mo",              # P&L from trades 6-9 months ago
    "pnl_9_12mo",             # P&L from trades 9-12 months ago
    "profitable_categories",  # Count of categories with positive P&L
    "primary_category",       # Category with highest P&L
    "total_markets",          # Distinct markets traded
    "win_rate",               # Percentage of markets with positive P&L
]

# Decay weights — PocketFives model, four tiers
DECAY_WEIGHTS = {
    "pnl_0_3mo": 1.00,
    "pnl_3_6mo": 0.75,
    "pnl_6_9mo": 0.50,
    "pnl_9_12mo": 0.25,
}

# Component weights in base DPI (must sum to 1.0)
# Versatility is applied ONLY as a multiplier — not double-counted in base
W_DECAY = 0.45
W_YIELD = 0.35
W_CONVICTION = 0.20

# Known wallet monikers — editorial layer
KNOWN_MONIKERS = {
    "0xd91a5e5a35150b26e52e9403e086c58a7e4a4f27": {"name": "The Oracle of Paris", "note": "Théo / Fredi9999 — $85M election trade"},
    "0x1234axiom": {"name": "The Axiom Ring", "note": "Insider cluster — Iran strike, Feb 2026"},
    "0xascetic0x": {"name": "The Compounder", "note": "$12 → $100K in 16 binary BTC bets"},
    "0xwindwalk3": {"name": "The Policy Hawk", "note": "$1.1M profit, RFK Jr. health policy specialist"},
}


# ─── Template Generator ─────────────────────────────────────────

def generate_template():
    """
    Creates a realistic test CSV with 500 wallets.
    Includes known archetypes: whales, bots, specialists, graveyard wallets.
    """
    print(f"\n  ⚠  '{CSV_FILE}' not found.")
    print(f"  →  Generating template with 500 test wallets...\n")

    rng = np.random.default_rng(42)
    n = 500

    wallet_addresses = [f"0x{os.urandom(20).hex()}" for _ in range(n)]

    # Base distributions
    total_volume = rng.lognormal(mean=11, sigma=2, size=n).clip(1000, 50_000_000)
    total_trades = rng.lognormal(mean=4, sigma=1.5, size=n).astype(int).clip(1, 100_000)
    total_pnl = rng.normal(loc=5000, scale=80000, size=n)

    # Median trade size — key bot-killer signal
    # Bots: low median (< $100). Humans: $500-$50K. Whales: $10K-$500K.
    median_trade = total_volume / (total_trades * rng.uniform(0.8, 3.0, n))
    median_trade = median_trade.clip(5, 500_000)

    # Top-5 concentration — whales concentrate, bots distribute
    top5_share = rng.beta(2, 5, n)  # Most wallets have moderate concentration
    top5_volume = total_volume * top5_share

    # Temporal P&L breakdown (sum should approximate total_pnl)
    pnl_splits = rng.dirichlet([4, 3, 2, 1], n)
    pnl_0_3 = total_pnl * pnl_splits[:, 0]
    pnl_3_6 = total_pnl * pnl_splits[:, 1]
    pnl_6_9 = total_pnl * pnl_splits[:, 2]
    pnl_9_12 = total_pnl * pnl_splits[:, 3]

    profitable_categories = rng.integers(0, 6, n)
    categories = ["Politics", "Sports", "Crypto", "Macro", "Culture"]
    primary_category = rng.choice(categories, n)
    total_markets = rng.integers(1, 500, n)
    win_rate = rng.beta(3, 4, n) * 100

    # Inject known archetypes
    # [0] = French Whale archetype: massive volume, high conviction, concentrated
    wallet_addresses[0] = "0xd91a5e5a35150b26e52e9403e086c58a7e4a4f27"
    total_volume[0] = 85_000_000
    total_pnl[0] = 48_000_000
    total_trades[0] = 847
    median_trade[0] = 45_000
    top5_volume[0] = 42_000_000
    pnl_0_3[0] = 2_000_000
    pnl_3_6[0] = 5_000_000
    pnl_6_9[0] = 15_000_000
    pnl_9_12[0] = 26_000_000
    profitable_categories[0] = 2
    primary_category[0] = "Politics"
    total_markets[0] = 23
    win_rate[0] = 78.3

    # [1] = Bot archetype: insane volume, tiny trades, thin margin
    wallet_addresses[1] = "0xbot_arb_example"
    total_volume[1] = 12_000_000
    total_pnl[1] = 180_000
    total_trades[1] = 95_000
    median_trade[1] = 42
    top5_volume[1] = 85_000
    pnl_0_3[1] = 60_000
    pnl_3_6[1] = 50_000
    pnl_6_9[1] = 40_000
    pnl_9_12[1] = 30_000
    profitable_categories[1] = 1
    primary_category[1] = "Crypto"
    total_markets[1] = 2400
    win_rate[1] = 52.1

    # [2] = Graveyard whale: big volume, massive losses
    wallet_addresses[2] = "0xgraveyard_example"
    total_volume[2] = 3_500_000
    total_pnl[2] = -890_000
    total_trades[2] = 156
    median_trade[2] = 12_000
    top5_volume[2] = 1_200_000
    pnl_0_3[2] = -340_000
    pnl_3_6[2] = -280_000
    pnl_6_9[2] = -170_000
    pnl_9_12[2] = -100_000
    profitable_categories[2] = 0
    primary_category[2] = "Politics"
    total_markets[2] = 34
    win_rate[2] = 23.5

    df = pd.DataFrame({
        "wallet_address": wallet_addresses,
        "total_volume_usd": np.round(total_volume, 2),
        "total_pnl_usd": np.round(total_pnl, 2),
        "total_trades": total_trades,
        "median_trade_usd": np.round(median_trade, 2),
        "top5_volume_usd": np.round(top5_volume, 2),
        "pnl_0_3mo": np.round(pnl_0_3, 2),
        "pnl_3_6mo": np.round(pnl_3_6, 2),
        "pnl_6_9mo": np.round(pnl_6_9, 2),
        "pnl_9_12mo": np.round(pnl_9_12, 2),
        "profitable_categories": profitable_categories,
        "primary_category": primary_category,
        "total_markets": total_markets,
        "win_rate": np.round(win_rate, 1),
    })

    df.to_csv(CSV_FILE, index=False)
    print(f"  ✅  Template saved: {CSV_FILE}")
    print(f"  →  Replace with real Dune export when ready.\n")
    return df


# ─── Core Engine ─────────────────────────────────────────────────

def compute_dpi(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes the Drip Power Index for every wallet in the dataframe.
    Returns the full dataframe with DPI scores and component breakdowns.
    """
    df = df.copy()
    df = df.fillna(0)

    # ── 1. DECAY SCORE ──────────────────────────────────────────
    # Time-weighted P&L using PocketFives sliding window
    df["decay_raw"] = (
        df["pnl_0_3mo"] * DECAY_WEIGHTS["pnl_0_3mo"]
        + df["pnl_3_6mo"] * DECAY_WEIGHTS["pnl_3_6mo"]
        + df["pnl_6_9mo"] * DECAY_WEIGHTS["pnl_6_9mo"]
        + df["pnl_9_12mo"] * DECAY_WEIGHTS["pnl_9_12mo"]
    )

    # ── 2. YIELD SCORE ──────────────────────────────────────────
    # ROI = P&L / Volume deployed. Rewards efficiency, not size.
    df["yield_raw"] = np.where(
        df["total_volume_usd"] > 0,
        df["total_pnl_usd"] / df["total_volume_usd"],
        0,
    )
    # Winsorize at 1st/99th percentile to cap outliers
    p01, p99 = df["yield_raw"].quantile(0.01), df["yield_raw"].quantile(0.99)
    df["yield_raw"] = df["yield_raw"].clip(lower=p01, upper=p99)

    # ── 3. CONVICTION SCORE (THE BOT-KILLER) ────────────────────
    # Formula: ln(1 + median_trade) × (0.5 + 0.5 × top5_concentration)
    #
    # WHY THIS WORKS:
    # - Bots have median trade sizes of $20-$100 → ln(1+50) = 3.93
    # - Whales have medians of $10K-$50K → ln(1+25000) = 10.13
    # - The log compresses the range so a $500K whale isn't 10,000× a $50 bot
    # - Top-5 concentration ratio catches bots that distribute evenly
    #   (bot top-5 = 0.01% of volume, whale top-5 = 40%+ of volume)
    #
    df["top5_concentration"] = np.where(
        df["total_volume_usd"] > 0,
        (df["top5_volume_usd"] / df["total_volume_usd"]).clip(0, 1),
        0,
    )
    df["conviction_raw"] = np.log1p(df["median_trade_usd"]) * (
        0.5 + 0.5 * df["top5_concentration"]
    )

    # ── 4. VERSATILITY SCORE ────────────────────────────────────
    # Profitable in 1 category = 1.00×, each additional = +0.03×, cap 1.12×
    # Applied ONLY as a multiplier on final score — not in base_dpi
    df["versatility_mult"] = (
        1.0 + 0.03 * (df["profitable_categories"] - 1).clip(lower=0)
    ).clip(upper=1.12)

    # ── 5. PERCENTILE RANKING ───────────────────────────────────
    # Convert raw scores to 0-100 percentile ranks within the cohort
    df["decay_pct"] = df["decay_raw"].rank(pct=True) * 100
    df["yield_pct"] = df["yield_raw"].rank(pct=True) * 100
    df["conviction_pct"] = df["conviction_raw"].rank(pct=True) * 100

    # ── 6. MASTER FORMULA ───────────────────────────────────────
    # Base DPI is a pure 3-component percentile blend (0.45 + 0.35 + 0.20 = 1.0)
    # Versatility applied ONLY as a multiplier — never in the base
    df["base_dpi"] = (
        W_DECAY * df["decay_pct"]
        + W_YIELD * df["yield_pct"]
        + W_CONVICTION * df["conviction_pct"]
    )
    df["final_dpi"] = df["base_dpi"] * df["versatility_mult"]

    return df


def build_leaderboard(df: pd.DataFrame) -> list[dict]:
    """
    Takes scored dataframe, extracts top N, applies editorial layer,
    and returns JSON-ready list of wallet cards.
    """
    top = df.nlargest(TOP_N, "final_dpi").copy()
    top.insert(0, "rank", range(1, len(top) + 1))

    records = []
    for _, row in top.iterrows():
        addr = row["wallet_address"]
        meta = KNOWN_MONIKERS.get(addr, {})

        # Truncate wallet for display: 0x1234...abcd
        short_addr = f"{addr[:6]}...{addr[-4:]}" if len(addr) > 12 else addr

        # Determine tier label
        dpi = row["final_dpi"]
        if dpi >= 90:
            tier = "LEGENDARY"
        elif dpi >= 75:
            tier = "ELITE"
        elif dpi >= 60:
            tier = "SHARP"
        elif dpi >= 45:
            tier = "CONTENDER"
        else:
            tier = "EMERGING"

        records.append({
            "rank": int(row["rank"]),
            "wallet_address": addr,
            "wallet_short": short_addr,
            "moniker": meta.get("name", None),
            "note": meta.get("note", None),
            "dpi_score": round(float(dpi), 1),
            "tier": tier,
            "total_pnl": round(float(row["total_pnl_usd"]), 0),
            "total_volume": round(float(row["total_volume_usd"]), 0),
            "win_rate": round(float(row["win_rate"]), 1),
            "total_markets": int(row["total_markets"]),
            "total_trades": int(row["total_trades"]),
            "primary_category": row["primary_category"],
            "profitable_categories": int(row["profitable_categories"]),
            "components": {
                "decay": round(float(row["decay_pct"]), 1),
                "yield": round(float(row["yield_pct"]), 1),
                "conviction": round(float(row["conviction_pct"]), 1),
            },
            "median_trade": round(float(row["median_trade_usd"]), 0),
            "top5_concentration": round(float(row["top5_concentration"]) * 100, 1),
        })

    return records


def run():
    print()
    print("  ╔══════════════════════════════════════════════╗")
    print("  ║  💧  DRIP POWER INDEX — V1 ENGINE           ║")
    print("  ╚══════════════════════════════════════════════╝")
    print()

    # 1. Load or generate data
    if not os.path.exists(CSV_FILE):
        df = generate_template()
    else:
        print(f"  ✅  Found {CSV_FILE}")
        df = pd.read_csv(CSV_FILE)

        # Validate columns
        missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
        if missing:
            print(f"\n  ❌  Missing columns: {missing}")
            print(f"  →  Required: {REQUIRED_COLUMNS}")
            return

        print(f"  →  {len(df):,} wallets loaded\n")

    # 2. Score
    scored = compute_dpi(df)

    # 3. Build leaderboard
    leaderboard = build_leaderboard(scored)

    # 4. Build metadata
    snapshot_date = datetime.now().strftime("%Y-%m-%d")
    meta = {
        "snapshot_date": snapshot_date,
        "total_wallets_scored": len(scored),
        "formula_version": "1.0",
        "weights": {
            "decay": W_DECAY,
            "yield": W_YIELD,
            "conviction": W_CONVICTION,
            "versatility": "1.00-1.12x multiplier (not in base)",
        },
        "decay_tiers": DECAY_WEIGHTS,
        "top_wallet": leaderboard[0]["wallet_short"] if leaderboard else None,
        "top_dpi": leaderboard[0]["dpi_score"] if leaderboard else None,
    }

    # 5. Write outputs
    with open(OUTPUT_JSON, "w") as f:
        json.dump(leaderboard, f, indent=2)

    with open(OUTPUT_META, "w") as f:
        json.dump(meta, f, indent=2)

    print(f"  🏆  Rankings complete — {snapshot_date}")
    print(f"  →  {OUTPUT_JSON} ({len(leaderboard)} wallets)")
    print(f"  →  {OUTPUT_META}")
    print()

    # Preview top 5
    print("  ┌─── TOP 5 ──────────────────────────────────────────────┐")
    for w in leaderboard[:5]:
        name = w["moniker"] or w["wallet_short"]
        print(f"  │  #{w['rank']:>2}  {name:<24} DPI {w['dpi_score']:>5.1f}  │  ${w['total_pnl']:>12,.0f} P&L")
    print("  └────────────────────────────────────────────────────────┘")
    print()


if __name__ == "__main__":
    run()
