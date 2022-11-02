import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect, useCallback } from 'react';
import Loading from 'components/common/Loading';
import './styles.scss';
import { userColumn } from 'helpers/columns';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'langs/useTranslation';
import { deleteAllUsers, deleteUser, deleteUsers, fetchUserList } from 'apis/userApi';
import EditModal from 'components/user/EditModal';
import AddModal from 'components/user/AddModal';
import { Button, InputAdornment, TextField } from '@mui/material';
import FileUploadModal from 'components/user/FileUploadModal';
import { Stack } from '@mui/system';
import { Refresh, Search } from '@mui/icons-material';
import { getRewardCount } from 'apis/rewardApi';
import { useAuthStore } from 'store/auth';
import { useStore } from 'store/store';

export default function User() {
    const { t } = useTranslation('common');
    const { setValue, setModalHandler, closeModal } = useStore();
    const { enqueueSnackbar } = useSnackbar();
    const { permissionArray } = useAuthStore();
    const [userList, setUserList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectRows, setSelectRows] = useState([]);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showImportDialog, setShowimportDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editData, setEditData] = useState({});
    const [perPage, setPerPage] = useState(10);
    const [rewardCount, setRewardCount] = useState(0);
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
        setModalHandler({
            func: () => confirmDelete(e),
            text: `${t('confirmDelete')}: ${e?.username}?`,
        });
    };

    const deleteMutipleHandler = () => {
        setModalHandler({
            func: confirmDeleteMutiple,
            text: `${t('confirmDeleteSelectedParticipants')}?`,
        });
    };

    const deleteAllHandler = () => {
        setModalHandler({
            func: confirmDeleteAll,
            text: `${t('confirmDeleteAllParticipants')}?`,
        });
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

    const confirmDelete = async (e) => {
        if (!permissionArray?.includes('action')) {
            enqueueSnackbar(t('noPermission'), { variant: 'error' });
            return;
        }
        try {
            setValue('modalLoading', true);
            let result = await deleteUser(e?.id);
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('deleteSuccess'), { variant: 'success' });
                closeModal();
                getUserList();
            }
            setValue('modalLoading', false);
        } catch (err) {
            enqueueSnackbar(t('deleteFailed'), { variant: 'error' });
            setValue('modalLoading', false);
        }
    };

    const confirmDeleteMutiple = async () => {
        if (!permissionArray?.includes('action')) {
            enqueueSnackbar(t('noPermission'), { variant: 'error' });
            return;
        }
        try {
            setValue('modalLoading', true);
            let result = await deleteUsers(selectRows);
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('deleteSuccess'), { variant: 'success' });
                closeModal();
                setSelectRows([]);
                getUserList();
            }
            setValue('modalLoading', false);
        } catch (err) {
            enqueueSnackbar(t('deleteFailed'), { variant: 'error' });
            setValue('modalLoading', false);
        }
    };

    const confirmDeleteAll = async () => {
        if (!permissionArray?.includes('action')) {
            enqueueSnackbar(t('noPermission'), { variant: 'error' });
            return;
        }
        try {
            setValue('modalLoading', true);
            let result = await deleteAllUsers();
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('deleteSuccess'), { variant: 'success' });
                closeModal();
                getUserList();
            }
            setValue('modalLoading', false);
        } catch (err) {
            enqueueSnackbar(t('deleteFailed'), { variant: 'error' });
            setValue('modalLoading', false);
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

    const getCount = useCallback(async () => {
        try {
            let result = await getRewardCount();
            const { success, data } = result;
            if (success && data) {
                setRewardCount(data[0]?.count || 0);
            }
        } catch (err) {
            enqueueSnackbar(t(err?.message), { variant: 'error' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enqueueSnackbar]);

    useEffect(() => {
        getCount();
    }, [getCount]);

    return (
        <div className='user-wrapper'>
            <div className='container'>
                {!loading && (
                    <div className='action-area'>
                        <div className='left'>
                            <div className='recommend'>
                                {t('rewardCount')} : <span>{rewardCount}</span> *{t('recommendCount')}*
                            </div>
                            <Button variant='contained' onClick={addHandler} color='primary'>
                                {t('create')}
                            </Button>
                            <Button variant='contained' onClick={importHandler} color='third'>
                                {t('import')}
                            </Button>
                            {userList?.length > 0 && (
                                <Button variant='contained' onClick={deleteAllHandler} color='secondary'>
                                    {t('deleteAll')}
                                </Button>
                            )}
                            {selectRows?.length > 0 && (
                                <Button variant='contained' onClick={deleteMutipleHandler} color='secondary'>
                                    {t('deleteSelected')}
                                </Button>
                            )}
                        </div>
                        <div className='right'>
                            <div className='refresh' onClick={getUserList}>
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
            <FileUploadModal open={showImportDialog} handleClose={handleCloseImport} />
        </div>
    );
}
