const getLayout4FreieGeometrie = ({
  feature,
  jwt,
  dispatch,
  setVisible,
  setIndex,
  showActions = true,
  openLightBox = true,
}) => {
  return {
    title: feature.properties.bezeichnung,
    mainSection: <h3>Bezeichnung: {feature.properties.bezeichnung}</h3>,
    subSections: [],
  };
};

export default getLayout4FreieGeometrie;
