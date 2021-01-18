/**
 * Created on 1/18/21 by jovialis (Dylan Hanson)
 **/

import {forServer} from '../../../utils/createApolloClient';
import React, {useState} from "react";
import {gql, useMutation} from "@apollo/client";

import Link from "../../../components/Link";
import NavigationBar from "../../../components/NavigationBar";

import {
    Avatar,
    Box,
    Button, Chip,
    Container, Divider,
    Grid, IconButton,
    LinearProgress,
    makeStyles,
    Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tooltip,
    Typography
} from "@material-ui/core";
import {AccountBalance, ThumbUp, ThumbUpAltOutlined, TrendingUp} from "@material-ui/icons";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import contrast from "../../../utils/createColorContrast";
dayjs.extend(relativeTime);

const useStyles = makeStyles(theme => ({
    title: {
        display: 'inline',
        backgroundColor: theme.palette.text.primary,
        color: theme.palette.background.paper,
        'box-decoration-break': 'clone',
    },
    tray: {
        backgroundColor: theme.palette.grey['100']
    },
    progress: {
        height: theme.spacing(0.4),
        backgroundColor: theme.palette.grey['300']
    },
    trendingIcon: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        display: 'inline-flex',
        alignItems: 'center',
        padding: theme.spacing(0.4),
        borderRadius: theme.spacing(200)
    }
}));

export default function Petition({ petition }) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <NavigationBar/>
            <Paper
                className={classes.tray}
                variant={"elevation"}
                elevation={0}
            >
                <Container maxWidth={"md"}>
                    <Box pt={10}>
                        <Box mb={3}>
                            <Grid alignItems={"center"} container>
                                <Box flexGrow={1} clone>
                                    <Grid item>
                                        <Link href={`/government/${ petition.government.uid }`}>
                                            <Chip
                                                icon={<AccountBalance/>}
                                                label={petition.government.name}
                                                size={"small"}
                                                onClick={() => {}}
                                            />
                                        </Link>
                                    </Grid>
                                </Box>
                                <Grid item>
                                    <Tooltip title={'Trending'} arrow>
                                        <Box className={classes.trendingIcon}>
                                            <TrendingUp fontSize={"small"}/>
                                        </Box>
                                    </Tooltip>
                                </Grid>

                            </Grid>
                        </Box>
                        <Box px={2} pb={0.9} clone>
                            <Typography
                                variant={"h1"}
                                className={classes.title}
                            >
                                {petition.name}
                            </Typography>
                        </Box>
                        <Box py={3} pt={4}>
                            <Grid
                                justify={"space-between"}
                                alignItems={"center"}
                                container
                            >
                                <Grid item>
                                    <Typography variant={'h3'}>
                                        {petition.signatureCount} Signature{ petition.signatureCount !== 1 && 's'}
                                    </Typography>
                                    <Typography variant={'h6'}>
                                        <span>Let's get to {petition.signatureGoal}!</span>
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Button
                                        color={"primary"}
                                        variant={"contained"}
                                        disableElevation
                                    >
                                        Sign This Petition
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
                <LinearProgress
                    className={classes.progress}
                    variant={"determinate"}
                    value={(petition.signatureCount / petition.signatureGoal) * 100}
                />
            </Paper>
            <Container maxWidth={"md"}>
                <Box py={4}>
                    {function() {
                        const [tab, setTab] = useState(0);

                        const tabs = [
                            <AboutTab petition={petition}/>,
                            <CommentsTab petition={petition}/>,
                            <SignaturesTab petition={petition}/>
                        ]

                        return <React.Fragment>
                            <Tabs
                                value={tab}
                                onChange={(_e, v) => setTab(v)}
                            >
                                <Tab label={'About'} disableRipple/>
                                <Tab label={(
                                    <Grid container alignItems={"center"} justify={"center"}>
                                        <Grid item>
                                            <Box mr={1} clone>
                                                <span>Comments</span>
                                            </Box>
                                        </Grid>
                                        <Grid item>
                                            <Chip
                                                label={petition.commentCount}
                                                size={"small"}
                                                color={petition.commentCount > 0 ? 'primary' : undefined}
                                            />
                                        </Grid>
                                    </Grid>
                                )} disableRipple/>
                                <Tab label={(
                                    <Grid container alignItems={"center"} justify={"center"}>
                                        <Grid item>
                                            <Box mr={1} clone>
                                                <span>Signatures</span>
                                            </Box>
                                        </Grid>
                                        <Grid item>
                                            <Chip
                                                label={petition.signatureCount}
                                                size={"small"}
                                                color={petition.signatureCount > 0 ? 'primary' : undefined}
                                            />
                                        </Grid>
                                    </Grid>
                                )} disableRipple/>
                            </Tabs>
                            <Divider />
                            <Box pt={4}>
                                {tabs[tab]}
                            </Box>
                        </React.Fragment>
                    }()}
                </Box>
            </Container>
        </React.Fragment>
    );
}

