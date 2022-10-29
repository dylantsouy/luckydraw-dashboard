import { fetcher, percentageFetcher } from './apiSetup';

export const fetchRewardList = async () => {
    const { success, data } = await fetcher('/rewards', 'GET', {});

    return { success, data };
};

export const fetchNoWinningsRewards = async () => {
    const { success, data } = await fetcher('/rewards/getNoWinningsRewards', 'POST', {});

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
    formData.append('order', props?.order);
    formData.append('count', props?.count);

    const { data, success } = await percentageFetcher(`/rewards`, 'POST', formData, setPercentTage);
    return { success, data };
};

export const editReward = async (props) => {
    const { id } = props;
    const { data, success } = await fetcher(`/rewards/${id}`, 'PUT', props);
    return { success, data };
};

export const createAdditionalReward = async (props) => {
    const { data, success } = await fetcher(`/rewards/createAdditionalReward`, 'POST', props);
    return { success, data };
};

export const getRewardCount = async () => {
    const { success, data } = await fetcher('/rewards/count', 'POST', {});

    return { success, data };
};

export const updateWinningResult = async (props) => {
    const { id, winning } = props;
    const { data, success } = await fetcher(`/rewards/updateWinningResult/${id}`, 'POST', { winning });
    return { success, data };
};
