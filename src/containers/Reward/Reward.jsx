import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect, useCallback } from 'react';
import './styles.scss';
import { rewardColumn } from 'helpers/columns';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'langs/useTranslation';
import { Button, InputAdornment, Skeleton, TextField } from '@mui/material';
import FileUploadModal from 'components/reward/FileUploadModal';
import { Stack } from '@mui/system';
import { Search } from '@mui/icons-material';
import { deleteAllRewards, deleteReward, deleteRewards, updateWinningResult } from 'apis/rewardApi';
import EditModal from 'components/reward/EditModal';
import { getUserCount } from 'apis/userApi';
import ResultModal from 'components/reward/ResultModal';
import { useAuthStore } from 'store/auth';
import { useStore } from 'store/store';
import useRewardList from 'hooks/useRewardList';
import DataGridSkeleton from 'components/common/DataGridSkeleton/DataGridSkeleton';

export default function Reward() {
    const { t } = useTranslation('common');
    const { permissionArray } = useAuthStore();
    const { enqueueSnackbar } = useSnackbar();
    const { data: rewardList, isLoading, mutate } = useRewardList();
    const { setValue, setModalHandler, closeModal } = useStore();
    const [searchValue, setSearchValue] = useState('');
    const [selectRows, setSelectRows] = useState([]);
    const [showImportDialog, setShowimportDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showResultDialog, setShowResultDialog] = useState(false);
    const [editData, setEditData] = useState({});
    const [resultData, setResultData] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [userCount, setUserCount] = useState('-');

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const filterList = () => {
        return isLoading ? [] : rewardList?.filter((e) => e.name?.includes(searchValue));
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
            mutate();
        }
    };

    const deleteHandler = (e) => {
        setModalHandler({
            func: () => confirmDelete(e),
            text: `${t('confirmDelete')}: ${e?.name}?`,
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
            mutate();
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
                mutate();
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
                mutate();
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
                mutate();
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
            let ids = rewardList.map((e) => e.id);
            setValue('modalLoading', true);
            let result = await deleteAllRewards(ids);
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
                <div className='action-area'>
                    <div className='left'>
                        <div className='recommend'>
                            {t('userCount')}:{' '}
                            <span className='mr-1 ml-1'>
                                {isLoading ? <Skeleton variant='rounded' width={25} height={15} /> : userCount}
                            </span>{' '}
                            *{t('recommendCount')}*
                        </div>
                        <Button variant='contained' onClick={importHandler} color='third' disabled={isLoading}>
                            {t('import')}
                        </Button>
                        <Button
                            variant='contained'
                            onClick={deleteAllHandler}
                            color='secondary'
                            disabled={isLoading || !rewardList?.length}
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
