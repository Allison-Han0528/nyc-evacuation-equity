/* ============================================================
   script.js — When Evacuation Is Uneven
   NYU Web Mapping Final Project · Allison Han · 2026

   TABLE OF CONTENTS
   1.  NYCHA development data (embedded)
   2.  Evacuation center data (embedded)
   3.  Borough boundary GeoJSON (embedded + fetch fallback)
   4.  Constants & configuration
   5.  Utility functions
   6.  Map initialisation (Mapbox GL JS)
   7.  Building all map sources and layers
   8.  Showing / hiding layers by step
   9.  Updating the legend
   10. Stat boxes
   11. Hover tooltips
   12. Scrollytelling (IntersectionObserver)
   13. Entry point
============================================================ */


/* ============================================================
   1. NYCHA DEVELOPMENT DATA
   Real NYCHA public housing developments from NYC Open Data,
   embedded here so the map works without a network request.
   Fields: name, borough, latitude, longitude
============================================================ */
const nychaData = [
  // ── BROOKLYN ─────────────────────────────────────────────
  { name: "Red Hook Houses",       borough: "Brooklyn",      latitude: 40.6741, longitude: -74.0062 },
  { name: "Gowanus Houses",        borough: "Brooklyn",      latitude: 40.6758, longitude: -73.9919 },
  { name: "Farragut Houses",       borough: "Brooklyn",      latitude: 40.6924, longitude: -73.9859 },
  { name: "Ingersoll Houses",      borough: "Brooklyn",      latitude: 40.6968, longitude: -73.9773 },
  { name: "Whitman Houses",        borough: "Brooklyn",      latitude: 40.6960, longitude: -73.9800 },
  { name: "Atlantic Terminal",     borough: "Brooklyn",      latitude: 40.6851, longitude: -73.9773 },
  { name: "Albany Houses",         borough: "Brooklyn",      latitude: 40.6601, longitude: -73.9414 },
  { name: "Van Dyke Houses",       borough: "Brooklyn",      latitude: 40.6531, longitude: -73.9135 },
  { name: "Pink Houses",           borough: "Brooklyn",      latitude: 40.6600, longitude: -73.8867 },
  { name: "Linden Houses",         borough: "Brooklyn",      latitude: 40.6537, longitude: -73.8918 },
  { name: "Boulevard Houses",      borough: "Brooklyn",      latitude: 40.6574, longitude: -73.8877 },
  { name: "Cypress Hills Houses",  borough: "Brooklyn",      latitude: 40.6853, longitude: -73.8815 },
  { name: "Coney Island Houses",   borough: "Brooklyn",      latitude: 40.5732, longitude: -74.0054 },
  { name: "O'Dwyer Gardens",       borough: "Brooklyn",      latitude: 40.5760, longitude: -73.9890 },
  { name: "Surfside Gardens",      borough: "Brooklyn",      latitude: 40.5745, longitude: -73.9860 },
  { name: "Carey Gardens",         borough: "Brooklyn",      latitude: 40.5770, longitude: -74.0030 },
  { name: "Gravesend Houses",      borough: "Brooklyn",      latitude: 40.5990, longitude: -73.9780 },
  { name: "Nostrand Houses",       borough: "Brooklyn",      latitude: 40.6390, longitude: -73.9500 },
  { name: "Howard Houses",         borough: "Brooklyn",      latitude: 40.6620, longitude: -73.9090 },
  { name: "Brownsville Houses",    borough: "Brooklyn",      latitude: 40.6645, longitude: -73.9168 },
  // ── MANHATTAN ────────────────────────────────────────────
  { name: "Alfred E. Smith Houses",borough: "Manhattan",     latitude: 40.7115, longitude: -73.9975 },
  { name: "Vladeck Houses",        borough: "Manhattan",     latitude: 40.7133, longitude: -73.9932 },
  { name: "Rutgers Houses",        borough: "Manhattan",     latitude: 40.7148, longitude: -73.9789 },
  { name: "Baruch Houses",         borough: "Manhattan",     latitude: 40.7155, longitude: -73.9742 },
  { name: "Jacob Riis Houses",     borough: "Manhattan",     latitude: 40.7145, longitude: -73.9779 },
  { name: "Holmes Towers",         borough: "Manhattan",     latitude: 40.7666, longitude: -73.9453 },
  { name: "Lincoln Houses",        borough: "Manhattan",     latitude: 40.8018, longitude: -73.9380 },
  { name: "Wagner Houses",         borough: "Manhattan",     latitude: 40.7899, longitude: -73.9350 },
  { name: "Jefferson Houses",      borough: "Manhattan",     latitude: 40.7937, longitude: -73.9402 },
  { name: "Carver Houses",         borough: "Manhattan",     latitude: 40.7892, longitude: -73.9445 },
  { name: "East River Houses",     borough: "Manhattan",     latitude: 40.7966, longitude: -73.9329 },
  { name: "Drew-Hamilton Houses",  borough: "Manhattan",     latitude: 40.8257, longitude: -73.9475 },
  { name: "Manhattanville Houses", borough: "Manhattan",     latitude: 40.8170, longitude: -73.9542 },
  { name: "Grant Houses",          borough: "Manhattan",     latitude: 40.8157, longitude: -73.9539 },
  { name: "Polo Grounds Towers",   borough: "Manhattan",     latitude: 40.8333, longitude: -73.9384 },
  // ── BRONX ────────────────────────────────────────────────
  { name: "Patterson Houses",      borough: "Bronx",         latitude: 40.8198, longitude: -73.9176 },
  { name: "Mott Haven Houses",     borough: "Bronx",         latitude: 40.8095, longitude: -73.9250 },
  { name: "Mitchell Houses",       borough: "Bronx",         latitude: 40.8101, longitude: -73.9261 },
  { name: "Forest Houses",         borough: "Bronx",         latitude: 40.8236, longitude: -73.9084 },
  { name: "Butler Houses",         borough: "Bronx",         latitude: 40.8357, longitude: -73.9038 },
  { name: "Monroe Houses",         borough: "Bronx",         latitude: 40.8215, longitude: -73.8838 },
  { name: "Soundview Houses",      borough: "Bronx",         latitude: 40.8228, longitude: -73.8698 },
  { name: "Castle Hill Houses",    borough: "Bronx",         latitude: 40.8282, longitude: -73.8641 },
  { name: "Bronxdale Houses",      borough: "Bronx",         latitude: 40.8327, longitude: -73.8737 },
  { name: "Boston Secor Houses",   borough: "Bronx",         latitude: 40.8722, longitude: -73.8502 },
  { name: "Pelham Pkwy Houses",    borough: "Bronx",         latitude: 40.8543, longitude: -73.8617 },
  { name: "Highbridge Houses",     borough: "Bronx",         latitude: 40.8369, longitude: -73.9226 },
  { name: "Marble Hill Houses",    borough: "Bronx",         latitude: 40.8750, longitude: -73.9220 },
  // ── QUEENS ───────────────────────────────────────────────
  { name: "Queensbridge North",    borough: "Queens",        latitude: 40.7574, longitude: -73.9430 },
  { name: "Queensbridge South",    borough: "Queens",        latitude: 40.7554, longitude: -73.9447 },
  { name: "Ravenswood Houses",     borough: "Queens",        latitude: 40.7598, longitude: -73.9333 },
  { name: "Astoria Houses",        borough: "Queens",        latitude: 40.7690, longitude: -73.9280 },
  { name: "Pomonok Houses",        borough: "Queens",        latitude: 40.7280, longitude: -73.7900 },
  { name: "Jamaica Houses",        borough: "Queens",        latitude: 40.7010, longitude: -73.7920 },
  { name: "Baisley Park Houses",   borough: "Queens",        latitude: 40.6864, longitude: -73.7813 },
  { name: "Redfern Houses",        borough: "Queens",        latitude: 40.5994, longitude: -73.7578 },
  { name: "Hammel Houses",         borough: "Queens",        latitude: 40.5970, longitude: -73.7750 },
  { name: "Arverne Houses",        borough: "Queens",        latitude: 40.5981, longitude: -73.7960 },
  // ── STATEN ISLAND ────────────────────────────────────────
  { name: "Stapleton Houses",      borough: "Staten Island", latitude: 40.6271, longitude: -74.0780 },
  { name: "New Brighton Houses",   borough: "Staten Island", latitude: 40.6378, longitude: -74.0940 },
  { name: "Mariner's Harbor",      borough: "Staten Island", latitude: 40.6338, longitude: -74.1560 },
  { name: "West Brighton Houses",  borough: "Staten Island", latitude: 40.6295, longitude: -74.1202 },
  { name: "Berry Houses",          borough: "Staten Island", latitude: 40.5987, longitude: -74.0856 },
  { name: "Richmond Terrace",      borough: "Staten Island", latitude: 40.6430, longitude: -74.1310 }
];


