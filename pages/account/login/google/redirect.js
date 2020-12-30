/**
 * Created on 12/17/20 by jovialis (Dylan Hanson)
 **/

import {useRouter} from "next/router";
import {Box, CircularProgress, Grid, Snackbar, SnackbarContent, Typography} from "@material-ui/core";
import {useEffect, useState} from "react";
import axios from "axios";

export default function GoogleLoginRedirectPage() {
    const router = useRouter();
    const [error, setError] = useState(false);
    const [didFetch, setDidFetch] = useState(false);

    useEffect(() => {
        if (didFetch || Object.keys(router.query).length === 0) {
            return;
        }

        setDidFetch(true);

        axios.get('/api/auth/login/google', {
            params: router.query
        }).then(_res => {
            console.log('Logged in user');
            router.push('/account');
        }).catch(err => {
            console.log(err);
            setError(true);
        })
    }, [router]);

    return (
        <div>
            <Box height={"100vh"} width={1} clone>
                <Grid
                    alignItems={"center"}
                    justify={"center"}
                    container
                >
                    <CircularProgress/>
                </Grid>
            </Box>
            <Snackbar open={error}>
                <SnackbarContent
                    message={'Uh Oh! Something went wrong logging you in. Please try again.'}
                />
            </Snackbar>
        </div>
    );
}