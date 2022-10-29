import React from 'react';
import './styles.scss';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { AdminPanelSettings, CardGiftcard, Celebration, People, Settings } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'langs/useTranslation';
import HasPermission from 'auths/HasPermission';
import { useStorageStore } from 'store/store';
import logo from 'assets/images/logo.png';

export default function Sidebar() {
    const { t } = useTranslation('common');
    const { sidebarShow } = useStorageStore();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const listItems = [
        // {
        //     listIcon: <Home />,
        //     listText: t('dashboard'),
        //     path: 'dashboard',
        // },
        {
            listIcon: <Celebration />,
            listText: t('luckyDraw'),
            path: 'luckyDraw',
        },
        {
            listIcon: <People />,
            listText: t('user'),
            path: 'user',
        },
        {
            listIcon: <CardGiftcard />,
            listText: t('reward'),
            path: 'reward',
        },
        // {
        //     listIcon: <ReceiptLong />,
        //     listText: t('winning'),
        //     path: 'winning',
        // },
        {
            listIcon: <AdminPanelSettings />,
            listText: t('admin'),
            path: 'admin',
        },
        {
            listIcon: <Settings />,
            listText: t('setting'),
            path: 'setting',
        },
    ];

    const goHandler = (path) => {
        navigate(path);
    };

    return (
        <div className={`sidebar-wrapper ${sidebarShow === 'close' ? 'hidden' : ''}`}>
            <div className='title' onClick={() => goHandler('/user')}>
                <div className='logo'>
                    <img src={logo} alt='logo' />
                </div>
                <div className='logo-text'>
                    <div className='top'>Luckdraw</div>
                    <div className='bottom'>Dashboard</div>
                </div>
            </div>
            <div className='logo'>
                <img src={logo} alt='logo' />
            </div>
            <Box className='menuSliderContainer' component='div'>
                <List>
                    {listItems.map((e) => (
                        <HasPermission key={e.path} permission={e.path}>
                            <ListItem
                                className={`listItem ${`/${e.path}` === pathname && 'active'}`}
                                onClick={() => goHandler(`/${e.path}`)}
                                button
                            >
                                <ListItemIcon className='listItemIcon'>{e.listIcon}</ListItemIcon>
                                <ListItemText primary={e.listText} />
                            </ListItem>
                        </HasPermission>
                    ))}
                </List>
            </Box>
        </div>
    );
}
