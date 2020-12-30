/**
 * Created on 12/22/20 by jovialis (Dylan Hanson)
 **/

import {
    Avatar,
    Box, Button, Chip, CircularProgress,
    Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid, Snackbar, SnackbarContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import {gql, useMutation, useQuery} from "@apollo/client";
import {useState} from "react";
import {Field, Form, Formik} from "formik";
import {Create} from "@material-ui/icons";
import {TextField} from "formik-material-ui";

export default function TabRoles({government}) {
    const { loading, error, data } = useQuery(gql`
        query ListRoles($id: ID!) {
            government(id: $id) {
                roles {
                    uid
                    name
                    permissions
                }
            }
        }
    `, {
        variables: {id: government.uid}
    });

    // Whether or not to show the signing dialogue
    const [showCreate, setShowCreate] = useState(false);

    return <Container>
        <Box m={"2rem 0"}>
            {data && (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <Button color={"primary"} variant={"outlined"} onClick={() => setShowCreate(true)}>
                                Create Role
                            </Button>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Display As</TableCell>
                                <TableCell>Permissions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.government.roles.map(r => <TableRow>
                                <TableCell>{r.name}</TableCell>
                                <TableCell><Chip size={"small"} label={r.name}/></TableCell>
                                <TableCell>{r.permissions.map(p => (
                                    <Chip label={p}/>
                                ))}</TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {loading && (
                <CircularProgress/>
            )}
        </Box>
        <CreateRoleDialog
            open={showCreate}
            onClose={() => setShowCreate(false)}
            government={government}
        />
        <Snackbar open={!!error} autoHideDuration={3000}>
            <SnackbarContent
                message={'Something went wrong.'}
            />
        </Snackbar>
    </Container>
}


function CreateRoleDialog({open, onClose, government}) {
    const [signPetition, {loading, error, data}] = useMutation(gql`
        mutation CreateRole($government: ID!, $input: CreateRoleRequest!) {
            createRole(government: $government, input: $input) {
                uid
                name
                permissions
            }
        }
    `);

    const submit = ({name}, {setSubmitting}) => {
        // Reflect submitting status in the form
        setSubmitting(true);

        signPetition({
            variables: {
                government: government.uid,
                input: {
                    name
                }
            }
        }).then(() => {
            onClose();
        }).catch(err => {
            console.log(err);
        })
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <Formik
                initialValues={{
                    name: null
                }}
                onSubmit={submit}
            >
                {({ submitForm, isSubmitting }) => (
                    <Form>
                        <DialogTitle>Create Role</DialogTitle>
                        <DialogContent>
                            <Box m={"1rem 0"}>
                                <Field
                                    id={"name"}
                                    component={TextField}
                                    name="name"
                                    label="Role Name"
                                    multiline={false}
                                    variant={"outlined"}
                                    fullWidth
                                />
                            </Box>
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
                                    <span>Create</span>
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
        </Dialog>
    );
}