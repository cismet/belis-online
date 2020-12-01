import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useWindowSize } from '@react-hook/window-size';
import DexieWorkeredIDBCacheFiller from './DexieWorkeredIDBCacheFiller';
function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const CacheSettings = ({ hide = () => {} }) => {
	const [ width, height ] = useWindowSize();

	const modalBodyStyle = {
		zIndex: 3000000000,

		overflowY: 'auto',
		overflowX: 'hidden',
		maxHeight: height - 250,
		width: '80%'
	};

	const keys = [];
	keys.push({ queryKey: 'all_tdta_standort_mast', dataKey: 'tdta_standort_mast' });
	keys.push({ queryKey: 'tdta_standort_mast' });
	keys.push({ queryKey: 'raw_point_index' });
	keys.push({ queryKey: 'leitung' });
	keys.push({ queryKey: 'mauerlasche' });
	keys.push({ queryKey: 'schaltstelle' });
	keys.push({ queryKey: 'tdta_leuchten' });
	keys.push({ queryKey: 'anlagengruppe' });
	keys.push({ queryKey: 'arbeitsprotokollstatus' });
	keys.push({ queryKey: 'bauart' });
	keys.push({ queryKey: 'leitungstyp' });
	keys.push({ queryKey: 'leuchtmittel' });
	keys.push({ queryKey: 'material_leitung' });
	keys.push({ queryKey: 'material_mauerlasche' });
	keys.push({ queryKey: 'querschnitt' });
	keys.push({ queryKey: 'team' });
	keys.push({ queryKey: 'tkey_bezirk' });
	keys.push({ queryKey: 'tkey_doppelkommando' });
	keys.push({ queryKey: 'tkey_energielieferant' });
	keys.push({ queryKey: 'tkey_kennziffer' });
	keys.push({ queryKey: 'tkey_klassifizierung' });
	keys.push({ queryKey: 'tkey_mastart' });
	keys.push({ queryKey: 'tkey_strassenschluessel' });
	keys.push({ queryKey: 'tkey_unterh_leuchte' });
	keys.push({ queryKey: 'tkey_unterh_mast' });
	keys.push({ queryKey: 'veranlassungsart' });
	keys.push({ queryKey: 'rundsteuerempfaenger' });
	keys.push({ queryKey: 'abzweigdose' });
	keys.push({ queryKey: 'tkey_leuchtentyp' });
	keys.push({ queryKey: 'tkey_masttyp' });

	// keys.push({ queryKey: 'infobaustein' });

	// keys.push({ queryKey: 'arbeitsprotokollaktion' });
	// keys.push({ queryKey: 'infobaustein_temgstplate' });
	// keys.push({ queryKey: 'arbeitsauftrag' });
	// keys.push({ queryKey: 'arbeitsprotokoll' });
	// keys.push({ queryKey: 'veranlassung' });

	return (
		<Modal
			dialogClassName='modal-lg modal-dialog' //but why???
			bsSize='large'
			height='100%'
			style={{ height: '100%' }}
			show
			onHide={hide}
		>
			<Modal.Header>
				<Modal.Title>
					<h5>Cache Einstellungen</h5>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body style={modalBodyStyle} id='myMenu'>
				<div style={{ marginBottom: 5 }}>
					<table
						style={{
							width: '100%'
						}}
					>
						<tbody>
							{keys.map((item, index) => {
								return (
									<DexieWorkeredIDBCacheFiller
										// <WorkeredIDBCacheFiller
										// <IDBCacheFiller
										//df
										key={'loader' + index}
										loaderInfo={item}
									/>
								);
							})}
						</tbody>
					</table>
				</div>
				{/* <div style={{ marginBottom: 5 }}>
					<table
						style={{
							width: '100%'
						}}
					>
						<tbody>
							{keys.map((item, index) => {
								return (
									<WorkeredIDBCacheFiller
										key={'loader' + index}
										loaderInfo={item}
									/>
								);
							})}
						</tbody>
					</table>
				</div> */}
			</Modal.Body>
			<Modal.Footer>
				{/* <Button
					id='cmdCloseModalApplicationMenu'
					bsStyle='primary'
					type='submit'
					onClick={() => {}}
				>
					Cache füllen
				</Button> */}
				<Button id='cmdCloseModalApplicationMenu' type='submit' onClick={hide}>
					Schließen
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CacheSettings;
