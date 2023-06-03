import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';
import './styles.scss';
import { adminColumn } from 'helpers/columns';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'langs/useTranslation';
import EditModal from 'components/admin/EditModal';
import AddModal from 'components/admin/AddModal';
import { Button, InputAdornment, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { Search } from '@mui/icons-material';
import { deleteAdmin, deleteAdmins, deleteAllAdmins } from 'apis/adminApi';
import HasPermission from 'auths/HasPermission';
import PasswordModal from 'components/admin/PasswordModal';
import { useStore } from 'store/store';
import useAdminList from 'hooks/useAdminList';
import DataGridSkeleton from 'components/common/DataGridSkeleton/DataGridSkeleton';

export default function Admin() {
    const { t } = useTranslation('common');
    const { setValue, setModalHandler, closeModal } = useStore();
    const { data: adminList, isLoading, mutate } = useAdminList();
    const { enqueueSnackbar } = useSnackbar();
    const [searchValue, setSearchValue] = useState('');
    const [selectRows, setSelectRows] = useState([]);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editData, setEditData] = useState({});
    const [perPage, setPerPage] = useState(10);
    const [changePasswordId, setChangePasswordId] = useState('');
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const filterList = () => {
        return isLoading
            ? []
            : adminList?.filter((e) => e.username?.includes(searchValue) || e.email?.includes(searchValue));
    };

    const onSelectionModelChange = (ids) => {
        setSelectRows(ids);
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
            text: `${t('confirmDeleteSelectedAdmin')}?`,
        });
    };

    const deleteAllHandler = () => {
        setModalHandler({
            func: confirmDeleteAll,
            text: `${t('confirmDeleteAllAdmin')}?`,
        });
    };

    const passwordHandler = (e) => {
        setShowPasswordDialog(true);
        setChangePasswordId(e?.id);
    };

    const handleClosePassword = (refresh) => {
        setShowPasswordDialog(false);
        if (refresh) {
            mutate();
        }
    };

    const handleCloseAdd = (refresh) => {
        setShowAddDialog(false);
        if (refresh) {
            mutate();
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
            mutate();
        }
    };

    const confirmDelete = async (e) => {
        try {
            setValue('modalLoading', true);
            let result = await deleteAdmin(e?.id);
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('deleteSuccess'), { variant: 'success' });
                closeModal();
                mutate();
            }
            setValue('modalLoading', false);
        } catch (err) {
            enqueueSnackbar(t('deleteFailed'), { variant: 'error' });
            setValue('modalLoading', false);
        }
    };

    const confirmDeleteMutiple = async () => {
        try {
            setValue('modalLoading', true);
            let result = await deleteAdmins(selectRows);
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('deleteSuccess'), { variant: 'success' });
                closeModal();
                setSelectRows([]);
                mutate();
            }
            setValue('modalLoading', false);
        } catch (err) {
            enqueueSnackbar(t('deleteFailed'), { variant: 'error' });
            setValue('modalLoading', false);
        }
    };

    const confirmDeleteAll = async () => {
        try {
            setValue('modalLoading', true);
            let result = await deleteAllAdmins();
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('deleteSuccess'), { variant: 'success' });
                closeModal();
                mutate();
            }
            setValue('modalLoading', false);
        } catch (err) {
            enqueueSnackbar(t('deleteFailed'), { variant: 'error' });
            setValue('modalLoading', false);
        }
    };

    return (
        <div className='admin-wrapper'>
            <div className='container'>
                <div className='action-area'>
                    <HasPermission permission='action'>
                        <div className='left'>
                            <Button variant='contained' onClick={addHandler} color='primary' disabled={isLoading}>
                                {t('create')}
                            </Button>
                            <Button
                                variant='contained'
                                onClick={deleteAllHandler}
                                color='secondary'
                                disabled={isLoading || !adminList?.length}
                            >
                                {t('deleteAll')}
                            </Button>
                            <Button
                                variant='contained'
                                onClick={deleteMutipleHandler}
                                color='secondary'
                                disabled={isLoading || !selectRows?.length}
                            >
                                {t('deleteSelected')}
                            </Button>
                        </div>
                    </HasPermission>
                    <div className='right'>
                        <TextField
                            margin='dense'
                            label={t('search')}
                            type='text'
                            value={searchValue}
                            disabled={isLoading}
                            fullWidth
                            variant='standard'
                            onChange={(e) => handleSearch(e)}
                            InputProps={{
                                endAdornment: <InputAdornment position='end'>{<Search />}</InputAdornment>,
                            }}
                        />
                    </div>
                </div>
                <div className='table-wrapper'>
                    <DataGrid
                        className='table-root'
                        rows={filterList(adminList)}
                        columns={adminColumn(t, editHandler, deleteHandler, passwordHandler)}
                        pageSize={perPage}
                        getRowId={(row) => row.id}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        onPageSizeChange={(p) => setPerPage(p)}
                        checkboxSelection
                        isRowSelectable={(params) => params.row.role !== 0}
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
                        loading={isLoading}
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
                            LoadingOverlay: DataGridSkeleton,
                        }}
                    />
                </div>
            </div>
            <EditModal
                open={showEditDialog}
                editData={editData}
                setEditData={setEditData}
                handleClose={handleCloseEdit}
            />
            <PasswordModal
                open={showPasswordDialog}
                changePasswordId={changePasswordId}
                handleClose={handleClosePassword}
            />
            <AddModal open={showAddDialog} handleClose={handleCloseAdd} />
        </div>
    );
}
