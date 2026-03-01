import { useState, useMemo, useEffect } from "react";

// ─── SAMPLE DATA (Replace with JSON fetch from dpi_leaderboard.json) ───
const SAMPLE_DATA = [
    { rank: 1, wallet_address: "0xf7a3b91c2d4e8f0a1b3c5d7e9f2a4b6c8d0e1f2a", wallet_short: "0xf7a3...1f2a", moniker: "The Fed Whisperer", note: "Macro specialist — 6 consecutive Fed calls", dpi_score: 97.2, tier: "LEGENDARY", total_pnl: 1840000, total_volume: 4200000, win_rate: 71.2, total_markets: 89, total_trades: 156, primary_category: "Macro", profitable_categories: 4, components: { decay: 96.8, yield: 98.1, conviction: 94.2 }, median_trade: 18500, top5_concentration: 38.4 },
    { rank: 2, wallet_address: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0", wallet_short: "0xa1b2...a9b0", moniker: null, note: null, dpi_score: 94.8, tier: "LEGENDARY", total_pnl: 2310000, total_volume: 8900000, win_rate: 64.3, total_markets: 203, total_trades: 412, primary_category: "Politics", profitable_categories: 5, components: { decay: 93.2, yield: 91.0, conviction: 88.7 }, median_trade: 12400, top5_concentration: 31.2 },
    { rank: 3, wallet_address: "0xwindwalk3000000000000000000000000000000000", wallet_short: "0xwind...0000", moniker: "The Policy Hawk", note: "$1.1M profit — RFK health policy specialist", dpi_score: 91.3, tier: "LEGENDARY", total_pnl: 1120000, total_volume: 3100000, win_rate: 68.9, total_markets: 34, total_trades: 67, primary_category: "Politics", profitable_categories: 2, components: { decay: 88.4, yield: 95.6, conviction: 91.3 }, median_trade: 28000, top5_concentration: 52.1 },
    { rank: 4, wallet_address: "0x9d84ce0306f8551e02efef1680475fc0f1dc1344", wallet_short: "0x9d84...1344", moniker: null, note: null, dpi_score: 89.7, tier: "ELITE", total_pnl: 2618357, total_volume: 9670000, win_rate: 63.0, total_markets: 178, total_trades: 890, primary_category: "Sports", profitable_categories: 3, components: { decay: 91.0, yield: 85.3, conviction: 76.4 }, median_trade: 5200, top5_concentration: 22.8 },
    { rank: 5, wallet_address: "0xascetic0x00000000000000000000000000000000", wallet_short: "0xasce...0000", moniker: "The Compounder", note: "$12 → $100K in 16 binary BTC bets", dpi_score: 88.1, tier: "ELITE", total_pnl: 99988, total_volume: 112000, win_rate: 100.0, total_markets: 16, total_trades: 16, primary_category: "Crypto", profitable_categories: 1, components: { decay: 82.0, yield: 99.8, conviction: 97.1 }, median_trade: 6200, top5_concentration: 71.3 },
    { rank: 6, wallet_address: "0xd218e474776403a330142299f7796e8ba32eb5c9", wallet_short: "0xd218...b5c9", moniker: null, note: null, dpi_score: 86.4, tier: "ELITE", total_pnl: 958059, total_volume: 5800000, win_rate: 67.0, total_markets: 145, total_trades: 320, primary_category: "Crypto", profitable_categories: 3, components: { decay: 87.3, yield: 83.1, conviction: 79.5 }, median_trade: 8900, top5_concentration: 28.6 },
    { rank: 7, wallet_address: "0x55aa66bb77cc88dd99ee00ff11223344556677ab", wallet_short: "0x55aa...77ab", moniker: null, note: null, dpi_score: 84.9, tier: "ELITE", total_pnl: 743000, total_volume: 4100000, win_rate: 59.4, total_markets: 234, total_trades: 567, primary_category: "Sports", profitable_categories: 4, components: { decay: 84.1, yield: 80.2, conviction: 72.8 }, median_trade: 4100, top5_concentration: 19.7 },
    { rank: 8, wallet_address: "0xab12cd34ef56ab78cd90ef12ab34cd56ef78ab90", wallet_short: "0xab12...ab90", moniker: "Erasmus", note: "$1.3M in political markets — polling + momentum", dpi_score: 83.2, tier: "ELITE", total_pnl: 1340000, total_volume: 7200000, win_rate: 62.1, total_markets: 67, total_trades: 198, primary_category: "Politics", profitable_categories: 2, components: { decay: 79.8, yield: 86.4, conviction: 85.1 }, median_trade: 21000, top5_concentration: 41.3 },
    { rank: 9, wallet_address: "0x1122334455667788990011223344556677889900", wallet_short: "0x1122...9900", moniker: null, note: null, dpi_score: 81.6, tier: "ELITE", total_pnl: 412000, total_volume: 2300000, win_rate: 71.8, total_markets: 156, total_trades: 289, primary_category: "Macro", profitable_categories: 3, components: { decay: 81.2, yield: 78.9, conviction: 68.3 }, median_trade: 3800, top5_concentration: 24.1 },
    { rank: 10, wallet_address: "0xaabbccddee0011223344aabbccddee0011223344", wallet_short: "0xaabb...3344", moniker: null, note: null, dpi_score: 79.8, tier: "ELITE", total_pnl: 567000, total_volume: 3800000, win_rate: 58.7, total_markets: 312, total_trades: 1204, primary_category: "Sports", profitable_categories: 5, components: { decay: 76.4, yield: 74.2, conviction: 61.8 }, median_trade: 1900, top5_concentration: 15.3 },
    { rank: 32, wallet_address: "0xd91a5e5a35150b26e52e9403e086c58a7e4a4f27", wallet_short: "0xd91a...4f27", moniker: "The Oracle of Paris", note: "Théo / Fredi9999 — $85M election trade", dpi_score: 62.4, tier: "SHARP", total_pnl: 48000000, total_volume: 85000000, win_rate: 78.3, total_markets: 23, total_trades: 847, primary_category: "Politics", profitable_categories: 2, components: { decay: 44.0, yield: 71.0, conviction: 99.2 }, median_trade: 45000, top5_concentration: 49.4 },
];

const TIER_COLORS = {
    LEGENDARY: { bg: "rgba(234,179,8,0.06)", border: "rgba(234,179,8,0.15)", text: "#eab308", glow: "rgba(234,179,8,0.08)" },
    ELITE: { bg: "rgba(99,102,241,0.06)", border: "rgba(99,102,241,0.12)", text: "#818cf8", glow: "rgba(99,102,241,0.06)" },
    SHARP: { bg: "rgba(22,163,74,0.06)", border: "rgba(22,163,74,0.12)", text: "#16a34a", glow: "rgba(22,163,74,0.06)" },
    CONTENDER: { bg: "rgba(100,116,139,0.06)", border: "rgba(100,116,139,0.12)", text: "#94a3b8", glow: "transparent" },
    EMERGING: { bg: "transparent", border: "#141618", text: "#475569", glow: "transparent" },
};

const CAT_COLORS = { Politics: "#ef4444", Sports: "#3b82f6", Crypto: "#f59e0b", Macro: "#8b5cf6", Culture: "#ec4899" };
const DPI_MAX_SCORE = 112;

function fmt(n) {
    const abs = Math.abs(n);
    const sign = n < 0 ? "-" : "";
    if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
    return `${sign}$${abs.toFixed(0)}`;
}

/* ── DPI Score Ring ── */
function ScoreRing({ score, size = 44, tier }) {
    const tc = TIER_COLORS[tier] || TIER_COLORS.EMERGING;
    const r = (size - 6) / 2;
    const c = 2 * Math.PI * r;
    const pct = Math.max(0, Math.min(score / DPI_MAX_SCORE, 1));
    return (
        <svg width={size} height={size} style={{ flexShrink: 0 }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#141618" strokeWidth={3} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tc.text} strokeWidth={3}
                strokeDasharray={`${c * pct} ${c * (1 - pct)}`} strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: "stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)" }} />
            <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
                style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: size * 0.27, fontWeight: 700, fill: tc.text }}>
                {score.toFixed(0)}
            </text>
        </svg>
    );
}

