import React, { useEffect, useState } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

const size = 150;
const MapBlocker = ({ blocking, visible, width, height }) => {
  const [dark, setDark] = useState(false);

  //   useEffect(() => {
  //     setTimeout(() => {}, 500);
  //   }, [blocking, dark]);

  const x = {};

  if (blocking === true) {
    return (
      <div
        style={{
          position: "absolute",
          height: height,
          width: width,
          background: visible === true ? "#00000050" : "#00000000",
          //   backgroundColor: "#AD310B !important",
          //   backgroundImage: "none !important",
          WebkitTransition: "background-color 1000ms linear",
          MozTransition: "background-color 1000ms linear",
          OTransition: "background-color 1000ms linear",
          MsTransition: "background-color 1000ms linear",
          transition: "background-color 1000ms linear",
          WebkitAnimationDirection: "alternate",
          animationDirection: "alternate",
          WebkitAnimationIterationCount: "2",
          animationIterationCount: "2",

          left: 0,
          top: 0,
          zIndex: 100000,
          cursor: "wait",
        }}
      >
        {/* {visible === true && (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							position: 'absolute',
							borderRadius: '25px',
							height: size,
							width: size,
							background: '#00000099',
							left: (width - size) / 2,
							top: (height - size) / 2,
							zIndex: 100001,
							cursor: 'wait',
							opacity: 1 //visible === true ? 0.8 : 0
						}}
					>
						<Icon
							style={{
								fontSize: size / 3,
								color: '#ffffff',
								cursor: 'pointer',
								textAlign: 'center',
								webkitAnimation: 'fa-spin 3s infinite linear',
								animation: 'fa-spin 3s infinite linear'
							}}
							icon={faSpinner}
						/>
					</div>
				)} */}
      </div>
    );
  } else {
    return <div />;
  }
};
export default MapBlocker;
