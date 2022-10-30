import { Tooltip } from '@mui/material';
import React from 'react';
import LangSelect from '../LangSelect';
import './styles.scss';
import PropTypes from 'prop-types';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import { Logout } from '@mui/icons-material';
import { useStorageStore } from 'store/store';
import { useAuthStore } from 'store/auth';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'langs/useTranslation';

export default function Header(props) {
    const { t } = useTranslation('common');
    const { login } = props;
    const { clear } = useAuthStore();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { sidebarShow, setSidebarShow } = useStorageStore();
    const logout = () => {
        clear();
        navigate('/login');
        enqueueSnackbar(t('logoutSuccess'), { variant: 'success' });
    };

    const logoutHandler = (e) => {
        e.preventDefault();
        logout();
    };

    const toggleSidebar = (e) => {
        setSidebarShow(e);
    };

    return login ? (
        <div className='header-wrapper'>
            <div></div>
            <div className='buttonWrapper'>
                <LangSelect />
            </div>
        </div>
    ) : (
        <div className={`header-wrapper`}>
            <div className='header-left'>
                <div className='header-bar'>
                    {sidebarShow === 'close' ? (
                        <FormatIndentIncreaseIcon onClick={() => toggleSidebar('open')} />
                    ) : (
                        <FormatIndentDecreaseIcon onClick={() => toggleSidebar('close')} />
                    )}
                </div>
            </div>
            <div className='header-right'>
                <Tooltip placement='bottom' title={t('logout')}>
                    <Logout className='logout-btn' color='primary' onClick={logoutHandler} />
                </Tooltip>

                <LangSelect />
            </div>
        </div>
    );
}

Header.propTypes = {
    login: PropTypes.bool,
};
