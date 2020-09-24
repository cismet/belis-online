const BELISVERSION = '%BELIS_VERSION%';
const BELISHASH = '#%BELIS_HASH%';

export const getBelisMapVersion = () => {
	/*eslint-disable no-useless-concat*/
	if (BELISVERSION === '%BELIS' + '_' + 'VERSION%') {
		return 'dev-hot-reload';
	} else {
		return BELISVERSION;
	}
};
export const getBeliscMapHash = () => {
	if (BELISHASH === '%BELIS' + '_' + 'HASH%') {
		return '#dev-hot-reload';
	} else {
		return BELISHASH;
	}
};
