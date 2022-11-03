import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import PropTypes from 'prop-types';
import { useTranslation } from 'langs/useTranslation';
import { useSnackbar } from 'notistack';
import ConfirmButton from 'components/common/ConfirmButton';
import DropUpload from 'components/common/DropUpload';
import { uploadRewards } from 'apis/rewardApi';
import NumberInput from 'components/common/NumberInput';
import { useAuthStore } from 'store/auth';

export default function FileUploadModal(props) {
    const { t } = useTranslation('common');
    const { permissionArray } = useAuthStore();
    const { open, handleClose, rewardList } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [addData, setAddData] = useState({
        file: null,
        name: '',
        order: 1,
        count: 1,
    });
    const [validation, setValidation] = useState({
        file: { valid: true, error: '' },
        name: { valid: true, error: '' },
        order: { valid: true, error: '' },
        count: { valid: true, error: '' },
    });

    const resetVaild = useCallback(() => {
        setValidation({
            file: { valid: true, error: '' },
            name: { valid: true, error: '' },
            order: { valid: true, error: '' },
            count: { valid: true, error: '' },
        });
    }, []);

    useEffect(() => {
        if (open) {
            setPercentage(0);
            resetVaild();
            setAddData({
                file: null,
                name: '',
                order: 1,
                count: 1,
            });
        }
    }, [open, resetVaild]);

    const confirmHandler = async () => {
        if (!permissionArray?.includes('action')) {
            enqueueSnackbar(t('noPermission'), { variant: 'error' });
            return;
        }
        let data = {
            file: addData.file,
            name: addData.name.trim(),
            count: addData.count,
            order: addData.order,
        };
        if (!data?.file || !data?.name || !data?.count || !data?.order) {
            setValidation((prevState) => ({
                ...prevState,
                file: { valid: !!data.file, error: !data.file ? t('required') : '' },
                name: { valid: !!data.name, error: data.name.length === 0 ? t('required') : '' },
                count: { valid: !!data.count, error: !data.count ? t('required') : '' },
                order: { valid: !!data.order, error: !data.order ? t('required') : '' },
            }));
            return;
        }
        let changeData = rewardList.find((e) => e.order === data.order);
        if (changeData) {
            setValidation((prevState) => ({
                ...prevState,
                order: { valid: false, error: t('orderExist') },
            }));
            return;
        }
        try {
            resetVaild();
            setLoading(true);
            let result = await uploadRewards(data, setPercentage);
            if (result?.success) {
                enqueueSnackbar(t('uploadSuccess'), { variant: 'success' });
                handleClose(true);
                setLoading(false);
            }
        } catch (err) {
            if (err.message === 'Fail to import data into database!') {
                enqueueSnackbar(t('uploadExist'), { variant: 'error' });
                setLoading(false);
                return;
            }
            if (err.message === 'File size over 1MB') {
                enqueueSnackbar(t('FileSizeOver'), { variant: 'error' });
                setLoading(false);
                return;
            }
            enqueueSnackbar(t('uploadFailed'), { variant: 'error' });
            setLoading(false);
        }
    };

    const handleChange = (type, e) => {
        setValidation({
            file: { valid: true, error: '' },
            name: { valid: true, error: '' },
            order: { valid: true, error: '' },
            count: { valid: true, error: '' },
        });
        setAddData((prevState) => ({
            ...prevState,
            [type]: e.target.value,
        }));
    };

    return (
        <>
            <Dialog
                className='editDialog fileUploadModal'
                open={open}
                onClose={() => (loading ? () => {} : handleClose())}
            >
                <DialogTitle>
                    <span className='title-text'>{t('createReward')}</span>
                </DialogTitle>
                <DialogContent>
                    <NumberInput
                        label='order'
                        error={!validation.order.valid}
                        helperText={validation.order.error}
                        value={addData.order}
                        variant='standard'
                        onChange={(e) => handleChange('order', e)}
                        setAddData={setAddData}
                    />
                    <NumberInput
                        label='count'
                        error={!validation.count.valid}
                        helperText={validation.count.error}
                        value={addData.count}
                        variant='standard'
                        onChange={(e) => handleChange('count', e)}
                        setAddData={setAddData}
                    />
                    <TextField
                        margin='dense'
                        label={t('name')}
                        type='text'
                        value={addData.name}
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
                    <div className='mt-2' />
                    <DropUpload
                        setAddData={setAddData}
                        setError={setValidation}
                        validation={validation}
                        percentage={percentage}
                        setPercentage={setPercentage}
                        accept={{
                            'image/*': ['.jpeg', '.png', '.gif', '.webp'],
                        }}
                        acceptWarn={t('imageAccept')}
                    />
                </DialogContent>
                <DialogActions>
                    <ConfirmButton variant='contained' onClick={confirmHandler} loading={loading} text={t('confirm')} />
                    <Button disabled={loading} onClick={() => handleClose()}>
                        {t('cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

FileUploadModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    rewardList: PropTypes.array.isRequired,
};
