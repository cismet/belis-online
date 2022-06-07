import { getAddImageButton, getSquaredThumbnails } from "./helper";

const getLayout4Abzweigdose = ({
  feature,
  jwt,
  dispatch,
  setVisible,
  setIndex,
  showAddPhotoAction = true,
}) => {
  const docs = feature.properties?.docs;
  return {
    title: "AZD " + feature.properties.id,
    mainSection: (
      <div>
        {feature.properties.docs.length > 1 &&
          getSquaredThumbnails({ docs, type: "Abzweigdose", jwt, setIndex, setVisible })}
        {showAddPhotoAction &&
          getAddImageButton(dispatch, feature.properties, "abzweigdose", feature.geometry)}
      </div>
    ),
    subSections: [],
  };
};

export default getLayout4Abzweigdose;