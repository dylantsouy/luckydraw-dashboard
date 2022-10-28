import { Button, InputAdornment, TextField } from '@mui/material';
import { editSetting, fetchSetting } from 'apis/settingApi';
import DropUploadNoName from 'components/common/DropUploadNoName';
import { colorRegex } from 'helpers/regex';
import { useTranslation } from 'langs/useTranslation';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './styles.scss';
import Loading from 'components/common/Loading';
import HasPermission from 'auths/HasPermission';

export default function Dashboard() {
    const { t } = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [loadingAll, setLoadingAll] = useState(true);
    const [file, setFile] = useState([]);
    const [setting, setSetting] = useState({
        background: '',
        title: '',
        subTitle: '',
        bgColor: '',
        textColor: '',
    });
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
        setSetting((prevState) => ({
            ...prevState,
            [type]: e,
        }));
    };

    const confirm = async () => {
        let data = {
            id: setting.id,
            background: setting.background.trim(),
            title: setting.title.trim(),
            subTitle: setting.subTitle.trim(),
            bgColor: setting.bgColor.trim(),
            textColor: setting.textColor.trim(),
            file: file?.file,
        };
        setLoading(true);
        try {
            let result = await editSetting(data, setPercentage);
            if (result.success) {
                enqueueSnackbar(t('update') + t('success'), { variant: 'success' });
                getSetting();
                setFile([]);
                setPercentage(0);
                setLoading(false);
            }
        } catch (err) {
            enqueueSnackbar(t('update') + t('failed'), { variant: 'error' });
            setLoading(false);
        }
    };

    const getSetting = useCallback(async () => {
        try {
            setLoadingAll(true);
            let result = await fetchSetting();
            const { success, data } = result;
            if (success) {
                setSetting(data);
            }
            setLoadingAll(false);
        } catch (err) {
            enqueueSnackbar(t(err?.message), { variant: 'error' });
            setLoadingAll(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enqueueSnackbar]);

    useEffect(() => {
        getSetting();
    }, [getSetting]);

    return (
        <>
            {loadingAll ? (
                <Loading size={40} />
            ) : (
                <div className='setting-wrapper'>
                    <div className='content'>
                        <div className='setting-items'>
                            <div className='setting-item'>
                                <div className='label'>{t('bgColor')}</div>
                                <div className='color-picker'>
                                    <input
                                        type='color'
                                        disabled={loading}
                                        value={`#${setting.bgColor}`}
                                        className='colorInput'
                                        onChange={(e) => handleChange('bgColor', e.target.value?.slice(1))}
                                    />
                                    <TextField
                                        id='input-with-icon-textfield'
                                        label=''
                                        disabled={loading}
                                        value={setting.bgColor}
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
                                        disabled={loading}
                                        value={`#${setting.textColor}`}
                                        className='colorInput'
                                        onChange={(e) => handleChange('textColor', e.target.value?.slice(1))}
                                    />
                                    <TextField
                                        id='input-with-icon-textfield'
                                        label=''
                                        disabled={loading}
                                        value={setting.textColor}
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
                                    disabled={loading}
                                    value={setting.title}
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
                                    disabled={loading}
                                    value={setting.subTitle}
                                    onChange={(e) => handleChange('subTitle', e.target.value)}
                                    variant='standard'
                                />
                            </div>
                        </div>

                        <div className='setting-items'>
                            <div className='setting-item'>
                                <div className='label'>{t('background')}</div>
                                {!!setting.background && (
                                    <Zoom>
                                        <div className='background-img'>
                                            <LazyLoadImage
                                                alt={'background'}
                                                height={'100%'}
                                                effect='blur'
                                                src={setting.background}
                                                width={'100%'}
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
                        <HasPermission permission='action'>
                            <Button
                                variant='contained'
                                onClick={confirm}
                                color='third'
                                className='mt-5 mb-5'
                                disabled={loading}
                            >
                                {t('confirm')}
                                {t('edit')}
                            </Button>
                        </HasPermission>
                    </div>
                </div>
            )}
        </>
    );
}
