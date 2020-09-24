import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Switch from 'react-ios-switch';

const Comp = (props) => {
	const id = props.id || 'id';
	const [ switched, setSwitched ] = useState(false);

	const toggleSwitch = () => {};

	return (
		//Workaround for label on the left side
		// not <Form.Check type='switch' id='x' label='' />
		//but:

		// <div className='custom-control custom-switch custom-switch-md'>
		// 	<input type='checkbox' className='custom-control-input' id={id} />
		// 	<label className='custom-control-label custom-control-label-md' htmlFor={id}>
		// 		{props.preLabel}
		// 	</label>
		// </div>

		// <Form.Check variant='success' size='lg' type='switch' id={id} label={props.preLabel} />
		// <div class='btn-group-toggle' data-toggle='buttons'>
		// 	<label class='btn btn-secondary p-3'>
		// 		<input type='checkbox' id='customCheck' name='example1' /> Check this custom
		// 		checkbox
		// 	</label>
		// </div>
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