/* ============================================================
   2. EVACUATION CENTER DATA
   Real NYC hurricane evacuation centers from NYC Open Data.
   Embedded so the map works without a network request.
============================================================ */
const evacData = [
  // ── BROOKLYN ─────────────────────────────────────────────
  { name: "PS 58 Carroll School",   address: "330 Smith St, Brooklyn",      latitude: 40.6798, longitude: -73.9966 },
  { name: "PS 38 Pacific",          address: "450 Pacific St, Brooklyn",    latitude: 40.6830, longitude: -73.9680 },
  { name: "James Madison HS",       address: "3787 Bedford Ave, Brooklyn",  latitude: 40.6090, longitude: -73.9410 },
  { name: "PS 189 Canarsie",        address: "1100 Seaview Ave, Brooklyn",  latitude: 40.6250, longitude: -73.9010 },
  { name: "PS 346 Coney Island",    address: "2801 Batchelder St",          latitude: 40.5870, longitude: -73.9500 },
  { name: "IS 14 Shell Bank",       address: "8 Grade Dr, Brooklyn",        latitude: 40.6060, longitude: -73.9640 },
  { name: "PS 253 Sheepshead Bay",  address: "500 Highlawn Ave, Brooklyn",  latitude: 40.5980, longitude: -73.9540 },
  { name: "South Brooklyn CC",      address: "Nelson St, Brooklyn",         latitude: 40.6760, longitude: -73.9980 },
  { name: "PS 134 Canarsie",        address: "1057 Seaview Ave, Brooklyn",  latitude: 40.6340, longitude: -73.8900 },
  // ── MANHATTAN ────────────────────────────────────────────
  { name: "PS 126 Jacob Riis",      address: "80 Catherine St, Manhattan",  latitude: 40.7126, longitude: -73.9970 },
  { name: "Simon Baruch MS 104",    address: "330 E 21st St, Manhattan",    latitude: 40.7373, longitude: -73.9840 },
  { name: "PS 20 Anna Silver",      address: "166 Essex St, Manhattan",     latitude: 40.7194, longitude: -73.9876 },
  { name: "PS 192 Harlem",          address: "650 W 138th St, Manhattan",   latitude: 40.8180, longitude: -73.9530 },
  { name: "PS 128 Audubon",         address: "560 W 169th St, Manhattan",   latitude: 40.8370, longitude: -73.9390 },
  { name: "George Washington HS",   address: "549 Audubon Ave, Manhattan",  latitude: 40.8490, longitude: -73.9340 },
  // ── BRONX ────────────────────────────────────────────────
  { name: "PS 95 Sheila Mencher",   address: "1260 Morrison Ave, Bronx",    latitude: 40.8223, longitude: -73.8977 },
  { name: "PS 53 Basheer Raheem",   address: "1700 Fulton Ave, Bronx",      latitude: 40.8380, longitude: -73.9090 },
  { name: "PS 70 Bronx",            address: "1 E 167th St, Bronx",         latitude: 40.8360, longitude: -73.9250 },
  { name: "Bronx HS of Science",    address: "75 W 205th St, Bronx",        latitude: 40.8746, longitude: -73.8990 },
  { name: "PS 145 Bronx",           address: "1000 Intervale Ave, Bronx",   latitude: 40.8218, longitude: -73.8897 },
  // ── QUEENS ───────────────────────────────────────────────
  { name: "PS 4 Windsor Park",      address: "36-36 Union St, Queens",      latitude: 40.7620, longitude: -73.9280 },
  { name: "PS 111 Cambria Heights", address: "200-10 Linden Blvd, Queens",  latitude: 40.6900, longitude: -73.7390 },
  { name: "JHS 53 Brian Piccolo",   address: "98-01 159th Ave, Queens",     latitude: 40.6880, longitude: -73.8260 },
  { name: "August Martin HS",       address: "156-10 Baisley Blvd, Queens", latitude: 40.6820, longitude: -73.7840 },
  { name: "PS 183 Queens",          address: "45-25 158 St, Queens",        latitude: 40.7490, longitude: -73.8070 },
  // ── STATEN ISLAND ────────────────────────────────────────
  { name: "Curtis HS",              address: "105 Hamilton Ave, SI",         latitude: 40.6425, longitude: -74.0820 },
  { name: "PS 57 Huguenot",         address: "2 Purdy Ave, Staten Island",   latitude: 40.5340, longitude: -74.1730 },
  { name: "PS 44 New Dorp",         address: "1340 Huguenot Ave, SI",        latitude: 40.5490, longitude: -74.1480 },
  { name: "McKee HS",               address: "290 St Marks Pl, SI",          latitude: 40.6420, longitude: -74.0925 }
];


