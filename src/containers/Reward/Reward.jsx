import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect, useCallback } from 'react';
import Loading from 'components/common/Loading';
import './styles.scss';
import { rewardColumn } from 'helpers/columns';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'langs/useTranslation';
import ConfirmModal from 'components/common/ConfirmModal';
import { Button, InputAdornment, TextField } from '@mui/material';
import FileUploadModal from 'components/reward/FileUploadModal';
import { Stack } from '@mui/system';
import { Search } from '@mui/icons-material';
import { deleteAllRewards, deleteReward, deleteRewards,fetchRewardList } from 'apis/rewardApi';

export default function Reward() {
    const { t } = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();
    const [rewardList, setRewardList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectRows, setSelectRows] = useState([]);
    const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
    const [showDeleteMutipleDialog, setShowDeleteMutipleDialog] = useState(false);
    const [showImportDialog, setShowimportDialog] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteData, setDeleteData] = useState({});
    const [perPage, setPerPage] = useState(10);
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
        setShowDeleteDialog(true);
        setDeleteData(e);
    };

    const deleteMutipleHandler = () => {
        setShowDeleteMutipleDialog(true);
    };

    const deleteAllHandler = () => {
        setShowDeleteAllDialog(true);
    };

    const confirmDelete = async () => {
        try {
            setDialogLoading(true);
            let result = await deleteReward(deleteData?.id);
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('delete') + t('success'), { variant: 'success' });
                setShowDeleteDialog(false);
                getRewardList();
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
            let result = await deleteRewards(selectRows);
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('delete') + t('success'), { variant: 'success' });
                setShowDeleteMutipleDialog(false);
                setSelectRows([]);
                getRewardList();
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
            let result = await deleteAllRewards();
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('delete') + t('success'), { variant: 'success' });
                setShowDeleteAllDialog(false);
                getRewardList();
            }
            setDialogLoading(false);
        } catch (err) {
            enqueueSnackbar(t('delete') + t('failed'), { variant: 'error' });
            setShowDeleteAllDialog(false);
        }
    };

    const getRewardList = useCallback(async () => {
        try {
            setLoading(true);
            let result = await fetchRewardList();
            const { success, data } = result;
            if (success) {
                setRewardList(data);
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
        getRewardList();
    }, [getRewardList]);

    return (
        <div className='reward-wrapper'>
            <div className='container'>
                {!loading && (
                    <div className='action-area'>
                        <div className='left'>
                            <Button variant='contained' onClick={importHandler} color='third'>
                                {t('import')}
                            </Button>
                            {rewardList?.length > 0 && (
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
                            rows={filterList(rewardList)}
                            columns={rewardColumn(t, deleteHandler)}
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
            <ConfirmModal
                open={showDeleteDialog}
                handlerOk={confirmDelete}
                handleClose={() => setShowDeleteDialog(false)}
                loading={dialogLoading}
                text={`${t('confirmDelete')}${t('reward')}: ${deleteData?.name}?`}
            />
            <ConfirmModal
                open={showDeleteAllDialog}
                handlerOk={confirmDeleteAll}
                handleClose={() => setShowDeleteAllDialog(false)}
                loading={dialogLoading}
                text={`${t('confirmDelete')}${t('all')}${t('reward')}?`}
            />
            <ConfirmModal
                open={showDeleteMutipleDialog}
                handlerOk={confirmDeleteMutiple}
                handleClose={() => setShowDeleteMutipleDialog(false)}
                loading={dialogLoading}
                text={`${t('confirmDelete')}${t('selected')}${t('reward')}?`}
            />
            <FileUploadModal open={showImportDialog} handleClose={handleCloseImport} />
        </div>
    );
}
