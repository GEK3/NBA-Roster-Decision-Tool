import React, { useState } from "react";

const capOptions = [
  { id: "RoomTeam", label: "Room Team", description: "Under the salary cap with room to sign players" },
  { id: "NonTaxTeam", label: "Non-Taxpayer", description: "Over cap but under the luxury tax level" },
  { id: "TaxTeam", label: "Taxpayer (Under First Apron)", description: "Over tax level but under the first apron" },
  { id: "FirstApronTeam", label: "First Apron Team", description: "Over first apron but under second apron (not hard capped)" },
  { id: "FirstApronHardCap", label: "Hard Capped at First Apron", description: "Used NTMLE/BAE/S&T - cannot exceed first apron" },
  { id: "SecondApronHardCap", label: "Hard Capped at Second Apron", description: "Used aggregated trades - cannot exceed second apron" },
  { id: "SecondApronTeam", label: "Second Apron Team", description: "Over the second apron with strictest limitations" },
];

const toolsByCapStatus = {
  RoomTeam: [
    { id: "CapSpace", label: "Use Cap Space", description: "Sign players using available cap room" },
    { id: "RoomMLE", label: "Room MLE ($7.7M)", description: "Mid-level exception for teams with cap space" },
    { id: "TradeRoomPlus", label: "Trade Using Room + $250k", description: "Acquire players using cap room plus additional $250k cushion" },
    { id: "VetMin", label: "Veteran Minimum", description: "Sign players to minimum contracts" },
    { id: "RookieSign", label: "Sign Draft Picks", description: "Sign first-round picks to rookie scale deals" },
    { id: "UseTPA", label: "Trade/Disabled Player Exception", description: "Use existing exceptions" },
  ],
  NonTaxTeam: [
    { id: "NTMLE", label: "Non-Taxpayer MLE ($12.4M) ⚠️", description: "Full mid-level exception (triggers 1st apron hard cap)" },
    { id: "BAE", label: "Bi-Annual Exception ($4.5M) ⚠️", description: "Every other year (triggers 1st apron hard cap)" },
    { id: "SNT_Acquire", label: "Sign-and-Trade (Acquire) ⚠️", description: "Receive player via S&T (triggers 1st apron hard cap)" },
    { id: "TradeStandard", label: "Standard Trade Matching (100% + $250k)", description: "Match salaries within 100% plus $250k" },
    { id: "TradeAggregated", label: "Aggregated Trade Matching ⚠️", description: "Combine contracts (triggers 2nd apron hard cap)" },
    { id: "TradeExpanded", label: "Expanded Trade Matching ⚠️", description: "200% or 125% + $250k (triggers 1st apron hard cap)" },
    { id: "TPEUse", label: "Trade Player Exception", description: "Use existing trade exceptions" },
    { id: "VetMin", label: "Veteran Minimum", description: "Sign players to minimum contracts" },
    { id: "RookieSign", label: "Sign Draft Picks", description: "Sign first-round picks to rookie scale deals" },
    { id: "UseTPA", label: "Disabled Player Exception", description: "Replace injured players" },
    { id: "StretchWaive", label: "Stretch & Waive", description: "Spread dead money over multiple years" },
  ],
  TaxTeam: [
    { id: "TPMLE", label: "Taxpayer MLE ($5M)", description: "Reduced mid-level exception" },
    { id: "TradeStandard", label: "Standard Trade Matching (100% + $250k)", description: "Match salaries within 100% plus $250k" },
    { id: "TradeAggregated", label: "Aggregated Trade Matching ⚠️", description: "Combine contracts (triggers 2nd apron hard cap)" },
    { id: "TradeExpanded", label: "Expanded Trade Matching ⚠️", description: "200% or 125% + $250k (triggers 1st apron hard cap)" },
    { id: "VetMin", label: "Veteran Minimum", description: "Sign players to minimum contracts" },
    { id: "Use2Way", label: "Two-Way Contracts", description: "Sign players to two-way deals" },
    { id: "UseTPA", label: "Trade/Disabled Player Exception", description: "Use existing exceptions" },
    { id: "StretchWaive", label: "Stretch & Waive", description: "Spread dead money over multiple years" },
  ],
  FirstApronTeam: [
    { id: "TPMLE", label: "Taxpayer MLE ($5M)", description: "Reduced mid-level exception" },
    { id: "TradeStandardOnly", label: "Standard Trade Matching Only", description: "100% + $250k (NO salary aggregation)" },
    { id: "VetMin", label: "Veteran Minimum", description: "Sign players to minimum contracts" },
    { id: "Use2Way", label: "Two-Way Contracts", description: "Sign players to two-way deals" },
    { id: "UseTPA", label: "Trade/Disabled Player Exception", description: "Use existing exceptions" },
    { id: "StretchWaive", label: "Stretch & Waive", description: "Spread dead money over multiple years" },
  ],
  FirstApronHardCap: [
    { id: "VetMin", label: "Veteran Minimum", description: "Sign players to minimum contracts" },
    { id: "TradeStandardOnly", label: "Standard Trade Matching Only", description: "100% + $250k (NO salary aggregation)" },
    { id: "Use2Way", label: "Two-Way Contracts", description: "Sign players to two-way deals" },
    { id: "StretchWaive", label: "Stretch & Waive", description: "Spread dead money over multiple years" },
  ],
  SecondApronHardCap: [
    { id: "TPMLE", label: "Taxpayer MLE ($5M)", description: "Reduced mid-level exception" },
    { id: "TradeStandardOnly", label: "Standard Trade Matching Only", description: "100% + $250k (NO salary aggregation)" },
    { id: "VetMin", label: "Veteran Minimum", description: "Sign players to minimum contracts" },
    { id: "Use2Way", label: "Two-Way Contracts", description: "Sign players to two-way deals" },
    { id: "StretchWaive", label: "Stretch & Waive", description: "Spread dead money over multiple years" },
  ],
  SecondApronTeam: [
    { id: "VetMin", label: "Veteran Minimum", description: "Sign players to minimum contracts only" },
    { id: "TradeLimitedSevere", label: "Severely Limited Trades", description: "Cannot aggregate salaries, take back more money, or use cash" },
  ],
};

