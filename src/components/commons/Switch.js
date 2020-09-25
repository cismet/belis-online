import React, { useState } from 'react';
import Switch from 'react-ios-switch';

const Comp = (props) => {
	const [ switched, setSwitched ] = useState(false);
	return (
		<div>
			<span>
				<span className='text-primary' style={{ verticalAlign: 'middle', marginRight: 5 }}>
					{props.preLabel}
				</span>
				<Switch
					style={{ verticalAlign: 'middle' }}
					onChange={() => {
						setSwitched((old) => !old);
					}}
					checked={switched}
				/>
				<span style={{ verticalAlign: 'middle', marginLeft: 5 }}>{props.postLabel}</span>
			</span>
		</div>
	);
};
export default Comp;