function AboutTab({petition}) {
    const aboutStyles = makeStyles(theme => ({
        contextBar: {
            backgroundColor: theme.palette.grey[100],
        }
    }));

    const styles = aboutStyles();

    return <React.Fragment>
        <Paper variant={"outlined"} className={styles.contextBar}>
            <Box px={3} py={2}>
                <Typography variant={'h5'}>
                    Started by <Link href={'#'}>{petition.creator.name}</Link> and addressed to <Link href={'#'}>{petition.target.name}</Link>.
                </Typography>
                <Typography variant={'h6'}>
                    {dayjs(petition.createdOn).fromNow()}
                </Typography>
            </Box>
        </Paper>
        <Box pt={3}>
            <Typography variant={"body1"}>
                {petition.description}
            </Typography>
        </Box>
    </React.Fragment>
}

function CommentsTab({petition}) {
    return <React.Fragment>
        {petition.comments.map(c => {
            const [comment, setComment] = useState(c);

            const [likeComment] = useMutation(gql`
                mutation LikeComment($id: ID!) {
                    likeSignature(signature: $id) {
                        user {
                            uid
                            name
                            email
                            thumbnail
                            roles {
                                name
                                color
                            }
                        }
                        comment
                        createdOn
                        uid 
                        likeCount
                        canLike
                    }
                }
            `);

            function doLike() {
                if (!comment.canLike || !comment.mutable) {
                    return;
                }

                likeComment({
                    variables: {
                        id: comment.uid
                    }
                }).then(res => {
                    setComment(res.data.likeSignature);
                }).catch(err => {
                    console.log(err);
                });
            }

            return <Box py={2}>
                <Grid item container direction={"row"} spacing={2}>
                    <Grid item>
                        <Avatar src={comment.user.thumbnail} alt={comment.user.name[0]}/>
                    </Grid>
                    <Grid item xs>
                        <Typography variant={"h5"}>
                            {comment.user.name}
                        </Typography>
                        <Typography variant={"h6"}>
                            {dayjs(comment.createdOn).fromNow()}
                        </Typography>
                        <Box mt={2} mb={1}>
                            <Typography variant={"body2"}>
                                {comment.comment}
                            </Typography>
                        </Box>
                        <Typography variant={"body1"}>
                            <IconButton color={"secondary"} edge={"start"} onClick={doLike}>
                                {comment.canLike ? (
                                    <ThumbUpAltOutlined fontSize={"small"}/>
                                ) : (
                                    <ThumbUp fontSize={"small"}/>
                                )}
                            </IconButton>
                            <span>{comment.likeCount}</span>
                        </Typography>

                    </Grid>
                </Grid>
            </Box>
        })}
    </React.Fragment>
}

function SignaturesTab({petition}) {
    const signatureStyles = makeStyles(theme => ({
        headerCell: {
            ...theme.typography.h5,
            fontSize: theme.spacing(2)
        },
        contentCell: {
            ...theme.typography.body1
        }
    }));

    const styles = signatureStyles();

    return <TableContainer>
        <Table size={"small"}>
            <TableHead>
                <TableRow>
                    <TableCell className={styles.headerCell}>Signatory</TableCell>
                    <TableCell className={styles.headerCell} align={"right"}>Time</TableCell>
                    <TableCell className={styles.headerCell} align={"right"}>Referred By</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {petition.signatures.map(s => <TableRow key={s.uid}>
                    <TableCell className={styles.contentCell}>
                        {/*<Avatar src={s.user.thumbnail} alt={s.user.name[0]}/>*/}
                        {s.user.name}
                    </TableCell>
                    <TableCell align={"right"} className={styles.contentCell}>
                        {dayjs(s.createdOn).fromNow()}
                    </TableCell>
                    <TableCell align={"right"} className={styles.contentCell}>
                        {s.referrer && s.referrer.user.name}
                    </TableCell>
                </TableRow>)}
            </TableBody>
        </Table>
    </TableContainer>
}

// Returns Petition data for a given Petition
export async function getStaticProps(context) {
    try {
        const client = forServer();
        const res = await client.query({
            query: gql`
            query GetPetition($id: ID!) {
                petition(id: $id) {
                    uid
                    name
                    description
                    canSign
                    mutable
                    creator {
                        uid
                        name
                        email
                        thumbnail
                        roles {
                            name
                        }
                    }
                    government {
                        uid
                        name
                        current
                    }
                    target {
                        uid
                        name
                        government {
                            name
                        }
                    }
                    tags {
                        uid
                        name
                        government {
                            name
                        }
                    }
                    createdOn
                    signatureCount
                    signatureGoal
                    signatures {
                        user {
                            uid
                            name
                            email
                            thumbnail
                            roles {
                                name
                                color
                            }
                        }
                        createdOn
                        uid
                    }
                    commentCount
                    comments {
                        user {
                            uid
                            name
                            email
                            thumbnail
                            roles {
                                name
                                color
                            }
                        }
                        comment
                        createdOn
                        uid 
                        likeCount
                        canLike
                    }
                }
            }
        `,
            variables: {
                id: context.params.petitionId
            }
        });

        const petition = res.data.petition;
        return {
            props: {
                petition
            }
        };
    } catch (e) {
        console.log(e);
        throw e;
    }

}

// Returns a list of Petition IDs to pre-render
export async function getStaticPaths() {
    try {
        const client = forServer();
        const res = await client.query({
            query: gql`
            query ListPetitions {
                petitions {
                    uid
                }
            }
        `
        });

        const paths = res.data.petitions.map(p => ({
            params: { petitionId: p.uid }
        }));

        return {
            paths: paths,
            fallback: true
        };
    } catch (e) {
        console.log(e);
        throw e;
    }
}