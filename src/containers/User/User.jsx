import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect, useCallback } from 'react';
import Loading from 'components/common/Loading';
import './styles.scss';
import { userColumn } from 'helpers/columns';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'langs/useTranslation';
import ConfirmModal from 'components/common/ConfirmModal';
import { deleteUser, fetchUserList } from 'apis/postApi';
import EditModal from 'components/user/EditModal';
import AddModal from 'components/user/AddModal';
import { Button } from '@mui/material';

export default function User() {
    const { t } = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();
    const [userList, setUserList] = useState([]);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editData, setEditData] = useState({});
    const [deleteData, setDeleteData] = useState({});
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const handleSearch = () => {
        setLoading(true);
        getUserList();
    };

    const addHandler = () => {
        setShowAddDialog(true);
    };

    const deleteHandler = (e) => {
        setShowDeleteDialog(true);
        setDeleteData(e);
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

    const getUserList = useCallback(async () => {
        try {
            setLoading(true);
            let result = await fetchUserList();
            const { success, data } = result;
            if (success) {
                setUserList(data);
            }
            setLoading(false);
        } catch (err) {
            enqueueSnackbar(t(err?.response?.data?.message), { variant: 'error' });
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
                <Button variant='contained' onClick={addHandler}>
                    新增
                </Button>
                <div className='table-wrapper'>
                    {loading ? (
                        <Loading size={40} />
                    ) : (
                        <DataGrid
                            className='table-root'
                            rows={userList || []}
                            columns={userColumn(t, editHandler, deleteHandler)}
                            pageSize={perPage}
                            getRowId={(row) => row.id}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            onPageSizeChange={(p) => setPerPage(p)}
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
        </div>
    );
}
