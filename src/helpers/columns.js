export const userColumn = (t) => {
    return [
        {
            field: 'code',
            filterable: false,
            headerName: t('code'),
            minWidth: 141,
        },
        {
            field: 'name',
            filterable: false,
            headerName: t('name'),
            minWidth: 141,
        },
        {
            field: 'createdAt',
            filterable: false,
            headerName: t('createdAt'),
            minWidth: 241,
        },
    ];
};