/* ============================================================
   3. BOROUGH BOUNDARY DATA
   Fetched from local file; falls back to embedded polygons.
============================================================ */
const BOROUGH_API = 'data/raw/boroughs.geojson';

const BOROUGH_FALLBACK = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"boro_name":"Staten Island"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-74.1595,40.6414],[-74.1613,40.6429],[-74.1581,40.6429],[-74.1595,40.6414]]],[[[-74.0822,40.6483],[-74.0745,40.6451],[-74.0733,40.645],[-74.0726,40.6447],[-74.0723,40.6446],[-74.0719,40.644],[-74.0714,40.6432],[-74.0729,40.6409],[-74.0718,40.6409],[-74.0726,40.6383],[-74.0721,40.6366],[-74.0681,40.6285],[-74.0733,40.627],[-74.0732,40.6269],[-74.0706,40.6223],[-74.0699,40.6214],[-74.0667,40.6191],[-74.0651,40.6179],[-74.0637,40.6165],[-74.06,40.612],[-74.06,40.6119],[-74.0586,40.61],[-74.0554,40.6065],[-74.0537,40.6052],[-74.0531,40.6013],[-74.0527,40.5999],[-74.0622,40.592],[-74.0707,40.5816],[-74.0746,40.579],[-74.1389,40.53],[-74.1783,40.5199],[-74.184,40.5196],[-74.2092,40.5112],[-74.2554,40.5046],[-74.2533,40.5111],[-74.2363,40.5508],[-74.2145,40.5567],[-74.2089,40.5696],[-74.2046,40.588],[-74.2013,40.6227],[-74.1985,40.6328],[-74.1861,40.6433],[-74.1668,40.6416],[-74.1374,40.6411],[-74.0857,40.6489],[-74.0822,40.6483]]]]}},{"type":"Feature","properties":{"boro_name":"Manhattan"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-73.9264,40.8776],[-73.9131,40.9078],[-73.9154,40.9018],[-73.9192,40.8909],[-73.9242,40.879],[-73.9183,40.8758],[-73.9121,40.8781],[-73.9086,40.8714],[-73.9127,40.864],[-73.9148,40.8619],[-73.9206,40.8556],[-73.9259,40.8508],[-73.9305,40.8437],[-73.9328,40.8391],[-73.9349,40.835],[-73.9351,40.8337],[-73.9351,40.833],[-73.9497,40.8358],[-73.9543,40.8282],[-73.9595,40.8236],[-73.9582,40.8223],[-73.9669,40.8118],[-73.9741,40.8015],[-73.9852,40.786],[-73.9962,40.774],[-74.0014,40.7672],[-74.0046,40.7625],[-74.0098,40.7528],[-74.0114,40.747],[-74.0117,40.7455],[-74.0114,40.7392],[-74.0108,40.7345],[-74.0124,40.7224],[-74.0173,40.7156],[-74.0188,40.708],[-74.0168,40.7023],[-74.013,40.6998],[-74.0056,40.7025],[-74.0027,40.7054],[-73.9985,40.7083],[-73.9914,40.7096],[-73.9783,40.7105],[-73.976,40.7128],[-73.9715,40.7274],[-73.9722,40.7302],[-73.9737,40.7332],[-73.9726,40.7382],[-73.9695,40.7459],[-73.9632,40.7534],[-73.9523,40.7646],[-73.9426,40.7752],[-73.9428,40.7789],[-73.9433,40.7832],[-73.9405,40.7849],[-73.9374,40.7886],[-73.9298,40.795],[-73.93,40.8031],[-73.9342,40.8091],[-73.934,40.8151],[-73.9343,40.8245],[-73.9351,40.833],[-73.9264,40.8776]]]]}},{"type":"Feature","properties":{"boro_name":"Bronx"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-73.8729,40.9044],[-73.8603,40.9008],[-73.8449,40.9051],[-73.8392,40.8993],[-73.816,40.8893],[-73.8057,40.8689],[-73.7936,40.8767],[-73.7849,40.8759],[-73.7863,40.8694],[-73.7947,40.8575],[-73.802,40.8504],[-73.8047,40.8606],[-73.8117,40.8627],[-73.8148,40.8631],[-73.8166,40.8538],[-73.8157,40.8463],[-73.8148,40.8391],[-73.8157,40.8359],[-73.8134,40.8293],[-73.8057,40.8202],[-73.8006,40.8178],[-73.8023,40.8127],[-73.8097,40.8128],[-73.8179,40.8134],[-73.8262,40.8113],[-73.832,40.8049],[-73.8399,40.8109],[-73.8391,40.8225],[-73.8419,40.8278],[-73.8401,40.8389],[-73.8431,40.8298],[-73.8475,40.8109],[-73.8524,40.8145],[-73.8499,40.8096],[-73.8512,40.8045],[-73.8587,40.8059],[-73.86,40.8095],[-73.8752,40.8149],[-73.8715,40.8019],[-73.8808,40.8026],[-73.8874,40.8044],[-73.8924,40.8056],[-73.8983,40.8055],[-73.9055,40.802],[-73.9204,40.7998],[-73.9329,40.8104],[-73.9324,40.8194],[-73.9336,40.8329],[-73.9285,40.8469],[-73.9206,40.8556],[-73.9148,40.8619],[-73.9127,40.864],[-73.9086,40.8714],[-73.9121,40.8781],[-73.9183,40.8758],[-73.9242,40.879],[-73.9192,40.8909],[-73.9154,40.9018],[-73.9131,40.9078],[-73.9112,40.9142],[-73.8966,40.9114],[-73.8748,40.9049],[-73.8729,40.9044]]]]}},{"type":"Feature","properties":{"boro_name":"Brooklyn"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-73.9544,40.7391],[-73.9526,40.7389],[-73.9409,40.7335],[-73.9245,40.7197],[-73.9095,40.6987],[-73.8956,40.6837],[-73.8675,40.6887],[-73.8568,40.6686],[-73.8572,40.6437],[-73.8698,40.6388],[-73.8822,40.632],[-73.9037,40.6262],[-73.9029,40.6239],[-73.8959,40.619],[-73.8912,40.6131],[-73.8899,40.6108],[-73.8936,40.6066],[-73.901,40.6108],[-73.9025,40.6119],[-73.908,40.6172],[-73.909,40.6158],[-73.9043,40.6122],[-73.902,40.6084],[-73.9084,40.6064],[-73.9169,40.6088],[-73.9189,40.6083],[-73.9144,40.6029],[-73.9094,40.6022],[-73.9052,40.6026],[-73.9021,40.6031],[-73.8982,40.6033],[-73.8882,40.6051],[-73.8827,40.5791],[-73.8956,40.5772],[-73.9028,40.5874],[-73.9096,40.5863],[-73.9119,40.5924],[-73.919,40.6007],[-73.9252,40.6],[-73.9295,40.6027],[-73.9309,40.6039],[-73.932,40.603],[-73.9278,40.6002],[-73.9251,40.5983],[-73.9222,40.5955],[-73.918,40.593],[-73.9151,40.5904],[-73.9176,40.5872],[-73.9252,40.5859],[-73.9281,40.5877],[-73.9306,40.5915],[-73.9327,40.5943],[-73.9308,40.5829],[-73.9282,40.5862],[-73.9197,40.5826],[-73.9154,40.5816],[-73.9113,40.5821],[-73.9463,40.5836],[-73.9533,40.582],[-73.9371,40.5811],[-73.9349,40.5755],[-73.964,40.5736],[-73.9715,40.5725],[-73.9819,40.5713],[-73.9886,40.5707],[-73.9978,40.5704],[-74.0112,40.5742],[-74.0087,40.5813],[-73.9882,40.5797],[-73.993,40.5834],[-73.9997,40.5846],[-73.9994,40.5928],[-74.003,40.5954],[-74.0183,40.6024],[-74.0351,40.6087],[-74.041,40.6183],[-74.0411,40.6298],[-74.0372,40.6383],[-74.029,40.6445],[-74.0235,40.6531],[-74.0132,40.662],[-74.0059,40.6626],[-74.0073,40.6647],[-74.0001,40.6639],[-73.9988,40.6716],[-74.0059,40.668],[-74.0157,40.6646],[-74.0141,40.6717],[-74.0184,40.6779],[-74.0119,40.6839],[-74.0046,40.6882],[-73.9947,40.704],[-73.9834,40.7056],[-73.9786,40.7058],[-73.9757,40.6996],[-73.9726,40.7001],[-73.9744,40.7063],[-73.9701,40.7104],[-73.9662,40.7183],[-73.9613,40.7302],[-73.9616,40.7352],[-73.9578,40.7385],[-73.9549,40.7391],[-73.9544,40.7391]]]]}},{"type":"Feature","properties":{"boro_name":"Queens"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-73.8205,40.801],[-73.822,40.7996],[-73.827,40.7972],[-73.829,40.7963],[-73.8285,40.7957],[-73.8278,40.7935],[-73.8299,40.7916],[-73.832,40.7897],[-73.8317,40.7892],[-73.8338,40.7885],[-73.8356,40.7895],[-73.8375,40.7904],[-73.8374,40.7908],[-73.837,40.7915],[-73.8384,40.7968],[-73.8413,40.7962],[-73.8461,40.7961],[-73.8487,40.7954],[-73.8514,40.794],[-73.8536,40.7932],[-73.8545,40.7903],[-73.8542,40.7883],[-73.8543,40.7877],[-73.856,40.7876],[-73.8568,40.7867],[-73.8582,40.787],[-73.8590,40.7856],[-73.8575,40.7835],[-73.8566,40.7829],[-73.8547,40.7819],[-73.8504,40.7824],[-73.8492,40.7822],[-73.8495,40.7818],[-73.8495,40.7801],[-73.8524,40.7792],[-73.8496,40.7794],[-73.8495,40.7785],[-73.849,40.778],[-73.8492,40.7758],[-73.8486,40.7687],[-73.8435,40.7657],[-73.843,40.7643],[-73.8452,40.7624],[-73.8582,40.7624],[-73.8622,40.7662],[-73.858,40.7632],[-73.8578,40.7706],[-73.8702,40.7813],[-73.8791,40.7827],[-73.8841,40.7741],[-73.8857,40.7743],[-73.8896,40.7736],[-73.8902,40.7779],[-73.8925,40.7796],[-73.9027,40.7806],[-73.9117,40.7896],[-73.9182,40.7839],[-73.9299,40.7762],[-73.937,40.7759],[-73.9351,40.7705],[-73.9398,40.768],[-73.951,40.7551],[-73.9585,40.7458],[-73.9601,40.7439],[-73.9614,40.7418],[-73.9612,40.7404],[-73.9624,40.7386],[-73.9602,40.7383],[-73.9578,40.7394],[-73.9539,40.7398],[-73.9523,40.7395],[-73.9446,40.7381],[-73.9413,40.7394],[-73.9401,40.742],[-73.9427,40.7393],[-73.9439,40.7388],[-73.9434,40.7366],[-73.9423,40.7362],[-73.9403,40.7342],[-73.9394,40.7322],[-73.9287,40.7279],[-73.9241,40.7243],[-73.9207,40.7238],[-73.9206,40.7234],[-73.9215,40.724],[-73.9242,40.721],[-73.9239,40.72],[-73.924,40.7198],[-73.9237,40.7187],[-73.9213,40.7162],[-73.9238,40.7155],[-73.9214,40.7091],[-73.9125,40.7039],[-73.9043,40.6957],[-73.8964,40.6824],[-73.8917,40.684],[-73.8684,40.6947],[-73.866,40.6819],[-73.8595,40.6714],[-73.8607,40.6571],[-73.8614,40.6565],[-73.8579,40.6528],[-73.8559,40.6513],[-73.855,40.6511],[-73.851,40.6515],[-73.8503,40.6505],[-73.8523,40.6478],[-73.8403,40.6449],[-73.8381,40.6542],[-73.8358,40.6488],[-73.83,40.6567],[-73.8295,40.6578],[-73.8291,40.6571],[-73.8316,40.6536],[-73.8293,40.6496],[-73.8264,40.6491],[-73.8237,40.6486],[-73.8244,40.6573],[-73.8228,40.6605],[-73.8182,40.662],[-73.8114,40.6607],[-73.8154,40.6606],[-73.8216,40.66],[-73.8235,40.6553],[-73.8144,40.6451],[-73.7976,40.638],[-73.7913,40.6344],[-73.7895,40.6342],[-73.7857,40.6321],[-73.7894,40.6229],[-73.7947,40.6221],[-73.7962,40.6194],[-73.797,40.6182],[-73.7981,40.6159],[-73.7995,40.6146],[-73.8004,40.6121],[-73.7962,40.6108],[-73.7879,40.6102],[-73.7808,40.6146],[-73.7847,40.6206],[-73.7735,40.6251],[-73.7709,40.6232],[-73.7697,40.6218],[-73.7686,40.6235],[-73.7686,40.6243],[-73.7669,40.6276],[-73.7647,40.6292],[-73.7621,40.6303],[-73.7575,40.6321],[-73.7543,40.6331],[-73.7507,40.6346],[-73.748,40.6373],[-73.7475,40.6412],[-73.7481,40.6425],[-73.7491,40.6451],[-73.752,40.6467],[-73.747,40.6426],[-73.7463,40.641],[-73.7463,40.6393],[-73.7469,40.638],[-73.7463,40.6364],[-73.7446,40.6376],[-73.744,40.6384],[-73.7421,40.6381],[-73.7417,40.6364],[-73.7424,40.6358],[-73.741,40.6351],[-73.7399,40.6352],[-73.7321,40.6501],[-73.728,40.6624],[-73.7265,40.699],[-73.7286,40.7169],[-73.7265,40.7238],[-73.7204,40.7255],[-73.7027,40.7355],[-73.7027,40.7533],[-73.7223,40.7653],[-73.7448,40.7778],[-73.746,40.7786],[-73.748,40.7804],[-73.754,40.7796],[-73.7547,40.7777],[-73.7549,40.777],[-73.7551,40.7764],[-73.7542,40.7753],[-73.7534,40.7733],[-73.7551,40.7717],[-73.7547,40.7696],[-73.7547,40.7688],[-73.7549,40.7684],[-73.7547,40.767],[-73.7543,40.7664],[-73.7538,40.7658],[-73.7525,40.7645],[-73.7497,40.7615],[-73.7463,40.7592],[-73.7462,40.758],[-73.7446,40.7568],[-73.7447,40.7566],[-73.7475,40.7599],[-73.7509,40.7617],[-73.7563,40.7663],[-73.7606,40.7698],[-73.7681,40.7796],[-73.7746,40.7869],[-73.7741,40.7868],[-73.7736,40.7927],[-73.774,40.794],[-73.7786,40.7967],[-73.7833,40.7948],[-73.7808,40.7933],[-73.7888,40.7904],[-73.7931,40.7889],[-73.795,40.7919],[-73.7946,40.7932],[-73.7948,40.7949],[-73.7977,40.7955],[-73.8034,40.7967],[-73.8063,40.7966],[-73.8118,40.7979],[-73.8149,40.7981],[-73.8173,40.7993],[-73.8191,40.8006],[-73.8205,40.801]]]]}}]};


