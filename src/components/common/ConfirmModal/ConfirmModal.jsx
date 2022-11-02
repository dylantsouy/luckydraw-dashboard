import { Button, Modal } from '@mui/material';
import React from 'react';
import './styles.scss';
import { useTranslation } from 'langs/useTranslation';
import ConfirmButton from '../ConfirmButton';
import { useStore } from 'store/store';

export default function ConfirmModal() {
    const { t } = useTranslation('common');
    const { showModal, modalHandler, modalText, noModalBtn, modalLoading, closeModal } = useStore();

    const handleClose = () => {
        closeModal();
    };
    const handlerOk = () => {
        modalHandler();
    };

    return (
        <Modal className='confirmModal-wrapper' open={showModal} onClose={handleClose}>
            <div className='container'>
                <div className='content'>{modalText}</div>
                {!noModalBtn && (
                    <div className='footer'>
                        <ConfirmButton
                            loading={modalLoading}
                            variant='contained'
                            onClick={handlerOk}
                            text={t('confirm')}
                        />
                        <Button onClick={() => handleClose()} role='cancelButton'>
                            {t('cancel')}
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
}
