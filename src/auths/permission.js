export const permissionHandler = (role) => {
    switch (role) {
        case 0:
            return ['dashboard', 'user', 'reward', 'admin', 'winning', 'luckyDraw'];
        default:
            return ['dashboard', 'user', 'reward', 'admin', 'winning', 'luckyDraw'];
    }
};