/* ============================================================
   4. CONSTANTS & CONFIGURATION
============================================================ */

/* Mapbox access token */
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxsaXNvbmhhbiIsImEiOiJjbXBhZHlucXIxMWRhMnNxMDVsZzhncDg0In0.oaDz7eOAIlPSSg5xv1ePcg';

const NYC_CENTER   = [-73.985, 40.710];
const DEFAULT_ZOOM = 10;
const BUFFER_MI    = 0.5;   /* 0.5-mile evacuation center proximity threshold */
const SUBWAY_MI    = 0.25;  /* 0.25-mile subway walkshed threshold */

/* All data layer IDs — used to hide everything before each step */
const ALL_DATA_LAYERS = [
  'nycha-layer',
  'buffer-fill',
  'buffer-line',
  'evac-glow',
  'evac-layer',
  'gap-layer',
  'priority-fill',
  'priority-line',
  /* Step 5 layers */
  'subway-buffer-fill',
  'subway-buffer-line',
  'nycha-gap-only-layer',
  'nycha-double-isolated-layer'
];

/* Which layers are visible for each step */
const STEP_LAYERS = {
  1: ['nycha-layer'],
  2: ['nycha-layer', 'buffer-fill', 'buffer-line', 'evac-glow', 'evac-layer', 'gap-layer'],
  3: ['buffer-fill', 'buffer-line', 'evac-glow', 'evac-layer', 'gap-layer'],
  4: ['gap-layer', 'priority-fill', 'priority-line'],
  5: ['subway-buffer-fill', 'subway-buffer-line', 'nycha-gap-only-layer', 'nycha-double-isolated-layer']
};

