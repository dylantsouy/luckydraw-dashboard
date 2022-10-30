import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import PropTypes from 'prop-types';
import { useTranslation } from 'langs/useTranslation';
import { useSnackbar } from 'notistack';
import { uploadUsers } from 'apis/userApi';
import ConfirmButton from 'components/common/ConfirmButton';
import DropUpload from 'components/common/DropUpload';
import TemplateFile from 'assets/files/importUser.xlsx';
import { GetAppOutlined } from '@mui/icons-material';
import { useAuthStore } from 'store/auth';

export default function FileUploadModal(props) {
    const { t } = useTranslation('common');
    const { permissionArray } = useAuthStore();
    const { open, handleClose } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [addData, setAddData] = useState({
        file: null,
    });
    const [validation, setValidation] = useState({
        file: { valid: true, error: '' },
    });

    const resetVaild = useCallback(() => {
        setValidation({
            file: { valid: true, error: '' },
        });
    }, []);

    useEffect(() => {
        if (open) {
            setPercentage(0);
            resetVaild();
            setAddData({
                file: null,
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
        };
        if (!data?.file) {
            setValidation((prevState) => ({
                ...prevState,
                file: {
                    valid: !!data.file,
                    error: !data.file ? t('required') : '',
                },
            }));
            return;
        }
        try {
            resetVaild();
            setLoading(true);
            let result = await uploadUsers(data?.file, setPercentage);
            if (result?.success) {
                enqueueSnackbar(t('upload') + t('success'), { variant: 'success' });
                handleClose(true);
                setLoading(false);
            }
        } catch (err) {
            if (err.message === 'Fail to import data into database!') {
                enqueueSnackbar(t('uploadExist'), { variant: 'error' });
                setLoading(false);
                return;
            }
            enqueueSnackbar(t('upload') + t('failed'), { variant: 'error' });
            setLoading(false);
        }
    };
    return (
        <Dialog className='editDialog fileUploadModal' open={open} onClose={() => (loading ? () => {} : handleClose())}>
            <DialogTitle>
                <span className='title-text'>
                    {t('upload')} {t('excel')}
                </span>
            </DialogTitle>
            <DialogContent>
                <div className='mt-2' />
                <DropUpload
                    setAddData={setAddData}
                    setError={setValidation}
                    validation={validation}
                    percentage={percentage}
                    setPercentage={setPercentage}
                    accept={{
                        'application/vnd.ms-excel': ['.xls'],
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                    }}
                    acceptWarn={t('excel')}
                />
                <Button
                    href={TemplateFile}
                    variant='text'
                    color='primary'
                    className='download-template'
                    startIcon={<GetAppOutlined color='primary' />}
                >
                    {t('downloadTemplate')}
                </Button>
            </DialogContent>
            <DialogActions>
                <ConfirmButton variant='contained' onClick={confirmHandler} loading={loading} text={t('confirm')} />
                <Button disabled={loading} onClick={() => handleClose()}>
                    {t('cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

FileUploadModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};
