import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import PropTypes from 'prop-types';
import { useTranslation } from 'langs/useTranslation';
import { useSnackbar } from 'notistack';
import { editReward } from 'apis/rewardApi';
import ConfirmButton from 'components/common/ConfirmButton';
import NumberInput from 'components/common/NumberInput';
import { useAuthStore } from 'store/auth';

export default function EditModal(props) {
    const { t } = useTranslation('common');
    const { permissionArray } = useAuthStore();
    const { open, handleClose, editData, setEditData } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [validation, setValidation] = useState({
        name: { valid: true, error: '' },
        order: { valid: true, error: '' },
        count: { valid: true, error: '' },
    });

    const handleChange = (type, e) => {
        setValidation({
            name: { valid: true, error: '' },
            order: { valid: true, error: '' },
            count: { valid: true, error: '' },
        });
        setEditData((prevState) => ({
            ...prevState,
            [type]: e.target.value,
        }));
    };

    useEffect(() => {
        if (open) {
            setValidation({
                name: { valid: true, error: '' },
                order: { valid: true, error: '' },
                count: { valid: true, error: '' },
            });
        }
    }, [open]);

    const confirmHandler = async () => {
        if (!permissionArray?.includes('action')) {
            enqueueSnackbar(t('noPermission'), { variant: 'error' });
            return;
        }
        let data = {
            id: editData.id,
            name: editData.name.trim(),
            order: editData.order,
            count: editData.count,
        };
        if (data.name.length === 0 || data.order.length === 0 || data.count.length === 0) {
            setValidation({
                name: { valid: !!data.name, error: data.name.length === 0 ? t('required') : '' },
                order: { valid: !!data.order, error: data.order.length === 0 ? t('required') : '' },
                count: { valid: !!data.count, error: data.count.length === 0 ? t('required') : '' },
            });
            return;
        }
        setLoading(true);
        try {
            let result = await editReward(data);
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
                <span className='title-text'>
                    {t('edit')}
                    {t('reward')}
                </span>
            </DialogTitle>
            <DialogContent>
                <div className='warn-text'>{t('orderWarn')}</div>
                <NumberInput
                    label='order'
                    error={!validation.order.valid}
                    helperText={validation.order.error}
                    value={editData.order}
                    variant='standard'
                    onChange={(e) => handleChange('order', e)}
                    setAddData={setEditData}
                />
                <NumberInput
                    label='count'
                    error={!validation.count.valid}
                    helperText={validation.count.error}
                    value={editData.count}
                    variant='standard'
                    onChange={(e) => handleChange('count', e)}
                    setAddData={setEditData}
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
                <Button onClick={() => handleClose()}>{t('cancel')}</Button>
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
