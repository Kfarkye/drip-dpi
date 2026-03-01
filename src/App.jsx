import { useState, useMemo, useEffect } from "react";

// ─── SAMPLE DATA (Replace with JSON fetch from dpi_leaderboard.json) ───
const SAMPLE_DATA = [
  {
    "rank": 1,
    "wallet_address": "0x7aa4ffe7716df2f1aa4a3dedab871a6c98a3ad73",
    "wallet_short": "0x7aa4...ad73",
    "moniker": null,
    "note": null,
    "dpi_score": 105.4,
    "tier": "LEGENDARY",
    "total_pnl": 137759.0,
    "total_volume": 352190.0,
    "win_rate": 40.3,
    "total_markets": 133,
    "total_trades": 61,
    "primary_category": "Politics",
    "profitable_categories": 4,
    "components": {
      "decay": 94.7,
      "yield": 99.5,
      "conviction": 96.1
    },
    "median_trade": 11283.0,
    "top5_concentration": 61.3
  },
  {
    "rank": 2,
    "wallet_address": "0x252d1d642a3865bb68bc9c8a7ca6f7fa2ce24eae",
    "wallet_short": "0x252d...4eae",
    "moniker": null,
    "note": null,
    "dpi_score": 104.9,
    "tier": "LEGENDARY",
    "total_pnl": 163258.0,
    "total_volume": 444327.0,
    "win_rate": 65.5,
    "total_markets": 148,
    "total_trades": 104,
    "primary_category": "Sports",
    "profitable_categories": 5,
    "components": {
      "decay": 97.6,
      "yield": 92.3,
      "conviction": 87.4
    },
    "median_trade": 2550.0,
    "top5_concentration": 66.4
  },
  {
    "rank": 3,
    "wallet_address": "0x15dc9c953f306ddcf86928769c995e62502c201d",
    "wallet_short": "0x15dc...201d",
    "moniker": null,
    "note": null,
    "dpi_score": 104.7,
    "tier": "LEGENDARY",
    "total_pnl": 121663.0,
    "total_volume": 335262.0,
    "win_rate": 49.7,
    "total_markets": 95,
    "total_trades": 53,
    "primary_category": "Macro",
    "profitable_categories": 5,
    "components": {
      "decay": 98.1,
      "yield": 90.3,
      "conviction": 88.9
    },
    "median_trade": 6548.0,
    "top5_concentration": 52.0
  },
  {
    "rank": 4,
    "wallet_address": "0xascetic0x",
    "wallet_short": "0xascetic0x",
    "moniker": "The Compounder",
    "note": "$12 → $100K in 16 binary BTC bets",
    "dpi_score": 103.2,
    "tier": "LEGENDARY",
    "total_pnl": 12857887.0,
    "total_volume": 35056129.0,
    "win_rate": 45.5,
    "total_markets": 85,
    "total_trades": 4715,
    "primary_category": "Politics",
    "profitable_categories": 5,
    "components": {
      "decay": 99.5,
      "yield": 91.3,
      "conviction": 76.8
    },
    "median_trade": 6248.0,
    "top5_concentration": 35.5
  },
  {
    "rank": 5,
    "wallet_address": "0xb6e543f8312731ff6c12d832a789dc9e39730ff5",
    "wallet_short": "0xb6e5...0ff5",
    "moniker": null,
    "note": null,
    "dpi_score": 103.1,
    "tier": "LEGENDARY",
    "total_pnl": 115500.0,
    "total_volume": 312154.0,
    "win_rate": 82.0,
    "total_markets": 34,
    "total_trades": 489,
    "primary_category": "Politics",
    "profitable_categories": 5,
    "components": {
      "decay": 97.1,
      "yield": 93.7,
      "conviction": 77.8
    },
    "median_trade": 1099.0,
    "top5_concentration": 70.0
  },
  {
    "rank": 6,
    "wallet_address": "0xd91a5e5a35150b26e52e9403e086c58a7e4a4f27",
    "wallet_short": "0xd91a...4f27",
    "moniker": "The Oracle of Paris",
    "note": "Théo / Fredi9999 — $85M election trade",
    "dpi_score": 102.6,
    "tier": "LEGENDARY",
    "total_pnl": 50000000.0,
    "total_volume": 88000000.0,
    "win_rate": 80.5,
    "total_markets": 191,
    "total_trades": 900,
    "primary_category": "Politics",
    "profitable_categories": 2,
    "components": {
      "decay": 100.0,
      "yield": 99.5,
      "conviction": 99.0
    },
    "median_trade": 48000.0,
    "top5_concentration": 51.1
  },
  {
    "rank": 7,
    "wallet_address": "0x2699333392bd40a307bd06907ee8e98d1b2e6774",
    "wallet_short": "0x2699...6774",
    "moniker": null,
    "note": null,
    "dpi_score": 102.2,
    "tier": "LEGENDARY",
    "total_pnl": 132578.0,
    "total_volume": 335683.0,
    "win_rate": 63.8,
    "total_markets": 164,
    "total_trades": 67,
    "primary_category": "Macro",
    "profitable_categories": 4,
    "components": {
      "decay": 88.4,
      "yield": 99.5,
      "conviction": 95.7
    },
    "median_trade": 6075.0,
    "top5_concentration": 68.0
  },
  {
    "rank": 8,
    "wallet_address": "0xc0555c96e94d1583a9279e8b637d8622c9232406",
    "wallet_short": "0xc055...2406",
    "moniker": null,
    "note": null,
    "dpi_score": 99.9,
    "tier": "LEGENDARY",
    "total_pnl": 176623.0,
    "total_volume": 481043.0,
    "win_rate": 25.2,
    "total_markets": 96,
    "total_trades": 381,
    "primary_category": "Macro",
    "profitable_categories": 4,
    "components": {
      "decay": 95.2,
      "yield": 91.8,
      "conviction": 83.6
    },
    "median_trade": 1547.0,
    "top5_concentration": 72.6
  },
  {
    "rank": 9,
    "wallet_address": "0xe6743575cbbb516016ceb4065a11812461bde587",
    "wallet_short": "0xe674...e587",
    "moniker": null,
    "note": null,
    "dpi_score": 97.0,
    "tier": "LEGENDARY",
    "total_pnl": 160300.0,
    "total_volume": 447182.0,
    "win_rate": 78.6,
    "total_markets": 71,
    "total_trades": 138,
    "primary_category": "Crypto",
    "profitable_categories": 3,
    "components": {
      "decay": 92.3,
      "yield": 88.9,
      "conviction": 94.2
    },
    "median_trade": 3166.0,
    "top5_concentration": 79.2
  },
  {
    "rank": 10,
    "wallet_address": "0xdf5c73596e982a4ea31813758c3773ff645a5252",
    "wallet_short": "0xdf5c...5252",
    "moniker": null,
    "note": null,
    "dpi_score": 96.3,
    "tier": "LEGENDARY",
    "total_pnl": 118991.0,
    "total_volume": 358619.0,
    "win_rate": 71.0,
    "total_markets": 55,
    "total_trades": 210,
    "primary_category": "Politics",
    "profitable_categories": 5,
    "components": {
      "decay": 93.2,
      "yield": 85.5,
      "conviction": 70.5
    },
    "median_trade": 1904.0,
    "top5_concentration": 49.6
  },
  {
    "rank": 11,
    "wallet_address": "0xdbc3b1c954afe020772a60832b5587cb3a736dac",
    "wallet_short": "0xdbc3...6dac",
    "moniker": null,
    "note": null,
    "dpi_score": 95.0,
    "tier": "LEGENDARY",
    "total_pnl": 89116.0,
    "total_volume": 372983.0,
    "win_rate": 41.9,
    "total_markets": 121,
    "total_trades": 182,
    "primary_category": "Politics",
    "profitable_categories": 5,
    "components": {
      "decay": 92.8,
      "yield": 70.5,
      "conviction": 91.8
    },
    "median_trade": 4036.0,
    "top5_concentration": 64.2
  },
  {
    "rank": 12,
    "wallet_address": "0x76680b7f5201842164069cdef1d43b49beda1f3a",
    "wallet_short": "0x7668...1f3a",
    "moniker": null,
    "note": null,
    "dpi_score": 94.4,
    "tier": "LEGENDARY",
    "total_pnl": 117202.0,
    "total_volume": 389100.0,
    "win_rate": 34.4,
    "total_markets": 128,
    "total_trades": 272,
    "primary_category": "Culture",
    "profitable_categories": 5,
    "components": {
      "decay": 94.2,
      "yield": 80.2,
      "conviction": 69.1
    },
    "median_trade": 2482.0,
    "top5_concentration": 43.6
  },
  {
    "rank": 13,
    "wallet_address": "0xbe2e38371876bbb45896b8344842707021bbe84f",
    "wallet_short": "0xbe2e...e84f",
    "moniker": null,
    "note": null,
    "dpi_score": 93.2,
    "tier": "LEGENDARY",
    "total_pnl": 93580.0,
    "total_volume": 246402.0,
    "win_rate": 58.6,
    "total_markets": 189,
    "total_trades": 296,
    "primary_category": "Crypto",
    "profitable_categories": 4,
    "components": {
      "decay": 86.5,
      "yield": 96.1,
      "conviction": 64.7
    },
    "median_trade": 467.0,
    "top5_concentration": 76.8
  },
  {
    "rank": 14,
    "wallet_address": "0x7c2b91ee2c2b256e3f029602b983fde4165d785a",
    "wallet_short": "0x7c2b...785a",
    "moniker": null,
    "note": null,
    "dpi_score": 92.5,
    "tier": "LEGENDARY",
    "total_pnl": 110961.0,
    "total_volume": 387821.0,
    "win_rate": 68.9,
    "total_markets": 150,
    "total_trades": 181,
    "primary_category": "Politics",
    "profitable_categories": 4,
    "components": {
      "decay": 96.1,
      "yield": 78.7,
      "conviction": 70.0
    },
    "median_trade": 1931.0,
    "top5_concentration": 49.2
  },
  {
    "rank": 15,
    "wallet_address": "0x3f99c939a3587eaa178ef8e5e2bb0618145422e5",
    "wallet_short": "0x3f99...22e5",
    "moniker": null,
    "note": null,
    "dpi_score": 91.1,
    "tier": "LEGENDARY",
    "total_pnl": 94959.0,
    "total_volume": 347452.0,
    "win_rate": 32.1,
    "total_markets": 45,
    "total_trades": 423,
    "primary_category": "Crypto",
    "profitable_categories": 5,
    "components": {
      "decay": 90.3,
      "yield": 74.9,
      "conviction": 72.5
    },
    "median_trade": 610.0,
    "top5_concentration": 77.7
  },
  {
    "rank": 16,
    "wallet_address": "0x0f3a231ac50380e0e3c5e63ddb43d86eba903375",
    "wallet_short": "0x0f3a...3375",
    "moniker": null,
    "note": null,
    "dpi_score": 90.9,
    "tier": "LEGENDARY",
    "total_pnl": 104962.0,
    "total_volume": 367650.0,
    "win_rate": 47.4,
    "total_markets": 14,
    "total_trades": 229,
    "primary_category": "Macro",
    "profitable_categories": 3,
    "components": {
      "decay": 93.7,
      "yield": 77.8,
      "conviction": 81.6
    },
    "median_trade": 1487.0,
    "top5_concentration": 72.2
  },
  {
    "rank": 17,
    "wallet_address": "0x6621b002f844a9f6e3934922e65088c07d86286c",
    "wallet_short": "0x6621...286c",
    "moniker": null,
    "note": null,
    "dpi_score": 90.1,
    "tier": "LEGENDARY",
    "total_pnl": 121517.0,
    "total_volume": 430718.0,
    "win_rate": 39.5,
    "total_markets": 85,
    "total_trades": 196,
    "primary_category": "Macro",
    "profitable_categories": 4,
    "components": {
      "decay": 87.4,
      "yield": 76.8,
      "conviction": 82.1
    },
    "median_trade": 3470.0,
    "top5_concentration": 55.4
  },
  {
    "rank": 18,
    "wallet_address": "0xerasmus000000000000000000000000000000000",
    "wallet_short": "0xeras...0000",
    "moniker": null,
    "note": null,
    "dpi_score": 89.9,
    "tier": "ELITE",
    "total_pnl": 10642343.0,
    "total_volume": 82916803.0,
    "win_rate": 77.5,
    "total_markets": 73,
    "total_trades": 4346,
    "primary_category": "Politics",
    "profitable_categories": 5,
    "components": {
      "decay": 98.6,
      "yield": 48.3,
      "conviction": 95.2
    },
    "median_trade": 27648.0,
    "top5_concentration": 41.5
  },
  {
    "rank": 19,
    "wallet_address": "0x2b543becbd6935c2e5bc8745ae5a4f6d6c547ef2",
    "wallet_short": "0x2b54...7ef2",
    "moniker": null,
    "note": null,
    "dpi_score": 89.1,
    "tier": "ELITE",
    "total_pnl": 104762.0,
    "total_volume": 420292.0,
    "win_rate": 82.5,
    "total_markets": 16,
    "total_trades": 181,
    "primary_category": "Sports",
    "profitable_categories": 4,
    "components": {
      "decay": 91.8,
      "yield": 71.5,
      "conviction": 77.3
    },
    "median_trade": 4571.0,
    "top5_concentration": 41.0
  },
  {
    "rank": 20,
    "wallet_address": "0x21ea4281d94b0a52131850137ff35f6ae01cd28e",
    "wallet_short": "0x21ea...d28e",
    "moniker": null,
    "note": null,
    "dpi_score": 86.9,
    "tier": "ELITE",
    "total_pnl": 99589.0,
    "total_volume": 268986.0,
    "win_rate": 38.0,
    "total_markets": 57,
    "total_trades": 386,
    "primary_category": "Politics",
    "profitable_categories": 5,
    "components": {
      "decay": 85.5,
      "yield": 94.2,
      "conviction": 30.9
    },
    "median_trade": 771.0,
    "top5_concentration": 37.2
  },
  {
    "rank": 21,
    "wallet_address": "0xbd3e12c7e1011aa3d3457c716986bd4afa170af7",
    "wallet_short": "0xbd3e...0af7",
    "moniker": null,
    "note": null,
    "dpi_score": 86.9,
    "tier": "ELITE",
    "total_pnl": 100342.0,
    "total_volume": 383713.0,
    "win_rate": 63.7,
    "total_markets": 16,
    "total_trades": 208,
    "primary_category": "Macro",
    "profitable_categories": 3,
    "components": {
      "decay": 84.1,
      "yield": 73.9,
      "conviction": 91.3
    },
    "median_trade": 3571.0,
    "top5_concentration": 66.5
  },
  {
    "rank": 22,
    "wallet_address": "0xfc83b6662b9cfb3fe8e1df358513f70547021099",
    "wallet_short": "0xfc83...1099",
    "moniker": null,
    "note": null,
    "dpi_score": 86.4,
    "tier": "ELITE",
    "total_pnl": 144017.0,
    "total_volume": 461680.0,
    "win_rate": 31.9,
    "total_markets": 153,
    "total_trades": 368,
    "primary_category": "Macro",
    "profitable_categories": 2,
    "components": {
      "decay": 96.6,
      "yield": 82.6,
      "conviction": 57.5
    },
    "median_trade": 766.0,
    "top5_concentration": 55.3
  },
  {
    "rank": 23,
    "wallet_address": "0xc1b4278286cdecd3ce421cadcd7effe279b03ab7",
    "wallet_short": "0xc1b4...3ab7",
    "moniker": null,
    "note": null,
    "dpi_score": 85.9,
    "tier": "ELITE",
    "total_pnl": 57933.0,
    "total_volume": 152606.0,
    "win_rate": 32.1,
    "total_markets": 130,
    "total_trades": 176,
    "primary_category": "Politics",
    "profitable_categories": 3,
    "components": {
      "decay": 77.8,
      "yield": 95.7,
      "conviction": 62.8
    },
    "median_trade": 1266.0,
    "top5_concentration": 51.6
  },
  {
    "rank": 24,
    "wallet_address": "0xb198028028129ee1b13fd06ad16e18d13d2c357a",
    "wallet_short": "0xb198...357a",
    "moniker": null,
    "note": null,
    "dpi_score": 85.4,
    "tier": "ELITE",
    "total_pnl": 91292.0,
    "total_volume": 236158.0,
    "win_rate": 30.9,
    "total_markets": 88,
    "total_trades": 345,
    "primary_category": "Sports",
    "profitable_categories": 5,
    "components": {
      "decay": 86.0,
      "yield": 98.1,
      "conviction": 15.9
    },
    "median_trade": 345.0,
    "top5_concentration": 36.8
  },
  {
    "rank": 25,
    "wallet_address": "0xdf545b7309659319431ff6c5c8e69f4bf2b1e804",
    "wallet_short": "0xdf54...e804",
    "moniker": null,
    "note": null,
    "dpi_score": 84.8,
    "tier": "ELITE",
    "total_pnl": 66081.0,
    "total_volume": 211237.0,
    "win_rate": 64.8,
    "total_markets": 94,
    "total_trades": 121,
    "primary_category": "Culture",
    "profitable_categories": 4,
    "components": {
      "decay": 83.1,
      "yield": 83.1,
      "conviction": 56.5
    },
    "median_trade": 3025.0,
    "top5_concentration": 28.1
  },
  {
    "rank": 26,
    "wallet_address": "0x38319cf4054101cc6222bc1730812cab57215588",
    "wallet_short": "0x3831...5588",
    "moniker": null,
    "note": null,
    "dpi_score": 83.6,
    "tier": "ELITE",
    "total_pnl": 80838.0,
    "total_volume": 252744.0,
    "win_rate": 72.6,
    "total_markets": 52,
    "total_trades": 174,
    "primary_category": "Crypto",
    "profitable_categories": 4,
    "components": {
      "decay": 89.4,
      "yield": 83.6,
      "conviction": 36.2
    },
    "median_trade": 1363.0,
    "top5_concentration": 30.5
  },
  {
    "rank": 27,
    "wallet_address": "0x1j59y6nk00000000000000000000000000000000",
    "wallet_short": "0x1j59...0000",
    "moniker": null,
    "note": null,
    "dpi_score": 83.5,
    "tier": "ELITE",
    "total_pnl": 12833958.0,
    "total_volume": 84966690.0,
    "win_rate": 76.2,
    "total_markets": 126,
    "total_trades": 1145,
    "primary_category": "Politics",
    "profitable_categories": 1,
    "components": {
      "decay": 99.0,
      "yield": 54.1,
      "conviction": 100.0
    },
    "median_trade": 121097.0,
    "top5_concentration": 66.7
  },
  {
    "rank": 28,
    "wallet_address": "0xe6209215046383252f0948a8ea8b3c29c7c248ab",
    "wallet_short": "0xe620...48ab",
    "moniker": null,
    "note": null,
    "dpi_score": 82.1,
    "tier": "ELITE",
    "total_pnl": 92643.0,
    "total_volume": 421584.0,
    "win_rate": 82.1,
    "total_markets": 188,
    "total_trades": 102,
    "primary_category": "Culture",
    "profitable_categories": 3,
    "components": {
      "decay": 82.6,
      "yield": 66.7,
      "conviction": 84.5
    },
    "median_trade": 7891.0,
    "top5_concentration": 42.1
  },
  {
    "rank": 29,
    "wallet_address": "0x80cd32c2f80ccbd394de39d00b22621c77410f10",
    "wallet_short": "0x80cd...0f10",
    "moniker": null,
    "note": null,
    "dpi_score": 81.8,
    "tier": "ELITE",
    "total_pnl": 136120.0,
    "total_volume": 481443.0,
    "win_rate": 71.0,
    "total_markets": 12,
    "total_trades": 85,
    "primary_category": "Culture",
    "profitable_categories": 1,
    "components": {
      "decay": 87.0,
      "yield": 77.3,
      "conviction": 78.3
    },
    "median_trade": 4672.0,
    "top5_concentration": 41.8
  },
  {
    "rank": 30,
    "wallet_address": "0x6eb8b2aa5f5a3ca57f1f319a96e267fa4f3f86c4",
    "wallet_short": "0x6eb8...86c4",
    "moniker": null,
    "note": null,
    "dpi_score": 81.6,
    "tier": "ELITE",
    "total_pnl": 123356.0,
    "total_volume": 385660.0,
    "win_rate": 51.7,
    "total_markets": 40,
    "total_trades": 448,
    "primary_category": "Macro",
    "profitable_categories": 1,
    "components": {
      "decay": 89.9,
      "yield": 84.1,
      "conviction": 58.9
    },
    "median_trade": 653.0,
    "top5_concentration": 61.2
  },
  {
    "rank": 31,
    "wallet_address": "0x3b06e233b5bc7f5f94e02d31e5087edf77a55523",
    "wallet_short": "0x3b06...5523",
    "moniker": null,
    "note": null,
    "dpi_score": 81.4,
    "tier": "ELITE",
    "total_pnl": 99342.0,
    "total_volume": 481914.0,
    "win_rate": 40.1,
    "total_markets": 103,
    "total_trades": 450,
    "primary_category": "Sports",
    "profitable_categories": 4,
    "components": {
      "decay": 87.9,
      "yield": 64.7,
      "conviction": 62.3
    },
    "median_trade": 1721.0,
    "top5_concentration": 44.8
  },
  {
    "rank": 32,
    "wallet_address": "0xe8a568aa7f013d065ce8b56b9372f5bfae32bf67",
    "wallet_short": "0xe8a5...bf67",
    "moniker": null,
    "note": null,
    "dpi_score": 81.4,
    "tier": "ELITE",
    "total_pnl": 78836.0,
    "total_volume": 448681.0,
    "win_rate": 78.7,
    "total_markets": 158,
    "total_trades": 195,
    "primary_category": "Culture",
    "profitable_categories": 2,
    "components": {
      "decay": 88.9,
      "yield": 58.0,
      "conviction": 93.7
    },
    "median_trade": 4184.0,
    "top5_concentration": 71.4
  },
  {
    "rank": 33,
    "wallet_address": "0x55c87130afe0d2e33ca369b14d15ef6cefdc7c78",
    "wallet_short": "0x55c8...7c78",
    "moniker": null,
    "note": null,
    "dpi_score": 80.2,
    "tier": "ELITE",
    "total_pnl": 47908.0,
    "total_volume": 173179.0,
    "win_rate": 38.4,
    "total_markets": 123,
    "total_trades": 341,
    "primary_category": "Macro",
    "profitable_categories": 5,
    "components": {
      "decay": 80.7,
      "yield": 75.4,
      "conviction": 44.4
    },
    "median_trade": 569.0,
    "top5_concentration": 52.4
  },
  {
    "rank": 34,
    "wallet_address": "0xc6668638d3702c38981f0b98dd812fffedacc421",
    "wallet_short": "0xc666...c421",
    "moniker": null,
    "note": null,
    "dpi_score": 79.4,
    "tier": "ELITE",
    "total_pnl": 42209.0,
    "total_volume": 116661.0,
    "win_rate": 59.9,
    "total_markets": 106,
    "total_trades": 424,
    "primary_category": "Sports",
    "profitable_categories": 3,
    "components": {
      "decay": 73.4,
      "yield": 89.9,
      "conviction": 52.2
    },
    "median_trade": 392.0,
    "top5_concentration": 66.4
  },
  {
    "rank": 35,
    "wallet_address": "0x175cc0a476e6f85ce692adf26aaf07fb9d5d2f20",
    "wallet_short": "0x175c...2f20",
    "moniker": null,
    "note": null,
    "dpi_score": 79.3,
    "tier": "ELITE",
    "total_pnl": 110690.0,
    "total_volume": 288566.0,
    "win_rate": 32.9,
    "total_markets": 196,
    "total_trades": 173,
    "primary_category": "Macro",
    "profitable_categories": 3,
    "components": {
      "decay": 83.6,
      "yield": 96.6,
      "conviction": 16.9
    },
    "median_trade": 1119.0,
    "top5_concentration": 14.5
  },
  {
    "rank": 36,
    "wallet_address": "0xd617a7056ac1d8a8402e6c4ab701eb4dd7e24f7d",
    "wallet_short": "0xd617...4f7d",
    "moniker": null,
    "note": null,
    "dpi_score": 79.3,
    "tier": "ELITE",
    "total_pnl": 171153.0,
    "total_volume": 477253.0,
    "win_rate": 27.1,
    "total_markets": 118,
    "total_trades": 336,
    "primary_category": "Macro",
    "profitable_categories": 1,
    "components": {
      "decay": 95.7,
      "yield": 89.4,
      "conviction": 24.6
    },
    "median_trade": 1934.0,
    "top5_concentration": 14.0
  },
  {
    "rank": 37,
    "wallet_address": "0xf9a1e9b985b0bb087c5fbeb7d50973305ce69402",
    "wallet_short": "0xf9a1...9402",
    "moniker": null,
    "note": null,
    "dpi_score": 78.7,
    "tier": "ELITE",
    "total_pnl": 67425.0,
    "total_volume": 191676.0,
    "win_rate": 21.2,
    "total_markets": 77,
    "total_trades": 399,
    "primary_category": "Politics",
    "profitable_categories": 5,
    "components": {
      "decay": 81.6,
      "yield": 87.4,
      "conviction": 14.5
    },
    "median_trade": 435.0,
    "top5_concentration": 27.5
  },
  {
    "rank": 38,
    "wallet_address": "0x169530e618a36892ff100192f895ff181c3a8b6a",
    "wallet_short": "0x1695...8b6a",
    "moniker": null,
    "note": null,
    "dpi_score": 77.7,
    "tier": "ELITE",
    "total_pnl": 94708.0,
    "total_volume": 306558.0,
    "win_rate": 68.2,
    "total_markets": 48,
    "total_trades": 326,
    "primary_category": "Culture",
    "profitable_categories": 4,
    "components": {
      "decay": 85.0,
      "yield": 81.2,
      "conviction": 23.2
    },
    "median_trade": 1630.0,
    "top5_concentration": 16.4
  },
  {
    "rank": 39,
    "wallet_address": "0x34cd6674beb9d5ae85b3119b388889c12b265d53",
    "wallet_short": "0x34cd...5d53",
    "moniker": null,
    "note": null,
    "dpi_score": 77.5,
    "tier": "ELITE",
    "total_pnl": 33870.0,
    "total_volume": 117338.0,
    "win_rate": 84.4,
    "total_markets": 145,
    "total_trades": 55,
    "primary_category": "Politics",
    "profitable_categories": 3,
    "components": {
      "decay": 67.1,
      "yield": 79.2,
      "conviction": 75.8
    },
    "median_trade": 2501.0,
    "top5_concentration": 49.6
  },
  {
    "rank": 40,
    "wallet_address": "0xdac0ff46401da27f6756edb28d8e39245ede7086",
    "wallet_short": "0xdac0...7086",
    "moniker": null,
    "note": null,
    "dpi_score": 77.4,
    "tier": "ELITE",
    "total_pnl": 63239.0,
    "total_volume": 319005.0,
    "win_rate": 39.3,
    "total_markets": 65,
    "total_trades": 358,
    "primary_category": "Macro",
    "profitable_categories": 4,
    "components": {
      "decay": 78.7,
      "yield": 62.8,
      "conviction": 68.1
    },
    "median_trade": 1120.0,
    "top5_concentration": 59.3
  },
  {
    "rank": 41,
    "wallet_address": "0xd26d231d49ba83976039168798aa1057c86bd176",
    "wallet_short": "0xd26d...d176",
    "moniker": null,
    "note": null,
    "dpi_score": 77.4,
    "tier": "ELITE",
    "total_pnl": 48873.0,
    "total_volume": 205658.0,
    "win_rate": 47.7,
    "total_markets": 123,
    "total_trades": 10,
    "primary_category": "Sports",
    "profitable_categories": 2,
    "components": {
      "decay": 72.5,
      "yield": 69.6,
      "conviction": 90.8
    },
    "median_trade": 40004.0,
    "top5_concentration": 27.9
  },
  {
    "rank": 42,
    "wallet_address": "0x15ef346b33ad9898bb1e4adc031f2a1266ed61cd",
    "wallet_short": "0x15ef...61cd",
    "moniker": null,
    "note": null,
    "dpi_score": 77.3,
    "tier": "ELITE",
    "total_pnl": 31604.0,
    "total_volume": 84814.0,
    "win_rate": 38.7,
    "total_markets": 132,
    "total_trades": 356,
    "primary_category": "Sports",
    "profitable_categories": 3,
    "components": {
      "decay": 68.6,
      "yield": 95.2,
      "conviction": 44.0
    },
    "median_trade": 234.0,
    "top5_concentration": 76.7
  },
  {
    "rank": 43,
    "wallet_address": "0x35e8fbbcdc208144be2fe265665d6adf639205a7",
    "wallet_short": "0x35e8...05a7",
    "moniker": null,
    "note": null,
    "dpi_score": 76.6,
    "tier": "ELITE",
    "total_pnl": 47905.0,
    "total_volume": 301496.0,
    "win_rate": 35.0,
    "total_markets": 191,
    "total_trades": 343,
    "primary_category": "Macro",
    "profitable_categories": 4,
    "components": {
      "decay": 79.7,
      "yield": 56.0,
      "conviction": 73.9
    },
    "median_trade": 883.0,
    "top5_concentration": 70.4
  },
  {
    "rank": 44,
    "wallet_address": "0x2ea0d6a7267aa93fd6b7c344670cc1200826d6be",
    "wallet_short": "0x2ea0...d6be",
    "moniker": null,
    "note": null,
    "dpi_score": 75.7,
    "tier": "ELITE",
    "total_pnl": 69136.0,
    "total_volume": 353798.0,
    "win_rate": 61.6,
    "total_markets": 177,
    "total_trades": 88,
    "primary_category": "Culture",
    "profitable_categories": 4,
    "components": {
      "decay": 84.5,
      "yield": 61.8,
      "conviction": 48.8
    },
    "median_trade": 5835.0,
    "top5_concentration": 13.3
  },
  {
    "rank": 45,
    "wallet_address": "0x2d264c92101d2153eefdffd4e6187f6c2060b04c",
    "wallet_short": "0x2d26...b04c",
    "moniker": null,
    "note": null,
    "dpi_score": 75.6,
    "tier": "ELITE",
    "total_pnl": 68104.0,
    "total_volume": 245838.0,
    "win_rate": 78.5,
    "total_markets": 38,
    "total_trades": 180,
    "primary_category": "Macro",
    "profitable_categories": 3,
    "components": {
      "decay": 79.2,
      "yield": 75.8,
      "conviction": 45.4
    },
    "median_trade": 1659.0,
    "top5_concentration": 30.7
  },
  {
    "rank": 46,
    "wallet_address": "0x8c969b43f104b231bc5da82e3ec7439b3264a5c7",
    "wallet_short": "0x8c96...a5c7",
    "moniker": null,
    "note": null,
    "dpi_score": 74.5,
    "tier": "SHARP",
    "total_pnl": 85902.0,
    "total_volume": 275443.0,
    "win_rate": 47.7,
    "total_markets": 39,
    "total_trades": 314,
    "primary_category": "Crypto",
    "profitable_categories": 2,
    "components": {
      "decay": 90.8,
      "yield": 82.1,
      "conviction": 13.5
    },
    "median_trade": 664.0,
    "top5_concentration": 18.6
  },
  {
    "rank": 47,
    "wallet_address": "0x8f2f889dd7a7e8eeb0b3099cf45a03eb5da738ae",
    "wallet_short": "0x8f2f...38ae",
    "moniker": null,
    "note": null,
    "dpi_score": 74.2,
    "tier": "SHARP",
    "total_pnl": 38362.0,
    "total_volume": 382375.0,
    "win_rate": 32.9,
    "total_markets": 125,
    "total_trades": 37,
    "primary_category": "Culture",
    "profitable_categories": 5,
    "components": {
      "decay": 74.4,
      "yield": 43.0,
      "conviction": 88.4
    },
    "median_trade": 19727.0,
    "top5_concentration": 33.9
  },
  {
    "rank": 48,
    "wallet_address": "0x9b4acf6b443a2776f4b74670531a854d41d4a7c1",
    "wallet_short": "0x9b4a...a7c1",
    "moniker": null,
    "note": null,
    "dpi_score": 73.9,
    "tier": "SHARP",
    "total_pnl": 49145.0,
    "total_volume": 440518.0,
    "win_rate": 46.2,
    "total_markets": 107,
    "total_trades": 210,
    "primary_category": "Crypto",
    "profitable_categories": 5,
    "components": {
      "decay": 69.6,
      "yield": 44.9,
      "conviction": 94.7
    },
    "median_trade": 3371.0,
    "top5_concentration": 78.1
  },
  {
    "rank": 49,
    "wallet_address": "0x1b67f8f6458ae36ce256da46035cdc76bc193148",
    "wallet_short": "0x1b67...3148",
    "moniker": null,
    "note": null,
    "dpi_score": 73.6,
    "tier": "SHARP",
    "total_pnl": 55030.0,
    "total_volume": 141338.0,
    "win_rate": 71.0,
    "total_markets": 174,
    "total_trades": 415,
    "primary_category": "Culture",
    "profitable_categories": 1,
    "components": {
      "decay": 71.5,
      "yield": 98.6,
      "conviction": 34.8
    },
    "median_trade": 605.0,
    "top5_concentration": 46.3
  },
  {
    "rank": 50,
    "wallet_address": "0xe75a65845479d89d322fbc37650a9c217ab9fabe",
    "wallet_short": "0xe75a...fabe",
    "moniker": null,
    "note": null,
    "dpi_score": 73.4,
    "tier": "SHARP",
    "total_pnl": 38941.0,
    "total_volume": 116181.0,
    "win_rate": 82.1,
    "total_markets": 150,
    "total_trades": 201,
    "primary_category": "Sports",
    "profitable_categories": 1,
    "components": {
      "decay": 75.4,
      "yield": 86.0,
      "conviction": 46.9
    },
    "median_trade": 1068.0,
    "top5_concentration": 40.1
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
