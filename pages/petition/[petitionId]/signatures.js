/**
 * Created on 12/18/20 by jovialis (Dylan Hanson)
 **/

import {useQuery, gql} from '@apollo/client';
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import NavigationBar from "../../../components/NavigationBar";
import {
    Avatar,
    Box, Breadcrumbs, Button,
    Card, CardActions,
    CardContent, Chip,
    CircularProgress,
    Container, Divider,
    Grid, Link, List, ListItem, ListItemAvatar, ListItemText,
    Snackbar,
    SnackbarContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography
} from "@material-ui/core";
import {KeyboardArrowRightSharp} from "@material-ui/icons";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


export default function SignaturesPage() {
    const router = useRouter();
    const {petitionId} = router.query;

    const [load, setLoad] = useState(false);

    const { loading, error, data } = useQuery(gql`
        query GetPetitionSignatures($id: ID!) {
            petition(id: $id) {
                uid
                name
                createdOn
                mutable
                creator {
                    name
                    thumbnail
                }
                target {
                    name
                }
                signatureCount
                signatures {
                    uid
                    createdOn
                    user {
                        name
                        thumbnail
                    }
                }
                signatureGoal
                government {
                    uid
                    name
                }
            }
        }
    `, {
        variables: {id: petitionId},
        skip: !load
    });

    useEffect(() => {
        if (petitionId) {
            setLoad(true);
        }
    }, [router.query]);

    return (
        <div className={'page-petition-signatures'}>
            <NavigationBar/>
            <Container>
                {loading && (
                    <Box>
                        <Grid container justify={"center"}>
                            <Grid item hidden={!loading}>
                                <CircularProgress/>
                            </Grid>
                        </Grid>
                    </Box>
                )}
                {data && (
                    <RenderPage petition={data.petition}/>
                )}
                <Snackbar open={!!error} autoHideDuration={3000}>
                    <SnackbarContent
                        message={'Something went wrong.'}
                    />
                </Snackbar>
            </Container>
        </div>
    )
}

function RenderPage({petition}) {
    const router = useRouter();

    return (
        <Box p={"2rem 0"}>
            <Breadcrumbs separator={<KeyboardArrowRightSharp fontSize={"small"}/>}>
                <Link color={"inherit"} href={'/'} onClick={() => router.push('/')}>
                    DoreBells
                </Link>
                <Link
                    color={"inherit"}
                    href={`/government/${petition.government.uid}`}
                    onClick={(e) => {
                        e.preventDefault();
                        router.push(`/government/${petition.government.uid}`)
                    }}
                >
                    {petition.government.name}
                </Link>
                <Link
                    color={"inherit"}
                    href={`/petition/${petition.uid}`}
                    onClick={(e) => {
                        e.preventDefault();
                        router.push(`/petition/${petition.uid}`)
                    }}
                >
                    Petition
                </Link>
                <Typography color={"textPrimary"}>Signatures</Typography>
            </Breadcrumbs>
            <Typography variant={'h2'}>
                {petition.name}
            </Typography>
            <Typography variant={"h6"}>
                <span>Started by </span>
                <Chip
                    avatar={<Avatar
                        src={petition.creator.thumbnail}
                        alt={petition.creator.name[0]}/>
                    }
                    color={"primary"}
                    label={petition.creator.name}
                />
                <span> and addressed to </span>
                <Chip
                    label={petition.target.name}
                    color={"secondary"}
                />
            </Typography>
            <Card variant={"outlined"}>
                <CardContent>
                    <Typography variant={"h4"}>
                        Signatures
                    </Typography>
                    <Box m={"1rem 0"}>
                        <Grid container>
                            <Grid item>
                                <Box m={"0 1rem 0 0"}>
                                    <CircularProgress
                                        variant={"determinate"}
                                        value={(petition.signatureCount / petition.signatureGoal) * 100}
                                    />
                                </Box>
                            </Grid>
                            <Grid item>
                                <Typography variant={"h6"}>
                                    {petition.signatureCount} Signatures
                                </Typography>
                                {petition.mutable && (
                                    <Typography variant={"body2"}>
                                        Let's get to {petition.signatureGoal}!
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Signatory</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Referred By</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {petition.signatures.map(s => <TableRow key={s.uid}>
                            <TableCell>
                                {/*<Avatar src={s.user.thumbnail} alt={s.user.name[0]}/>*/}
                                {s.user.name}
                            </TableCell>
                            <TableCell>
                                {dayjs(s.createdOn).fromNow()}
                            </TableCell>
                            <TableCell>

                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}