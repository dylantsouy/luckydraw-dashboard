import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import './styles.scss';
import ConfirmButton from 'components/common/ConfirmButton';
import PasswordInput from 'components/common/PasswordInput';
import { permissionHandler } from 'auths/roleHandler';
import { useAuthStore } from 'store/auth';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'langs/useTranslation';
import { loginApi } from 'apis/authApi';
import logo from 'assets/images/logo.png';

export default function Login() {
    const { setAuthValue } = useAuthStore();
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ username: '', password: '' });
    const [validation, setValidation] = useState({
        username: { valid: true, error: '' },
        password: { valid: true, error: '' },
    });

    const login = async () => {
        try {
            let result = await loginApi(form);
            console.log(result);
            if (result?.success) {
                setAuthValue('user', result.data);
                setAuthValue('token', result.token);
                setAuthValue('permissionArray', permissionHandler(result.data.role));
                setLoading(false);
                enqueueSnackbar(t('login') + t('success'), { variant: 'success' });
                navigate('/user');
            }
        } catch (err) {
            console.log(err.message);
            setLoading(false);
            enqueueSnackbar(t(err?.message), { variant: 'error' });
        }
    };

    const onChange = (e) => {
        setValidation({
            username: { valid: true, error: '' },
            password: { valid: true, error: '' },
        });
        setForm({
            ...form,
            [e.target.id]: e.target.value,
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!form.username || !form.password) {
            setValidation({
                username: {
                    valid: !!form.username,
                    error: !form.username ? '此欄位必填' : '',
                },
                password: {
                    valid: !!form.password,
                    error: !form.password ? '此欄位必填' : '',
                },
            });
            setLoading(false);
        } else {
            login(form, setValidation, setLoading);
        }
    };

    return (
        <>
            <div className='login-wrapper'>
                <div className='modal'>
                    <div className='title'>
                        <div className='logo'>
                            <img src={logo} alt='logo' />
                        </div>
                        <div className='logo-text'>
                            <div className='top'>Luckdraw</div>
                            <div className='bottom'>Dashboard</div>
                        </div>
                    </div>
                    <form className='root' noValidate onSubmit={onSubmit}>
                        <TextField
                            id='username'
                            label={t('username')}
                            variant='outlined'
                            onChange={onChange}
                            error={!validation.username.valid}
                            helperText={validation.username.error}
                        />
                        <PasswordInput
                            variant='outlined'
                            onChange={onChange}
                            error={!validation.password.valid}
                            helperText={validation.password.error}
                        />
                        <div className='mt-2' />
                        <ConfirmButton variant='contained' type='submit' loading={loading} text={t('login')} />
                    </form>
                    <div className='version'>v1.0.0</div>
                </div>
            </div>
        </>
    );
}
