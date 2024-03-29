import React from 'react';
import './styles.scss';
import PropTypes from 'prop-types';
import { Button, Skeleton } from '@mui/material';
import Loading from '../Loading';

export default function ConfirmButton(props) {
    const { loading, color, onClick, text, variant, type, serverResponseTimeout } = props;
    return (
        <Button
            role='confirmButton'
            className='confirmButton'
            variant={variant || 'contained'}
            color={color || 'primary'}
            onClick={onClick}
            disabled={loading}
            type={type}
        >
            {loading ? (
                serverResponseTimeout ? (
                    <div className='serverResponseTimeout'>
                        {text}...
                        <Skeleton variant='rect' />
                    </div>
                ) : (
                    <Loading color='info' size={25} />
                )
            ) : (
                text
            )}
        </Button>
    );
}

ConfirmButton.propTypes = {
    loading: PropTypes.bool,
    variant: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func,
    text: PropTypes.string,
    type: PropTypes.string,
    serverResponseTimeout: PropTypes.any,
};
