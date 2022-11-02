import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect, useCallback } from 'react';
import Loading from 'components/common/Loading';
import './styles.scss';
import { rewardColumn } from 'helpers/columns';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'langs/useTranslation';
import { Button, InputAdornment, TextField } from '@mui/material';
import FileUploadModal from 'components/reward/FileUploadModal';
import { Stack } from '@mui/system';
import { Refresh, Search } from '@mui/icons-material';
import { deleteAllRewards, deleteReward, deleteRewards, fetchRewardList, updateWinningResult } from 'apis/rewardApi';
import EditModal from 'components/reward/EditModal';
import { getUserCount } from 'apis/userApi';
import ResultModal from 'components/reward/ResultModal';
import { useAuthStore } from 'store/auth';
import { useStore } from 'store/store';

export default function Reward() {
    const { t } = useTranslation('common');
    const { permissionArray } = useAuthStore();
    const { enqueueSnackbar } = useSnackbar();
    const { setValue, setModalHandler, closeModal } = useStore();
    const [rewardList, setRewardList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectRows, setSelectRows] = useState([]);
    const [showImportDialog, setShowimportDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showResultDialog, setShowResultDialog] = useState(false);
    const [editData, setEditData] = useState({});
    const [resultData, setResultData] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [userCount, setUserCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const filterList = () => {
        return rewardList.filter((e) => e.name?.includes(searchValue));
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
            getRewardList();
        }
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
            text: `${t('confirmDeleteSelectedReward')}?`,
        });
    };

    const deleteAllHandler = () => {
        setModalHandler({
            func: confirmDeleteAll,
            text: `${t('confirmDeleteAllReward')}?`,
        });
    };

    const emptyRewardHandler = (e) => {
        setModalHandler({
            func: () => confirmEmptyResult(e),
            text: `${t('confirmEmptyReward')}?`,
        });
    };
    const editHandler = (e) => {
        setShowEditDialog(true);
        setEditData(e);
    };

    const handleCloseEdit = (refresh) => {
        setShowEditDialog(false);
        if (refresh) {
            getRewardList();
        }
    };

    const showResultHandler = (e) => {
        setResultData(e);
        setShowResultDialog(true);
    };

    const confirmEmptyResult = async (e) => {
        if (!permissionArray?.includes('action')) {
            enqueueSnackbar(t('noPermission'), { variant: 'error' });
            return;
        }
        try {
            setValue('modalLoading', true);
            let result = await updateWinningResult({ id: e?.id, winning: null });
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('deleteSuccess'), { variant: 'success' });
                closeModal();
                getRewardList();
            }
            setValue('modalLoading', false);
        } catch (err) {
            enqueueSnackbar(t('deleteFailed'), { variant: 'error' });
            setValue('modalLoading', false);
        }
    };

    const confirmDelete = async (e) => {
        if (!permissionArray?.includes('action')) {
            enqueueSnackbar(t('noPermission'), { variant: 'error' });
            return;
        }
        try {
            setValue('modalLoading', true);
            let result = await deleteReward(e?.id);
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('deleteSuccess'), { variant: 'success' });
                closeModal();
                getRewardList();
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
            let result = await deleteRewards(selectRows);
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('deleteSuccess'), { variant: 'success' });
                closeModal();
                setSelectRows([]);
                getRewardList();
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
            let result = await deleteAllRewards();
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('deleteSuccess'), { variant: 'success' });
                closeModal();
                getRewardList();
            }
            setValue('modalLoading', false);
        } catch (err) {
            enqueueSnackbar(t('deleteFailed'), { variant: 'error' });
            setValue('modalLoading', false);
        }
    };

    const getRewardList = useCallback(async () => {
        try {
            setLoading(true);
            let result = await fetchRewardList();
            const { success, data } = result;
            if (success) {
                setRewardList(data);
            }
            setLoading(false);
        } catch (err) {
            enqueueSnackbar(t(err?.message), { variant: 'error' });
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enqueueSnackbar]);

    useEffect(() => {
        getRewardList();
    }, [getRewardList]);

    const getCount = useCallback(async () => {
        try {
            let result = await getUserCount();
            const { success, data } = result;
            if (success) {
                setUserCount(data);
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
        <div className='reward-wrapper'>
            <div className='container'>
                {!loading && (
                    <div className='action-area'>
                        <div className='left'>
                            <div className='recommend'>
                                {t('userCount')}: <span>{userCount}</span> *{t('recommendCount')}*
                            </div>
                            <Button variant='contained' onClick={importHandler} color='third'>
                                {t('import')}
                            </Button>
                            {rewardList?.length > 0 && (
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
                            <div className='refresh' onClick={getRewardList}>
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
                            rows={filterList(rewardList)}
                            columns={rewardColumn(t, deleteHandler, editHandler, emptyRewardHandler, showResultHandler)}
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
                rewardList={rewardList}
            />
            <ResultModal
                resultData={resultData}
                open={showResultDialog}
                handleClose={() => setShowResultDialog(false)}
            />
            <FileUploadModal open={showImportDialog} handleClose={handleCloseImport} rewardList={rewardList} />
        </div>
    );
}