const toolImplications = {
  CapSpace: {
    pros: [
      "Maximum flexibility to sign free agents",
      "Can offer contracts up to the max salary",
      "Can front-load or back-load contracts",
      "No hard cap restrictions"
    ],
    cons: [
      "Must renounce cap holds on existing free agents",
      "Lose Bird Rights on renounced players",
      "Cannot exceed the cap once space is used"
    ],
    restrictions: []
  },
  RoomMLE: {
    pros: [
      "Additional $7.7M to use after cap space",
      "2-year contracts allowed",
      "Can be split among multiple players"
    ],
    cons: [
      "Cannot use Non-Taxpayer MLE",
      "Cannot use Bi-Annual Exception",
      "Limited to teams under the cap"
    ],
    restrictions: []
  },
  TradeRoomPlus: {
    pros: [
      "Can absorb contracts using cap space",
      "Additional $250k cushion beyond available room",
      "No need to match salaries",
      "Can take on bad contracts for assets"
    ],
    cons: [
      "Limited to available cap space plus $250k",
      "Cannot simultaneously use traded player exceptions",
      "Reduces available cap space for free agents"
    ],
    restrictions: []
  },
  NTMLE: {
    pros: [
      "Up to $12.4M available",
      "Can offer up to 4-year contracts",
      "Can be split among multiple players",
      "20% raises allowed"
    ],
    cons: [
      "Triggers hard cap at first apron",
      "Cannot exceed apron for ANY reason",
      "Must stay under apron all season"
    ],
    restrictions: ["Hard cap at $172.3M (first apron)"]
  },
  BAE: {
    pros: [
      "Additional $4.5M exception",
      "2-year contracts allowed",
      "Can be used with other exceptions"
    ],
    cons: [
      "Triggers hard cap at first apron",
      "Only available every other year",
      "Cannot be combined with sign-and-trades"
    ],
    restrictions: ["Hard cap at $172.3M (first apron)", "Available every other year"]
  },
  SNT_Acquire: {
    pros: [
      "Can acquire players you couldn't sign outright",
      "Maintains Bird Rights on the acquired player",
      "Can be part of larger trades"
    ],
    cons: [
      "Triggers hard cap at first apron",
      "3-year minimum contract length",
      "Must send out assets in return"
    ],
    restrictions: ["Hard cap at $172.3M (first apron)", "Cannot re-trade player for 3 months"]
  },
  TradeStandard: {
    pros: [
      "Match within 100% of outgoing salary plus $250k",
      "Can be used multiple times",
      "Creates trade exception from salary differential",
      "No hard cap implications"
    ],
    cons: [
      "Must send out nearly equal salary",
      "Cannot combine with other matching rules",
      "Limited flexibility compared to room trades"
    ],
    restrictions: []
  },
  TradeAggregated: {
    pros: [
      "Can combine multiple contracts to match salaries",
      "Greater flexibility in trade construction",
      "Useful for acquiring higher-salaried players",
      "Can aggregate 2+ outgoing contracts"
    ],
    cons: [
      "Triggers hard cap at second apron",
      "Cannot re-aggregate recently acquired players for 2 months",
      "Complex rules on minimum salary players"
    ],
    restrictions: ["Triggers hard cap at $182.8M (second apron)"]
  },
  TradeExpanded: {
    pros: [
      "Can take back up to 200% of outgoing salary",
      "Or 125% plus $7.5M (scaled by cap)",
      "Maximum flexibility for trades",
      "Can facilitate larger salary differentials"
    ],
    cons: [
      "Triggers hard cap at first apron",
      "Only available to non-taxpayer teams",
      "Must be simultaneous trade"
    ],
    restrictions: ["Hard cap at $172.3M (first apron)"]
  },
  TPEUse: {
    pros: [
      "Can acquire players without sending salary back",
      "Created from previous trades",
      "Can be used within one year",
      "No immediate salary matching required"
    ],
    cons: [
      "Limited to size of exception created",
      "Expires after one year",
      "Cannot be combined with other exceptions",
      "May trigger hard cap depending on usage"
    ],
    restrictions: []
  },
  TPMLE: {
    pros: [
      "Up to $5M available",
      "Can offer 3-year contracts",
      "No hard cap triggered"
    ],
    cons: [
      "Much smaller than Non-Taxpayer MLE",
      "Cannot be used in sign-and-trades",
      "Limited player pool at this salary"
    ],
    restrictions: []
  },
  TradeStandardOnly: {
    pros: [
      "Can still make trades despite tax status",
      "100% matching plus $250k cushion"
    ],
    cons: [
      "Cannot aggregate salaries",
      "Must match nearly dollar-for-dollar",
      "Very limited trade flexibility",
      "Difficult to improve roster via trade"
    ],
    restrictions: ["No salary aggregation allowed"]
  },
  VetMin: {
    pros: [
      "Always available regardless of cap situation",
      "League subsidizes portion for vets with 3+ years",
      "No cap implications",
      "Can sign throughout the season"
    ],
    cons: [
      "Limited to minimum salary scale",
      "Harder to attract quality players",
      "1-2 year contracts only"
    ],
    restrictions: []
  },
  TradeLimitedSevere: {
    pros: [
      "Can still make trades if needed"
    ],
    cons: [
      "Cannot aggregate salaries",
      "Cannot take back more salary than sent out",
      "Cannot use cash in trades",
      "Cannot trade first-round picks 7 years out",
      "Frozen pick in draft"
    ],
    restrictions: ["No aggregation", "No cash", "Cannot take back more salary", "Pick restrictions"]
  },
  FirstApronTeam: {
    pros: [
      "Can still use Taxpayer MLE",
      "No hard cap restrictions (yet)",
      "Can make standard trades",
      "Two-way contracts available"
    ],
    cons: [
      "Cannot aggregate salaries in trades",
      "Limited to standard trade matching",
      "Risk of triggering hard cap with certain moves",
      "Draft pick penalties if repeatedly over"
    ],
    restrictions: ["No salary aggregation in trades"]
  },
  FirstApronHardCap: {
    pros: [
      "Can still sign minimum contracts",
      "Can make trades within restrictions",
      "Protected from luxury tax if managed properly"
    ],
    cons: [
      "Cannot exceed First Apron for ANY reason",
      "Very limited roster flexibility",
      "Cannot use any mid-level exceptions",
      "Must shed salary to add players"
    ],
    restrictions: ["Hard capped at $172.3M (First Apron)", "Cannot exceed under any circumstances"]
  },
  SecondApronHardCap: {
    pros: [
      "Can still use Taxpayer MLE if room exists",
      "More flexibility than second apron teams",
      "Can make standard trades"
    ],
    cons: [
      "Cannot exceed Second Apron for ANY reason",
      "No salary aggregation in trades",
      "Limited roster improvement options",
      "Must carefully manage every dollar"
    ],
    restrictions: ["Hard capped at $182.8M (Second Apron)", "Cannot aggregate salaries"]
  },
  SecondApronHardCap: {
    pros: [
      "Can still use Taxpayer MLE if room exists",
      "More flexibility than second apron teams",
      "Can make standard trades"
    ],
    cons: [
      "Cannot exceed Second Apron for ANY reason",
      "No salary aggregation in trades",
      "Limited roster improvement options",
      "Must carefully manage every dollar"
    ],
    restrictions: ["Hard capped at $189.5M (Second Apron)", "Cannot aggregate salaries"]
  },
  Use2Way: {
    pros: [
      "Doesn't count against salary cap",
      "Can develop young talent",
      "Flexible roster management"
    ],
    cons: [
      "Limited to 50 NBA games",
      "Lower salary for players",
      "Must have roster spot to convert"
    ],
    restrictions: ["50 game limit", "Maximum 3 two-way players"]
  },
  RookieSign: {
    pros: [
      "Cost-controlled contracts",
      "Rookie scale predetermined",
      "Team options for years 3 and 4",
      "Can extend before free agency"
    ],
    cons: [
      "Must use cap space or exception",
      "Limited to draft position scale",
      "Must sign within deadlines"
    ],
    restrictions: []
  },
  UseTPA: {
    pros: [
      "Replace injured player mid-season",
      "Doesn't count against cap",
      "Can be crucial for playoff runs",
      "Additional roster flexibility"
    ],
    cons: [
      "Requires significant injury",
      "Complex qualification process",
      "Limited time to use",
      "May trigger hard cap"
    ],
    restrictions: []
  },
  StretchWaive: {
    pros: [
      "Creates immediate cap relief",
      "Spreads dead money over multiple years",
      "Can help get under tax or apron"
    ],
    cons: [
      "Dead money counts against cap for years",
      "Still paying player not on roster",
      "Reduces future flexibility"
    ],
    restrictions: ["Formula: (Years remaining × 2) + 1"]
  }
};

