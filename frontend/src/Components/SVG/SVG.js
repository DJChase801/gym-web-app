import React from 'react';
import PropTypes from 'prop-types';
import Glass from './Glass';
import DownArrow from './DownArrow';

const SVG = (props) => {
	const components = {
		'downArrow': DownArrow,
        'glass': Glass,
	};
	if (components[props.name]) {
		const TagName = components[props.name];
		return <TagName {...props} />;
	}
	return null;
};

SVG.propTypes = {
	name: PropTypes.string,
};

export default SVG;