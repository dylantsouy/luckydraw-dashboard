import { fetcher } from './apiSetup';

export const editAdmin = async (props) => {
    const { id } = props;
    const { data, success } = await fetcher(`/admins/${id}`, 'PUT', props);
    return { success, data };
};

export const createAdmin = async (props) => {
    const { data, success } = await fetcher(`/admins/createAdmin`, 'POST', props);
    return { success, data };
};

export const deleteAdmin = async (id) => {
    const { data, success } = await fetcher(`/admins/${id}`, 'DELETE', {});
    return { success, data };
};

export const deleteAllAdmins = async () => {
    const { data, success } = await fetcher(`/admins/deleteAll`, 'POST', {});
    return { success, data };
};

export const deleteAdmins = async (ids) => {
    const { data, success } = await fetcher(`/admins/deleteAdmins`, 'POST', { ids });
    return { success, data };
};

export const changePassword = async (props) => {
    const { data, success } = await fetcher(`/admins/updatePassword`, 'POST', props);
    return { success, data };
};
