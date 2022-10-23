import React from 'react';
import { Delete, Edit } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

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