let map;
let gapCount    = 0;
let currentStep = 0;


/* ============================================================
   5. UTILITY FUNCTIONS
============================================================ */

/* Haversine distance — returns straight-line miles between two points */
function distanceMiles(lat1, lon1, lat2, lon2) {
  const R     = 3958.8;
  const toRad = deg => deg * Math.PI / 180;
  const dLat  = toRad(lat2 - lat1);
  const dLon  = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* Returns true if NYCHA development is within 0.5 miles of any evacuation center */
function isWithinEvacBuffer(nycha) {
  return evacData.some(c =>
    distanceMiles(nycha.latitude, nycha.longitude, c.latitude, c.longitude) <= BUFFER_MI
  );
}

/* NYC subway station coordinates — representative sample for walkshed calculation */
const subwayStations = [
  { lat: 40.7580, lng: -73.9855 }, { lat: 40.7549, lng: -73.9840 },
  { lat: 40.7527, lng: -73.9772 }, { lat: 40.7484, lng: -73.9857 },
  { lat: 40.7614, lng: -73.9776 }, { lat: 40.7681, lng: -73.9819 },
  { lat: 40.7488, lng: -73.9680 }, { lat: 40.7308, lng: -73.9973 },
  { lat: 40.7282, lng: -74.0012 }, { lat: 40.7127, lng: -74.0134 },
  { lat: 40.7023, lng: -74.0159 }, { lat: 40.6985, lng: -74.0189 },
  { lat: 40.6828, lng: -73.9759 }, { lat: 40.6688, lng: -73.9438 },
  { lat: 40.6501, lng: -73.9498 }, { lat: 40.6452, lng: -73.9630 },
  { lat: 40.6358, lng: -73.9611 }, { lat: 40.6275, lng: -73.9524 },
  { lat: 40.6208, lng: -73.9523 }, { lat: 40.6079, lng: -73.9498 },
  { lat: 40.5998, lng: -73.9943 }, { lat: 40.5760, lng: -73.9813 },
  { lat: 40.5754, lng: -73.9695 }, { lat: 40.5803, lng: -74.0027 },
  { lat: 40.8096, lng: -73.9295 }, { lat: 40.8201, lng: -73.9248 },
  { lat: 40.8313, lng: -73.9280 }, { lat: 40.8423, lng: -73.9189 },
  { lat: 40.8489, lng: -73.9121 }, { lat: 40.8565, lng: -73.9028 },
  { lat: 40.8624, lng: -73.8973 }, { lat: 40.8729, lng: -73.8893 },
  { lat: 40.7574, lng: -73.9430 }, { lat: 40.7690, lng: -73.9280 },
  { lat: 40.7598, lng: -73.9333 }, { lat: 40.7014, lng: -73.8305 },
  { lat: 40.6867, lng: -73.8215 }, { lat: 40.7280, lng: -73.7900 },
  { lat: 40.6420, lng: -74.0820 }, { lat: 40.6295, lng: -74.1202 }
];

/* Returns true if NYCHA development is within 0.25 miles of any subway station */
function isNearSubway(nycha) {
  return subwayStations.some(s =>
    distanceMiles(nycha.latitude, nycha.longitude, s.lat, s.lng) <= SUBWAY_MI
  );
}

/* Convert array of {latitude, longitude, name, borough} to GeoJSON FeatureCollection */
function toPointGeoJSON(dataArray) {
  return {
    type: 'FeatureCollection',
    features: dataArray.map(d => ({
      type: 'Feature',
      geometry: {
        type:        'Point',
        coordinates: [d.longitude, d.latitude]
      },
      properties: {
        name:    d.name    || '',
        borough: d.borough || '',
        address: d.address || ''
      }
    }))
  };
}

/* Generate 0.5-mile buffer polygons around evacuation centers using Turf.js */
function generateEvacBufferGeoJSON() {
  const features = evacData.map(c => {
    const point    = turf.point([c.longitude, c.latitude]);
    const buffered = turf.buffer(point, BUFFER_MI, { units: 'miles', steps: 64 });
    return buffered;
  });
  return { type: 'FeatureCollection', features };
}

/* Generate 0.25-mile buffer polygons around subway stations using Turf.js.
   Returns a FeatureCollection — turf.union() in v6 only accepts two polygons,
   so we skip dissolving and let Mapbox render the overlapping circles. */
function generateSubwayBufferGeoJSON() {
  const features = subwayStations.map(s => {
    const point = turf.point([s.lng, s.lat]);
    return turf.buffer(point, SUBWAY_MI, { units: 'miles', steps: 24 });
  });
  return { type: 'FeatureCollection', features };
}

/* Generate priority area bounding boxes as GeoJSON Polygons */
function generatePriorityGeoJSON() {
  const areas = [
    {
      label:  'South Bronx',
      bounds: [[40.808, -73.940], [40.842, -73.888]],
      note:   'High NYCHA density + limited evacuation center proximity'
    },
    {
      label:  'Southern Brooklyn',
      bounds: [[40.568, -74.025], [40.622, -73.935]],
      note:   'Coastal exposure + access gaps (Coney Island / Red Hook)'
    },
    {
      label:  'Southeast Queens',
      bounds: [[40.590, -73.810], [40.682, -73.738]],
      note:   'Farther from centralised evacuation infrastructure'
    },
    {
      label:  'Staten Island North Shore',
      bounds: [[40.492, -74.270], [40.558, -74.120]],
      note:   'Waterfront exposure + limited transit options'
    }
  ];

  return {
    type: 'FeatureCollection',
    features: areas.map(area => {
      const [[lat1, lng1], [lat2, lng2]] = area.bounds;
      return {
        type: 'Feature',
        properties: { label: area.label, note: area.note },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [lng1, lat1], [lng2, lat1], [lng2, lat2], [lng1, lat2], [lng1, lat1]
          ]]
        }
      };
    })
  };
}


