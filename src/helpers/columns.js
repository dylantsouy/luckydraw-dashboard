import React from 'react';
import { Delete, Edit, Password, RemoveRedEye } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { transformedFormatBytes } from 'helpers/formatBytesTransformer';
import { roleName } from 'auths/roleHandler';

export const userColumn = (t, editHandler, deleteHandler) => {
    return [
        {
            field: 'code',
            filterable: false,
            headerName: t('code'),
            minWidth: 141,
        },
        {
            field: 'name',
            filterable: false,
            headerName: t('name'),
            minWidth: 141,
        },
        {
            field: 'createdAt',
            filterable: false,
            headerName: t('createdAt'),
            minWidth: 241,
            renderCell: (params) => {
                return <>{dayjs(params.row?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</>;
            },
        },
        {
            field: 'action',
            filterable: false,
            sortable: false,
            headerName: t('action'),
            minWidth: 130,
            renderCell: (params) => {
                return (
                    <>
                        <Tooltip title={t('edit')} placement='right'>
                            <Edit className='action-icon' onClick={() => editHandler(params.row)} />
                        </Tooltip>
                        <Tooltip title={t('delete')} placement='right'>
                            <Delete className='action-icon ml-3 warn' onClick={() => deleteHandler(params.row)} />
                        </Tooltip>
                    </>
                );
            },
        },
    ];
};

export const rewardColumn = (t, deleteHandler, editHandler, emptyRewardHandler, showResultHandler) => {
    return [
        {
            field: 'url',
            filterable: false,
            headerName: t('image'),
            minWidth: 30,
            renderCell: (params) => {
                return (
                    <Zoom>
                        <LazyLoadImage
                            alt={params.row?.name}
                            height={20}
                            effect='blur'
                            src={params.row?.url}
                            width={20}
                        />
                    </Zoom>
                );
            },
        },
        {
            field: 'name',
            filterable: false,
            headerName: t('name'),
            minWidth: 250,
        },
        {
            field: 'order',
            filterable: false,
            headerName: t('order'),
            minWidth: 110,
        },
        {
            field: 'count',
            filterable: false,
            headerName: t('count'),
            minWidth: 110,
        },
        {
            field: 'size',
            filterable: false,
            headerName: t('size'),
            minWidth: 110,
            renderCell: (params) => {
                return <>{params.row?.size ? transformedFormatBytes(params.row?.size) : '-'}</>;
            },
        },
        {
            field: 'winning',
            filterable: false,
            headerName: t('winning'),
            minWidth: 120,
            renderCell: (params) => {
                return (
                    <>
                        {params.row?.winning ? (
                            <>
                                <Tooltip title={t('see')} placement='right'>
                                    <RemoveRedEye
                                        className='action-icon success'
                                        onClick={() => showResultHandler(params.row)}
                                    />
                                </Tooltip>
                                <Tooltip title={t('emptyReward')} placement='right'>
                                    <Delete
                                        className='action-icon ml-3 warn'
                                        onClick={() => emptyRewardHandler(params.row)}
                                    />
                                </Tooltip>
                            </>
                        ) : (
                            <div>尚未抽獎</div>
                        )}
                    </>
                );
            },
        },
        {
            field: 'createdAt',
            filterable: false,
            headerName: t('createdAt'),
            minWidth: 160,
            renderCell: (params) => {
                return <>{dayjs(params.row?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</>;
            },
        },
        {
            field: 'action',
            filterable: false,
            sortable: false,
            headerName: t('action'),
            minWidth: 130,
            renderCell: (params) => {
                return (
                    <>
                        <Tooltip title={t('edit')} placement='right'>
                            <Edit className='action-icon' onClick={() => editHandler(params.row)} />
                        </Tooltip>
                        <Tooltip title={t('delete')} placement='right'>
                            <Delete className='action-icon ml-3 warn' onClick={() => deleteHandler(params.row)} />
                        </Tooltip>
                    </>
                );
            },
        },
    ];
};
export const adminColumn = (t, editHandler, deleteHandler, passwordHandler) => {
    return [
        {
            field: 'username',
            filterable: false,
            headerName: t('username'),
            minWidth: 141,
        },
        {
            field: 'password',
            filterable: false,
            headerName: t('password'),
            minWidth: 141,
            renderCell: () => {
                return <>******</>;
            },
        },
        {
            field: 'email',
            filterable: false,
            headerName: t('email'),
            minWidth: 241,
        },
        {
            field: 'role',
            filterable: false,
            headerName: t('role'),
            minWidth: 241,
            renderCell: (params) => {
                return <>{roleName(params.row?.role, t)}</>;
            },
        },
        {
            field: 'createdAt',
            filterable: false,
            headerName: t('createdAt'),
            minWidth: 241,
            renderCell: (params) => {
                return <>{dayjs(params.row?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</>;
            },
        },
        {
            field: 'action',
            filterable: false,
            sortable: false,
            headerName: t('action'),
            minWidth: 130,
            renderCell: (params) => {
                return (
                    <>
                        <Tooltip title={t('edit')} placement='right'>
                            <Edit className='action-icon' onClick={() => editHandler(params.row)} />
                        </Tooltip>
                        <Tooltip title={t('changePassword')} placement='right'>
                            <Password className='action-icon ml-3 ' onClick={() => passwordHandler(params.row)} />
                        </Tooltip>
                        <Tooltip title={t('delete')} placement='right'>
                            <Delete className='action-icon ml-3 warn' onClick={() => deleteHandler(params.row)} />
                        </Tooltip>
                    </>
                );
            },
        },
    ];
};

export const winningColumn = (t, deleteHandler) => {
    return [
        {
            field: 'User.code',
            filterable: false,
            headerName: `${t('user')}${t('code')}`,
            minWidth: 141,
            renderCell: (params) => {
                return <>{params.row?.User?.code || '-'}</>;
            },
        },
        {
            field: 'User.name',
            filterable: false,
            headerName: `${t('user')}${t('name')}`,
            minWidth: 141,
            renderCell: (params) => {
                return <>{params.row?.User?.name || '-'}</>;
            },
        },
        {
            field: 'Reward.name',
            filterable: false,
            headerName: `${t('reward')}${t('name')}`,
            minWidth: 141,
            renderCell: (params) => {
                return <>{params.row?.Reward?.name || '-'}</>;
            },
        },
        {
            field: 'createdAt',
            filterable: false,
            headerName: t('createdAt'),
            minWidth: 241,
            renderCell: (params) => {
                return <>{dayjs(params.row?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</>;
            },
        },
        {
            field: 'action',
            filterable: false,
            sortable: false,
            headerName: t('action'),
            minWidth: 130,
            renderCell: (params) => {
                return (
                    <>
                        <Tooltip title={t('delete')} placement='right'>
                            <Delete className='action-icon ml-3 warn' onClick={() => deleteHandler(params.row)} />
                        </Tooltip>
                    </>
                );
            },
        },
    ];
};
