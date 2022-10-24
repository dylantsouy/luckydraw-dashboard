import { fetcher } from './apiSetup';

export const fetchAdminList = async () => {
    const { success, data } = await fetcher('/admins', 'get', {});

    return { success, data };
};

export const editAdmin = async (props) => {
    const { id } = props;
    const { data, success } = await fetcher(`/admins/${id}`, 'PUT', props);
    return { success, data };
};

export const createAdmin = async (props) => {
    const { data, success } = await fetcher(`/admins`, 'POST', props);
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
