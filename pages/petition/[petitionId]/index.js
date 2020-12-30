/**
 * Created on 12/9/20 by jovialis (Dylan Hanson)
 **/

import {useQuery, gql, useMutation} from '@apollo/client';
import {useRouter} from "next/router";

import {Formik, Form, Field} from "formik";
import {
    AppBar,
    CircularProgress,
    Container,
    Grid,
    Snackbar,
    Toolbar,
    Typography,
    Alert,
    SnackbarContent,
    Button,
    Card,
    CardContent,
    Chip,
    CardActionArea,
    CardActions,
    Divider,
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText,
    List,
    Paper,
    GridList,
    ListSubheader,
    CardHeader,
    Link,
    Dialog,
    DialogTitle, DialogContent, DialogContentText, DialogActions, FormControlLabel, FormControl, FormGroup,
    Box, IconButton, Breadcrumbs,
} from "@material-ui/core";
import {useEffect, useState} from "react";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import NavigationBar from "../../../components/NavigationBar";
import {CheckBox, Comment, KeyboardArrowRightSharp, ThumbUp, ThumbUpAltOutlined} from "@material-ui/icons";
import {TextField} from "formik-material-ui";
import contrast from "../../../utils/createColorContrast";

const GET_DATA = gql`
    query GetMeAndPetition($id: ID!) {
        me {
            name,
            thumbnail,
            email,
            roles {
                name
            }
        }
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
`;

export default function Petition() {
    const router = useRouter();
    const {petitionId} = router.query;

    const [load, setLoad] = useState(false);

    const { loading, error, data } = useQuery(GET_DATA, {
        variables: {id: petitionId},
        skip: !load
    });

    useEffect(() => {
        if (petitionId) {
            setLoad(true);
        }
    }, [router.query]);

    return (
        <div className={"page-petition"}>
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
                    <RenderPage petition={data.petition} user={data.me}/>
                )}
                <Snackbar open={!!error} autoHideDuration={3000}>
                    <SnackbarContent
                        message={'Something went wrong.'}
                    />
                </Snackbar>
            </Container>
        </div>
    );
}

