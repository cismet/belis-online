

export const getVCard = (feature) => {
    const vcard = {};

    switch(feature.featuretype) {
        case 'tdta_leuchten':
            vcard['title'] = 'Leuchte-0';
            vcard['subtitle'] = 'Trilux Hängeleuchte';
            vcard['location'] = 'Lenneper Str.';
            break;
        case 'Leitung':
            vcard['title'] = 'Leitung';
            break;
        case 'mauerlasche':
            vcard['title'] = 'M-' + feature.properties.laufende_nummer;
            vcard['subtitle'] = 'Mauerlasche';
            vcard['location'] = '';
            break;
        case 'schaltstelle':
            vcard['title'] = 'Schaltstelle';
            break;
        case 'abzweigdose':
            vcard['title'] = 'Abzweigdose';
            break;
        default:
    }

    return vcard;
};
  