import React from 'react';
import './styles.scss';
import PropTypes from 'prop-types';

export default function Loading(props) {
    const { color } = props;
    return (
        <div className='draw-loading'>
            <div className={`loading ${color}`} />
        </div>
    );
}

Loading.propTypes = {
    color: PropTypes.string,
};