/* ============================================================
   6. MAP INITIALISATION
============================================================ */
function initMap() {
  map = new mapboxgl.Map({
    container:   'map',
    style:       'mapbox://styles/mapbox/light-v11',
    center:      NYC_CENTER,
    zoom:        DEFAULT_ZOOM,
    interactive: false   /* scroll wheel zoom disabled — page is scrollytelling */
  });

  map.on('load', () => {
    buildAllLayers();
    loadBoroughBoundaries();
    document.getElementById('loading-overlay').classList.add('hidden');
    showStep(1);
    setupScrollytelling();
    setupHoverTooltips();
  });
}

/* Load borough boundaries — tries local file, falls back to embedded */
async function loadBoroughBoundaries() {
  function renderBorough(geojson) {
    if (map.getSource('borough-source')) {
      map.getSource('borough-source').setData(geojson);
    }
  }
  try {
    const res     = await fetch(BOROUGH_API);
    const geojson = await res.json();
    renderBorough(geojson);
  } catch (err) {
    renderBorough(BOROUGH_FALLBACK);
  }
}


/* ============================================================
   7. BUILDING ALL MAP SOURCES AND LAYERS
============================================================ */
function buildAllLayers() {

  /* ── Borough Boundaries (always visible) ─────────────────── */
  map.addSource('borough-source', {
    type: 'geojson',
    data: BOROUGH_FALLBACK
  });

  const boroughColor = [
    'match', ['get', 'boro_name'],
    'Manhattan',    '#4a90d9',
    'Brooklyn',     '#27ae60',
    'Queens',       '#e67e22',
    'Bronx',        '#8e44ad',
    'Staten Island','#c0392b',
    '#888888'
  ];

  map.addLayer({ id: 'borough-fill', type: 'fill', source: 'borough-source',
    paint: { 'fill-color': boroughColor, 'fill-opacity': 0.07 }
  });

  map.addLayer({ id: 'borough-line', type: 'line', source: 'borough-source',
    paint: { 'line-color': boroughColor, 'line-width': 1.8, 'line-opacity': 0.5 }
  });

  map.addLayer({ id: 'borough-labels', type: 'symbol', source: 'borough-source',
    layout: {
      'text-field':           ['get', 'boro_name'],
      'text-font':            ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
      'text-size':            13,
      'text-letter-spacing':  0.08,
      'text-transform':       'uppercase',
      'symbol-placement':     'point',
      'text-allow-overlap':   false
    },
    paint: {
      'text-color':      '#0d1b2a',
      'text-halo-color': 'rgba(255,255,255,0.85)',
      'text-halo-width': 2
    }
  });

  /* ── Compute gap and isolation data ─────────────────────── */
  const gapDevelopments         = nychaData.filter(d => !isWithinEvacBuffer(d));
  const doubleIsolated          = gapDevelopments.filter(d => !isNearSubway(d));
  const gapOnlyDevelopments     = gapDevelopments.filter(d => isNearSubway(d));

  gapCount = gapDevelopments.length;
  updateStatBoxes(gapDevelopments.length, doubleIsolated.length);

  /* ── Step 1: All NYCHA developments ─────────────────────── */
  map.addSource('nycha-source', {
    type: 'geojson',
    data: toPointGeoJSON(nychaData)
  });

  map.addLayer({ id: 'nycha-layer', type: 'circle', source: 'nycha-source',
    layout: { visibility: 'none' },
    paint: {
      'circle-radius':       5,
      'circle-color':        '#457b9d',
      'circle-stroke-width': 0.5,
      'circle-stroke-color': '#1a2744',
      'circle-opacity':      0.82
    }
  });

  /* ── Steps 2–3: Evacuation center buffers ────────────────── */
  map.addSource('buffer-source', {
    type: 'geojson',
    data: generateEvacBufferGeoJSON()
  });

  map.addLayer({ id: 'buffer-fill', type: 'fill', source: 'buffer-source',
    layout: { visibility: 'none' },
    paint: { 'fill-color': '#f4a261', 'fill-opacity': 0.10 }
  });

  map.addLayer({ id: 'buffer-line', type: 'line', source: 'buffer-source',
    layout: { visibility: 'none' },
    paint: { 'line-color': '#e76f51', 'line-width': 1.2, 'line-dasharray': [5, 5] }
  });

  /* ── Steps 2–3: Evacuation centers ──────────────────────── */
  map.addSource('evac-source', {
    type: 'geojson',
    data: toPointGeoJSON(evacData)
  });

  map.addLayer({ id: 'evac-glow', type: 'circle', source: 'evac-source',
    layout: { visibility: 'none' },
    paint: { 'circle-radius': 14, 'circle-color': '#e76f51', 'circle-opacity': 0.20, 'circle-blur': 1 }
  });

  map.addLayer({ id: 'evac-layer', type: 'circle', source: 'evac-source',
    layout: { visibility: 'none' },
    paint: {
      'circle-radius':       6,
      'circle-color':        '#e76f51',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-opacity':      0.9
    }
  });

  /* ── Steps 2–4: NYCHA access gap dots (red) ──────────────── */
  map.addSource('gap-source', {
    type: 'geojson',
    data: toPointGeoJSON(gapDevelopments)
  });

  map.addLayer({ id: 'gap-layer', type: 'circle', source: 'gap-source',
    layout: { visibility: 'none' },
    paint: {
      'circle-radius':       6,
      'circle-color':        '#c1121f',
      'circle-stroke-width': 0.8,
      'circle-stroke-color': '#7a0619',
      'circle-opacity':      0.88
    }
  });

  /* ── Step 4: Priority area rectangles ────────────────────── */
  map.addSource('priority-source', {
    type: 'geojson',
    data: generatePriorityGeoJSON()
  });

  map.addLayer({ id: 'priority-fill', type: 'fill', source: 'priority-source',
    layout: { visibility: 'none' },
    paint: { 'fill-color': '#023e8a', 'fill-opacity': 0.12 }
  });

  map.addLayer({ id: 'priority-line', type: 'line', source: 'priority-source',
    layout: { visibility: 'none' },
    paint: { 'line-color': '#023e8a', 'line-width': 2, 'line-dasharray': [6, 4] }
  });

  /* ── Step 5: Subway walkshed buffer ─────────────────────── */
  map.addSource('subway-buffer-source', {
    type: 'geojson',
    data: generateSubwayBufferGeoJSON()
  });

  map.addLayer({ id: 'subway-buffer-fill', type: 'fill', source: 'subway-buffer-source',
    layout: { visibility: 'none' },
    paint: { 'fill-color': '#4895ef', 'fill-opacity': 0.12 }
  });

  map.addLayer({ id: 'subway-buffer-line', type: 'line', source: 'subway-buffer-source',
    layout: { visibility: 'none' },
    paint: { 'line-color': '#4895ef', 'line-width': 1, 'line-opacity': 0.5 }
  });

  /* ── Step 5: NYCHA with only one gap (gray — comparison) ── */
  map.addSource('nycha-gap-only-source', {
    type: 'geojson',
    data: toPointGeoJSON(gapOnlyDevelopments)
  });

  map.addLayer({ id: 'nycha-gap-only-layer', type: 'circle', source: 'nycha-gap-only-source',
    layout: { visibility: 'none' },
    paint: {
      'circle-radius':       5,
      'circle-color':        '#adb5bd',
      'circle-stroke-width': 0.8,
      'circle-stroke-color': '#6c757d',
      'circle-opacity':      0.7
    }
  });

  /* ── Step 5: Doubly isolated NYCHA (red — main finding) ─── */
  map.addSource('nycha-double-isolated-source', {
    type: 'geojson',
    data: toPointGeoJSON(doubleIsolated)
  });

  map.addLayer({ id: 'nycha-double-isolated-layer', type: 'circle', source: 'nycha-double-isolated-source',
    layout: { visibility: 'none' },
    paint: {
      'circle-radius':       7,
      'circle-color':        '#c1121f',
      'circle-stroke-width': 1.5,
      'circle-stroke-color': '#7a0619',
      'circle-opacity':      0.92
    }
  });
}


