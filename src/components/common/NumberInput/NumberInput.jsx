import React from 'react';
import './styles.scss';
import PropTypes from 'prop-types';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Add, Minimize } from '@mui/icons-material';
import { useTranslation } from 'langs/useTranslation';

export default function NumberInput(props) {
    const { t } = useTranslation('common');
    const { value, error, helperText, label, onChange, setAddData, disabled } = props;

    const numberClick = (type) => {
        if (type === 'plus') {
            setAddData((prevState) => ({
                ...prevState,
                [label]: ++prevState[label],
            }));
            return;
        } else {
            setAddData((prevState) => ({
                ...prevState,
                [label]: prevState[label] <= 1 ? 1 : --prevState[label],
            }));
            return;
        }
    };

    return (
        <TextField
            margin='dense'
            label={t(label)}
            type='number'
            className='numberInput'
            value={value}
            fullWidth
            onChange={onChange}
            disabled={disabled}
            error={error}
            helperText={helperText}
            InputProps={{
                inputProps: { min: 0 },
                startAdornment: (
                    <InputAdornment position='end'>
                        <IconButton
                            disabled={disabled || value <= 1}
                            className='minimize'
                            onClick={() => numberClick('minize')}
                        >
                            <Minimize />
                        </IconButton>
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position='end'>
                        <IconButton disabled={disabled} className='plus' onClick={() => numberClick('plus')}>
                            <Add />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
}

NumberInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    setAddData: PropTypes.func.isRequired,
    value: PropTypes.number,
    error: PropTypes.bool,
    disabled: PropTypes.bool,
    helperText: PropTypes.string,
    label: PropTypes.string,
};
