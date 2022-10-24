import { fetcher, percentageFetcher } from './apiSetup';

export const fetchRewardList = async () => {
    const { success, data } = await fetcher('/rewards', 'get', {});

    return { success, data };
};

export const deleteReward = async (id) => {
    const { data, success } = await fetcher(`/rewards/${id}`, 'DELETE', {});
    return { success, data };
};

export const deleteAllRewards = async () => {
    const { data, success } = await fetcher(`/rewards/deleteAll`, 'POST', {});
    return { success, data };
};

export const deleteRewards = async (ids) => {
    const { data, success } = await fetcher(`/rewards/deleteRewards`, 'POST', { ids });
    return { success, data };
};

export const uploadRewards = async (props, setPercentTage) => {
    const formData = new FormData();
    formData.append('file', props?.file);
    formData.append('name', props?.name);
    
    const { data, success } = await percentageFetcher(`/rewards`, 'POST', formData, setPercentTage);
    return { success, data };
};
