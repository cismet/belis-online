import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useWindowSize } from '@react-hook/window-size';
import DexieWorkeredIDBCacheFiller from './DexieWorkeredIDBCacheFiller';
import { useDispatch, useSelector } from 'react-redux';
import { fillCacheInfo, getCacheSettings, renewCache } from '../core/store/slices/cacheControl';
import CacheItem from './app/cache/CacheItem';
import AggregatedCacheItem from './app/cache/AggregatedCacheItem';
import { faDownload, faSync, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const CacheSettings = ({ hide = () => {} }) => {
	const dispatch = useDispatch();
	const cacheSettings = useSelector(getCacheSettings);
	useEffect(() => {
		dispatch(fillCacheInfo());
	}, []);
	const [ width, height ] = useWindowSize();

	const modalBodyStyle = {
		zIndex: 3000000000,
		overflowY: 'auto',
		overflowX: 'hidden',
		maxHeight: height - 250,
		width: '100%'
	};

	let secondarySettings = [];
	Object.keys(cacheSettings)
		.filter((key) => cacheSettings[key].primary === undefined)
		.forEach((secondaryKey) => {
			secondarySettings.push(cacheSettings[secondaryKey]);
		});

	return (
		<Modal
			dialogClassName='modal-lg modal-dialog' //but why???
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
					<div>
						<Button
							style={{ margin: 3 }}
							variant='outline-primary'
							size='sm'
							onClick={() => {
								Object.keys(cacheSettings).map((key, index) => {
									setTimeout(() => {
										dispatch(renewCache(key));
									}, 100 + 100 * index);
								});
							}}
						>
							<Icon icon={faDownload} /> Kompletten Cache neu füllen
						</Button>

						<Button disabled style={{ margin: 3 }} variant='outline-success' size='sm'>
							<Icon icon={faSync} /> Nur neue Objekte laden
						</Button>
					</div>
					<table
						border={0}
						style={{
							width: '100%',
							padding: 3
						}}
					>
						<tbody>
							<tr>
								<td />
								<td
									style={{
										textAlign: 'right',
										paddingLeft: '25px',
										paddingRight: '15px',
										whiteSpace: 'nowrap'
									}}
								>
									# Objekte
								</td>
								<td>Name</td>
								<td
									style={{
										width: 120,
										paddingLeft: '25px',
										paddingRight: '25px',
										whiteSpace: 'nowrap'
									}}
								>
									letzte Aktualisierung
								</td>
							</tr>
							{Object.keys(cacheSettings).map((key, index) => {
								if (cacheSettings[key].primary === true) {
									return (
										<CacheItem
											key={'CacheItem.' + index}
											control={cacheSettings[key]}
											renew={() => {
												console.log('renew');

												dispatch(renewCache(key));
											}}
										/>
									);
								}
							})}
							<AggregatedCacheItem
								controls={secondarySettings}
								renew={(key) => {
									dispatch(renewCache(key));
								}}
							/>

							{/* <CacheItem
								control={cacheSettings.mauerlasche}
								renew={() => {
									console.log('renew');

									dispatch(renewCache('mauerlasche'));
								}}
							/> */}
						</tbody>
					</table>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button id='cmdCloseModalApplicationMenu' type='submit' onClick={hide}>
					Schließen
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CacheSettings;
