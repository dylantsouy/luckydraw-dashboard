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

export const editUser = async (props) => {
    const { id } = props;
    const { data, success } = await fetcher(`/users/${id}`, 'PUT', props);
    return { success, data };
};

export const createUser = async (props) => {
    const { data, success } = await fetcher(`/users`, 'POST', props);
    return { success, data };
};

export const deleteUser = async (id) => {
    const { data, success } = await fetcher(`/users/${id}`, 'DELETE', {});
    return { success, data };
};