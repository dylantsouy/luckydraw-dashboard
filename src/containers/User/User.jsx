import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect, useCallback } from 'react';
import Loading from 'components/common/Loading';
import './styles.scss';
import { userColumn } from 'helpers/columns';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'langs/useTranslation';
import ConfirmModal from 'components/common/ConfirmModal';
import { fetchUserList } from 'apis/postApi';

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
        setDialogLoading(true);
        // deleteLocation(deleteData.location)
        //     .then(async (res) => {
        //         const { success } = res;
        //         if (success) {
        //             getUserList();
        //             enqueueSnackbar(t('delete_success'), { variant: 'success' });
        //             setDialogLoading(false);
        //             setShowDelete(false);
        //         }
        //     })
        //     .catch(() => {
        //         enqueueSnackbar(t('delete_failed'), { variant: 'error' });
        //         setDialogLoading(false);
        //         setLoading(false);
        //     });
    };

    const getUserList = useCallback(async () => {
        setLoading(true);
        try {
            let result = await fetchUserList();
            const { success, data } = result;
            console.log(result);
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
                <div className='table-wrapper'>
                    {loading ? (
                        <Loading size={40} />
                    ) : (
                        <DataGrid
                            className='table-root'
                            rows={userList || []}
                            columns={userColumn(t)}
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
            {/* <LocationEditModal
                open={showEdit}
                editData={editData}
                setEditData={setEditData}
                handleClose={handleCloseEdit}
            /> */}
            <ConfirmModal
                open={showDeleteDialog}
                handlerOk={confirmDelete}
                handleClose={() => setShowDeleteDialog(false)}
                loading={dialogLoading}
                text={`${t('confirmDelete')}${t('location')}: ${deleteData?.location}?`}
            />
            {/* <LocationAddModal open={showAdd} handleClose={handleCloseAdd} /> */}
        </div>
    );
}
