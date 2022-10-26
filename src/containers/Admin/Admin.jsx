import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect, useCallback } from 'react';
import Loading from 'components/common/Loading';
import './styles.scss';
import { adminColumn } from 'helpers/columns';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'langs/useTranslation';
import ConfirmModal from 'components/common/ConfirmModal';
import EditModal from 'components/admin/EditModal';
import AddModal from 'components/admin/AddModal';
import { Button, InputAdornment, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { Refresh, Search } from '@mui/icons-material';
import { deleteAdmin, deleteAdmins, deleteAllAdmins, fetchAdminList } from 'apis/adminApi';

export default function Admin() {
    const { t } = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();
    const [adminList, setAdminList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectRows, setSelectRows] = useState([]);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
    const [showDeleteMutipleDialog, setShowDeleteMutipleDialog] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editData, setEditData] = useState({});
    const [deleteData, setDeleteData] = useState({});
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const filterList = () => {
        return adminList.filter((e) => e.username?.includes(searchValue) || e.email?.includes(searchValue));
    };

    const onSelectionModelChange = (ids) => {
        setSelectRows(ids);
    };

    const addHandler = () => {
        setShowAddDialog(true);
    };

    const deleteHandler = (e) => {
        setShowDeleteDialog(true);
        setDeleteData(e);
    };

    const deleteMutipleHandler = () => {
        setShowDeleteMutipleDialog(true);
    };

    const deleteAllHandler = () => {
        setShowDeleteAllDialog(true);
    };

    const handleCloseAdd = (refresh) => {
        setShowAddDialog(false);
        if (refresh) {
            getAdminList();
        }
    };

    const editHandler = (e) => {
        setShowEditDialog(true);
        e.password = '';
        setEditData(e);
    };

    const handleCloseEdit = (refresh) => {
        setShowEditDialog(false);
        if (refresh) {
            getAdminList();
        }
    };

    const confirmDelete = async () => {
        try {
            setDialogLoading(true);
            let result = await deleteAdmin(deleteData?.id);
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('delete') + t('success'), { variant: 'success' });
                setShowDeleteDialog(false);
                getAdminList();
            }
            setDialogLoading(false);
        } catch (err) {
            enqueueSnackbar(t('delete') + t('failed'), { variant: 'error' });
            setDialogLoading(false);
        }
    };

    const confirmDeleteMutiple = async () => {
        try {
            setDialogLoading(true);
            let result = await deleteAdmins(selectRows);
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('delete') + t('success'), { variant: 'success' });
                setShowDeleteMutipleDialog(false);
                setSelectRows([]);
                getAdminList();
            }
            setDialogLoading(false);
        } catch (err) {
            enqueueSnackbar(t('delete') + t('failed'), { variant: 'error' });
            setDialogLoading(false);
        }
    };

    const confirmDeleteAll = async () => {
        try {
            setDialogLoading(true);
            let result = await deleteAllAdmins();
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('delete') + t('success'), { variant: 'success' });
                setShowDeleteAllDialog(false);
                getAdminList();
            }
            setDialogLoading(false);
        } catch (err) {
            enqueueSnackbar(t('delete') + t('failed'), { variant: 'error' });
            setShowDeleteAllDialog(false);
        }
    };

    const getAdminList = useCallback(async () => {
        try {
            setLoading(true);
            let result = await fetchAdminList();
            const { success, data } = result;
            if (success) {
                setAdminList(data);
                setSelectRows([]);
            }
            setLoading(false);
        } catch (err) {
            enqueueSnackbar(t(err?.message), { variant: 'error' });
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enqueueSnackbar]);

    useEffect(() => {
        getAdminList();
    }, [getAdminList]);

    return (
        <div className='admin-wrapper'>
            <div className='container'>
                {!loading && (
                    <div className='action-area'>
                        <div className='left'>
                            <Button variant='contained' onClick={addHandler} color='primary'>
                                {t('create')}
                            </Button>
                            {adminList?.length > 0 && (
                                <Button variant='contained' onClick={deleteAllHandler} color='secondary'>
                                    {t('delete') + t('all')}
                                </Button>
                            )}
                            {selectRows?.length > 0 && (
                                <Button variant='contained' onClick={deleteMutipleHandler} color='secondary'>
                                    {t('delete') + t('selected')}
                                </Button>
                            )}
                        </div>
                        <div className='right'>
                            <div className='refresh' onClick={getAdminList}>
                                <Refresh color='primary' />
                            </div>
                            <TextField
                                margin='dense'
                                label={t('search')}
                                type='text'
                                value={searchValue}
                                fullWidth
                                variant='standard'
                                onChange={(e) => handleSearch(e)}
                                InputProps={{
                                    endAdornment: <InputAdornment position='end'>{<Search />}</InputAdornment>,
                                }}
                            />
                        </div>
                    </div>
                )}
                <div className='table-wrapper'>
                    {loading ? (
                        <Loading size={40} />
                    ) : (
                        <DataGrid
                            className='table-root'
                            rows={filterList(adminList)}
                            columns={adminColumn(t, editHandler, deleteHandler)}
                            pageSize={perPage}
                            getRowId={(row) => row.id}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            onPageSizeChange={(p) => setPerPage(p)}
                            checkboxSelection
                            onSelectionModelChange={(ids) => {
                                onSelectionModelChange(ids);
                            }}
                            disableSelectionOnClick={true}
                            sortingOrder={['desc', 'asc']}
                            componentsProps={{
                                pagination: {
                                    labelRowsPerPage: t('perPage'),
                                },
                            }}
                            localeText={{
                                columnMenuUnsort: t('columnMenuUnsort'),
                                columnMenuSortAsc: t('columnMenuSortAsc'),
                                columnMenuSortDesc: t('columnMenuSortDesc'),
                                columnMenuShowColumns: t('columnMenuShowColumns'),
                                columnMenuHideColumn: t('columnMenuHideColumn'),
                            }}
                            components={{
                                NoRowsOverlay: () => (
                                    <Stack height='100%' alignItems='center' justifyContent='center'>
                                        {t('noRaws')}
                                    </Stack>
                                ),
                                NoResultsOverlay: () => (
                                    <Stack height='100%' alignItems='center' justifyContent='center'>
                                        {t('noRaws')}
                                    </Stack>
                                ),
                            }}
                        />
                    )}
                </div>
            </div>
            <EditModal
                open={showEditDialog}
                editData={editData}
                setEditData={setEditData}
                handleClose={handleCloseEdit}
            />
            <AddModal open={showAddDialog} handleClose={handleCloseAdd} />
            <ConfirmModal
                open={showDeleteDialog}
                handlerOk={confirmDelete}
                handleClose={() => setShowDeleteDialog(false)}
                loading={dialogLoading}
                text={`${t('confirmDelete')}${t('admin')}: ${deleteData?.username}?`}
            />
            <ConfirmModal
                open={showDeleteAllDialog}
                handlerOk={confirmDeleteAll}
                handleClose={() => setShowDeleteAllDialog(false)}
                loading={dialogLoading}
                text={`${t('confirmDelete')}${t('all')}${t('admin')}?`}
            />
            <ConfirmModal
                open={showDeleteMutipleDialog}
                handlerOk={confirmDeleteMutiple}
                handleClose={() => setShowDeleteMutipleDialog(false)}
                loading={dialogLoading}
                text={`${t('confirmDelete')}${t('selected')}${t('admin')}?`}
            />
        </div>
    );
}
