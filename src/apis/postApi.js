import { fetcher } from './apiSetup';

export const loginApi = async ({ username, password }) => {
    const { data, success, token } = await fetcher('/signin', 'POST', {
        username,
        password,
    });

    return { success, data, token };
};

export const fetchUserList = async () => {
    const { success, data } = await fetcher('/users', 'get', {});

    return { success, data };
};
