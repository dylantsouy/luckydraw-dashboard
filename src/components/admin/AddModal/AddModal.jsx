import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import PropTypes from 'prop-types';
import { useTranslation } from 'langs/useTranslation';
import { useSnackbar } from 'notistack';
import ConfirmButton from 'components/common/ConfirmButton';
import { emailRegex, passwordRegex, usernameRegex } from 'helpers/regex';
import { signupApi } from 'apis/authApi';
import { roleName } from 'auths/roleHandler';

export default function AddModal(props) {
    const { t } = useTranslation('common');
    const { open, handleClose } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [addData, setAddData] = useState({
        username: '',
        password: '',
        email: '',
        role: 0,
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
                role: 0,
            });
        }
    }, [open]);

    const confirmHandler = async () => {
        let data = {
            password: addData.password.trim(),
            username: addData.username.trim(),
            email: addData.email.trim(),
            role: addData.role,
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
                    autoFocus
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
                <FormControl className='mt-6' fullWidth>
                    <InputLabel id='role-select-label'>{t('role')}</InputLabel>
                    <Select
                        labelId='role-select-label'
                        id='role-select'
                        variant='outlined'
                        value={addData.role}
                        label='role'
                        onChange={(e) => handleChange('role', e)}
                    >
                        <MenuItem value={0}>{roleName(0, t)}</MenuItem>
                        <MenuItem value={1}>{roleName(1, t)}</MenuItem>
                        <MenuItem value={2}>{roleName(2, t)}</MenuItem>
                    </Select>
                </FormControl>
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
