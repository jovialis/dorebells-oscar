/**
 * Created on 12/18/20 by jovialis (Dylan Hanson)
 **/

import {gql, useQuery} from "@apollo/client";
import {useEffect, useState} from "react";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Link,
    ListItemAvatar,
    Toolbar,
    Typography
} from "@material-ui/core";
import {AccountCircle} from "@material-ui/icons";

import NextLink from 'next/link';

const GetMe = gql`
    query GetMe {
        me {
            name
            thumbnail
            email
            roles {
                name
            }
        }
    }
`;

export default function NavigationBar() {
    const [load, setLoad] = useState(false);

    const { loading, error, data } = useQuery(GetMe, {
        skip: !load
    });

    useEffect(() => {
        setLoad(true);
    }, []);

    return (
        <AppBar position={"static"} elevation={0}>
            <Toolbar variant={"dense"}>
                <Box clone flexGrow={1}>
                    <Typography variant={"h6"}>
                        <Link href={"/"} color={"textPrimary"}>
                            DoreBells
                        </Link>
                    </Typography>
                </Box>

                {loading && (
                    <CircularProgress disableShrink/>
                )}

                {(data && data.me) && (
                    <Avatar src={data.me.thumbnail} alt={data.me.name[0]}/>
                )}

                {(error || (data && !data.me)) && (
                    <Link href={'/account/login'}>
                        <Button startIcon={<AccountCircle/>} variant={"outlined"}>
                            Login
                        </Button>
                    </Link>
                )}
            </Toolbar>
        </AppBar>
    );
}