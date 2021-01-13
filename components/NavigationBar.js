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
    ListItemAvatar, Menu, MenuItem,
    Toolbar,
    Typography
} from "@material-ui/core";
import {AccountCircle} from "@material-ui/icons";

import NextLink from 'next/link';
import {useRouter} from "next/router";

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

    const [menuAnchor, setMenuAnchor] = useState(null);

    const router = useRouter();

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

                {(data && data.me) && ([
                    <Link href={'/petition/create'}>
                        <Button variant={'contained'}>
                            New Petition
                        </Button>
                    </Link>,
                    <Box>
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
                    </Box>
                ])}

                {(error || (data && !data.me)) && (
                    <Link href={`/account/login?callback=${ router.pathname }`}>
                        <Button startIcon={<AccountCircle/>} variant={"outlined"}>
                            Login
                        </Button>
                    </Link>
                )}
            </Toolbar>
        </AppBar>
    );
}