/* ── Component Bar ── */
function ComponentBar({ label, value, color }) {
    const [mounted, setMounted] = useState(false);
    const clamped = Math.max(0, Math.min(value, 100));
    useEffect(() => { const t = setTimeout(() => setMounted(true), 200); return () => clearTimeout(t); }, []);

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 42, fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, fontWeight: 600, color: "#2d3138", textAlign: "right", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
            <div style={{ flex: 1, height: 4, background: "#111214", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: mounted ? `${clamped}%` : "0%", background: color, borderRadius: 2, transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
            </div>
            <div style={{ width: 22, fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, fontWeight: 600, color: "#2d3138", textAlign: "right" }}>{value.toFixed(0)}</div>
        </div>
    );
}

/* ── Wallet Card ── */
function WalletCard({ w, expanded, onToggle }) {
    const tc = TIER_COLORS[w.tier] || TIER_COLORS.EMERGING;
    const cc = CAT_COLORS[w.primary_category] || "#64748b";
    const isSpecial = w.rank <= 3;

    return (
        <div onClick={onToggle} style={{
            background: expanded ? "#0e1012" : "#0a0b0c",
            border: `1px solid ${expanded ? tc.border : "#141618"}`,
            borderRadius: 10, padding: "16px 18px", cursor: "pointer",
            transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
            boxShadow: expanded ? `0 0 24px ${tc.glow}` : "none",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 28, textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: isSpecial ? 16 : 13, fontWeight: 800, color: isSpecial ? tc.text : "#3d4148", letterSpacing: "-0.02em" }}>{w.rank}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        {w.moniker ? (
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#e8eaed", letterSpacing: "-0.01em" }}>{w.moniker}</span>
                        ) : (
                            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 500, color: "#555b63" }}>{w.wallet_short}</span>
                        )}
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, fontWeight: 700, color: tc.text, background: tc.bg, border: `1px solid ${tc.border}`, padding: "2px 6px", borderRadius: 3, letterSpacing: "0.1em" }}>{w.tier}</span>
                    </div>
                    {w.moniker && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#2d3138", marginTop: 2 }}>{w.wallet_short}</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 700, color: w.total_pnl >= 0 ? "#16a34a" : "#ef4444", fontFeatureSettings: "'tnum'" }}>
                            {w.total_pnl > 0 ? "+" : ""}{fmt(w.total_pnl)}
                        </div>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#2d3138" }}>P&L</div>
                    </div>
                    <ScoreRing score={w.dpi_score} tier={w.tier} />
                </div>
            </div>

            <div style={{ display: "flex", gap: 16, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${expanded ? "#1a1c20" : "#111214"}`, flexWrap: "wrap" }}>
                {[
                    { l: "Win Rate", v: `${w.win_rate}%`, c: w.win_rate >= 60 ? "#16a34a" : "#555b63" },
                    { l: "Markets", v: w.total_markets },
                    { l: "Med. Trade", v: fmt(w.median_trade) },
                    { l: "Edge", v: w.primary_category, c: cc },
                    { l: "Volume", v: fmt(w.total_volume) },
                ].map((s) => (
                    <div key={s.l}>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1e2024", marginBottom: 1 }}>{s.l}</div>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, color: s.c || "#555b63", fontFeatureSettings: "'tnum'" }}>{s.v}</div>
                    </div>
                ))}
            </div>

            {expanded && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1a1c20" }}>
                    {w.note && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: "#3d4148", marginBottom: 10, lineHeight: 1.5, fontStyle: "italic" }}>"{w.note}"</div>}
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1e2024", marginBottom: 6 }}>DPI Components</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <ComponentBar label="Decay" value={w.components.decay} color="linear-gradient(90deg, #1a2636, #3b82f6)" />
                        <ComponentBar label="Yield" value={w.components.yield} color="linear-gradient(90deg, #1a2e1a, #16a34a)" />
                        <ComponentBar label="Conv." value={w.components.conviction} color="linear-gradient(90deg, #2d1f3d, #8b5cf6)" />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#1e2024" }}>Top-5 concentration: {w.top5_concentration}%</span>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#1e2024" }}>{w.profitable_categories}/5 categories profitable</span>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Main ── */
export default function App() {
    const [expandedRank, setExpandedRank] = useState(null);
    const [tierFilter, setTierFilter] = useState("ALL");
    const data = SAMPLE_DATA;

    const filtered = useMemo(() => {
        if (tierFilter === "ALL") return data;
        return data.filter((w) => w.tier === tierFilter);
    }, [data, tierFilter]);

    const tiers = ["ALL", "LEGENDARY", "ELITE", "SHARP", "CONTENDER"];
    const top50Wallets = useMemo(() => data.filter((w) => w.rank <= 50), [data]);
    const topPnlWallet = useMemo(() => {
        if (!data.length) return null;
        return data.reduce((best, w) => (w.total_pnl > best.total_pnl ? w : best), data[0]);
    }, [data]);
    const topPnl = topPnlWallet?.total_pnl ?? 0;
    const avgDpi = useMemo(() => {
        if (!top50Wallets.length) return "0.0";
        return (top50Wallets.reduce((sum, w) => sum + w.dpi_score, 0) / top50Wallets.length).toFixed(1);
    }, [top50Wallets]);

    return (
        <div style={{ minHeight: "100vh", background: "#08090a", color: "#e8eaed", fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif", WebkitFontSmoothing: "antialiased" }}>
            <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet" />

            <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", opacity: 0.02, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "200px" }} />

            <div style={{ maxWidth: 740, margin: "0 auto", padding: "48px 24px 72px", position: "relative" }}>

                {/* Masthead */}
                <div style={{ background: "#0c0d0e", border: "1px solid #141618", borderRadius: 14, padding: "36px 28px 32px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "-30%", right: "-5%", width: "45%", height: "160%", background: "radial-gradient(ellipse, rgba(234,179,8,0.04) 0%, transparent 60%)", pointerEvents: "none" }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#eab308", background: "rgba(234,179,8,0.06)", padding: "4px 10px", borderRadius: 4, border: "1px solid rgba(234,179,8,0.1)", marginBottom: 14 }}>
                            <span style={{ fontSize: 12 }}>💧</span>Updated Weekly · Inaugural Rankings
                        </div>
                        <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.08, margin: "0 0 6px", color: "#f0f1f3" }}>The Drip Power Index</h1>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: "#3d4148", margin: 0, lineHeight: 1.55, maxWidth: 500 }}>
                            The definitive ranking of prediction market traders. Not by who made the most —<span style={{ color: "#555b63" }}> by who's winning right now.</span>
                        </p>
                    </div>
                </div>

                {/* Stats Bar */}
                <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                    {[
                        { l: "Wallets Scored", v: "1.3M", sub: "Polymarket on-chain" },
                        { l: "Top P&L (All-Time)", v: fmt(topPnl), sub: topPnlWallet ? `Rank #${topPnlWallet.rank} — decay penalized` : "No data" },
                        { l: "Avg DPI (Top 50)", v: avgDpi, sub: `Out of ~${DPI_MAX_SCORE} max` },
                        { l: "Formula", v: "v1.0", sub: "3-component + multiplier" },
                    ].map((x) => (
                        <div key={x.l} style={{ flex: 1, minWidth: 140, background: "#0c0d0e", border: "1px solid #141618", borderRadius: 10, padding: "12px 14px" }}>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1e2024", marginBottom: 3 }}>{x.l}</div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 800, color: "#e8eaed", letterSpacing: "-0.02em", fontFeatureSettings: "'tnum'" }}>{x.v}</div>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#1e2024", marginTop: 1 }}>{x.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Methodology teaser */}
                <div style={{ background: "#0c0d0e", border: "1px solid #141618", borderRadius: 10, padding: "16px 20px", marginBottom: 24 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1e2024", marginBottom: 8 }}>Why Raw P&L Is a Flawed Metric</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#3d4148", lineHeight: 1.65 }}>
                        The all-time leaderboard is a graveyard of one-hit wonders. The DPI uses a three-component base score with a versatility multiplier that rewards
                        <span style={{ color: "#3b82f6", fontWeight: 600 }}> recent performance </span>(time-decayed P&L, 45%),
                        <span style={{ color: "#16a34a", fontWeight: 600 }}> capital efficiency </span>(ROI not raw profit, 35%), and
                        <span style={{ color: "#8b5cf6", fontWeight: 600 }}> conviction </span>(median trade size × concentration — the bot-killer, 20%).
                        <span style={{ color: "#eab308", fontWeight: 600 }}> Versatility </span> is applied as a 1.00–1.12× multiplier for edge across multiple categories. Scores decay weekly. If you stop winning, you drop.
                    </div>
                </div>

                {/* Tier Filter */}
                <div style={{ display: "flex", gap: 3, marginBottom: 16, flexWrap: "wrap" }}>
                    {tiers.map((t) => {
                        const active = tierFilter === t;
                        const tc = t === "ALL" ? { text: "#e8eaed", border: "#e8eaed", bg: "rgba(255,255,255,0.04)" } : TIER_COLORS[t];
                        return (
                            <button key={t} onClick={() => setTierFilter(t)} style={{
                                padding: "5px 12px", fontSize: 9.5, fontWeight: 650, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.06em",
                                border: `1px solid ${active ? tc.border : "#141618"}`, background: active ? tc.bg : "transparent",
                                color: active ? tc.text : "#2d3138", borderRadius: 5, cursor: "pointer", transition: "all 0.15s ease",
                            }}>{t === "ALL" ? "All Tiers" : t}</button>
                        );
                    })}
                </div>

                {/* Leaderboard */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {filtered.map((w) => (
                        <WalletCard key={w.wallet_address} w={w} expanded={expandedRank === w.rank} onToggle={() => setExpandedRank(expandedRank === w.rank ? null : w.rank)} />
                    ))}
                </div>

                {/* Notable Absence */}
                {tierFilter === "ALL" && (
                    <div style={{ marginTop: 20, background: "#0c0d0e", border: "1px solid #141618", borderRadius: 10, padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ef4444" }}>Notable</span>
                            <div style={{ flex: 1, height: 1, background: "#141618" }} />
                        </div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3d4148", lineHeight: 1.6 }}>
                            <span style={{ fontWeight: 600, color: "#555b63" }}>The Oracle of Paris (Théo / Fredi9999)</span> — the most profitable trader in Polymarket history ($48M) — ranks #32 this week.
                            His edge was one election, 14 months ago. The decay engine doesn't care about legacy. It asks:
                            <span style={{ color: "#eab308", fontStyle: "italic" }}> what have you done lately?</span>
                        </div>
                    </div>
                )}

                {/* Methodology Footer */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "36px 0 16px" }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1e2024", whiteSpace: "nowrap" }}>Methodology</span>
                    <div style={{ flex: 1, height: 1, background: "#141618" }} />
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#2d3138", lineHeight: 1.7, maxWidth: 580 }}>
                    <p style={{ margin: "0 0 8px" }}><span style={{ color: "#555b63", fontWeight: 600 }}>Decay (45%):</span> P&L from the last 12 months, weighted 1.0× (0-3mo), 0.75× (3-6mo), 0.50× (6-9mo), 0.25× (9-12mo). Forces weekly volatility — inactive wallets drop automatically.</p>
                    <p style={{ margin: "0 0 8px" }}><span style={{ color: "#555b63", fontWeight: 600 }}>Yield (35%):</span> ROI = P&L / Capital Deployed. Rewards efficiency over size. Winsorized at 1st/99th percentile to cap outliers.</p>
                    <p style={{ margin: "0 0 8px" }}><span style={{ color: "#555b63", fontWeight: 600 }}>Conviction (20%):</span> ln(1 + median trade size) × top-5 concentration ratio. The bot-killer. Bots have $42 median trades and flat distributions. Whales have $45K medians and concentrated top trades.</p>
                    <p style={{ margin: 0 }}><span style={{ color: "#555b63", fontWeight: 600 }}>Versatility (×1.00–1.12):</span> Applied as a multiplier after base scoring. +0.03× per profitable category beyond the first, capped at 1.12×. Rewards breadth without double-counting.</p>
                </div>

                {/* Sources */}
                <div style={{ borderTop: "1px solid #141618", marginTop: 28, paddingTop: 16 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111214", marginBottom: 4 }}>Sources</div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: "#1a1c20", lineHeight: 1.8 }}>
                        On-chain data: Polygon via Polymarket Data API + Dune Analytics · Wallet P&L: Trades + Redemptions (CLOB + Activity endpoints) · Market metadata: Gamma API · Formula: Drip Power Index v1.0 — inspired by PocketFives PLB methodology · Updated: Wednesdays · Analysis by The Drip
                    </div>
                </div>
            </div>
        </div>
    );
}
