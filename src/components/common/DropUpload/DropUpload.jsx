import React from 'react';
import './styles.scss';
import PropTypes from 'prop-types';
import { FileUploadSharp } from '@mui/icons-material';
import { useTranslation } from 'langs/useTranslation';
import { useDropzone } from 'react-dropzone';
import ProgressLinear from '../ProgressLinear';

export default function DropUpload(props) {
    const { setAddData, validation, setError, percentage, setPercentage, disabled, accept, acceptWarn } = props;
    const { t } = useTranslation('common');
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        // when upload to api need disabled for loading
        disabled: disabled,
        // upload event
        onDrop: (files) => {
            setPercentage(0);
            setError((prevState) => ({
                ...prevState,
                name: { valid: true, error: '' },
                file: { valid: true, error: '' },
            }));
            setAddData((prevState) => ({
                ...prevState,
                name: files[0]?.name?.split('.').slice(0, -1).join('.') || '',
                file: files[0],
            }));
        },
        // when close file upload dialog
        onFileDialogCancel: () => {
            setError((prevState) => ({
                ...prevState,
                file: { valid: true, error: '' },
            }));
            setAddData((prevState) => ({
                ...prevState,
                name: '',
                file: [],
            }));
        },
        // when upload file but rejected,ex: file format error
        onDropRejected: () => {
            setAddData((prevState) => ({
                ...prevState,
                name: '',
                file: [],
            }));
            setError((prevState) => ({
                ...prevState,
                file: { valid: false, error: t('fileTypeError') },
            }));
        },
        // accept format
        accept: accept,
    });
    // upload file layout
    const files = acceptedFiles.map((file) => (
        <div className='acceptedFile' key={file.path}>
            <FileUploadSharp color='primary' className={`${percentage ? 'uploading' : ''}`} />
            {file.path} - {file.size} bytes
        </div>
    ));

    return (
        <section className='dropArea'>
            <div
                {...getRootProps({
                    className: `dropzone ${!validation.file.valid ? 'warn' : ''} ${disabled ? 'disabled' : ''}`,
                })}
            >
                <input {...getInputProps()} />
                {acceptedFiles.length > 0 ? (
                    <div>
                        <div>{files}</div>
                        {percentage > 0 && <ProgressLinear value={percentage} />}
                    </div>
                ) : (
                    <div className='placeholder'>
                        <div className='placeholder-top'>
                            {t('DropFile')} <em className='third'>{t('clickToUpload')}</em>
                        </div>
                        <div className='placeholder-bottom'>
                            {t('onlyAccept')} <em className='third'>{acceptWarn}</em>
                        </div>
                        <div className='placeholder-bottom'>{t('FileSizeOver')}</div>
                    </div>
                )}
            </div>

            {!validation.file.valid && <div className='error'>{validation.file.error}</div>}
        </section>
    );
}

DropUpload.propTypes = {
    setAddData: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    validation: PropTypes.object.isRequired,
    percentage: PropTypes.number.isRequired,
    setPercentage: PropTypes.func.isRequired,
    accept: PropTypes.object,
    disabled: PropTypes.bool,
    acceptWarn: PropTypes.string,
};
