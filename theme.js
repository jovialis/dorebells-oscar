/**
 * Created on 12/14/20 by jovialis (Dylan Hanson)
 **/

import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

const defaults = createMuiTheme();

// Create a theme instance.
const theme = createMuiTheme({
    fontFamily: "catamaran, nunito-sans, neue-haas-unica, sans-serif",
    shape: {
        borderRadius: 1
    },
    palette: {
        primary: {
            main: '#FF9D00',
            contrastText: "#FFFFFF"
        },
        secondary: {
            main: '#000000',
            contrastText: "#FFFFFF"
        },
        text: {
            primary: '#000000'
        }
    },
    typography: (palette => ({
        h1: {
            fontFamily: "neue-haas-unica, sans-serif",
            fontWeight: 800,
            lineHeight: 'inherit',

            fontSize: "3rem",
            [defaults.breakpoints.down('sm')]: {
                fontSize: '2rem'
            },
            [defaults.breakpoints.down('xs')]: {
                fontSize: '1.5rem'
            }
        },
        h2: {
            fontFamily: "neue-haas-unica, sans-serif",
            fontWeight: 800,

            fontSize: "2.5rem",
            [defaults.breakpoints.down('sm')]: {
                fontSize: '1.5rem'
            },
            [defaults.breakpoints.down('xs')]: {
                fontSize: '1.2rem'
            }
        },
        h3: {
            fontFamily: "neue-haas-unica, sans-serif",
            fontWeight: 800,

            fontSize: "1.5rem",
            [defaults.breakpoints.down('sm')]: {
                fontSize: '1rem'
            },
            [defaults.breakpoints.down('xs')]: {
                fontSize: '1rem'
            }
        },
        h4: {
            fontFamily: "nunito-sans, sans-serif",
            fontWeight: 800,
            fontStyle: 'italic',

            fontSize: "1.2rem",
            [defaults.breakpoints.down('sm')]: {
                fontSize: '1rem'
            },
            [defaults.breakpoints.down('xs')]: {
                fontSize: '0.9rem'
            }
        },
        h5: {
            fontFamily: "nunito-sans, sans-serif",
            fontWeight: 800,
            fontStyle: 'italic',

            fontSize: "1.1rem",
            [defaults.breakpoints.down('sm')]: {
                fontSize: '0.9rem'
            },
            [defaults.breakpoints.down('xs')]: {
                fontSize: '0.8rem'
            }
        },
        h6: {
            fontFamily: "catamaran, sans-serif",
            fontWeight: 100,

            fontSize: "1.1rem",
            [defaults.breakpoints.down('sm')]: {
                fontSize: '0.9rem'
            },
            [defaults.breakpoints.down('xs')]: {
                fontSize: '0.8rem'
            }
        },
        body1: {
            fontFamily: "catamaran, sans-serif",
            fontWeight: 400,

            fontSize: "1.1rem",
            lineHeight: "2.1rem",
            [defaults.breakpoints.down('sm')]: {
                fontSize: '1rem'
            }
        },
        body2: {
            fontFamily: "catamaran, sans-serif",
            fontWeight: 400,

            fontSize: "1rem",
            [defaults.breakpoints.down('sm')]: {
                fontSize: '0.9rem'
            }
        },
        button: {
            fontFamily: "nunito-sans, sans-serif",
            fontWeight: 800,
            fontStyle: 'italic',

            lineHeight: defaults.spacing(0.25),
            fontSize: '0.9rem'
        },
        label: {
            fontFamily: "nunito-sans, sans-serif",
            fontWeight: 800,
            fontStyle: 'italic',
        }
    })),

});
export default theme;