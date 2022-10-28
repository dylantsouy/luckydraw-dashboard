import { fetcher, percentageFetcher } from './apiSetup';

export const fetchSetting = async () => {
    const { success, data } = await fetcher('/settings', 'get', {});

    return { success, data };
};

export const editSetting = async (props, setPercentTage) => {
    const formData = new FormData();
    formData.append('file', props?.file);
    formData.append('title', props?.title);
    formData.append('subTitle', props?.subTitle);
    formData.append('bgColor', props?.bgColor);
    formData.append('textColor', props?.textColor);

    const { data, success } = await percentageFetcher(`/settings/update`, 'POST', formData, setPercentTage);
    return { success, data };
};
