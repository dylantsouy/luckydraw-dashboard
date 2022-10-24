import React from 'react';
import { Delete, Edit } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
};
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

export const rewardColumn = (t, deleteHandler) => {
    return [
        {
            field: 'data',
            filterable: false,
            headerName: t('image'),
            minWidth: 141,
            renderCell: (params) => {
                let base64Flag = `data:${params.row.type};base64,`;
                let imageStr = arrayBufferToBase64(params?.row?.data?.data);
                let img = base64Flag + imageStr;
                return (
                    <Zoom>
                        <img width={20} src={img} alt='Red dot' />
                    </Zoom>
                );
            },
        },
        {
            field: 'name',
            filterable: false,
            headerName: t('name'),
            minWidth: 341,
        },
        {
            field: 'type',
            filterable: false,
            headerName: t('type'),
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
                        <Tooltip title={t('delete')} placement='right'>
                            <Delete className='action-icon ml-3 warn' onClick={() => deleteHandler(params.row)} />
                        </Tooltip>
                    </>
                );
            },
        },
    ];
};
export const adminColumn = (t, editHandler, deleteHandler) => {
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