const NBACapDecisionTool = () => {
  const [selectedCap, setSelectedCap] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [showTeamSummary, setShowTeamSummary] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState("2024-25");

  // Sample team data - in a real app, this would come from an API
  const teamData = {
    "2024-25": [
      { rank: 1, team: "PHX", logo: "🔥", totalApron: 214877340, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "SecondApronTeam" },
      { rank: 2, team: "MIN", logo: "🐺", totalApron: 205543421, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "SecondApronTeam" },
      { rank: 3, team: "BOS", logo: "☘️", totalApron: 193388445, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "SecondApronTeam" },
      { rank: 4, team: "NYK", logo: "🏀", totalApron: 188677841, firstApron: 178900000, secondApron: 189500000, isHardCapped: true, capStatus: "FirstApronHardCap" },
      { rank: 5, team: "LAL", logo: "💜", totalApron: 186360671, firstApron: 178900000, secondApron: 189500000, isHardCapped: true, capStatus: "FirstApronHardCap" },
      { rank: 6, team: "MIL", logo: "🦌", totalApron: 186751223, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "FirstApronTeam" },
      { rank: 7, team: "DEN", logo: "⛰️", totalApron: 183774619, firstApron: 178900000, secondApron: 189500000, isHardCapped: true, capStatus: "FirstApronHardCap" },
      { rank: 8, team: "DAL", logo: "🐴", totalApron: 178128441, firstApron: 178900000, secondApron: 189500000, isHardCapped: true, capStatus: "TaxTeam" },
      { rank: 9, team: "GSW", logo: "🌉", totalApron: 177780867, firstApron: 178900000, secondApron: 189500000, isHardCapped: true, capStatus: "TaxTeam" },
      { rank: 10, team: "TOR", logo: "🦖", totalApron: 176842436, firstApron: 178900000, secondApron: 189500000, isHardCapped: true, capStatus: "TaxTeam" },
      { rank: 11, team: "WAS", logo: "🏛️", totalApron: 176604086, firstApron: 178900000, secondApron: 189500000, isHardCapped: true, capStatus: "TaxTeam" },
      { rank: 12, team: "IND", logo: "🏁", totalApron: 176011825, firstApron: 178900000, secondApron: 189500000, isHardCapped: true, capStatus: "TaxTeam" },
      { rank: 13, team: "MIA", logo: "🔥", totalApron: 175886172, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "TaxTeam" },
      { rank: 14, team: "NOP", logo: "⚜️", totalApron: 172745200, firstApron: 178900000, secondApron: 189500000, isHardCapped: true, capStatus: "NonTaxTeam" },
      { rank: 15, team: "CLE", logo: "🗡️", totalApron: 172640048, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "NonTaxTeam" },
      { rank: 16, team: "SAC", logo: "👑", totalApron: 172235996, firstApron: 178900000, secondApron: 189500000, isHardCapped: true, capStatus: "NonTaxTeam" },
      { rank: 17, team: "CHI", logo: "🐂", totalApron: 171640312, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "NonTaxTeam" },
      { rank: 18, team: "HOU", logo: "🚀", totalApron: 170921211, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "NonTaxTeam" },
      { rank: 19, team: "LAC", logo: "⛵", totalApron: 170720454, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "NonTaxTeam" },
      { rank: 20, team: "ATL", logo: "🦅", totalApron: 170981401, firstApron: 178900000, secondApron: 189500000, isHardCapped: true, capStatus: "NonTaxTeam" },
      { rank: 21, team: "PHI", logo: "🔔", totalApron: 170340547, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "NonTaxTeam" },
      { rank: 22, team: "ORL", logo: "✨", totalApron: 162711914, firstApron: 178900000, secondApron: 189500000, isHardCapped: true, capStatus: "RoomTeam" },
      { rank: 23, team: "POR", logo: "🌲", totalApron: 149540151, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "RoomTeam" },
      { rank: 24, team: "SAS", logo: "🏰", totalApron: 147746482, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "RoomTeam" },
      { rank: 25, team: "CHA", logo: "🐝", totalApron: 147423486, firstApron: 178900000, secondApron: 189500000, isHardCapped: true, capStatus: "RoomTeam" },
      { rank: 26, team: "OKC", logo: "⚡", totalApron: 146902623, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "RoomTeam" },
      { rank: 27, team: "MEM", logo: "🐻", totalApron: 146894373, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "RoomTeam" },
      { rank: 28, team: "UTA", logo: "🎵", totalApron: 144923217, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "RoomTeam" },
      { rank: 29, team: "BKN", logo: "🌉", totalApron: 136280422, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "RoomTeam" },
      { rank: 30, team: "DET", logo: "🏁", totalApron: 134353989, firstApron: 178900000, secondApron: 189500000, isHardCapped: false, capStatus: "RoomTeam" }
    ],
    "2025-26": [
      { rank: 1, team: "BOS", logo: "☘️", totalApron: 227764875, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "SecondApronTeam" },
      { rank: 2, team: "CLE", logo: "🗡️", totalApron: 220663272, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "SecondApronTeam" },
      { rank: 3, team: "PHX", logo: "🔥", totalApron: 219233471, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "SecondApronTeam" },
      { rank: 4, team: "HOU", logo: "🚀", totalApron: 205451975, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "SecondApronTeam" },
      { rank: 5, team: "NYK", logo: "🏀", totalApron: 199779194, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "SecondApronTeam" },
      { rank: 6, team: "DEN", logo: "⛰️", totalApron: 197211896, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "FirstApronTeam" },
      { rank: 7, team: "MIN", logo: "🐺", totalApron: 193020896, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "FirstApronTeam" },
      { rank: 8, team: "ORL", logo: "✨", totalApron: 191833831, firstApron: 187500000, secondApron: 198900000, isHardCapped: true, capStatus: "FirstApronTeam" },
      { rank: 9, team: "LAL", logo: "💜", totalApron: 191586670, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "FirstApronTeam" },
      { rank: 10, team: "TOR", logo: "🦖", totalApron: 188169375, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "FirstApronTeam" },
      { rank: 11, team: "MIA", logo: "🔥", totalApron: 180991510, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "TaxTeam" },
      { rank: 12, team: "OKC", logo: "⚡", totalApron: 179212796, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "TaxTeam" },
      { rank: 13, team: "NOP", logo: "⚜️", totalApron: 177572840, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "TaxTeam" },
      { rank: 14, team: "PHI", logo: "🔔", totalApron: 177344731, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "TaxTeam" },
      { rank: 15, team: "LAC", logo: "⛵", totalApron: 172830866, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "NonTaxTeam" },
      { rank: 16, team: "POR", logo: "🌲", totalApron: 172492382, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "NonTaxTeam" },
      { rank: 17, team: "GSW", logo: "🌉", totalApron: 170932327, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "NonTaxTeam" },
      { rank: 18, team: "SAC", logo: "👑", totalApron: 170248731, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "NonTaxTeam" },
      { rank: 19, team: "IND", logo: "🏁", totalApron: 168463090, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "NonTaxTeam" },
      { rank: 20, team: "MIL", logo: "🦌", totalApron: 167779681, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "NonTaxTeam" },
      { rank: 21, team: "WAS", logo: "🏛️", totalApron: 164341912, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "NonTaxTeam" },
      { rank: 22, team: "UTA", logo: "🎵", totalApron: 153292629, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "RoomTeam" },
      { rank: 23, team: "CHA", logo: "🐝", totalApron: 151229689, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "RoomTeam" },
      { rank: 24, team: "DAL", logo: "🐴", totalApron: 150153270, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "RoomTeam" },
      { rank: 25, team: "SAS", logo: "🏰", totalApron: 147018612, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "RoomTeam" },
      { rank: 26, team: "ATL", logo: "🦅", totalApron: 146958795, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "RoomTeam" },
      { rank: 27, team: "DET", logo: "🏁", totalApron: 136280422, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "RoomTeam" },
      { rank: 28, team: "CHI", logo: "🐂", totalApron: 135179667, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "RoomTeam" },
      { rank: 29, team: "MEM", logo: "🐻", totalApron: 134353989, firstApron: 187500000, secondApron: 198900000, isHardCapped: true, capStatus: "RoomTeam" },
      { rank: 30, team: "BKN", logo: "🌉", totalApron: 132456789, firstApron: 187500000, secondApron: 198900000, isHardCapped: false, capStatus: "RoomTeam" }
    ]
  };

  const availableTools = selectedCap ? toolsByCapStatus[selectedCap] : [];
  const implications = selectedTool ? (toolImplications[selectedTool] || {
    pros: ["Details not available"],
    cons: ["Details not available"],
    restrictions: []
  }) : null;

  const handleCapChange = (e) => {
    setSelectedCap(e.target.value);
    setSelectedTool(""); // Reset tool selection when cap status changes
  };

  const handleToolChange = (e) => {
    setSelectedTool(e.target.value);
  };

  const getCapStatusColor = (capId) => {
    switch(capId) {
      case "RoomTeam": return "text-green-400";
      case "NonTaxTeam": return "text-blue-400";
      case "TaxTeam": return "text-cyan-400";
      case "FirstApronTeam": return "text-yellow-400";
      case "FirstApronHardCap": return "text-orange-400";
      case "SecondApronHardCap": return "text-orange-500";
      case "SecondApronTeam": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDistanceFromApron = (teamSalary, apronLevel) => {
    const diff = teamSalary - apronLevel;
    if (diff > 0) return `+${formatCurrency(diff)}`;
    return formatCurrency(diff);
  };

  const getStatusColor = (capStatus) => {
    switch(capStatus) {
      case "RoomTeam": return "text-green-500";
      case "NonTaxTeam": return "text-blue-500";
      case "TaxTeam": return "text-cyan-500";
      case "FirstApronTeam": return "text-yellow-500";
      case "FirstApronHardCap": return "text-orange-500";
      case "SecondApronHardCap": return "text-orange-600";
      case "SecondApronTeam": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getStatusLabel = (capStatus) => {
    switch(capStatus) {
      case "RoomTeam": return "Under Cap";
      case "NonTaxTeam": return "Non-Tax";
      case "TaxTeam": return "Taxpayer";
      case "FirstApronTeam": return "1st Apron";
      case "FirstApronHardCap": return "Hard Cap @ 1st";
      case "SecondApronHardCap": return "Hard Cap @ 2nd";
      case "SecondApronTeam": return "2nd Apron";
      default: return "Unknown";
    }
  };

  const currentTeams = teamData[selectedSeason] || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">NBA Roster & Trade Decision Tool</h1>
          <p className="text-gray-400">Analyze team cap situations and explore roster-building options</p>
        </div>

        {/* Navigation Toggle */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setShowTeamSummary(true)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              showTeamSummary 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Team Summary
          </button>
          <button
            onClick={() => setShowTeamSummary(false)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              !showTeamSummary 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Decision Tool
          </button>
        </div>

        {showTeamSummary ? (
          <>
            {/* Season Selector */}
            <div className="mb-6">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="2024-25">2024-25 Season</option>
                <option value="2025-26">2025-26 Season</option>
              </select>
            </div>

            {/* Team Summary Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 text-sm uppercase tracking-wider">
                      <th className="py-3 px-4 text-left">Rank</th>
                      <th className="py-3 px-4 text-left">Team</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Total Salary</th>
                      <th className="py-3 px-4 text-right">1st Apron</th>
                      <th className="py-3 px-4 text-right">2nd Apron</th>
                      <th className="py-3 px-4 text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTeams.map((team) => {
                      const isOver1st = team.totalApron > team.firstApron;
                      const isOver2nd = team.totalApron > team.secondApron;
                      
                      return (
                        <tr key={team.team} className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors">
                          <td className="py-3 px-4 text-gray-400">{team.rank}</td>
                          <td className="py-3 px-4 font-medium">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{team.logo}</span>
                              <span>{team.team}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(team.capStatus)}`}>
                              {getStatusLabel(team.capStatus)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            {formatCurrency(team.totalApron)}
                          </td>
                          <td className={`py-3 px-4 text-right font-mono ${isOver1st ? 'text-yellow-500' : 'text-gray-400'}`}>
                            {getDistanceFromApron(team.totalApron, team.firstApron)}
                          </td>
                          <td className={`py-3 px-4 text-right font-mono ${isOver2nd ? 'text-red-500' : 'text-gray-400'}`}>
                            {getDistanceFromApron(team.totalApron, team.secondApron)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {team.isHardCapped && (
                              <span className="text-orange-500" title="Hard Capped">🔒</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm text-gray-400 mb-1">Teams Over 2nd Apron</h3>
                <p className="text-2xl font-bold text-red-500">
                  {currentTeams.filter(t => t.capStatus === "SecondApronTeam").length}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm text-gray-400 mb-1">Teams Over 1st Apron</h3>
                <p className="text-2xl font-bold text-yellow-500">
                  {currentTeams.filter(t => t.totalApron > t.firstApron).length}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm text-gray-400 mb-1">Teams Hard Capped</h3>
                <p className="text-2xl font-bold text-orange-500">
                  {currentTeams.filter(t => t.isHardCapped).length}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm text-gray-400 mb-1">Teams Under Cap</h3>
                <p className="text-2xl font-bold text-green-500">
                  {currentTeams.filter(t => t.capStatus === "RoomTeam").length}
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Status Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded"></span>
                  <span>Under Cap (Room)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded"></span>
                  <span>Non-Taxpayer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-cyan-500 rounded"></span>
                  <span>Taxpayer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-500 rounded"></span>
                  <span>First Apron</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-500 rounded"></span>
                  <span>Hard Capped @ 1st</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-600 rounded"></span>
                  <span>Hard Capped @ 2nd</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded"></span>
                  <span>Second Apron</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-500">🔒</span>
                  <span>Hard Cap Active</span>
                </div>
              </div>
            </div>

            {/* Quick Analysis */}
            <div className="mt-6 bg-blue-900/20 border border-blue-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Quick Analysis - {selectedSeason}</h3>
              <div className="space-y-2 text-sm">
                <p>• <span className="font-medium">{currentTeams.filter(t => t.capStatus === "SecondApronTeam").length} teams</span> are over the second apron and face the most severe restrictions</p>
                <p>• <span className="font-medium">{currentTeams.filter(t => t.isHardCapped).length} teams</span> are hard capped and cannot exceed their respective apron limits</p>
                <p>• <span className="font-medium">{currentTeams.filter(t => t.capStatus === "RoomTeam").length} teams</span> have cap space available for free agent signings</p>
                <p>• The luxury tax level for {selectedSeason} is approximately <span className="font-medium">{formatCurrency(selectedSeason === "2024-25" ? 170900000 : 179500000)}</span></p>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Cap Status Selection */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <label className="block text-sm font-medium mb-2">Team Cap Status</label>
              <select
                value={selectedCap}
                onChange={handleCapChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              >
                <option value="">Select your team's cap situation...</option>
                {capOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label} - {opt.description}</option>
                ))}
              </select>

        {/* Cap Status Selection */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium mb-2">Team Cap Status</label>
          <select
            value={selectedCap}
            onChange={handleCapChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          >
            <option value="">Select your team's cap situation...</option>
            {capOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label} - {opt.description}</option>
            ))}
          </select>

          {selectedCap && (
            <>
              <div className={`mt-4 p-4 bg-gray-700 rounded-lg ${getCapStatusColor(selectedCap)}`}>
                <h3 className="font-semibold mb-1">
                  {capOptions.find(opt => opt.id === selectedCap)?.label}
                </h3>
                <p className="text-sm text-gray-300">
                  {capOptions.find(opt => opt.id === selectedCap)?.description}
                </p>
              </div>

              {/* Trade Rules Summary */}
              <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <h4 className="font-semibold mb-2 text-blue-400">📊 Trade Matching Rules</h4>
                <div className="text-sm text-gray-300">
                  {selectedCap === "RoomTeam" && (
                    <ul className="space-y-1">
                      <li>• Can absorb contracts using cap space + $250k</li>
                      <li>• No salary matching required</li>
                      <li>• Most flexible trade options</li>
                    </ul>
                  )}
                  {selectedCap === "NonTaxTeam" && (
                    <ul className="space-y-1">
                      <li>• Standard: Match within 100% + $250k</li>
                      <li>• Expanded: Take back up to 200% (hard caps at 1st apron)</li>
                      <li>• Can aggregate multiple contracts (hard caps at 2nd apron)</li>
                      <li>• Full access to all trade exceptions</li>
                    </ul>
                  )}
                  {selectedCap === "TaxTeam" && (
                    <ul className="space-y-1">
                      <li>• Standard: Match within 100% + $250k</li>
                      <li>• Expanded: Take back up to 200% (hard caps at 1st apron)</li>
                      <li>• Can aggregate contracts (hard caps at 2nd apron)</li>
                      <li>• Still have trade flexibility below first apron</li>
                    </ul>
                  )}
                  {selectedCap === "FirstApronTeam" && (
                    <ul className="space-y-1">
                      <li>• Limited to 100% + $250k matching</li>
                      <li>• <span className="text-red-400">Cannot aggregate salaries</span></li>
                      <li>• No expanded trade options</li>
                      <li>• Must match nearly dollar-for-dollar</li>
                    </ul>
                  )}
                  {selectedCap === "FirstApronHardCap" && (
                    <ul className="space-y-1">
                      <li className="text-yellow-400">• Hard capped at First Apron ($172.3M)</li>
                      <li>• Limited to 100% + $250k matching</li>
                      <li>• Cannot aggregate salaries</li>
                      <li>• Cannot make moves that exceed cap</li>
                    </ul>
                  )}
                  {selectedCap === "SecondApronHardCap" && (
                    <ul className="space-y-1">
                      <li className="text-yellow-400">• Hard capped at Second Apron ($182.8M)</li>
                      <li>• Limited to 100% + $250k matching</li>
                      <li>• Cannot aggregate salaries</li>
                      <li>• Can still use TPMLE if under cap</li>
                    </ul>
                  )}
                  {selectedCap === "SecondApronTeam" && (
                    <ul className="space-y-1">
                      <li className="text-red-400">• Cannot aggregate salaries</li>
                      <li className="text-red-400">• Cannot take back more salary</li>
                      <li className="text-red-400">• Cannot use cash in trades</li>
                      <li className="text-red-400">• Frozen draft pick 7 years out</li>
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Available Tools Selection */}
        {selectedCap && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <label className="block text-sm font-medium mb-2">Available Roster Tools</label>
            <select
              value={selectedTool}
              onChange={handleToolChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            >
              <option value="">Select a tool to use...</option>
              {availableTools.map(tool => (
                <option key={tool.id} value={tool.id}>{tool.label}</option>
              ))}
            </select>

            {/* Tool Description */}
            {selectedTool && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-1">
                  {availableTools.find(t => t.id === selectedTool)?.label}
                </h3>
                <p className="text-sm text-gray-300">
                  {availableTools.find(t => t.id === selectedTool)?.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Implications Display */}
        {selectedTool && implications && (
          <div className="space-y-4">
            {/* Trade-Specific Alert for Trade Tools */}
            {(selectedTool.includes("Trade") || selectedTool === "TradeRoomPlus") && (
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2 flex items-center">
                  <span className="mr-2">🔄</span>
                  Trade Tool Selected
                </h3>
                <p className="text-blue-300 text-sm">
                  {selectedTool === "TradeRoomPlus" && "You can absorb contracts into your cap space without matching salaries."}
                  {selectedTool === "TradeStandard" && "You must send out roughly equal salary to what you take back."}
                  {selectedTool === "TradeAggregated" && "You can combine multiple outgoing contracts but will trigger the second apron hard cap."}
                  {selectedTool === "TradeExpanded" && "You can take back significantly more salary but will trigger the first apron hard cap."}
                  {selectedTool === "TradeStandardOnly" && "Your trade flexibility is limited - no salary aggregation allowed."}
                  {selectedTool === "TradeLimitedSevere" && "You face the most restrictive trade rules in the CBA."}
                </p>
              </div>
            )}

            {/* Restrictions Alert */}
            {implications.restrictions.length > 0 && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                <h3 className="text-red-400 font-semibold mb-2 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Key Restrictions
                </h3>
                <ul className="space-y-1">
                  {implications.restrictions.map((restriction, index) => (
                    <li key={index} className="text-red-300 text-sm">• {restriction}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pros */}
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold mb-2 flex items-center">
                <span className="mr-2">✅</span>
                Advantages
              </h3>
              <ul className="space-y-1">
                {implications.pros.map((pro, index) => (
                  <li key={index} className="text-green-300 text-sm">• {pro}</li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <h3 className="text-yellow-400 font-semibold mb-2 flex items-center">
                <span className="mr-2">⚡</span>
                Limitations
              </h3>
              <ul className="space-y-1">
                {implications.cons.map((con, index) => (
                  <li key={index} className="text-yellow-300 text-sm">• {con}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Summary Card */}
        {selectedCap && selectedTool && (
          <div className="mt-6 bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Decision Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Cap Status:</span>
                <span className={getCapStatusColor(selectedCap)}>
                  {capOptions.find(opt => opt.id === selectedCap)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Selected Tool:</span>
                <span className="text-white">
                  {availableTools.find(t => t.id === selectedTool)?.label}
                </span>
              </div>
              {(selectedTool.includes("Trade") || selectedTool === "TradeRoomPlus") && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Trade Type:</span>
                  <span className="text-blue-400">
                    {selectedTool === "TradeRoomPlus" && "Absorbing into cap"}
                    {selectedTool === "TradeStandard" && "Standard matching"}
                    {selectedTool === "TradeAggregated" && "Aggregating contracts"}
                    {selectedTool === "TradeExpanded" && "Expanded matching"}
                    {selectedTool === "TradeStandardOnly" && "Limited matching"}
                    {selectedTool === "TradeLimitedSevere" && "Severely restricted"}
                  </span>
                </div>
              )}
              {(implications?.restrictions.includes("Hard cap at $172.3M (first apron)") || 
                implications?.restrictions.includes("Hard capped at $172.3M (First Apron)")) && (
                <div className="flex justify-between text-red-400">
                  <span>Hard Cap:</span>
                  <span>$172.3M (First Apron)</span>
                </div>
              )}
              {(implications?.restrictions.includes("Triggers hard cap at $182.8M (second apron)") || 
                implications?.restrictions.includes("Hard capped at $182.8M (Second Apron)")) && (
                <div className="flex justify-between text-red-400">
                  <span>Hard Cap:</span>
                  <span>$182.8M (Second Apron)</span>
                </div>
              )}
              {selectedCap === "FirstApronHardCap" && (
                <div className="flex justify-between text-orange-400">
                  <span>Status:</span>
                  <span>Currently Hard Capped</span>
                </div>
              )}
              {selectedCap === "SecondApronHardCap" && (
                <div className="flex justify-between text-orange-500">
                  <span>Status:</span>
                  <span>Currently Hard Capped</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Salary Thresholds Reference */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">2023-24 Salary Thresholds</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Salary Cap:</span>
              <span className="text-green-400 font-mono">$136,021,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Luxury Tax Level:</span>
              <span className="text-cyan-400 font-mono">$165,294,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">First Apron:</span>
              <span className="text-yellow-400 font-mono">$172,346,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Second Apron:</span>
              <span className="text-red-400 font-mono">$182,794,000</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            * These amounts increase annually based on basketball-related income (BRI)
          </p>
        </div>

        {/* Hard Cap Triggers Reference */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">What Triggers Hard Caps?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
              <h4 className="text-orange-400 font-semibold mb-2">First Apron Hard Cap ($172.3M)</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Using Non-Taxpayer MLE ($12.4M)</li>
                <li>• Using Bi-Annual Exception ($4.5M)</li>
                <li>• Acquiring player via Sign-and-Trade</li>
                <li>• Using Expanded Trade Exception (200%)</li>
              </ul>
              <p className="text-xs text-orange-300 mt-2">Once triggered, cannot exceed for entire season</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-600 rounded-lg p-4">
              <h4 className="text-orange-500 font-semibold mb-2">Second Apron Hard Cap ($182.8M)</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Using Aggregated Trade Exception</li>
                <li>• (Combining multiple contracts in trade)</li>
              </ul>
              <p className="text-xs text-orange-400 mt-2">Less restrictive than 1st apron but still binding</p>
            </div>
          </div>
        </div>

        {/* Trade Rules Quick Reference */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Trade Matching Rules by Cap Status</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-2">Cap Status</th>
                  <th className="text-left py-2 px-2">Salary Matching</th>
                  <th className="text-left py-2 px-2">Can Aggregate?</th>
                  <th className="text-left py-2 px-2">Cash Usage</th>
                  <th className="text-left py-2 px-2">Hard Cap?</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-700/50">
                  <td className="py-2 px-2 text-green-400">Room Team</td>
                  <td className="py-2 px-2">Cap Space + $250k</td>
                  <td className="py-2 px-2">N/A (absorbing)</td>
                  <td className="py-2 px-2">✅ Yes</td>
                  <td className="py-2 px-2">None</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-2 px-2 text-blue-400">Non-Taxpayer</td>
                  <td className="py-2 px-2">100% / 125% / 200%</td>
                  <td className="py-2 px-2">✅ Yes*</td>
                  <td className="py-2 px-2">✅ Yes</td>
                  <td className="py-2 px-2">Varies by method</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-2 px-2 text-cyan-400">Taxpayer (Under 1st)</td>
                  <td className="py-2 px-2">100% / 125% / 200%</td>
                  <td className="py-2 px-2">✅ Yes*</td>
                  <td className="py-2 px-2">✅ Yes</td>
                  <td className="py-2 px-2">Varies by method</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-2 px-2 text-yellow-400">First Apron Team</td>
                  <td className="py-2 px-2">100% + $250k only</td>
                  <td className="py-2 px-2">❌ No</td>
                  <td className="py-2 px-2">✅ Yes</td>
                  <td className="py-2 px-2">None</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-2 px-2 text-orange-400">Hard Cap @ 1st</td>
                  <td className="py-2 px-2">100% + $250k only</td>
                  <td className="py-2 px-2">❌ No</td>
                  <td className="py-2 px-2">✅ Yes</td>
                  <td className="py-2 px-2">Locked at 1st</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-2 px-2 text-orange-500">Hard Cap @ 2nd</td>
                  <td className="py-2 px-2">100% + $250k only</td>
                  <td className="py-2 px-2">❌ No</td>
                  <td className="py-2 px-2">✅ Yes</td>
                  <td className="py-2 px-2">Locked at 2nd</td>
                </tr>
                <tr>
                  <td className="py-2 px-2 text-red-400">Second Apron</td>
                  <td className="py-2 px-2">100% (no extra)</td>
                  <td className="py-2 px-2">❌ No</td>
                  <td className="py-2 px-2">❌ No</td>
                  <td className="py-2 px-2">None</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            * Using expanded matching (200%) triggers 1st apron hard cap; aggregation triggers 2nd apron hard cap
          </p>
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>NBA Roster & Trade Decision Tool - Based on 2023 CBA</p>
          <p className="mt-1">Salary figures shown are for 2023-24 season</p>
          <p className="mt-1">Created with React and Tailwind CSS</p>
        </div>
          </div>
        )}
      </div>
    </div>
  );
};
  );
};

export default NBACapDecisionTool;