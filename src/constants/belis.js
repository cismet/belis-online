export const backgrounds = {
  stadtplan: "OMT_Klokantech_basic@90",
  lbk_: "cismetText|trueOrtho2020@40",

  lbk: "wupp-plan-live@100|trueOrtho2020@60", //|rvrSchrift@100",
  nightplan:
    'wupp-plan-live@{"opacity":0.9,"css-filter": "filter:grayscale(0.9)brightness(0.9)invert(1)"}',
  pale_stadtplan: "wupp-plan-live@30",
  pale_lbk: "wupp-plan-live@20|trueOrtho2020@30|rvrSchrift@100",
  pale_nightplan:
    'wupp-plan-live@{"opacity":0.3,"css-filter": "filter:grayscale(0.9)brightness(0.9)invert(1)"}',
};

// export const REST_SERVICE = "http://bender:8890";
export const REST_SERVICE = "https://belis-testapi.cismet.de";
export const getWebDavUrl = (jwt, doc) => {
  return REST_SERVICE + "/secres/" + jwt + "/beliswebdav/" + doc.doc;
};

export const DOMAIN = "BELIS2-TEST";
