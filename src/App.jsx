import { useState, useMemo, useEffect } from "react";

// ─── SAMPLE DATA (Replace with JSON fetch from dpi_leaderboard.json) ───
const SAMPLE_DATA = [
  {
    "rank": 1,
    "wallet_address": "0xd91a5e5a35150b26e52e9403e086c58a7e4a4f27",
    "wallet_short": "0xd91a...4f27",
    "moniker": "The Oracle of Paris",
    "note": "Théo / Fredi9999 — $85M election trade",
    "dpi_score": 102.9,
    "tier": "LEGENDARY",
    "total_pnl": 48000000.0,
    "total_volume": 85000000.0,
    "win_rate": 65.0,
    "total_markets": 169,
    "total_trades": 847,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 100.0,
      "yield": 99.6,
      "conviction": 100.0
    },
    "median_trade": 150531.0,
    "top5_concentration": 45.0
  },
  {
    "rank": 2,
    "wallet_address": "0x68299929f47440f3d008cff752fe1371d1ed658c",
    "wallet_short": "0x6829...658c",
    "moniker": null,
    "note": null,
    "dpi_score": 97.9,
    "tier": "LEGENDARY",
    "total_pnl": 634893.0,
    "total_volume": 1886685.0,
    "win_rate": 55.0,
    "total_markets": 35,
    "total_trades": 55,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 98.0,
      "yield": 92.2,
      "conviction": 93.4
    },
    "median_trade": 34303.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 3,
    "wallet_address": "0xb84763bb83f6dd13dd7b3eb6a590c3d8826ff4df",
    "wallet_short": "0xb847...f4df",
    "moniker": null,
    "note": null,
    "dpi_score": 97.2,
    "tier": "LEGENDARY",
    "total_pnl": 611680.0,
    "total_volume": 1859044.0,
    "win_rate": 55.0,
    "total_markets": 42,
    "total_trades": 32,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 97.3,
      "yield": 90.2,
      "conviction": 95.3
    },
    "median_trade": 58095.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 4,
    "wallet_address": "0xwindwalk3",
    "wallet_short": "0xwindwalk3",
    "moniker": "The Policy Hawk",
    "note": "$1.1M profit, RFK Jr. health policy specialist",
    "dpi_score": 94.7,
    "tier": "LEGENDARY",
    "total_pnl": 1100000.0,
    "total_volume": 5000000.0,
    "win_rate": 65.0,
    "total_markets": 60,
    "total_trades": 300,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 99.6,
      "yield": 78.1,
      "conviction": 98.8
    },
    "median_trade": 25000.0,
    "top5_concentration": 45.0
  },
  {
    "rank": 5,
    "wallet_address": "0x85c0ed6a67abc5a2a8225633247e5ca758d9cb31",
    "wallet_short": "0x85c0...cb31",
    "moniker": null,
    "note": null,
    "dpi_score": 94.5,
    "tier": "LEGENDARY",
    "total_pnl": 520401.0,
    "total_volume": 1745026.0,
    "win_rate": 55.0,
    "total_markets": 11,
    "total_trades": 78,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 96.1,
      "yield": 87.5,
      "conviction": 89.5
    },
    "median_trade": 22372.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 6,
    "wallet_address": "0xb86ed52106e26e0638b1fab668c00770cb09ade0",
    "wallet_short": "0xb86e...ade0",
    "moniker": null,
    "note": null,
    "dpi_score": 93.8,
    "tier": "LEGENDARY",
    "total_pnl": 516090.0,
    "total_volume": 1913814.0,
    "win_rate": 55.0,
    "total_markets": 42,
    "total_trades": 41,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 95.7,
      "yield": 83.2,
      "conviction": 94.5
    },
    "median_trade": 46678.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 7,
    "wallet_address": "0x3c429fedd51c65d2c70d32addb9691d7eaa779d5",
    "wallet_short": "0x3c42...79d5",
    "moniker": null,
    "note": null,
    "dpi_score": 93.6,
    "tier": "LEGENDARY",
    "total_pnl": 715152.0,
    "total_volume": 1887890.0,
    "win_rate": 55.0,
    "total_markets": 33,
    "total_trades": 338,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 98.8,
      "yield": 97.7,
      "conviction": 61.3
    },
    "median_trade": 5585.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 8,
    "wallet_address": "0x4dae1bda4fdb957225fecaff1681970848406ccd",
    "wallet_short": "0x4dae...6ccd",
    "moniker": null,
    "note": null,
    "dpi_score": 93.0,
    "tier": "LEGENDARY",
    "total_pnl": 598866.0,
    "total_volume": 1666342.0,
    "win_rate": 55.0,
    "total_markets": 26,
    "total_trades": 264,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 96.9,
      "yield": 96.5,
      "conviction": 64.8
    },
    "median_trade": 6312.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 9,
    "wallet_address": "0x66dd0f33dad9282a08b356b54e2b6468b4702e29",
    "wallet_short": "0x66dd...2e29",
    "moniker": null,
    "note": null,
    "dpi_score": 92.3,
    "tier": "LEGENDARY",
    "total_pnl": 478815.0,
    "total_volume": 1232971.0,
    "win_rate": 55.0,
    "total_markets": 20,
    "total_trades": 192,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 93.0,
      "yield": 98.8,
      "conviction": 66.0
    },
    "median_trade": 6422.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 10,
    "wallet_address": "0xf26b86766e82227e9f15ac6bf9d8984923a6b326",
    "wallet_short": "0xf26b...b326",
    "moniker": null,
    "note": null,
    "dpi_score": 92.2,
    "tier": "LEGENDARY",
    "total_pnl": 729167.0,
    "total_volume": 1967108.0,
    "win_rate": 55.0,
    "total_markets": 9,
    "total_trades": 430,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 99.2,
      "yield": 96.9,
      "conviction": 54.7
    },
    "median_trade": 4575.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 11,
    "wallet_address": "0xbea4cbeeba55d87c4f935cbf0bd6a0d47bafe653",
    "wallet_short": "0xbea4...e653",
    "moniker": null,
    "note": null,
    "dpi_score": 91.9,
    "tier": "LEGENDARY",
    "total_pnl": 624645.0,
    "total_volume": 1833829.0,
    "win_rate": 55.0,
    "total_markets": 44,
    "total_trades": 324,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 97.7,
      "yield": 93.8,
      "conviction": 62.1
    },
    "median_trade": 5660.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 12,
    "wallet_address": "0x93741955cda6f0a20baaa72877868eac368ae3af",
    "wallet_short": "0x9374...e3af",
    "moniker": null,
    "note": null,
    "dpi_score": 91.6,
    "tier": "LEGENDARY",
    "total_pnl": 654148.0,
    "total_volume": 1885331.0,
    "win_rate": 55.0,
    "total_markets": 32,
    "total_trades": 369,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 98.4,
      "yield": 94.5,
      "conviction": 57.8
    },
    "median_trade": 5109.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 13,
    "wallet_address": "0xaf6d7e5a939493b8f2cab92ad038d3eaefe08e0b",
    "wallet_short": "0xaf6d...8e0b",
    "moniker": null,
    "note": null,
    "dpi_score": 91.6,
    "tier": "LEGENDARY",
    "total_pnl": 408165.0,
    "total_volume": 1519579.0,
    "win_rate": 55.0,
    "total_markets": 33,
    "total_trades": 26,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 91.0,
      "yield": 82.4,
      "conviction": 95.7
    },
    "median_trade": 58445.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 14,
    "wallet_address": "0x0b32ad9fddb8bd98a79921afb12e1f24e927366c",
    "wallet_short": "0x0b32...366c",
    "moniker": null,
    "note": null,
    "dpi_score": 91.1,
    "tier": "LEGENDARY",
    "total_pnl": 501300.0,
    "total_volume": 1537642.0,
    "win_rate": 55.0,
    "total_markets": 31,
    "total_trades": 211,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 95.3,
      "yield": 89.8,
      "conviction": 70.7
    },
    "median_trade": 7287.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 15,
    "wallet_address": "0x71e2255fe9f28c4cc019bc756fe8fc1d538ca9eb",
    "wallet_short": "0x71e2...a9eb",
    "moniker": null,
    "note": null,
    "dpi_score": 90.8,
    "tier": "LEGENDARY",
    "total_pnl": 545189.0,
    "total_volume": 1791140.0,
    "win_rate": 55.0,
    "total_markets": 12,
    "total_trades": 265,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 96.5,
      "yield": 88.7,
      "conviction": 68.4
    },
    "median_trade": 6759.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 16,
    "wallet_address": "0xerasmus",
    "wallet_short": "0xerasmus",
    "moniker": null,
    "note": null,
    "dpi_score": 90.6,
    "tier": "LEGENDARY",
    "total_pnl": 500000.0,
    "total_volume": 2000000.0,
    "win_rate": 65.0,
    "total_markets": 30,
    "total_trades": 150,
    "primary_category": "Politics",
    "profitable_categories": 1,
    "components": {
      "decay": 94.9,
      "yield": 80.9,
      "conviction": 98.0
    },
    "median_trade": 20000.0,
    "top5_concentration": 45.0
  },
  {
    "rank": 17,
    "wallet_address": "0x2872f944e11c3b6119c6586afb15e6fb5362a916",
    "wallet_short": "0x2872...a916",
    "moniker": null,
    "note": null,
    "dpi_score": 89.9,
    "tier": "ELITE",
    "total_pnl": 491705.0,
    "total_volume": 1449105.0,
    "win_rate": 55.0,
    "total_markets": 40,
    "total_trades": 271,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 94.5,
      "yield": 93.4,
      "conviction": 60.2
    },
    "median_trade": 5347.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 18,
    "wallet_address": "0x0c23cd5b46252bd31bf8713b9f94b28af22dcfdc",
    "wallet_short": "0x0c23...cfdc",
    "moniker": null,
    "note": null,
    "dpi_score": 88.8,
    "tier": "ELITE",
    "total_pnl": 434893.0,
    "total_volume": 1670921.0,
    "win_rate": 55.0,
    "total_markets": 10,
    "total_trades": 135,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 91.4,
      "yield": 81.6,
      "conviction": 82.4
    },
    "median_trade": 12377.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 19,
    "wallet_address": "0xc8fad5e7904fe144b0dbd9d4f78ab4e86fa8ec6a",
    "wallet_short": "0xc8fa...ec6a",
    "moniker": null,
    "note": null,
    "dpi_score": 87.4,
    "tier": "ELITE",
    "total_pnl": 366419.0,
    "total_volume": 1916917.0,
    "win_rate": 55.0,
    "total_markets": 10,
    "total_trades": 35,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 89.1,
      "yield": 73.8,
      "conviction": 94.9
    },
    "median_trade": 54769.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 20,
    "wallet_address": "0xsworks",
    "wallet_short": "0xsworks",
    "moniker": null,
    "note": null,
    "dpi_score": 87.1,
    "tier": "ELITE",
    "total_pnl": 300000.0,
    "total_volume": 1500000.0,
    "win_rate": 65.0,
    "total_markets": 20,
    "total_trades": 100,
    "primary_category": "Macro",
    "profitable_categories": 2,
    "components": {
      "decay": 85.9,
      "yield": 75.0,
      "conviction": 98.4
    },
    "median_trade": 22500.0,
    "top5_concentration": 45.0
  },
  {
    "rank": 21,
    "wallet_address": "0xebcda6be18840ac4fa4e02a788bd881a277a841a",
    "wallet_short": "0xebcd...841a",
    "moniker": null,
    "note": null,
    "dpi_score": 86.7,
    "tier": "ELITE",
    "total_pnl": 360264.0,
    "total_volume": 1066363.0,
    "win_rate": 55.0,
    "total_markets": 28,
    "total_trades": 205,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 88.7,
      "yield": 92.6,
      "conviction": 59.4
    },
    "median_trade": 5202.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 22,
    "wallet_address": "0x147152639014797b16e92d2c1664b5702f999f44",
    "wallet_short": "0x1471...9f44",
    "moniker": null,
    "note": null,
    "dpi_score": 86.6,
    "tier": "ELITE",
    "total_pnl": 370278.0,
    "total_volume": 1979956.0,
    "win_rate": 55.0,
    "total_markets": 7,
    "total_trades": 71,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 89.5,
      "yield": 72.7,
      "conviction": 92.2
    },
    "median_trade": 27887.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 23,
    "wallet_address": "0xa435ccad7e65d72b73b1b31a82b7ec8c9998b489",
    "wallet_short": "0xa435...b489",
    "moniker": null,
    "note": null,
    "dpi_score": 86.5,
    "tier": "ELITE",
    "total_pnl": 490488.0,
    "total_volume": 1760176.0,
    "win_rate": 55.0,
    "total_markets": 36,
    "total_trades": 313,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 94.1,
      "yield": 83.6,
      "conviction": 61.7
    },
    "median_trade": 5624.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 24,
    "wallet_address": "0xf84947e8ec5b57d319f6d6b1d4a0c2a0c7c125c9",
    "wallet_short": "0xf849...25c9",
    "moniker": null,
    "note": null,
    "dpi_score": 86.0,
    "tier": "ELITE",
    "total_pnl": 450071.0,
    "total_volume": 1266593.0,
    "win_rate": 55.0,
    "total_markets": 37,
    "total_trades": 348,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 92.2,
      "yield": 95.7,
      "conviction": 42.6
    },
    "median_trade": 3640.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 25,
    "wallet_address": "0x0e89aa690233f0dc90532dc24e81752f0264fc73",
    "wallet_short": "0x0e89...fc73",
    "moniker": null,
    "note": null,
    "dpi_score": 85.3,
    "tier": "ELITE",
    "total_pnl": 257700.0,
    "total_volume": 1082384.0,
    "win_rate": 55.0,
    "total_markets": 17,
    "total_trades": 64,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 84.0,
      "yield": 79.3,
      "conviction": 86.3
    },
    "median_trade": 16912.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 26,
    "wallet_address": "0xe8466434544c876b9f42ea7d04e9e9fec6cbdfe3",
    "wallet_short": "0xe846...dfe3",
    "moniker": null,
    "note": null,
    "dpi_score": 85.1,
    "tier": "ELITE",
    "total_pnl": 380940.0,
    "total_volume": 1214456.0,
    "win_rate": 55.0,
    "total_markets": 7,
    "total_trades": 266,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 90.2,
      "yield": 89.1,
      "conviction": 54.3
    },
    "median_trade": 4566.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 27,
    "wallet_address": "0xbc3188c403c8e2e8456ac19248a4fe5383ca3248",
    "wallet_short": "0xbc31...3248",
    "moniker": null,
    "note": null,
    "dpi_score": 84.9,
    "tier": "ELITE",
    "total_pnl": 371324.0,
    "total_volume": 1520400.0,
    "win_rate": 55.0,
    "total_markets": 32,
    "total_trades": 218,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 89.8,
      "yield": 80.1,
      "conviction": 69.9
    },
    "median_trade": 6974.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 28,
    "wallet_address": "0x234d32ab931f8fbcc04731e0dc68aa3c946c3de1",
    "wallet_short": "0x234d...3de1",
    "moniker": null,
    "note": null,
    "dpi_score": 84.8,
    "tier": "ELITE",
    "total_pnl": 335163.0,
    "total_volume": 1641916.0,
    "win_rate": 55.0,
    "total_markets": 14,
    "total_trades": 131,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 87.1,
      "yield": 75.8,
      "conviction": 82.8
    },
    "median_trade": 12534.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 29,
    "wallet_address": "0xb096028dd95381fcc147abb931734fab630c88c1",
    "wallet_short": "0xb096...88c1",
    "moniker": null,
    "note": null,
    "dpi_score": 84.4,
    "tier": "ELITE",
    "total_pnl": 473628.0,
    "total_volume": 1494402.0,
    "win_rate": 55.0,
    "total_markets": 38,
    "total_trades": 393,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 92.6,
      "yield": 89.5,
      "conviction": 44.9
    },
    "median_trade": 3803.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 30,
    "wallet_address": "0x78edbba860fca42b1ca2c1e1cee0caa491cd17b7",
    "wallet_short": "0x78ed...17b7",
    "moniker": null,
    "note": null,
    "dpi_score": 83.8,
    "tier": "ELITE",
    "total_pnl": 186564.0,
    "total_volume": 639393.0,
    "win_rate": 55.0,
    "total_markets": 32,
    "total_trades": 62,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 78.5,
      "yield": 85.9,
      "conviction": 79.7
    },
    "median_trade": 10313.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 31,
    "wallet_address": "0x896144a395cc68923c25bcf001351f84cfa213e1",
    "wallet_short": "0x8961...13e1",
    "moniker": null,
    "note": null,
    "dpi_score": 83.6,
    "tier": "ELITE",
    "total_pnl": 479123.0,
    "total_volume": 1665266.0,
    "win_rate": 55.0,
    "total_markets": 10,
    "total_trades": 423,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 93.4,
      "yield": 84.8,
      "conviction": 47.7
    },
    "median_trade": 3937.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 32,
    "wallet_address": "0xedc8f0195905733a340b4adafe43f7c9cc26f42f",
    "wallet_short": "0xedc8...f42f",
    "moniker": null,
    "note": null,
    "dpi_score": 83.6,
    "tier": "ELITE",
    "total_pnl": 479538.0,
    "total_volume": 1781368.0,
    "win_rate": 55.0,
    "total_markets": 13,
    "total_trades": 427,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 93.8,
      "yield": 82.8,
      "conviction": 50.0
    },
    "median_trade": 4172.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 33,
    "wallet_address": "0xe38e83d8e8a864c061e8235c032b9614d1e65c66",
    "wallet_short": "0xe38e...5c66",
    "moniker": null,
    "note": null,
    "dpi_score": 82.6,
    "tier": "ELITE",
    "total_pnl": 441127.0,
    "total_volume": 1472035.0,
    "win_rate": 55.0,
    "total_markets": 17,
    "total_trades": 438,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 91.8,
      "yield": 88.3,
      "conviction": 39.8
    },
    "median_trade": 3361.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 34,
    "wallet_address": "0x9d7a95067262ceef4e1b6f1486a7cfe8e57a93a5",
    "wallet_short": "0x9d7a...93a5",
    "moniker": null,
    "note": null,
    "dpi_score": 82.4,
    "tier": "ELITE",
    "total_pnl": 392702.0,
    "total_volume": 1182324.0,
    "win_rate": 55.0,
    "total_markets": 14,
    "total_trades": 376,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 90.6,
      "yield": 91.0,
      "conviction": 36.7
    },
    "median_trade": 3144.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 35,
    "wallet_address": "0x1j59y6nk",
    "wallet_short": "0x1j59y6nk",
    "moniker": null,
    "note": null,
    "dpi_score": 82.0,
    "tier": "ELITE",
    "total_pnl": 200000.0,
    "total_volume": 1000000.0,
    "win_rate": 65.0,
    "total_markets": 10,
    "total_trades": 50,
    "primary_category": "Politics",
    "profitable_categories": 1,
    "components": {
      "decay": 79.7,
      "yield": 75.0,
      "conviction": 99.2
    },
    "median_trade": 30000.0,
    "top5_concentration": 45.0
  },
  {
    "rank": 36,
    "wallet_address": "0xab294f141486f182272814a3d1536f1d7b7dcbe3",
    "wallet_short": "0xab29...cbe3",
    "moniker": null,
    "note": null,
    "dpi_score": 81.7,
    "tier": "ELITE",
    "total_pnl": 334113.0,
    "total_volume": 1540081.0,
    "win_rate": 55.0,
    "total_markets": 39,
    "total_trades": 241,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 86.7,
      "yield": 77.7,
      "conviction": 65.6
    },
    "median_trade": 6390.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 37,
    "wallet_address": "0x629bcd6da1e0ed2b6f5ec396330d07eede3884f6",
    "wallet_short": "0x629b...84f6",
    "moniker": null,
    "note": null,
    "dpi_score": 81.6,
    "tier": "ELITE",
    "total_pnl": 358864.0,
    "total_volume": 1003677.0,
    "win_rate": 55.0,
    "total_markets": 36,
    "total_trades": 397,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 87.9,
      "yield": 96.1,
      "conviction": 30.1
    },
    "median_trade": 2528.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 38,
    "wallet_address": "0x032d3e178cf7a5537a2e5839d5e37f6dd4dd233a",
    "wallet_short": "0x032d...233a",
    "moniker": null,
    "note": null,
    "dpi_score": 80.3,
    "tier": "ELITE",
    "total_pnl": 146616.0,
    "total_volume": 432412.0,
    "win_rate": 55.0,
    "total_markets": 43,
    "total_trades": 84,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 75.0,
      "yield": 93.0,
      "conviction": 58.6
    },
    "median_trade": 5148.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 39,
    "wallet_address": "0x3400566214d9eced2256f56b6adf9e0d5b37be4d",
    "wallet_short": "0x3400...be4d",
    "moniker": null,
    "note": null,
    "dpi_score": 80.1,
    "tier": "ELITE",
    "total_pnl": 359301.0,
    "total_volume": 1243187.0,
    "win_rate": 55.0,
    "total_markets": 5,
    "total_trades": 348,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 88.3,
      "yield": 85.2,
      "conviction": 41.4
    },
    "median_trade": 3572.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 40,
    "wallet_address": "0xa71a4d64e1c00cf309e5b9da330ed52c47c53d46",
    "wallet_short": "0xa71a...3d46",
    "moniker": null,
    "note": null,
    "dpi_score": 79.6,
    "tier": "ELITE",
    "total_pnl": 238224.0,
    "total_volume": 712242.0,
    "win_rate": 55.0,
    "total_markets": 14,
    "total_trades": 199,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 82.0,
      "yield": 91.4,
      "conviction": 41.8
    },
    "median_trade": 3579.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 41,
    "wallet_address": "0x0b704c2dc7d175d29e214b1cd336ccc44bb057ef",
    "wallet_short": "0x0b70...57ef",
    "moniker": null,
    "note": null,
    "dpi_score": 79.5,
    "tier": "ELITE",
    "total_pnl": 153468.0,
    "total_volume": 608042.0,
    "win_rate": 55.0,
    "total_markets": 48,
    "total_trades": 76,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 76.2,
      "yield": 81.2,
      "conviction": 72.3
    },
    "median_trade": 8001.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 42,
    "wallet_address": "0xbe9d1430993a46742c4586ab119940ee775bf1b4",
    "wallet_short": "0xbe9d...f1b4",
    "moniker": null,
    "note": null,
    "dpi_score": 79.1,
    "tier": "ELITE",
    "total_pnl": 344825.0,
    "total_volume": 1662498.0,
    "win_rate": 55.0,
    "total_markets": 28,
    "total_trades": 365,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 87.5,
      "yield": 76.2,
      "conviction": 53.9
    },
    "median_trade": 4555.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 43,
    "wallet_address": "0xb8b3ba4f63feb1ef251a7ca37bd435a0d914278d",
    "wallet_short": "0xb8b3...278d",
    "moniker": null,
    "note": null,
    "dpi_score": 78.9,
    "tier": "ELITE",
    "total_pnl": 222199.0,
    "total_volume": 1608355.0,
    "win_rate": 55.0,
    "total_markets": 12,
    "total_trades": 130,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 80.9,
      "yield": 68.0,
      "conviction": 82.0
    },
    "median_trade": 12372.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 44,
    "wallet_address": "0xeb7115d2f26547e09720e81a02bd93b99d0a07a3",
    "wallet_short": "0xeb71...07a3",
    "moniker": null,
    "note": null,
    "dpi_score": 78.7,
    "tier": "ELITE",
    "total_pnl": 330056.0,
    "total_volume": 1550651.0,
    "win_rate": 55.0,
    "total_markets": 19,
    "total_trades": 343,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 86.3,
      "yield": 77.0,
      "conviction": 53.1
    },
    "median_trade": 4521.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 45,
    "wallet_address": "0xf9c5df825f3c3ae28b170938e2fcfe5438de9274",
    "wallet_short": "0xf9c5...9274",
    "moniker": null,
    "note": null,
    "dpi_score": 78.6,
    "tier": "ELITE",
    "total_pnl": 258638.0,
    "total_volume": 1945860.0,
    "win_rate": 55.0,
    "total_markets": 50,
    "total_trades": 232,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 84.4,
      "yield": 67.6,
      "conviction": 73.4
    },
    "median_trade": 8387.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 46,
    "wallet_address": "0x84c906fdf6d03af2cc5c6e0a0f28ca7621dd0d3c",
    "wallet_short": "0x84c9...0d3c",
    "moniker": null,
    "note": null,
    "dpi_score": 77.7,
    "tier": "ELITE",
    "total_pnl": 235520.0,
    "total_volume": 1193029.0,
    "win_rate": 55.0,
    "total_markets": 41,
    "total_trades": 192,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 81.2,
      "yield": 74.2,
      "conviction": 64.5
    },
    "median_trade": 6214.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 47,
    "wallet_address": "0xbdf898e35502997f68a1e41b5cfd5d9982a7c84f",
    "wallet_short": "0xbdf8...c84f",
    "moniker": null,
    "note": null,
    "dpi_score": 77.7,
    "tier": "ELITE",
    "total_pnl": 245289.0,
    "total_volume": 1503296.0,
    "win_rate": 55.0,
    "total_markets": 33,
    "total_trades": 218,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 83.2,
      "yield": 69.1,
      "conviction": 68.8
    },
    "median_trade": 6896.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 48,
    "wallet_address": "0xascetic0x",
    "wallet_short": "0xascetic0x",
    "moniker": "The Compounder",
    "note": "$12 → $100K in 16 binary BTC bets",
    "dpi_score": 77.6,
    "tier": "ELITE",
    "total_pnl": 100000.0,
    "total_volume": 500000.0,
    "win_rate": 65.0,
    "total_markets": 3,
    "total_trades": 16,
    "primary_category": "Crypto",
    "profitable_categories": 1,
    "components": {
      "decay": 69.9,
      "yield": 75.0,
      "conviction": 99.6
    },
    "median_trade": 46875.0,
    "top5_concentration": 45.0
  },
  {
    "rank": 49,
    "wallet_address": "0xa0abe81aa97149c497543749a5eccc430df62327",
    "wallet_short": "0xa0ab...2327",
    "moniker": null,
    "note": null,
    "dpi_score": 77.6,
    "tier": "ELITE",
    "total_pnl": 268370.0,
    "total_volume": 784329.0,
    "win_rate": 55.0,
    "total_markets": 22,
    "total_trades": 480,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 84.8,
      "yield": 94.1,
      "conviction": 21.1
    },
    "median_trade": 1634.0,
    "top5_concentration": 15.0
  },
  {
    "rank": 50,
    "wallet_address": "0x637cb2a170258679959b6406e45b6353b17850a9",
    "wallet_short": "0x637c...50a9",
    "moniker": null,
    "note": null,
    "dpi_score": 77.3,
    "tier": "ELITE",
    "total_pnl": 291096.0,
    "total_volume": 1901848.0,
    "win_rate": 55.0,
    "total_markets": 31,
    "total_trades": 327,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 85.5,
      "yield": 68.8,
      "conviction": 62.5
    },
    "median_trade": 5816.0,
    "top5_concentration": 15.0
  }
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
                        { l: "Wallets Scored", v: "500", sub: "Polymarket on-chain" },
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
                            <span style={{ fontWeight: 600, color: "#555b63" }}>The Oracle of Paris (Théo / Fredi9999)</span> — the most profitable trader in Polymarket history ($48M) — ranks #7 this week.
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
