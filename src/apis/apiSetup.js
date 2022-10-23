// To do >>>>> add a file in apis folder root apiSetup.js
// to detect REACT_APP_ENV if local, (use js method, window.location.hostname)
// then get the url from local, else get the url from the real url

import axios from 'axios';

export const urlDeterminator = () => {
    let env = process.env.REACT_APP_ENV;
    let endpoint = `REACT_APP_API_${env.toUpperCase()}_URL`;

    return process.env[endpoint];
};

export const apiUrl = urlDeterminator();

export const fetcher = async (url, method = 'GET', data = {}) => {
    try {
        const auth = localStorage.getItem('auth');
        const token = JSON.parse(auth)?.state?.token;
        const result = await axios({
            method,
            url: `${apiUrl}${url}`,
            data,
            headers: { 'Content-Type': 'application/json', 'x-access-token': token },
        });

        return {
            ...result?.data,
        };
    } catch (err) {
        if (err.response.data.message === 'Unauthorized' || err.response.data.message === 'No token provided') {
            window.location.href = '/login';
            localStorage.clear();
            return null;
        }
    }
};