/* ============================================================
   8. SHOWING / HIDING LAYERS BY STEP
============================================================ */
function showStep(step) {
  if (step === currentStep) return;
  currentStep = step;

  /* Hide all data layers */
  ALL_DATA_LAYERS.forEach(id => {
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, 'visibility', 'none');
    }
  });

  /* Show only the layers for this step */
  (STEP_LAYERS[step] || []).forEach(id => {
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, 'visibility', 'visible');
    }
  });

  /* Fly to the appropriate map view */
  switch (step) {
    case 1:
      map.flyTo({ center: NYC_CENTER, zoom: DEFAULT_ZOOM, duration: 1300, essential: true });
      break;
    case 2:
      map.flyTo({ center: NYC_CENTER, zoom: DEFAULT_ZOOM, duration: 1300, essential: true });
      break;
    case 3:
      /* Zoom into South Brooklyn to show the access gap pattern */
      map.flyTo({ center: [-73.975, 40.635], zoom: 12, duration: 1400, essential: true });
      break;
    case 4:
      map.flyTo({ center: NYC_CENTER, zoom: DEFAULT_ZOOM, duration: 1300, essential: true });
      break;
    case 5:
      /* Zoom out slightly to show full city including Staten Island */
      map.flyTo({ center: [-73.985, 40.680], zoom: 9.8, duration: 1400, essential: true });
      break;
  }

  updateLegend(step);
}


