// To do >>>>> add a file in apis folder root apiSetup.js
// to detect REACT_APP_ENV if local, (use js method, window.location.hostname)
// then get the url from local, else get the url from the real url

import axios from 'axios';

export const urlDeterminator = () => {
    return 'https://luckydraw-server.onrender.com/api';
};

export const apiUrl = urlDeterminator();

export const fetcher = async (url, method = 'GET', data = {}, company = false) => {
    try {
        const auth = localStorage.getItem('auth');
        const token = JSON.parse(auth)?.state?.token;
        const companyId = JSON.parse(auth)?.state?.user?.companyId;
        data.companyId = companyId;
        const result = await axios({
            method,
            url: `${apiUrl}${url}${company ? '/' + companyId : ''}`,
            data,
            headers: { 'Content-Type': 'application/json', 'x-access-token': token },
        });
        return {
            ...result?.data,
        };
    } catch (err) {
        if (err?.response?.data?.message === 'Unauthorized' || err?.response?.data?.message === 'No token provided') {
            localStorage.setItem('auth', null);
            window.location.reload();
        }
        throw new Error(err?.response?.data?.message);
    }
};

export const percentageFetcher = async (url, method = 'GET', data = {}, setPercentTage, company = false) => {
    try {
        const auth = localStorage.getItem('auth');
        const token = JSON.parse(auth)?.state?.token;
        const companyId = JSON.parse(auth)?.state?.user?.companyId;
        data.append('companyId', companyId);
        const result = await axios({
            method,
            url: `${apiUrl}${url}${company ? '/' + companyId : ''}`,
            data,
            headers: { 'Content-Type': 'application/json', 'x-access-token': token },
            onUploadProgress: (progressEvent) => {
                let num = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
                setPercentTage(num);
            },
        });

        return {
            ...result?.data,
        };
    } catch (err) {
        if (err?.response?.data?.message === 'Unauthorized' || err?.response?.data?.message === 'No token provided') {
            localStorage.setItem('auth', null);
            window.location.reload();
        }
        throw new Error(err?.response?.data?.message);
    }
};

export const swrFetcher = async (url, data, company = false) => {
    try {
        const auth = localStorage.getItem('auth');
        const token = JSON.parse(auth)?.state?.token;
        const companyId = JSON.parse(auth)?.state?.user?.companyId;

        const result = await axios.get(`${apiUrl}${url}${company ? '/' + companyId : ''}`, {
            headers: { 'Content-Type': 'application/json', 'x-access-token': token },
            params: data,
        });
        return result?.data;
    } catch (err) {
        if (err?.response?.data?.message === 'Unauthorized' || err?.response?.data?.message === 'No token provided') {
            localStorage.setItem('auth', null);
            window.location.reload();
        }
        throw new Error(err?.response?.data?.message);
    }
};

export const loadingHandler = (data, error) => {
    if (error) {
        return true;
    }
    if (data?.success) {
        return false;
    } else {
        if (data?.errors?.errMsg === 'No Record') {
            return false;
        } else {
            return true;
        }
    }
};
