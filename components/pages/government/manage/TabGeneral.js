/**
 * Created on 12/21/20 by jovialis (Dylan Hanson)
 **/

import {gql, useQuery} from "@apollo/client";
import {Button, Container, Grid, TextField, Box, Typography} from "@material-ui/core";

export default function ManageGovernmentTabGeneral({government}) {
    return <Container>
        <Box p={"1rem 0"}>
            <Grid container direction={"column"} spacing={5}>
                <Grid item container direction={"row"} spacing={10} alignItems={"flex-end"}>
                    <Box flexGrow={1} clone>
                        <Grid item>
                            <Typography variant={"h6"}>
                                Government Name
                            </Typography>
                            <TextField value={government.name} variant={"outlined"} fullWidth/>
                        </Grid>
                    </Box>
                    <Grid item>
                        <Button color={"primary"} variant={"contained"}>
                            Save
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container direction={"row"} spacing={10} alignItems={"flex-end"}>
                    <Box flexGrow={1} clone>
                        <Grid item>
                            <Typography variant={"h6"}>
                                Government Name
                            </Typography>
                            <TextField value={government.name} variant={"outlined"} fullWidth/>
                        </Grid>
                    </Box>
                    <Grid item>
                        <Button color={"primary"} variant={"contained"}>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </Container>
}