/**
 * Created on 12/17/20 by jovialis (Dylan Hanson)
 **/
import {
    Box,
    Button,
    Card,
    CardHeader,
    Grid,
    Link,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography
} from "@material-ui/core";
import {useRouter} from "next/router";

export default function PageLogin() {
    const router = useRouter();

    return (
        <div>
            <Box width={1} height={"100vh"} clone>
                <Grid container justify={"center"} alignItems={"center"}>
                    <Grid item>
                        <Box p={'1rem 2rem'} clone>
                            <Paper>
                                <Typography variant={"h4"}>
                                    Login
                                </Typography>
                                <List>
                                    <ListItem>
                                        <Link href={`/account/login/google?callback=${router.query.callback && router.query.callback}`}>
                                            <Button color={"primary"}>
                                                Login w/ Google
                                            </Button>
                                        </Link>

                                    </ListItem>
                                </List>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}