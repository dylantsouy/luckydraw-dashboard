import React from 'react';
import './styles.scss';
import { Skeleton } from '@mui/material';

export default function DataGridSkeleton() {
    return (
        <>
            <Skeleton variant='rectangular' sx={{ my: 1, mx: 1 }} height={45} />
            <Skeleton variant='rectangular' sx={{ my: 1, mx: 1 }} height={45} />
            <Skeleton variant='rectangular' sx={{ my: 1, mx: 1 }} height={45} />
            <Skeleton variant='rectangular' sx={{ my: 1, mx: 1 }} height={45} />
            <Skeleton variant='rectangular' sx={{ my: 1, mx: 1 }} height={45} />
        </>
    );
}
