import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect, useCallback } from 'react';
import Loading from 'components/common/Loading';
import './styles.scss';
import { userColumn } from 'helpers/columns';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'langs/useTranslation';
import ConfirmModal from 'components/common/ConfirmModal';
import { deleteAllUsers, deleteUser, deleteUsers, fetchUserList } from 'apis/userApi';
import EditModal from 'components/user/EditModal';
import AddModal from 'components/user/AddModal';
import { Button, InputAdornment, TextField } from '@mui/material';
import FileUploadModal from 'components/user/FileUploadModal';
import { Stack } from '@mui/system';
import { Search } from '@mui/icons-material';

export default function Winning() {
    const { t } = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();
    const [userList, setUserList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectRows, setSelectRows] = useState([]);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
    const [showDeleteMutipleDialog, setShowDeleteMutipleDialog] = useState(false);
    const [showImportDialog, setShowimportDialog] = useState(false);
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
        return userList.filter((e) => e.name?.includes(searchValue) || e.code?.includes(searchValue));
    };

    const onSelectionModelChange = (ids) => {
        setSelectRows(ids);
    };

    const importHandler = () => {
        setShowimportDialog(true);
    };

    const handleCloseImport = (refresh) => {
        setShowimportDialog(false);
        if (refresh) {
            getUserList();
        }
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
            getUserList();
        }
    };

    const editHandler = (e) => {
        setShowEditDialog(true);
        setEditData(e);
    };

    const handleCloseEdit = (refresh) => {
        setShowEditDialog(false);
        if (refresh) {
            getUserList();
        }
    };

    const confirmDelete = async () => {
        try {
            setDialogLoading(true);
            let result = await deleteUser(deleteData?.id);
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('delete') + t('success'), { variant: 'success' });
                setShowDeleteDialog(false);
                getUserList();
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
            let result = await deleteUsers(selectRows);
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('delete') + t('success'), { variant: 'success' });
                setShowDeleteMutipleDialog(false);
                setSelectRows([]);
                getUserList();
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
            let result = await deleteAllUsers();
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('delete') + t('success'), { variant: 'success' });
                setShowDeleteAllDialog(false);
                getUserList();
            }
            setDialogLoading(false);
        } catch (err) {
            enqueueSnackbar(t('delete') + t('failed'), { variant: 'error' });
            setShowDeleteAllDialog(false);
        }
    };

    const getUserList = useCallback(async () => {
        try {
            setLoading(true);
            let result = await fetchUserList();
            const { success, data } = result;
            if (success) {
                setUserList(data);
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
        getUserList();
    }, [getUserList]);

    return (
        <div className='user-wrapper'>
            <div className='container'>
                {!loading && (
                    <div className='action-area'>
                        <div className='left'>
                            <Button variant='contained' onClick={addHandler} color='primary'>
                                {t('create')}
                            </Button>
                            <Button variant='contained' onClick={importHandler} color='third'>
                                {t('import')}
                            </Button>
                            {userList?.length > 0 && (
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
                            rows={filterList(userList)}
                            columns={userColumn(t, editHandler, deleteHandler)}
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
                text={`${t('confirmDelete')}${t('user')}: ${deleteData?.name}?`}
            />
            <ConfirmModal
                open={showDeleteAllDialog}
                handlerOk={confirmDeleteAll}
                handleClose={() => setShowDeleteAllDialog(false)}
                loading={dialogLoading}
                text={`${t('confirmDelete')}${t('all')}${t('user')}?`}
            />
            <ConfirmModal
                open={showDeleteMutipleDialog}
                handlerOk={confirmDeleteMutiple}
                handleClose={() => setShowDeleteMutipleDialog(false)}
                loading={dialogLoading}
                text={`${t('confirmDelete')}${t('selected')}${t('user')}?`}
            />
            <FileUploadModal open={showImportDialog} handleClose={handleCloseImport} />
        </div>
    );
}
