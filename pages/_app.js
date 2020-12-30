import '../styles/globals.css'

import React from 'react';
import Head from "next/head";
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme';
import {forClient} from "../utils/createApolloClient";

const client = forClient();

export default function App({ Component, pageProps }) {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>DoreBells</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                {/* ApolloProvider hook for quick, easy GraphQL compilation */}
                <ApolloProvider client={client}>
                    <Component {...pageProps} />
                </ApolloProvider>
            </ThemeProvider>
        </React.Fragment>
    );
}