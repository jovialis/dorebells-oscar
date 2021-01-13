/**
 * Created on 12/30/20 by jovialis (Dylan Hanson)
 **/

import {useEffect, useState} from "react";
import {useQuery, gql, useMutation} from "@apollo/client";
import NavigationBar from "../../../components/NavigationBar";
import {
    Box, Button,
    Card, Chip,
    CircularProgress,
    Container, FormControl,
    Grid, InputLabel, MenuItem,
    Paper, Select,
    Snackbar,
    SnackbarContent, TextField,
    Typography
} from "@material-ui/core";
import {useRouter} from "next/router";

export default function CreatePetitionPage() {
    const [load, setLoad] = useState(false);

    const { loading, error, data } = useQuery(gql`
        query GetTargetsAndTags {
            government {
                uid
                name
            }
            tags {
                uid
                name
            }
            targets {
                uid
                name
            }
        }
    `, {
        skip: !load
    });

    useEffect(() => {
        setLoad(true);
    });

    return (
        <div className={"page-create-petition"}>
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
                    <RenderPage
                        government={data.government}
                        tags={data.tags}
                        targets={data.targets}
                    />
                )}
                <Snackbar
                    open={!!error}
                    autoHideDuration={3000}
                >
                    <SnackbarContent
                        message={'Something went wrong.'}
                    />
                </Snackbar>
            </Container>
        </div>
    );
}

function RenderPage({ government, targets, tags }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [target, setTarget] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    function selectTag(uid) {
        if (selectedTags.includes(uid)) {
            console.log(`Removing ${uid}`);
            selectedTags.splice(selectedTags.indexOf(uid), 1)
            console.log(selectedTags);
            setSelectedTags([...selectedTags]);
        } else if (selectedTags.length < 5) {
            setSelectedTags([uid, ...selectedTags]);
        }
    }

    function selected(uid) {
        return selectedTags.includes(uid);
    }

    const [createPetition, {loading, error}] = useMutation(gql`
        mutation CreatePetition($request: CreatePetitionRequest!) {
            createPetition(input: $request) {
                uid
                name
            }
        }
    `)

    const router = useRouter();

    function submit() {
        createPetition({
            variables: {
                request: {
                    name: title,
                    description,
                    target,
                    tags: selectedTags
                }
            }
        }).then(res => {
            const uid = res.data.createPetition.uid;
            console.log(`Created petition ${ uid }. Redirecting...`);
            router.push(`/petition/${ uid }`);
        }).catch(err => {
            console.log(err);
        });
    }

    return <Box p={"2rem 0"}>
        <Typography variant={"h1"}>
            Create Petition
        </Typography>
        <Paper variant={"outlined"}>
            <Typography variant={"h6"}>
                {government.name}
            </Typography>
        </Paper>
        <Box p={"1rem 0"}>
            <Typography variant={"h5"}>
                Petition Title
            </Typography>
            <TextField
                variant={"outlined"}
                label={'Petition Title'}
                onChange={e => setTitle(e.target.value)}
                fullWidth
            />
        </Box>
        <Box p={"1rem 0"}>
            <Typography variant={"h5"}>
                Description
            </Typography>
            <TextField
                variant={"outlined"}
                label={'Petition Description'}
                onChange={e => setDescription(e.target.value)}
                multiline
                rows={4}
                fullWidth
            />
        </Box>
        <Box p={"1rem 0"}>
            <Typography variant={"h5"}>
                Target
            </Typography>
            <Typography variant={"body2"}>
                Who is the petition addressed to?
            </Typography>
            <FormControl>
                <InputLabel id="demo-simple-select-label">Target</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={e => setTarget(e.target.value)}
                >
                    {targets.map(t => <MenuItem value={t.uid}>{t.name}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>
        <Box p={"1rem 0"}>
            <Typography variant={"h5"}>
                Tags
            </Typography>
            <Typography variant={"body2"}>
                Select up to five tags.
            </Typography>
            {tags.map(t => <li>
                <Chip
                    label={t.name}
                    onClick={() => selectTag(t.uid)}
                    variant={selected(t.uid) ? "default" : "outlined"}
                    // onDelete={data.label === 'React' ? undefined : handleDelete(data)}
                    // className={classes.chip}
                />
            </li>)}
        </Box>
        <p>Title: {title}</p>
        <p>Description: {description}</p>
        <p>Target: {target}</p>
        <p>Tags: {selectedTags.join(', ')}</p>
        <Button
            variant={"contained"}
            onClick={submit}
        >Submit</Button>
    </Box>
}