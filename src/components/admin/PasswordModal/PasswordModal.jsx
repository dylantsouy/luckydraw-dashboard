import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import PropTypes from 'prop-types';
import { useTranslation } from 'langs/useTranslation';
import { useSnackbar } from 'notistack';
import { changePassword } from 'apis/adminApi';
import ConfirmButton from 'components/common/ConfirmButton';
import { passwordRegex } from 'helpers/regex';

export default function EditModal(props) {
    const { t } = useTranslation('common');
    const { open, handleClose, changePasswordId } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState('');
    const [validation, setValidation] = useState({
        password: { valid: true, error: '' },
    });

    const handleChange = (e) => {
        setValidation({
            password: { valid: true, error: '' },
        });
        setEditData(e.target.value);
    };

    useEffect(() => {
        if (open) {
            setValidation({
                password: { valid: true, error: '' },
            });
            setEditData('');
        }
    }, [open]);

    const confirmHandler = async () => {
        let data = {
            id: changePasswordId,
            password: editData.trim(),
        };
        if (data.password.length === 0) {
            setValidation({
                password: { valid: !!data.password, error: data.password.length === 0 ? t('required') : '' },
            });
            return;
        }
        if (!passwordRegex(data.password)) {
            setValidation({
                password: {
                    valid: passwordRegex(data.password),
                    error: !passwordRegex(data.password) ? t('regexError') : '',
                },
            });
            return;
        }
        setLoading(true);
        try {
            let result = await changePassword(data);
            if (result.success) {
                enqueueSnackbar(t('editSuccess'), { variant: 'success' });
                handleClose(true);
                setLoading(false);
            }
        } catch (err) {
            enqueueSnackbar(t('editFailed'), { variant: 'error' });
            setLoading(false);
        }
    };

    return (
        <Dialog className='editDialog' open={open} onClose={() => handleClose()}>
            <DialogTitle>
                <span className='title-text'>{t('changePassword')}</span>
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin='dense'
                    label={t('password')}
                    type='text'
                    value={editData.password}
                    fullWidth
                    required
                    error={!validation.password.valid}
                    helperText={validation.password.error}
                    variant='standard'
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            confirmHandler();
                        }
                    }}
                    onChange={(e) => handleChange(e)}
                />
            </DialogContent>
            <DialogActions>
                <ConfirmButton variant='contained' onClick={confirmHandler} loading={loading} text={t('confirm')} />
                <Button onClick={() => handleClose()}>{t('cancel')}</Button>
            </DialogActions>
        </Dialog>
    );
}

EditModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    changePasswordId: PropTypes.string.isRequired,
};
