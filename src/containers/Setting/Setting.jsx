import { Button, InputAdornment, Skeleton, TextField } from '@mui/material';
import { editSetting } from 'apis/settingApi';
import DropUploadNoName from 'components/common/DropUploadNoName';
import { useTranslation } from 'langs/useTranslation';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './styles.scss';
import { useAuthStore } from 'store/auth';
import useSetting from 'hooks/useSetting';

export default function Setting() {
    const { t } = useTranslation('common');
    const { permissionArray } = useAuthStore();
    const { enqueueSnackbar } = useSnackbar();
    const { data: settingData, isLoading, mutate } = useSetting();
    const [formData, setFormData] = useState({
        bgColor: '',
        title: '',
        subTitle: '',
        background: '',
        textColor: '',
    });
    const [loading, setLoading] = useState(false);

    const [percentage, setPercentage] = useState(0);
    const [file, setFile] = useState([]);
    const [validation, setValidation] = useState({
        file: { valid: true, error: '' },
    });

    const handleChange = (type, e) => {
        if ((type === 'bgColor' || type === 'textColor') && e.length === 7) {
            return;
        }
        setValidation({
            file: { valid: true, error: '' },
        });
        setFormData((prevFormData) => ({
            ...prevFormData,
            [type]: e,
        }));
    };

    const confirm = async () => {
        if (!permissionArray?.includes('action')) {
            enqueueSnackbar(t('noPermission'), { variant: 'error' });
            return;
        }
        let data = {
            id: formData.id,
            background: formData.background.trim(),
            title: formData.title.trim(),
            subTitle: formData.subTitle.trim(),
            bgColor: formData.bgColor.trim(),
            textColor: formData.textColor.trim(),
            file: file?.file,
        };
        setLoading(true);
        try {
            let result = await editSetting(data, setPercentage);
            if (result.success) {
                enqueueSnackbar(t('editSuccess'), { variant: 'success' });
                mutate();
                setFile([]);
                setPercentage(0);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (err.message === 'File size over 1MB') {
                enqueueSnackbar(t('FileSizeOver'), { variant: 'error' });
                return;
            }
            enqueueSnackbar(t('editFailed'), { variant: 'error' });
        }
    };

    useEffect(() => {
        if (settingData) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                bgColor: settingData.bgColor || '',
                title: settingData.title || '',
                subTitle: settingData.subTitle || '',
                background: settingData.background || '',
                textColor: settingData.textColor || '',
            }));
        }
    }, [settingData]);

    return (
        <>
            <div className='setting-wrapper'>
                <div className='content'>
                    <div className='setting-items'>
                        <div className='setting-item'>
                            <div className='label'>{t('bgColor')}</div>
                            <div className='color-picker'>
                                <input
                                    type='color'
                                    disabled={isLoading}
                                    value={`#${formData?.bgColor}`}
                                    className='colorInput'
                                    onChange={(e) => handleChange('bgColor', e.target.value?.slice(1))}
                                />
                                <TextField
                                    id='input-with-icon-textfield'
                                    label=''
                                    disabled={isLoading}
                                    value={formData?.bgColor}
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>#</InputAdornment>,
                                    }}
                                    onChange={(e) => handleChange('bgColor', e.target.value)}
                                    variant='standard'
                                />
                            </div>
                        </div>
                        <div className='setting-item'>
                            <div className='label'>{t('textColor')}</div>
                            <div className='color-picker'>
                                <input
                                    type='color'
                                    disabled={isLoading}
                                    value={`#${formData?.textColor}`}
                                    className='colorInput'
                                    onChange={(e) => handleChange('textColor', e.target.value?.slice(1))}
                                />
                                <TextField
                                    id='input-with-icon-textfield'
                                    label=''
                                    disabled={isLoading}
                                    value={formData?.textColor}
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>#</InputAdornment>,
                                    }}
                                    onChange={(e) => handleChange('textColor', e.target.value)}
                                    variant='standard'
                                />
                            </div>
                        </div>
                        <div className='setting-item'>
                            <div className='label'>{t('title')}</div>
                            <TextField
                                fullWidth
                                id='input-with-icon-textfield'
                                label=''
                                disabled={isLoading}
                                value={formData?.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                variant='standard'
                            />
                        </div>
                        <div className='setting-item'>
                            <div className='label'>{t('subTitle')}</div>
                            <TextField
                                fullWidth
                                id='input-with-icon-textfield'
                                label=''
                                disabled={isLoading}
                                value={formData?.subTitle}
                                onChange={(e) => handleChange('subTitle', e.target.value)}
                                variant='standard'
                            />
                        </div>
                    </div>

                    <div className='setting-items'>
                        <div className='setting-item'>
                            <div className='label'>{t('background')}</div>
                            {isLoading ? (
                                <Skeleton variant='rounded' height={200} />
                            ) : !formData?.background ? (
                                <div className='background-img'>{t('noRaws')}</div>
                            ) : (
                                <Zoom>
                                    <div className='background-img'>
                                        <LazyLoadImage
                                            alt={'background'}
                                            height={'100%'}
                                            width={'100%'}
                                            effect='blur'
                                            src={formData?.background}
                                        />
                                    </div>
                                </Zoom>
                            )}
                            <div className='upload-area'>
                                <DropUploadNoName
                                    setAddData={setFile}
                                    setError={setValidation}
                                    validation={validation}
                                    percentage={percentage}
                                    setPercentage={setPercentage}
                                    accept={{
                                        'image/*': ['.jpeg', '.png', '.gif', '.webp'],
                                    }}
                                    acceptWarn={t('imageAccept')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='action'>
                    <Button
                        variant='contained'
                        onClick={confirm}
                        color='third'
                        className='mt-5 mb-5'
                        disabled={isLoading || loading}
                    >
                        {t('confirmEdit')}
                    </Button>
                </div>
            </div>
        </>
    );
}
