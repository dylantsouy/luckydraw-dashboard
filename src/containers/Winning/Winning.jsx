import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect, useCallback } from 'react';
import Loading from 'components/common/Loading';
import './styles.scss';
import { winningColumn } from 'helpers/columns';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'langs/useTranslation';
import ConfirmModal from 'components/common/ConfirmModal';
import { deleteAllWinnings, deleteWinning, deleteWinnings, fetchWinningList } from 'apis/winningApi';
import { Button, InputAdornment, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { Refresh, Search } from '@mui/icons-material';

export default function Winning() {
    const { t } = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();
    const [winningList, setWinningList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectRows, setSelectRows] = useState([]);
    const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
    const [showDeleteMutipleDialog, setShowDeleteMutipleDialog] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteData, setDeleteData] = useState({});
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const filterList = () => {
        return winningList.filter(
            (e) =>
                e?.User?.name.includes(searchValue) ||
                e?.User?.code.includes(searchValue) ||
                e?.Reward?.name.includes(searchValue)
        );
    };

    const onSelectionModelChange = (ids) => {
        setSelectRows(ids);
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
            let result = await deleteWinning(deleteData?.id);
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('deleteSuccess'), { variant: 'success' });
                setShowDeleteDialog(false);
                getWinningList();
            }
            setDialogLoading(false);
        } catch (err) {
            enqueueSnackbar(t('deleteFailed'), { variant: 'error' });
            setDialogLoading(false);
        }
    };

    const confirmDeleteMutiple = async () => {
        try {
            setDialogLoading(true);
            let result = await deleteWinnings(selectRows);
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('deleteSuccess'), { variant: 'success' });
                setShowDeleteMutipleDialog(false);
                setSelectRows([]);
                getWinningList();
            }
            setDialogLoading(false);
        } catch (err) {
            enqueueSnackbar(t('deleteFailed'), { variant: 'error' });
            setDialogLoading(false);
        }
    };

    const confirmDeleteAll = async () => {
        try {
            setDialogLoading(true);
            let result = await deleteAllWinnings();
            const { success } = result;
            if (success) {
                enqueueSnackbar(t('deleteSuccess'), { variant: 'success' });
                setShowDeleteAllDialog(false);
                getWinningList();
            }
            setDialogLoading(false);
        } catch (err) {
            enqueueSnackbar(t('deleteFailed'), { variant: 'error' });
            setShowDeleteAllDialog(false);
        }
    };

    const getWinningList = useCallback(async () => {
        try {
            setLoading(true);
            let result = await fetchWinningList();
            const { success, data } = result;
            if (success) {
                setWinningList(data);
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
        getWinningList();
    }, [getWinningList]);

    return (
        <div className='winning-wrapper'>
            <div className='container'>
                {!loading && (
                    <div className='action-area'>
                        <div className='left'>
                            {winningList?.length > 0 && (
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
                            <div className='refresh' onClick={getWinningList}>
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
                            rows={filterList(winningList)}
                            columns={winningColumn(t, deleteHandler)}
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
                text={`${t('confirmDelete')}?`}
            />
            <ConfirmModal
                open={showDeleteAllDialog}
                handlerOk={confirmDeleteAll}
                handleClose={() => setShowDeleteAllDialog(false)}
                loading={dialogLoading}
                text={`${t('confirmDeleteAllWinning')}?`}
            />
            <ConfirmModal
                open={showDeleteMutipleDialog}
                handlerOk={confirmDeleteMutiple}
                handleClose={() => setShowDeleteMutipleDialog(false)}
                loading={dialogLoading}
                text={`${t('confirmDeleteSelectedWinning')}?`}
            />
        </div>
    );
}
