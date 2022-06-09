export const selectNextFeature = ({
  featureCollection,
  selectedFeature,
  dispatch,
  setSelectedFeature,
}) => {
  if (featureCollection) {
    const newIndex = (selectedFeature.index + 1) % featureCollection.length;
    dispatch(setSelectedFeature(featureCollection[newIndex]));
  }
};
export const selectPreviousFeature = ({
  featureCollection,
  selectedFeature,
  dispatch,
  setSelectedFeature,
}) => {
  if (featureCollection) {
    let newIndex = (selectedFeature.index - 1) % featureCollection.length;
    if (newIndex === -1) {
      newIndex = featureCollection.length - 1;
    }
    dispatch(setSelectedFeature(featureCollection[newIndex]));
  }
};
