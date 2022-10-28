export const roleName = (role, t) => {
    switch (role) {
        case 0:
            return t('admin');
        case 1:
            return t('manager');
        case 2:
            return t('visitor');

        default:
            break;
    }
};

export const permissionHandler = (role) => {
    switch (role) {
        case 0:
            return ['admin', 'dashboard', 'user', 'reward', 'winning', 'luckyDraw', 'setting', 'action'];
        case 1:
            return ['dashboard', 'user', 'reward', 'winning', 'luckyDraw', 'setting', 'action'];
        case 2:
            return ['dashboard', 'user', 'reward', 'winning', 'luckyDraw', 'setting'];
        default:
            return ['dashboard'];
    }
};
