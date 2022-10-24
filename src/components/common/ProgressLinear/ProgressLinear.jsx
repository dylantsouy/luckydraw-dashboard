import React from 'react';
import Box from '@mui/material/Box';
import './styles.scss';
import PropTypes from 'prop-types';
import { LinearProgress } from '@mui/material';

export default function ProgressLinear(props) {
    const { value } = props;
    return (
        <Box className='ProgressLinear' sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant='determinate' {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }} className='ProgressLinearValue'>
                <div>{`${Math.round(value)}%`}</div>
            </Box>
        </Box>
    );
}

ProgressLinear.propTypes = {
    value: PropTypes.number,
};
