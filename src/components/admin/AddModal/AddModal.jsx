import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import PropTypes from 'prop-types';
import { useTranslation } from 'langs/useTranslation';
import { useSnackbar } from 'notistack';
import ConfirmButton from 'components/common/ConfirmButton';
import { emailRegex, passwordRegex, usernameRegex } from 'helpers/regex';
import { signupApi } from 'apis/authApi';

export default function AddModal(props) {
    const { t } = useTranslation('common');
    const { open, handleClose } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [addData, setAddData] = useState({
        username: '',
        password: '',
        email: '',
    });
    const [validation, setValidation] = useState({
        username: { valid: true, error: '' },
        password: { valid: true, error: '' },
        email: { valid: true, error: '' },
    });

    const handleChange = (type, e) => {
        setValidation({
            username: { valid: true, error: '' },
            password: { valid: true, error: '' },
            email: { valid: true, error: '' },
        });
        setAddData((prevState) => ({
            ...prevState,
            [type]: e.target.value,
        }));
    };

    useEffect(() => {
        if (open) {
            setValidation({
                username: { valid: true, error: '' },
                password: { valid: true, error: '' },
                email: { valid: true, error: '' },
            });
            setAddData({
                password: '',
                username: '',
                email: '',
            });
        }
    }, [open]);

    const confirmHandler = async () => {
        let data = {
            password: addData.password.trim(),
            username: addData.username.trim(),
            email: addData.email.trim(),
        };
        if (data.username.length === 0 || data.password.length === 0 || data.email.length === 0) {
            setValidation({
                username: { valid: !!data.username, error: data.username.length === 0 ? t('required') : '' },
                password: { valid: !!data.password, error: data.password.length === 0 ? t('required') : '' },
                email: { valid: !!data.email, error: data.email.length === 0 ? t('required') : '' },
            });
            return;
        }
        if (!usernameRegex(data.username) || !passwordRegex(data.password) || !emailRegex(data.email)) {
            setValidation({
                username: {
                    valid: usernameRegex(data.username),
                    error: !usernameRegex(data.username) ? t('regexError') : '',
                },
                password: {
                    valid: passwordRegex(data.password),
                    error: !passwordRegex(data.password) ? t('regexError') : '',
                },
                email: { valid: emailRegex(data.email), error: !emailRegex(data.email) ? t('regexError') : '' },
            });
            return;
        }
        try {
            setLoading(true);
            let result = await signupApi(data);
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
                    {t('admin')}
                </span>
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin='dense'
                    label={t('username')}
                    type='text'
                    error={!validation.username.valid}
                    helperText={validation.username.error}
                    value={addData.username}
                    fullWidth
                    required
                    variant='standard'
                    onChange={(e) => handleChange('username', e)}
                />
                <TextField
                    margin='dense'
                    label={t('password')}
                    type='text'
                    value={addData.password}
                    fullWidth
                    autoFocus
                    required
                    error={!validation.password.valid}
                    helperText={validation.password.error}
                    variant='standard'
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            confirmHandler();
                        }
                    }}
                    onChange={(e) => handleChange('password', e)}
                />
                <TextField
                    margin='dense'
                    label={t('email')}
                    type='text'
                    value={addData.email}
                    fullWidth
                    autoFocus
                    required
                    error={!validation.email.valid}
                    helperText={validation.email.error}
                    variant='standard'
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            confirmHandler();
                        }
                    }}
                    onChange={(e) => handleChange('email', e)}
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
