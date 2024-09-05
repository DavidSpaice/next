const model = [
  { model: "GUD24AH2/D-D(U)" },
  { model: "GUD30AH2/D-D(U)" },
  { model: "GUD42AH2/D-D(U)" },
  { model: "GUD48AH2/D-D(U)" },
  { model: "GUD60AH2/D-D(U)" },
  { model: "GUD36AH2/A-D(U)" },
  { model: "GUD60AH2/A-D(U)" },
  { model: "GWH09QB-D3DNB8E/I (WIFI)" },
  { model: "GWH12QC-D3DNB8E/I (WIFI)" },
  { model: "GWH18QD-D3DNB8E/I (WIFI)" },
  { model: "GWH24QE-D3DNB8E/I (WIFI)" },
  { model: "GWH24QE-D3DNB2R/O (LCLH)" },
  { model: "GWH24QE-D3DNB8R/I(WIFI)" },
  { model: "GUD36W/A-D(U)" },
  { model: "GUD60W/A-D(U)" },
  { model: "GUD24W2/D-D(U)" },
  { model: "GUD30W2/D-D(U)" },
  { model: "GUD36W2/D-D(U)" },
  { model: "GUD42W2/D-D(U)" },
  { model: "GUD48W2/D-D(U)" },
  { model: "GUD60W2/D-D(U)" },
  { model: "XK76" },
  { model: "XK19" },
  { model: "ELEMHT16-5KW" },
  { model: "ELEMHT16-8KW" },
  { model: "ELEMHT16-10KW" },
  { model: "ELEMHT16-15KW" },
  { model: "ELEMHT18-5KW" },
  { model: "ELEMHT18-8KW" },
  { model: "ELEMHT18-10KW" },
  { model: "ELEMHT18-15KW" },
  { model: "GFH(09)EA-D3DNA1A/I" },
  { model: "GFH(12)EA-D3DNA1A/I" },
  { model: "GFH(18)EA-D3DNA1A/I" },
  { model: "GFH(21)EA-D3DNA1A/I" },
  { model: "GFH(24)EA-D3DNA1A/I" },
  { model: "GKH(12)BB-D3DNA3A/I" },
  { model: "GKH(18)BB-D3DNA3A/I" },
  { model: "GKH(24)BC-D3DNA4A/I" },
  { model: "GWHD(18)ND3GO" },
  { model: "GWHD(24)ND3GO" },
  { model: "GWHD(36)ND3GO" },
  { model: "GWHD(18)ND3MO" },
  { model: "GWHD(24)ND3MO" },
  { model: "GWHD(30)ND3MO" },
  { model: "GWHD(36)ND3MO" },
  { model: "GWHD(42)ND3MO" },
  { model: "GCAT36F/NaA" },
  { model: "GCAT60H/NaA" },
  { model: "ACI-BCO24CP17" },
  { model: "ACI-AUO24SHP-M" },
  { model: "GWH09QB-D3DNA6E/O(LCLH)" },
  { model: "GWH12QC-D3DNA6E/O (LCLH)" },
  { model: "GWH18QD-D3DNA6E/O (LCLH)" },
  { model: "GWH24QE-D3DNA6E/O (LCLH)" },
  { model: "GWH12QC-D3DNB2M/O(LCLH)" },
  { model: "GWH12QC-D3DNB8N/I(WIFI)" },
  { model: "GWH18QD-D3DNB2L/O(LCLH)" },
  { model: "GWH18QD-D3DNB8L/I (WIFI)" },
  { model: "GWH09ATCXB-D3DNA1A/O" },
  { model: "GWH09ATCXB-D3DNA3A/I" },
  { model: "GWH12ATCXB-D3DNA1C/O" },
  { model: "GWH12ATCXB-D3DNA3C/I" },
  { model: "GWH18ATDXD-D3DNA1A/O(LCLH)" },
  { model: "GWH18ATDXD-D3DNA3A/I" },
  { model: "GWH24QEXF-D3DNC4C/O(LCLH)" },
  { model: "GWH24ATEXF-D3DNA3E/I" },
  { model: "GWH09QC-A3DNA1D/O (LCLH)" },
  { model: "GWH09QC-A3DNB8D/I (WIFI)" },
  { model: "GWH12QC-A3DNA1D/O (LCLH)" },
  { model: "GWH12QC-A3DNB8D/I (WIFI)" },
  { model: "GWH09ACD-D3DNA1A/O(LCLH)" },
  { model: "GWH09QD-D3DND6B/I(WIFI)" },
  { model: "GWH12YD-D3DNA1A/O (LCLH)" },
  { model: "GWH12QD-D3DND6A/I (WIFI)" },
  { model: "GWH18YE-D3DNA1A/O (LCLH)" },
  { model: "GWH18QE-D3DND6A/I (WIFI)" },
  { model: "GWH24YE-D3DNA1A/O (LCLH)" },
  { model: "GWH24QE-D3DND6L/I ( WIFI)" },
  { model: "GAE09AE-D3NRNB2G" },
  { model: "ACI-AUO30SHP-M" },
  { model: "ACI-CCO36CP21" },
  { model: "GAA12AE-D3NRNB2G" },
  { model: "GWH12QC-D3DNB8D/I (WIFI)" },
  { model: "GWH18QD-D3DNB8G/I (WIFI)" },
  { model: "GCAT24F/NaA" },
  { model: "GWH09ATCXB-A3DNA1A/O(LCLH)" },
  { model: "GWH09ATCXB-A3DNA3A/I (WIFI)" },
  { model: "GWH12ATCXB-A3DNA1C/O(LCLH)" },
  { model: "GWH12ATCXB-A3DNA3C/I (WIFI)" },
  { model: "GWH30QFXH-D3DNB2A/O" },
  { model: "GWH30QFXH-D3DNB2A/I(WIFI)" },
  { model: "GWH36QFXH-D3DNB2B/O" },
  { model: "GWH36QFXH-D3DNB2B/I" },
  { model: "GWH09AGCXD-D3DNA1A/O(LCLH)" },
  { model: "GWH12AGCXD-D3DNA1A/O(LCLH)" },
  { model: "GWH18AGDXF-D3DNA1A/O(LCLH)" },
  { model: "GWH24AGEXH-D3DNA1A/O(LCLH)" },
  { model: "GAA07AE-D6NRNB" },
  { model: "GAA09AE-D6NRNB" },
  { model: "GAA12AE-D6NRNB" },
  { model: "GAA15AE-D6NRNB" },
  { model: "GAE07AE-D6NRNB2" },
  { model: "GAE09AE-D6NRNB2" },
  { model: "GAE12AE-D6NRNB2" },
  { model: "GAE15AE-D6NRNB2" },
  { model: "PTAC-PWRCORD" },
  { model: "PTAC-ALGRILL" },
  { model: "PTAC-DRAINKIT" },
  { model: "PTAC-TSTAT" },
  { model: "GAA12AE-D3NRNB" },
  { model: "GAA07AE-D3NRNB" },
  { model: "ML296UH070XV36B" },
  { model: "GFH(24)DB-D3DNA" },
  { model: "GMV-ND30PHS/B-T" },
  { model: "GMV-28WL/C-T(U)" },
  { model: "GEH(12)AA-D3DNA1C/I" },
  { model: "MGV96U060B3C" },
  { model: "MGV96U080B3C" },
  { model: "MGV96U100C5C" },
  { model: "MGV96U120D5C" },
  { model: "MOVA-18CN1-M134G" },
  { model: "MOVA-24CN1-M134G" },
  { model: "MOVA-30CN1-M134G" },
  { model: "MOVA-36CN1-M134G" },
  { model: "MOVA-42CN1-M134L" },
  { model: "MOVA-48CN1-M134L" },
  { model: "MOVA-60CN1-M134L" },
  { model: "MOVA-18CN1-M152G" },
  { model: "MOVA-24CN1-M152G" },
  { model: "MOVA-30CN1-M152G" },
  { model: "MOVA-36CN1-M152L" },
  { model: "MOVA-42CN1-M152L" },
  { model: "MOVA-48CN1-M152L" },
  { model: "MOVA-60CN1-M152L" },
  { model: "MOVA-61CN1-M152L" },
  { model: "MOVA-18HN1-M152L" },
  { model: "MOVA-24HN1-M152L" },
  { model: "MOVA-30HN1-M152L" },
  { model: "MOVA-36HN1-M152L" },
  { model: "MOVA-42HN1-M152L" },
  { model: "MOVA-48HN1-M152L" },
  { model: "MOVA-60HN1-M152L" },
  { model: "MVMP18A1MN1OC" },
  { model: "MVMP24B1MN1OC" },
  { model: "MVMP36B1MN1OC" },
  { model: "MVMP48C1MN1OC" },
  { model: "MVMP60C1MN1OC" },
  { model: "MVMP18A1MN1TC" },
  { model: "MVMP24B1MN1TC" },
  { model: "MVMP36B1MN1TC" },
  { model: "MVMP48C1MN1TC" },
  { model: "MVMP60C1MN1TC" },
  { model: "MVME24A1MN1TC" },
  { model: "MVME36B1MN1TC" },
  { model: "MVME61C1MN1TC" },
  { model: "MCPM3036ANOH" },
  { model: "MCPM3036BNOH" },
  { model: "MCPM3036CNOH" },
  { model: "MCPM4248BNOH" },
  { model: "MCPM4248CNOH" },
  { model: "MCPM4248DNOH" },
  { model: "MCPM4860CNOH" },
  { model: "MCPM4860DNOH" },
  { model: "MCPM3036ANTH" },
  { model: "MCPM3036BNTH" },
  { model: "MCPM3036CNTH" },
  { model: "MCPM4248BNTH" },
  { model: "MCPM4248CNTH" },
  { model: "MCPM4248DNTH" },
  { model: "MCPM4860CNTH" },
  { model: "MCPM4860DNTH" },
  { model: "MRC-24HWN1-M134G" },
  { model: "MRC-30HWN1-M134G" },
  { model: "MRC-36HWN1-M134L" },
  { model: "MRC-42HWN1-M134L" },
  { model: "MRC-48HWN1-M134L" },
  { model: "MRC-60HWN1-M134L" },
  { model: "MRD-24HWN1-M134G" },
  { model: "MRD-36HWN1-M134G" },
  { model: "MRD-48HWN1-M134L" },
  { model: "MRD-60HWN1-M134L" },
  { model: "MRD-60HWN1-X14C" },
  { model: "MGV96U080C4C" },
  { model: "MGV96U100D5C" },
  { model: "MHVP18A1MN1OA" },
  { model: "MHVP24A1MN1OA" },
  { model: "MHVP30B1MN1OA" },
  { model: "MHVP36B1MN1OA" },
  { model: "MHVE18A1MN1TA" },
  { model: "MHVE24A1MN1TA" },
  { model: "MHVE30B1MN1TA" },
  { model: "MHVE36B1MN1TA" },
  { model: "MPCE18A1MN1TA" },
  { model: "MPCE24A1MN1TA" },
  { model: "MPCE30B1MN1TA" },
  { model: "MPCE36B1MN1TA" },
  { model: "MRD-24S060GWN1-M134G" },
  { model: "MRD-30S060GWN1-M134G" },
  { model: "MRD-36S090GWN1-M134G" },
  { model: "MRD-42S090GWN1-M134L" },
  { model: "MRD-48S090GWN1-M134L" },
  { model: "MRD-60S090GWN1-M134L" },
  { model: "MRD-60S110GWN1-M134L" },
  { model: "GMV-72WM/B-F(U)" },
  { model: "GMV-V36WL/C-T(U)" },
  { model: "GUD36A/A-D(U)" },
  { model: "GWH12AGCXD-D3DNA2A/I" },
  { model: "GWH09AGCXD-A3DNA2A/I" },
  { model: "GWH09AGCXD-A3DNA1A/O" },
  { model: "GWH12AGCXD-A3DNA2A/I" },
  { model: "GWH12AGCXD-A3DNA1A/O" },
  { model: "GWH09AGCXD-D3DNA2A/I" },
  { model: "GWH09AGCXD-D3DNAIA/O" },
  { model: "GWH18AGDXF-D3DNAIA/I" },
  { model: "GWH18AGDXF-D3DNA2A/O" },
  { model: "GWH24AGEXH-D3DNA2A/I" },
  { model: "GWH24AGEXH-D3DNAIA/O" },
  { model: "GWH07ATCXB-D3DNA3A/I" },
  { model: "GWH07ATA-D3DNA1A/I(WIFI)" },
  { model: "GWHD(18)ND3PO" },
  { model: "GWH12AGCXD-D3DNAIA/O" },
  { model: "GFH(24)DB-D3DNA1A/I" },
  { model: "GMV-ND06G/B4B-T(U)" },
  { model: "GMV-ND07G/B4B-T(U)" },
  { model: "GMV-ND09G/B4B-T(U)" },
  { model: "GMV-ND12G/B4B-T(U)" },
  { model: "GMV-ND14G/B4B-T(U)" },
  { model: "GMV-ND18G/B4B-T(U)" },
  { model: "GMV-ND24G/B4B-T(U)" },
  { model: "GMV-ND30G/B4B-T(U)" },
  { model: "GMV-ND36G/B4B-T(U)" },
];

export default model;
