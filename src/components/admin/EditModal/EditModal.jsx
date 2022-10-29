import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import PropTypes from 'prop-types';
import { useTranslation } from 'langs/useTranslation';
import { useSnackbar } from 'notistack';
import { editAdmin } from 'apis/adminApi';
import ConfirmButton from 'components/common/ConfirmButton';
import { emailRegex, usernameRegex } from 'helpers/regex';
import { roleName } from 'auths/roleHandler';

export default function EditModal(props) {
    const { t } = useTranslation('common');
    const { open, handleClose, editData, setEditData } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [validation, setValidation] = useState({
        username: { valid: true, error: '' },
        email: { valid: true, error: '' },
    });

    const handleChange = (type, e) => {
        setValidation({
            username: { valid: true, error: '' },
            email: { valid: true, error: '' },
        });
        setEditData((prevState) => ({
            ...prevState,
            [type]: e.target.value,
        }));
    };

    useEffect(() => {
        if (open) {
            setValidation({
                username: { valid: true, error: '' },
                email: { valid: true, error: '' },
            });
        }
    }, [open]);

    const confirmHandler = async () => {
        let data = {
            id: editData.id,
            username: editData.username.trim(),
            email: editData.email.trim(),
            role: editData.role,
        };
        if (data.username.length === 0 || data.email.length === 0) {
            setValidation({
                username: { valid: !!data.username, error: data.username.length === 0 ? t('required') : '' },
                email: { valid: !!data.email, error: data.email.length === 0 ? t('required') : '' },
            });
            return;
        }
        if (!usernameRegex(data.username) || !emailRegex(data.email)) {
            setValidation({
                username: {
                    valid: usernameRegex(data.username),
                    error: !usernameRegex(data.username) ? t('regexError') : '',
                },
                email: { valid: emailRegex(data.email), error: !emailRegex(data.email) ? t('regexError') : '' },
            });
            return;
        }
        setLoading(true);
        try {
            let result = await editAdmin(data);
            if (result.success) {
                enqueueSnackbar(t('update') + t('success'), { variant: 'success' });
                handleClose(true);
                setLoading(false);
            }
        } catch (err) {
            enqueueSnackbar(t('update') + t('failed'), { variant: 'error' });
            setLoading(false);
        }
    };

    return (
        <Dialog className='editDialog' open={open} onClose={() => handleClose()}>
            <DialogTitle>
                <span className='title-text'>
                    {t('edit')}
                    {t('admin')}
                </span>
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin='dense'
                    label={t('username')}
                    type='text'
                    required
                    autoFocus
                    value={editData.username}
                    fullWidth
                    variant='standard'
                    onChange={(e) => handleChange('username', e)}
                />
                <TextField
                    margin='dense'
                    label={t('email')}
                    type='text'
                    value={editData.email}
                    fullWidth
                    required
                    error={!validation.email.valid}
                    helperText={validation.email.error}
                    variant='standard'
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            confirmHandler();
                        }
                    }}
                    onChange={(e) => handleChange('email', e)}
                />
                <FormControl className='mt-6' fullWidth>
                    <InputLabel id='role-select-label'>{t('role')}</InputLabel>
                    <Select
                        labelId='role-select-label'
                        id='role-select'
                        variant='outlined'
                        value={editData.role}
                        label='role'
                        onChange={(e) => handleChange('role', e)}
                    >
                        <MenuItem value={0}>{roleName(0, t)}</MenuItem>
                        <MenuItem value={1}>{roleName(1, t)}</MenuItem>
                        <MenuItem value={2}>{roleName(2, t)}</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <ConfirmButton variant='contained' onClick={confirmHandler} loading={loading} text={t('confirm')} />
                <Button onClick={() => handleClose()}>{t('cancel')}</Button>
            </DialogActions>
        </Dialog>
    );
}

EditModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    editData: PropTypes.object.isRequired,
    setEditData: PropTypes.func.isRequired,
};
