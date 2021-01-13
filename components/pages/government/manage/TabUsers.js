/**
 * Created on 12/22/20 by jovialis (Dylan Hanson)
 **/

import {gql, useQuery} from "@apollo/client";
import {useState} from "react";
import {
    Box,
    Button, Chip, CircularProgress,
    Container, Snackbar, SnackbarContent,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import contrast from "../../../../utils/createColorContrast";

export default function TabUsers({government}) {
    const { loading, error, data } = useQuery(gql`
        query ListMembers($id: ID!) {
            government(id: $id) {
                members {
                    uid
                    email
                    name
                    roles(government: $id) {
                        name
                        uid
                        color
                    }
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
            <Typography variant={"body1"}>
                Control which users possess which roles in this government.
            </Typography>
            {data && (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Roles</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.government.members.map(m => <TableRow>
                                <TableCell>{m.name}</TableCell>
                                <TableCell>{m.email}</TableCell>
                                <TableCell>
                                    {m.roles.map(r => <Chip
                                        size={"small"}
                                        label={r.name}
                                        style={{backgroundColor: r.color, color: contrast(r.color)}}
                                    />)}
                                </TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {loading && (
                <CircularProgress/>
            )}
        </Box>
        <Snackbar open={!!error} autoHideDuration={3000}>
            <SnackbarContent
                message={'Something went wrong.'}
            />
        </Snackbar>
    </Container>
}