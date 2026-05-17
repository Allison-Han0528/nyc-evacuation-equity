# When Evacuation Is Uneven

**Mapping hurricane risk and evacuation access gaps for NYCHA developments in New York City**

🔗 [Live Site](https://allison-han0528.github.io/when-evacuation-is-unven/) &nbsp;·&nbsp; NYU Web Mapping Final Project · Allison Han · 2026

---

## About

When hurricane risk is mapped in New York City, the focus usually falls on coastlines and flood zones. But for residents of public housing, another question matters just as much: **when a storm is approaching, how easy is it to reach a designated evacuation center?**

This project maps **evacuation disadvantage** for NYCHA (New York City Housing Authority) developments — identifying which public housing sites face the greatest combination of hurricane exposure, distance from evacuation centers, and lack of transit access.

---

## The Five Steps

| Step | Question |
|------|----------|
| 1 | Where do NYCHA developments sit within the city's geography? |
| 2 | Which developments fall outside the 0.5-mile reach of an evacuation center? |
| 3 | Where is the access gap most concentrated? |
| 4 | Which areas should be planning priorities? |
| 5 | Which developments are doubly isolated — far from both evacuation centers AND subway stations? |

---

## Key Findings

- **78%** of sampled NYCHA developments fall outside the 0.5-mile reach of any evacuation center
- **42** of those are additionally outside the 0.25-mile subway walkshed — doubly isolated
- A full spatial analysis using **QGIS across all NYCHA developments citywide** identifies **132 doubly isolated developments**
- The highest concentrations are in **southern Brooklyn, southeast Queens, and Staten Island** — where coastal exposure, sparse transit, and access gaps converge

---

## Data Sources

| Dataset | Source | Use |
|---------|--------|-----|
| NYCHA Public Housing Developments | [NYC Open Data](https://data.cityofnewyork.us/Housing-Development/NYCHA-Development-Data-Book/evjd-dqpz) | Base point layer (representative sample embedded in code) |
| Hurricane Evacuation Centers | [NYC Open Data](https://data.cityofnewyork.us/Public-Safety/Hurricane-Evacuation-Centers/ayer-cga7) | Evacuation access analysis |
| Subway Stations | [NYC Open Data](https://data.cityofnewyork.us/Transportation/Subway-Stations/arq3-7z49) | Transit access analysis (representative sample embedded) |
| NYC Borough Boundaries | [NYC Open Data](https://data.cityofnewyork.us/City-Government/Borough-Boundaries/7t3b-ywvw) | Base map context |

---

## Methods

**Buffer Analysis**
A 0.5-mile buffer was generated around each evacuation center using [Turf.js](https://turfjs.org/), accounting for real geographic distance via Haversine calculation. A 0.25-mile subway walkshed buffer was applied using the same method.

**Access Gap Identification**
Developments outside the evacuation buffer were identified by comparing each NYCHA–center pair. This mirrors the spatial Difference analysis performed in QGIS on the full dataset.

**Double Isolation (Step 5)**
Developments were flagged as doubly isolated if they fell outside *both* the evacuation center buffer and the subway walkshed. The QGIS analysis using the complete citywide dataset identified 132 such developments.

**Full QGIS Analysis**
The complete spatial workflow — including reprojection to EPSG:2263 (NY State Plane), buffer generation, and spatial intersection — was performed in QGIS on the full NYCHA dataset downloaded from NYC Open Data.

---

## Tech Stack

| Tool | Use |
|------|-----|
| [Mapbox GL JS v3.3.0](https://docs.mapbox.com/mapbox-gl-js/) | Interactive map rendering |
| [Turf.js v6.5.0](https://turfjs.org/) | Client-side geospatial buffer analysis |
| [QGIS](https://qgis.org/) | Full spatial data processing (complete dataset) |
| [Google Fonts](https://fonts.google.com/) | Playfair Display + Source Serif 4 |
| Vanilla HTML, CSS, JavaScript | No frameworks |

---

## File Structure

```
when-evacuation-is-uneven/
├── index.html          ← Main page: HTML structure + all CSS styles
├── script.js           ← Map logic, scrollytelling, embedded data
├── README.md           ← This file
└── data/               ← Full QGIS-processed datasets (for reference)
    ├── raw/
    │   ├── boroughs.geojson
    │   ├── Hurricane_Evacuation_Centers_20260517.geojson
    │   ├── hurricane-evacuation-zones.geojson
    │   └── subway_stations.geojson
    └── processed/
        ├── nycha_access_gap_4326.geojson
        ├── nycha_double_isolated_4326.geojson
        ├── nycha_no_subway_4326.geojson
        ├── evacuation_buffer_4326.geojson
        └── subway_buffer_4326.geojson
```

> **Note:** The map runs entirely from data embedded in `script.js` and does not require the `/data` folder to function. The `/data` folder contains the full QGIS-processed datasets used for the complete 132-development analysis.

---

## How to Run Locally

```bash
# Clone the repository
git clone https://github.com/Allison-Han0528/when-evacuation-is-unven.git
cd when-evacuation-is-unven

# Serve locally (any static server works)
python -m http.server 5500
# then open http://localhost:5500
```

---

*NYU Center for Urban Science + Progress · Web Mapping · Spring 2026*