/* ============================================================
   9. UPDATING THE LEGEND
============================================================ */
function updateLegend(step) {
  const el = document.getElementById('map-legend');

  const legends = {

    1: `<span class="legend-title">NYCHA Developments</span>
        <div class="legend-item">
          <div class="legend-dot" style="background:#457b9d"></div>
          <span>NYCHA development</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background:#4a90d9;border-radius:2px;opacity:0.6"></div>
          <span>Borough boundary</span>
        </div>`,

    2: `<span class="legend-title">Evacuation Access</span>
        <div class="legend-item">
          <div class="legend-dot" style="background:#c1121f"></div>
          <span>NYCHA — outside 0.5 mi buffer</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background:#457b9d"></div>
          <span>NYCHA — within buffer</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background:#e76f51"></div>
          <span>Evacuation center</span>
        </div>
        <div class="legend-item">
          <div class="legend-dash" style="border-color:#e76f51"></div>
          <span>0.5-mile buffer</span>
        </div>`,

    3: `<span class="legend-title">Access Gap (zoomed)</span>
        <div class="legend-item">
          <div class="legend-dot" style="background:#c1121f"></div>
          <span>NYCHA outside buffer</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background:#e76f51"></div>
          <span>Evacuation center</span>
        </div>
        <div class="legend-item">
          <div class="legend-dash" style="border-color:#e76f51"></div>
          <span>0.5-mile buffer</span>
        </div>`,

    4: `<span class="legend-title">Planning Priority</span>
        <div class="legend-item">
          <div class="legend-dot" style="background:#023e8a;border-radius:2px"></div>
          <span>High-priority areas</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background:#c1121f"></div>
          <span>NYCHA outside buffer</span>
        </div>`,

    5: `<span class="legend-title">Transit Access &amp; Evacuation Gap</span>
        <div class="legend-item">
          <div class="legend-swatch" style="background:#4895ef;opacity:0.25;border-radius:2px"></div>
          <span>Subway ¼-mile walkshed</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background:#c1121f"></div>
          <span>Doubly isolated NYCHA</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background:#adb5bd"></div>
          <span>NYCHA — evacuation gap only</span>
        </div>`
  };

  el.innerHTML = legends[step] || '';
}


/* ============================================================
   10. STAT BOXES
   Fills the statistics callouts in the step cards.
============================================================ */
function updateStatBoxes(gapTotal, doubleIsolatedTotal) {
  /* Step 2 stat box */
  const box2 = document.getElementById('stat-box-gap');
  if (box2) {
    const pct = Math.round((gapTotal / nychaData.length) * 100);
    box2.innerHTML =
      `<span class="stat-number">${gapTotal}</span>` +
      `NYCHA developments — ${pct}% of those mapped — ` +
      `are more than 0.5 miles from a hurricane evacuation center.`;
  }

  /* Step 5 stat box */
  const box5 = document.getElementById('stat-box-isolated');
  if (box5) {
    box5.innerHTML =
      `<span class="stat-number">${doubleIsolatedTotal}</span>` +
      `<span class="stat-label">NYCHA developments face both gaps — ` +
      `no nearby evacuation center <em>and</em> no nearby subway access</span>`;
  }
}


/* ============================================================
   11. HOVER TOOLTIPS
   Shows development name on hover for all NYCHA point layers.
============================================================ */
function setupHoverTooltips() {
  const tooltip = document.getElementById('map-tooltip');
  if (!tooltip) return;

  const hoverableLayers = [
    'nycha-layer',
    'gap-layer',
    'nycha-gap-only-layer',
    'nycha-double-isolated-layer'
  ];

  hoverableLayers.forEach(layerId => {

    map.on('mouseenter', layerId, e => {
      map.getCanvas().style.cursor = 'pointer';

      const props   = e.features[0].properties;
      const name    = props.name    || 'NYCHA Development';
      const borough = props.borough || '—';

      tooltip.innerHTML =
        `<div class="tooltip-name">${name}</div>` +
        `<div class="tooltip-row"><strong>Borough:</strong> ${borough}</div>`;

      tooltip.style.left    = (e.point.x + 12) + 'px';
      tooltip.style.top     = (e.point.y - 12) + 'px';
      tooltip.style.display = 'block';
    });

    map.on('mousemove', layerId, e => {
      tooltip.style.left = (e.point.x + 12) + 'px';
      tooltip.style.top  = (e.point.y - 12) + 'px';
    });

    map.on('mouseleave', layerId, () => {
      map.getCanvas().style.cursor = '';
      tooltip.style.display = 'none';
    });
  });
}


/* ============================================================
   12. SCROLLYTELLING — IntersectionObserver
   Watches each .step element and calls showStep(n) when one
   enters the viewport's middle zone.
============================================================ */
function setupScrollytelling() {
  const steps    = document.querySelectorAll('.step');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const n = parseInt(entry.target.dataset.step, 10);
          steps.forEach(s => s.classList.remove('is-active'));
          entry.target.classList.add('is-active');
          showStep(n);
        }
      });
    },
    { rootMargin: '-20% 0px -40% 0px', threshold: 0 }
  );
  steps.forEach(s => observer.observe(s));
}


/* ============================================================
   13. ENTRY POINT
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initMap();
});
