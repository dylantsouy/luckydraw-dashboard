import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import PropTypes from 'prop-types';
import { useTranslation } from 'langs/useTranslation';

export default function ResultModal(props) {
    const { t } = useTranslation('common');
    const { open, handleClose, resultData } = props;

    return (
        <Dialog className='ResultModal' open={open} onClose={() => handleClose()}>
            <DialogTitle>
                <span className='title-text'>{t('winning')}</span>
            </DialogTitle>
            <DialogContent>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton className='header'>
                            <ListItemText primary={t('code')} />
                            <ListItemText primary={t('name')} />
                        </ListItemButton>
                    </ListItem>
                    {resultData?.winning?.map((e) => (
                        <ListItem disablePadding key={e?.id}>
                            <ListItemButton>
                                <ListItemText primary={e?.code} />
                                <ListItemText primary={e?.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>{t('cancel')}</Button>
            </DialogActions>
        </Dialog>
    );
}

ResultModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    resultData: PropTypes.any,
};
