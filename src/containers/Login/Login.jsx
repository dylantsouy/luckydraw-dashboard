import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import './styles.scss';
import ConfirmButton from 'components/common/ConfirmButton';
import PasswordInput from 'components/common/PasswordInput';
import { permissionHandler } from 'auths/roleHandler';
import { useAuthStore } from 'store/auth';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'langs/useTranslation';
import { loginApi, signupApi } from 'apis/authApi';
import logo from 'assets/images/logo.png';
import { emailRegex, usernameRegex } from 'helpers/regex';

export default function Login() {
    const { setAuthValue } = useAuthStore();
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [type, setType] = useState('login');
    const [loading, setLoading] = useState(false);
    const [formLogin, setFormLogin] = useState({ passwordLogin: '', usernameLogin: '' });
    const [validationLogin, setValidationLogin] = useState({
        username: { valid: true, error: '' },
        password: { valid: true, error: '' },
    });
    const [formSignup, setFormSignup] = useState({
        passwordRegister: '',
        usernameRegister: '',
        company: '',
        email: '',
    });
    const [validationSignup, setValidationSignup] = useState({
        username: { valid: true, error: '' },
        password: { valid: true, error: '' },
        company: { valid: true, error: '' },
        email: { valid: true, error: '' },
    });
    const changeType = (type) => {
        setValidationSignup({
            username: { valid: true, error: '' },
            password: { valid: true, error: '' },
            company: { valid: true, error: '' },
            email: { valid: true, error: '' },
        });
        setFormSignup({ usernameRegister: '', passwordRegister: '', company: '', email: '' });
        setValidationLogin({
            username: { valid: true, error: '' },
            password: { valid: true, error: '' },
        });
        setFormLogin({ usernameLogin: '', passwordLogin: '' });
        setType(type);
    };
    const loginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formLogin.usernameLogin || !formLogin.passwordLogin) {
            setValidationLogin({
                username: {
                    valid: !!formLogin.usernameLogin,
                    error: !formLogin.usernameLogin ? '此欄位必填' : '',
                },
                password: {
                    valid: !!formLogin.passwordLogin,
                    error: !formLogin.passwordLogin ? '此欄位必填' : '',
                },
            });
            setLoading(false);
            return;
        }
        if (!usernameRegex(formLogin.usernameLogin)) {
            setValidationLogin({
                username: {
                    valid: usernameRegex(formLogin.usernameLogin),
                    error: !usernameRegex(formLogin.usernameLogin) ? t('regexError') : '',
                },
                password: { valid: true, error: '' },
            });
            return;
        }

        login();
    };

    const login = async () => {
        const data = {
            username: formLogin.usernameLogin.trim(),
            password: formLogin.passwordLogin.trim(),
        };
        try {
            let result = await loginApi(data);
            if (result?.success) {
                setAuthValue('user', result.data);
                setAuthValue('token', result.token);
                setAuthValue('permissionArray', permissionHandler(result.data.role));
                setLoading(false);
                enqueueSnackbar(t('loginSuccess'), { variant: 'success' });
                navigate('/user');
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            enqueueSnackbar(t(err?.message), { variant: 'error' });
        }
    };

    const onChangeLogin = (e) => {
        setValidationLogin({
            username: { valid: true, error: '' },
            password: { valid: true, error: '' },
        });
        setFormLogin({
            ...formLogin,
            [e.target.id]: e.target.value,
        });
    };

    const onChangeSignup = (e) => {
        setValidationSignup({
            username: { valid: true, error: '' },
            password: { valid: true, error: '' },
            company: { valid: true, error: '' },
            email: { valid: true, error: '' },
        });
        setFormSignup({
            ...formSignup,
            [e.target.id]: e.target.value,
        });
    };
    const signupSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formSignup.usernameRegister || !formSignup.passwordRegister || !formSignup.email || !formSignup.company) {
            setValidationSignup({
                username: {
                    valid: !!formSignup.usernameRegister,
                    error: !formSignup.usernameRegister ? '此欄位必填' : '',
                },
                password: {
                    valid: !!formSignup.passwordRegister,
                    error: !formSignup.passwordRegister ? '此欄位必填' : '',
                },
                email: {
                    valid: !!formSignup.email,
                    error: !formSignup.email ? '此欄位必填' : '',
                },
                company: {
                    valid: !!formSignup.company,
                    error: !formSignup.company ? '此欄位必填' : '',
                },
            });
            setLoading(false);
            return;
        }
        if (!usernameRegex(formSignup.usernameRegister) || !emailRegex(formSignup.email)) {
            setValidationSignup({
                username: {
                    valid: usernameRegex(formSignup.usernameRegister),
                    error: !usernameRegex(formSignup.usernameRegister) ? t('regexError') : '',
                },
                email: {
                    valid: emailRegex(formSignup.email),
                    error: !emailRegex(formSignup.email) ? t('regexError') : '',
                },
                password: { valid: true, error: '' },
                company: { valid: true, error: '' },
            });
            return;
        }

        signup();
    };

    const signup = async () => {
        const data = {
            username: formSignup.usernameRegister.trim(),
            password: formSignup.passwordRegister.trim(),
            email: formSignup.email.trim(),
            company: formSignup.company.trim(),
        };
        try {
            let result = await signupApi(data);
            if (result?.success) {
                setLoading(false);
                enqueueSnackbar(t('signupSuccess'), { variant: 'success' });
                changeType('login');
            }
        } catch (err) {
            setLoading(false);
            enqueueSnackbar(t(err?.message), { variant: 'error' });
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
                    {type === 'login' ? (
                        <form className='root' noValidate onSubmit={loginSubmit}>
                            <TextField
                                id='usernameLogin'
                                label={t('username')}
                                value={formLogin.usernameLogin}
                                variant='outlined'
                                onChange={onChangeLogin}
                                error={!validationLogin.username.valid}
                                helperText={validationLogin.username.error}
                                inputProps={{
                                    autoComplete: 'off',
                                    form: {
                                        autoComplete: 'off',
                                    },
                                }}
                            />
                            <PasswordInput
                                id='passwordLogin'
                                variant='outlined'
                                value={formLogin.passwordLogin}
                                onChange={onChangeLogin}
                                error={!validationLogin.password.valid}
                                helperText={validationLogin.password.error}
                            />
                            <div className='mt-2' />
                            <ConfirmButton variant='contained' type='submit' loading={loading} text={t('login')} />
                        </form>
                    ) : (
                        <form className='root' noValidate onSubmit={signupSubmit}>
                            <TextField
                                id='usernameRegister'
                                label={t('username')}
                                variant='outlined'
                                onChange={onChangeSignup}
                                value={formSignup.usernameRegister}
                                error={!validationSignup.username.valid}
                                helperText={validationSignup.username.error}
                                inputProps={{
                                    autoComplete: 'off',
                                    form: {
                                        autoComplete: 'off',
                                    },
                                }}
                            />
                            <PasswordInput
                                id='passwordRegister'
                                variant='outlined'
                                value={formSignup.passwordRegister}
                                onChange={onChangeSignup}
                                error={!validationSignup.password.valid}
                                helperText={validationSignup.password.error}
                            />
                            <TextField
                                id='email'
                                label={t('email')}
                                variant='outlined'
                                value={formSignup.email}
                                onChange={onChangeSignup}
                                error={!validationSignup.email.valid}
                                helperText={validationSignup.email.error}
                                inputProps={{
                                    autoComplete: 'off',
                                    form: {
                                        autoComplete: 'off',
                                    },
                                }}
                            />
                            <TextField
                                id='company'
                                label={t('companyName')}
                                variant='outlined'
                                value={formSignup.company}
                                onChange={onChangeSignup}
                                error={!validationSignup.company.valid}
                                helperText={validationSignup.company.error}
                                inputProps={{
                                    autoComplete: 'off',
                                    form: {
                                        autoComplete: 'off',
                                    },
                                }}
                            />
                            <div className='mt-2' />
                            <ConfirmButton variant='contained' type='submit' loading={loading} text={t('register')} />
                        </form>
                    )}
                    <div className='bottom'>
                        <Button
                            variant='standard'
                            color='third'
                            className='changeTypeBtn'
                            onClick={() => changeType(type === 'login' ? 'register' : 'login')}
                        >
                            {type === 'login' ? t('register') : t('login')}
                        </Button>
                        <div className='version'>v1.0.0</div>
                    </div>
                </div>
            </div>
        </>
    );
}
