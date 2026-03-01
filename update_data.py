"""
Injects dpi_leaderboard.json data into src/App.jsx
- Replaces SAMPLE_DATA array
- Updates Notable section rank for Oracle of Paris
- Updates Wallets Scored stat
"""
import json
import re

# Read leaderboard JSON
with open("dpi_leaderboard.json") as f:
    leaderboard = json.load(f)

# Read metadata
with open("dpi_meta.json") as f:
    meta = json.load(f)

# Read App.jsx
with open("src/App.jsx") as f:
    content = f.read()

# 1. Build the JS data array from JSON (ensure_ascii=False for Théo)
js_data = "const SAMPLE_DATA = " + json.dumps(leaderboard, indent=2, ensure_ascii=False) + ";"

# Replace the entire SAMPLE_DATA block using string find/replace, not regex
# Find start marker
start_marker = "const SAMPLE_DATA = ["
start_idx = content.find(start_marker)
if start_idx == -1:
    raise ValueError("Could not find SAMPLE_DATA start")

# Find the closing "];" after the start
# We need to find the matching bracket - count brackets
bracket_depth = 0
end_idx = None
for i in range(start_idx + len("const SAMPLE_DATA = "), len(content)):
    if content[i] == '[':
        bracket_depth += 1
    elif content[i] == ']':
        bracket_depth -= 1
        if bracket_depth == 0:
            # Check if next non-whitespace char is ;
            j = i + 1
            while j < len(content) and content[j] in ' \t\n':
                j += 1
            if j < len(content) and content[j] == ';':
                end_idx = j + 1
            else:
                end_idx = i + 1
            break

if end_idx is None:
    raise ValueError("Could not find SAMPLE_DATA closing bracket")

content = content[:start_idx] + js_data + content[end_idx:]

# 2. Find Oracle of Paris rank
oracle_rank = None
for w in leaderboard:
    if w["wallet_address"] == "0xd91a5e5a35150b26e52e9403e086c58a7e4a4f27":
        oracle_rank = w["rank"]
        break

# Update Notable section
if oracle_rank:
    content = content.replace("ranks #32 this week", f"ranks #{oracle_rank} this week")
    print(f"  ✅  Oracle of Paris rank updated to #{oracle_rank}")
else:
    content = content.replace(
        "ranks #32 this week",
        "falls outside the top 50 entirely"
    )
    print("  ⚠  Oracle of Paris not in top 50")

# 3. Update Wallets Scored
total = meta["total_wallets_scored"]
if total >= 1_000_000:
    count_str = f"{total/1_000_000:.1f}M"
elif total >= 1_000:
    count_str = f"{total/1_000:.1f}K"
else:
    count_str = str(total)

# Use simple string replace for wallets scored
content = content.replace(
    '{ l: "Wallets Scored", v: "1.3M"',
    f'{{ l: "Wallets Scored", v: "{count_str}"'
)
print(f"  ✅  Wallets Scored updated to {count_str}")

# Write back
with open("src/App.jsx", "w") as f:
    f.write(content)

print(f"  ✅  App.jsx updated with {len(leaderboard)} wallets from engine output")
print(f"  →  Top wallet: {leaderboard[0]['wallet_short']} (DPI {leaderboard[0]['dpi_score']})")
