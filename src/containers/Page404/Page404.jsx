import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.scss';
import { Button } from '@mui/material';

export default function Page404() {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/user');
    };
    return (
        <>
            <div className='page404-wrapper'>
                <div className='title'>404</div>
                <div className='subtitle'>Uh Oh! Looks like Something Wrong.</div>

                <Button variant='contained' onClick={() => goHome()}>
                    Go Home
                </Button>
            </div>
        </>
    );
}
