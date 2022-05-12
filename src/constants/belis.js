export const backgrounds = {
  stadtplan: "klokantech_basic@90",
  lbk: "rvrGrundriss@80|trueOrtho2020@65|rvrSchriftNT@100",
  nightplan:
    'wupp-plan-live@{"opacity":0.9,"css-filter": "filter:grayscale(0.9)brightness(0.9)invert(1)"}',
  pale_stadtplan: "klokantech_basic@10",
  pale_lbk: "rvrGrundriss@20|trueOrtho2020@35|rvrSchriftNT@70",
  pale_nightplan:
    'wupp-plan-live@{"opacity":0.3,"css-filter": "filter:grayscale(0.9)brightness(0.9)invert(1)"}',
};

export const offlineConfig = {
  rules: [
    {
      origin: "https://omt.map-hosting.de/fonts/Metropolis Medium Italic,Noto",
      cachePath: "fonts/Open",
    },
    {
      origin: "https://omt.map-hosting.de/fonts/Klokantech Noto",
      cachePath: "fonts/Open",
    },
    {
      origin: "https://omt.map-hosting.de/fonts",
      cachePath: "fonts",
    },
    {
      origin: "https://omt.map-hosting.de/styles",
      cachePath: "styles",
    },

    {
      origin: "https://omt.map-hosting.de/data/v3",
      cachePath: "tiles",
    },

    {
      origin: "https://omt.map-hosting.de/data/gewaesser",
      cachePath: "tiles.gewaesser",
    },

    {
      origin: "https://omt.map-hosting.de/data/kanal",
      cachePath: "tiles.kanal",
    },

    {
      origin: "https://omt.map-hosting.de/data/brunnen",
      cachePath: "tiles.brunnen",
      // realServerFallback: true, //this can override the globalsetting
    },
  ],
  dataStores: [
    {
      name: "Vektorkarte für Wuppertal",
      key: "wuppBasemap",
      url: "https://offline-data.cismet.de/offline-data/wupp.zip",
    },

    {
      name: "Gewässer, Kanal und Brunnendaten",
      key: "umweltalarm",
      url: "https://offline-data.cismet.de/offline-data/umweltalarm.zip",
    },
  ],
  offlineStyles: [
    "https://omt.map-hosting.de/styles/cismet-light/style.json",
    "https://omt.map-hosting.de/styles/osm-bright-grey/style.json",
    "https://omt.map-hosting.de/styles/klokantech-basic/style.json",
    "https://omt.map-hosting.de/styles/brunnen/style.json",
    "https://omt.map-hosting.de/styles/kanal/style.json",
    "https://omt.map-hosting.de/styles/gewaesser/style.json",
  ],
  realServerFallback: true, //should be true in production
  consoleDebug: process.env.NODE_ENV !== "production",
  optional: true,
  initialActive: false, //todo set to true in production
};

// export const REST_SERVICE = "http://bender:8890";
export const REST_SERVICE = "https://belis-cloud.cismet.de/belis2-test/api/";
export const getWebDavUrl = (jwt, doc) => {
  if (doc.intermediate === true) {
    return doc.url;
  } else if (doc.doc.startsWith("dev")) {
    return `${REST_SERVICE}/secres/${jwt}/belisdev/${doc.doc}`;
  } else {
    return `${REST_SERVICE}/secres/${jwt}/beliswebdav/${doc.doc}`;
  }
};

export const DOMAIN = "BELIS2-TEST";

export const backgroundConfigurations = {
  lbk: {
    layerkey: "rvrGrau@50|trueOrtho2020@40",
    src: "/images/rain-hazard-map-bg/ortho.png",
    title: "Luftbildkarte",
  },

  vectorCityMap2: {
    layerkey: "cismetLight",
    src: "/images/rain-hazard-map-bg/citymap.png",
    title: "Stadtplan",
  },

  vectorCityMap: {
    layerkey: "osmBrightOffline",
    src: "/images/rain-hazard-map-bg/citymap.png",
    title: "Stadtplan",
  },

  abkg: {
    layerkey: "bplan_abkg@70",
    src: "/images/rain-hazard-map-bg/citymap.png",
    title: "Amtliche Basiskarte",
  },
  stadtplan: {
    layerkey: "wupp-plan-live@90",
    src: "/images/rain-hazard-map-bg/citymap.png",
    title: "Stadtplan",
  },
  nix: {
    layerkey: "empty",
    src: "/images/rain-hazard-map-bg/citymap.png",
    title: "Stadtplan",
  },
};

export const backgroundModes = [
  {
    title: "Stadtplan",
    mode: "default",
    layerKey: "stadtplan",
  },
  {
    title: "Stadtplan (bunt)",
    mode: "default",
    layerKey: "vectorCityMap",
    offlineDataStoreKey: "wuppBasemap",
  },
  {
    title: "Stadtplan (light)",
    mode: "default",
    layerKey: "vectorCityMap2",
    offlineDataStoreKey: "wuppBasemap",
  },

  { title: "Luftbildkarte", mode: "default", layerKey: "lbk" },
  { title: "-", mode: "default", layerKey: "nix" },
];
