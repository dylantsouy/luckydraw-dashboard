import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import PropTypes from 'prop-types';
import { useTranslation } from 'langs/useTranslation';
import { useSnackbar } from 'notistack';
import { editUser } from 'apis/userApi';
import ConfirmButton from 'components/common/ConfirmButton';

export default function EditModal(props) {
    const { t } = useTranslation('common');
    const { open, handleClose, editData, setEditData } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [validation, setValidation] = useState({
        code: { valid: true, error: '' },
        name: { valid: true, error: '' },
    });

    const handleChange = (type, e) => {
        setValidation({
            code: { valid: true, error: '' },
            name: { valid: true, error: '' },
        });
        setEditData((prevState) => ({
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
        }
    }, [open]);

    const confirmHandler = async () => {
        let data = {
            id: editData.id,
            code: editData.code.trim(),
            name: editData.name.trim(),
        };
        if (data.code.length === 0 || data.name.length === 0) {
            setValidation({
                code: { valid: !!data.code, error: data.code.length === 0 ? t('required') : '' },
                name: { valid: !!data.name, error: data.name.length === 0 ? t('required') : '' },
            });
            return;
        }
        setLoading(true);
        try {
            let result = await editUser(data);
            if (result.success) {
                enqueueSnackbar(t('update') + t('success'), { variant: 'success' });
                handleClose(true);
                setLoading(false);
            }
        } catch (err) {
            enqueueSnackbar(t('update') + t('failed'), { variant: 'error' });
            setLoading(false);
        }
    };

    return (
        <Dialog className='editDialog' open={open} onClose={() => handleClose()}>
            <DialogTitle>
                <span className='title-text'>{t('edit')}{t('user')}</span>
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin='dense'
                    label={t('code')}
                    type='text'
                    required
                    value={editData.code}
                    fullWidth
                    variant='standard'
                    onChange={(e) => handleChange('code', e)}
                />
                <TextField
                    margin='dense'
                    label={t('name')}
                    type='text'
                    value={editData.name}
                    fullWidth
                    autoFocus
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
                <Button onClick={()=>handleClose()}>{t('cancel')}</Button>
            </DialogActions>
        </Dialog>
    );
}

EditModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    editData: PropTypes.object.isRequired,
    setEditData: PropTypes.func.isRequired,
};
