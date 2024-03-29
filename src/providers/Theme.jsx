import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3B9974',
            contrastText: '#d0e6dd',
        },
        secondary: {
            main: '#fd7468',
            contrastText: '#ffe7dc',
        },
        third: {
            main: '#6ac1ff',
            contrastText: '#eaf2f4',
        },
        gray: {
            main: '#afafaf',
            contrastText: '#fff',
        },
    },
});

const Theme = (props) => {
    const { children } = props;

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
export default Theme;

Theme.propTypes = {
    children: PropTypes.element,
};
