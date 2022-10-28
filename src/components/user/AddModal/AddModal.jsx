import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import PropTypes from 'prop-types';
import { useTranslation } from 'langs/useTranslation';
import { useSnackbar } from 'notistack';
import { createUser } from 'apis/userApi';
import ConfirmButton from 'components/common/ConfirmButton';

export default function AddModal(props) {
    const { t } = useTranslation('common');
    const { open, handleClose } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [addData, setAddData] = useState({
        code: '',
        name: '',
    });
    const [validation, setValidation] = useState({
        code: { valid: true, error: '' },
        name: { valid: true, error: '' },
    });

    const handleChange = (type, e) => {
        setValidation({
            code: { valid: true, error: '' },
            name: { valid: true, error: '' },
        });
        setAddData((prevState) => ({
            ...prevState,
            [type]: e.target.value,
        }));
    };

    useEffect(() => {
        if (open) {
            setValidation({
                code: { valid: true, error: '' },
                name: { valid: true, error: '' },
            });
            setAddData({
                name: '',
                code: '',
            });
        }
    }, [open]);

    const confirmHandler = async () => {
        let data = {
            name: addData.name.trim(),
            code: addData.code.trim(),
        };
        if (data.code.length === 0 || data.name.length === 0) {
            setValidation({
                code: { valid: !!data.code, error: data.code.length === 0 ? t('required') : '' },
                name: { valid: !!data.name, error: data.name.length === 0 ? t('required') : '' },
            });
            return;
        }
        try {
            setLoading(true);
            let result = await createUser(data);
            if (result?.success) {
                enqueueSnackbar(t('create') + t('success'), { variant: 'success' });
                handleClose(true);
                setLoading(false);
            }
        } catch (err) {
            enqueueSnackbar(t('create') + t('failed'), { variant: 'error' });
            setLoading(false);
        }
    };

    return (
        <Dialog className='editDialog' open={open} onClose={() => handleClose()}>
            <DialogTitle>
                <span className='code-text'>
                    {t('create')}
                    {t('user')}
                </span>
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin='dense'
                    label={t('code')}
                    type='text'
                    error={!validation.code.valid}
                    helperText={validation.code.error}
                    value={addData.code}
                    autoFocus
                    fullWidth
                    required
                    variant='standard'
                    onChange={(e) => handleChange('code', e)}
                />
                <TextField
                    margin='dense'
                    label={t('name')}
                    type='text'
                    value={addData.name}
                    fullWidth
                    required
                    error={!validation.name.valid}
                    helperText={validation.name.error}
                    variant='standard'
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            confirmHandler();
                        }
                    }}
                    onChange={(e) => handleChange('name', e)}
                />
            </DialogContent>
            <DialogActions>
                <ConfirmButton variant='contained' onClick={confirmHandler} loading={loading} text={t('confirm')} />
                <Button onClick={() => handleClose()}>{t('cancel')}</Button>
            </DialogActions>
        </Dialog>
    );
}

AddModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};
