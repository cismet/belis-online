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
          opacity: 0.1,
          background: "#000000",
          mrgin: 10,
          pointerEvents: "none",
        }}
      />
    );
  } else {
    return <div />;
  }
};

export default FocusRectangle;
