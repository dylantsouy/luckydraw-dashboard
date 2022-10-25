import { fetcher } from './apiSetup';

export const fetchWinningList = async () => {
    const { success, data } = await fetcher('/winnings', 'get', {});

    return { success, data };
};

export const deleteWinning = async (id) => {
    const { data, success } = await fetcher(`/winnings/${id}`, 'DELETE', {});
    return { success, data };
};

export const deleteAllWinnings = async () => {
    const { data, success } = await fetcher(`/winnings/deleteAll`, 'POST', {});
    return { success, data };
};

export const deleteWinnings = async (ids) => {
    const { data, success } = await fetcher(`/winnings/deleteWinnings`, 'POST', { ids });
    return { success, data };
};
