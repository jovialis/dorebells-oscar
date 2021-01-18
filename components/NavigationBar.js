/**
 * Created on 12/18/20 by jovialis (Dylan Hanson)
 **/

import React from "react";
import {gql, useQuery} from "@apollo/client";
import {useEffect, useState} from "react";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Link,
    ListItemAvatar, makeStyles, Menu, MenuItem,
    Toolbar,
    Typography
} from "@material-ui/core";
import {AccountCircle, AddBoxOutlined, PlusOneRounded} from "@material-ui/icons";

import NextLink from 'next/link';
import {useRouter} from "next/router";

const withStyles = makeStyles(theme => ({
    charterBar: {
        minHeight: theme.spacing(2)
    },
    charter: {
        fontSize: theme.spacing(1.3)
    },
    navigationBar: {
        backgroundColor: theme.palette.secondary.main,
    },
    siteTitle: {
        color: theme.palette.secondary.contrastText
    }
}))

export default function NavigationBar() {
    const router = useRouter();
    const classes = withStyles();

    const [load, setLoad] = useState(false);

    const { loading, error, data } = useQuery(gql`
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
    `, {
        skip: !load
    });

    useEffect(() => {
        setLoad(true);
    }, []);

    const [menuAnchor, setMenuAnchor] = useState(null);

    return (
        <AppBar position={"static"} elevation={0}>
            <Toolbar variant={"dense"} className={classes.charterBar}>
                <Box clone flexGrow={1}>
                    <Typography variant={"h5"} className={classes.charter}>
                        VANDERBILT UNIVERSITY STUDENT GOVERNMENT
                    </Typography>
                </Box>
            </Toolbar>
            <Toolbar className={classes.navigationBar}>
                <Box clone flexGrow={1}>
                    <Typography variant={"h3"} >
                        <Link href={"/"} className={classes.siteTitle}>
                            DoreBells
                        </Link>
                    </Typography>
                </Box>

                {loading && (
                    <CircularProgress disableShrink/>
                )}

                {(data && data.me) && (
                    <React.Fragment>
                        <Box mr={2}>
                            <Link href={'/petition/create'}>
                                <Button
                                    variant={'outlined'}
                                    size={"medium"}
                                    color={"primary"}
                                    startIcon={<AddBoxOutlined/>}
                                >
                                    New Petition
                                </Button>
                            </Link>
                        </Box>
                        <Avatar
                            src={data.me.thumbnail}
                            alt={data.me.name[0]}
                            onClick={e => setMenuAnchor(e.target)}
                        />
                        <Menu
                            open={Boolean(menuAnchor)}
                            anchorEl={menuAnchor}
                            onClose={() => setMenuAnchor(null)}
                        >
                            <MenuItem onClick={() => {
                                router.push('/account/logout')
                            }}>Logout</MenuItem>
                        </Menu>
                    </React.Fragment>
                )}

                {(error || (data && !data.me)) && (
                    <Link href={`/account/login?callback=${ router.asPath }`}>
                        <Button
                            color={"primary"}
                            startIcon={<AccountCircle/>}
                            variant={"outlined"}
                        >
                            Login
                        </Button>
                    </Link>
                )}
            </Toolbar>
        </AppBar>
    );
}