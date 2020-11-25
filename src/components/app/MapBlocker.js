import React from 'react';

const MapBlocker = ({ blocking, visible, width, height }) => {
	if (blocking === true) {
		return (
			<div
				style={{
					position: 'absolute',
					height: height,
					width: width,
					background: 'black',
					left: 0,
					top: 0,
					zIndex: 100000,
					cursor: 'wait',
					opacity: visible === true ? 0.2 : 0
				}}
			/>
		);
	} else {
		return <div />;
	}
};
export default MapBlocker;
