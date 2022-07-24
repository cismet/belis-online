import React from "react";

const FocusRectangle = ({ inFocusMode, mapWidth, mapHeight }) => {
  if (inFocusMode === true) {
    return (
      <div
        style={{
          position: "absolute",
          top: mapHeight / 4,
          left: mapWidth / 4,
          zIndex: 500,
          width: mapWidth / 2,
          height: mapHeight / 2,

          background: "#00000011",
          mrgin: 10,
          pointerEvents: "none",
          border: "2px solid #ffffffbb",
        }}
      />
    );
  } else {
    return <div />;
  }
};

export default FocusRectangle;