function RenderPage({petition, user}) {
    const router = useRouter();
    const isCurrentGovernment = petition.government.current;

    // Whether or not to show the signing dialogue
    const [showSign, setShowSign] = useState(false);

    return (
        <Box p={"2rem 0"}>
            {!isCurrentGovernment && (
                <Card elevation={0} variant={"outlined"}>
                    <CardContent>
                        <Typography variant={"h5"}>
                            Archived
                        </Typography>
                        <Typography variant={"body2"}>
                            This petition was created during the {petition.government.name} administration. It is archived and can no longer be signed or updated.
                        </Typography>
                    </CardContent>
                </Card>
            )}
            <Grid container spacing={10} alignItems={"flex-start"}>
                <Grid item container xs={12} sm={7} md={8} spacing={10} alignItems={"flex-start"}>
                    <Grid item xs={12}>
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
                            <Typography color={"textPrimary"}>Petition</Typography>
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
                        <Box m={"1rem 0"}>
                            <Typography variant={'body1'}>
                                {petition.description}
                            </Typography>
                        </Box>
                        <Box m={"1rem 0 0 -0.2rem"}>
                            {petition.tags.map(t => (
                                <Box clone m={"0.2rem"}>
                                    <Chip label={t.name}/>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={"h3"}>
                            Comments ({petition.commentCount})
                        </Typography>
                        <Box p={"1rem 0"} clone>
                            <Grid container spacing={6} direction={"column"} >
                                {petition.comments.map(s => <CommentSignature signature={s}/>)}
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={5} md={4}>
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
                            {petition.mutable && (
                                <Typography variant={"body2"}>
                                    Click below to sign this petition. Your name and email will be automatically associated.
                                </Typography>
                            )}
                        </CardContent>
                        {petition.mutable ? (
                            <CardActions>
                                {user ? (
                                    petition.canSign ? (
                                        <Button
                                            size={"large"}
                                            variant={"contained"}
                                            color={"primary"}
                                            disableElevation
                                            onClick={() => setShowSign(true)}
                                        >
                                            Add My Signature
                                        </Button>
                                    ) : (
                                        <Button
                                            size={"large"}
                                            variant={"contained"}
                                            color={"primary"}
                                            disableElevation
                                            disabled
                                        >
                                            Already Signed
                                        </Button>
                                    )
                                ) : (
                                    <Button
                                        size={"large"}
                                        color={"primary"}
                                        onClick={() => router.push('/account/login')}
                                    >
                                        Login to Sign
                                    </Button>
                                )}
                                <SignPetitionDialog
                                    open={showSign}
                                    onClose={() => setShowSign(false)}
                                    petition={petition}
                                    user={user}
                                />
                            </CardActions>
                        ) : (
                            <CardActions>
                                <Button
                                    size={"large"}
                                    variant={"contained"}
                                    color={"primary"}
                                    disableElevation
                                    disabled
                                >
                                    {petition.canSign ? "You did not sign." : "You signed."}
                                </Button>
                            </CardActions>
                        )}
                        {petition.signatureCount > 0 && ([
                            <Divider/>,
                            <CardContent>
                                <Typography variant={"h6"}>
                                    Recent Supporters
                                </Typography>
                                <List>
                                    {petition.signatures.slice(0, 3).map(s => (
                                        <ListItem disableGutters={true}>
                                            <ListItemAvatar>
                                                <Avatar src={s.user.thumbnail} alt={s.user.name[0]}/>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={s.user.name}
                                                secondary={dayjs(s.createdOn).fromNow()}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Typography variant={"body1"}>
                                    <Link href={"#"} onClick={(e) => {
                                        e.preventDefault();
                                        router.push(`/petition/${petition.uid}/signatures`)
                                    }}>
                                        And {petition.signatureCount - 3} more...
                                    </Link>
                                </Typography>
                            </CardContent>
                        ])}

                    </Card>
                </Grid>
            </Grid>


        </Box>
    );
}

function CommentSignature({signature: propSignature}) {
    const [signature, setSignature] = useState(propSignature);

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
        if (!signature.canLike || !signature.mutable) {
            return;
        }

        likeComment({
            variables: {
                id: signature.uid
            }
        }).then(res => {
            setSignature(res.data.likeSignature);
        }).catch(err => {
            console.log(err);
        });
    }

    return [
        <Grid item container direction={"row"} spacing={2}>
            <Grid item>
                <Avatar src={signature.user.thumbnail} alt={signature.user.name[0]}/>
            </Grid>
            <Grid item xs>
                <Typography variant={"h6"}>
                    {signature.user.name}
                    {signature.user.roles.map(r => (
                        <Chip
                            label={r.name}
                            size={"small"}
                            style={{backgroundColor: r.color, color: contrast(r.color)}}
                        />
                    ))}
                </Typography>
                <Typography variant={"body2"}>
                    {dayjs(signature.createdOn).fromNow()}
                </Typography>
                <Box p={"0.2rem 0"} clone>
                    <Typography variant={"body1"}>
                        {signature.comment}
                    </Typography>
                </Box>
                <Typography>
                    <IconButton color={"secondary"} edge={"start"} onClick={doLike}>
                        {signature.canLike ? (
                            <ThumbUpAltOutlined fontSize={"small"}/>
                        ) : (
                            <ThumbUp fontSize={"small"}/>
                        )}
                    </IconButton>
                    <span>{signature.likeCount}</span>
                </Typography>

            </Grid>
        </Grid>,
        <Divider variant={"inset"} />
    ];
}

function SignPetitionDialog({open, onClose, petition, user}) {
    const SIGN_PETITION = gql`
        mutation SignPetition($petition: ID!, $input: SignPetitionRequest!) {
            signPetition(petition: $petition, input: $input) {
                referralCode
            }
        }
    `;

    const [signPetition, {loading, error, data}] = useMutation(SIGN_PETITION);

    const submit = ({comment}, {setSubmitting}) => {
        // Reflect submitting status in the form
        setSubmitting(true);

        signPetition({
            variables: {
                petition: petition.uid,
                input: {
                    referer: null,
                    comment
                }
            }
        }).then(() => {
            setDidSign(true);
        }).catch(err => {
            console.log(err);
        })
    };

    const [didSign, setDidSign] = useState(false);

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            {didSign && (
                <div>
                    <DialogTitle>Thank You!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You just made a real difference.
                            Referral code: {data.signPetition.referralCode}
                        </DialogContentText>
                    </DialogContent>
                </div>
            )}
            {!didSign && (
                <Formik
                    initialValues={{
                        comment: null
                    }}
                    onSubmit={submit}
                >
                    {({ submitForm, isSubmitting }) => (
                        <Form>
                            <DialogTitle>Sign {petition.name}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    <span>Signing petition as </span>
                                    <Chip
                                        size={"medium"}
                                        avatar={<Avatar src={user.thumbnail} alt={user.name[0]}/>}
                                        label={user.name}
                                    />
                                </DialogContentText>

                                <Box m={"1rem 0"}>
                                    <Field
                                        component={TextField}
                                        name="comment"
                                        label="Leave a Comment"
                                        multiline={true}
                                        variant={"outlined"}
                                        fullWidth
                                    />
                                </Box>
                                <DialogContentText>
                                    By signing this petition, your name will be publicly available for all to see.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={onClose} color="primary">
                                    Cancel
                                </Button>
                                <Box clone position={"relative"}>
                                    <Button
                                        color="primary"
                                        variant={"contained"}
                                        onClick={submitForm}
                                        disabled={isSubmitting}
                                        disableElevation
                                    >
                                        <span>Sign</span>
                                        {isSubmitting && (
                                            <Box
                                                position={"absolute"}
                                                height={"100%"}
                                                width={"100%"}
                                                display={"flex"}
                                                alignItems={"center"}
                                                justifyContent={"center"}
                                            >
                                                <CircularProgress
                                                    size={24}
                                                />
                                            </Box>
                                        )}
                                    </Button>
                                </Box>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            )}
        </Dialog>
    );
}