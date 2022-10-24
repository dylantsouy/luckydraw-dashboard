import { fetcher } from './apiSetup';

export const loginApi = async (props) => {
    const { data, success, token } = await fetcher('/signin', 'POST', props);
    return { success, data, token };
};

export const signupApi = async (props) => {
    const { data, success, token } = await fetcher('/signup', 'POST', props);
    return { success, data, token };
};
