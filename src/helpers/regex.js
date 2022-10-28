export const passwordRegex = (password) => {
    return /^[a-z0-9]{8,50}$/i.test(password);
};

export const usernameRegex = (username) => {
    return /^[a-z0-9]{8,50}$/i.test(username);
};

export const emailRegex = (email) => {
    return /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
    );
};
