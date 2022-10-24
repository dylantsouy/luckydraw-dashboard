import { fetcher, percentageFetcher } from './apiSetup';

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

export const deleteAllUsers = async () => {
    const { data, success } = await fetcher(`/users/deleteAll`, 'POST', {});
    return { success, data };
};

export const deleteUsers = async (ids) => {
    const { data, success } = await fetcher(`/users/deleteUsers`, 'POST', { ids });
    return { success, data };
};

export const uploadUsers = async (file, setPercentTage) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data, success } = await percentageFetcher(`/users/uploadUser`, 'POST', formData, setPercentTage);
    return { success, data };
};
