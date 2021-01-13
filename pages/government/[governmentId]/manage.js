/**
 * Created on 12/21/20 by jovialis (Dylan Hanson)
 **/

/**
 * Client Rendering Stuff
 */
import {useQuery, gql} from '@apollo/client';

import NavigationBar from "../../../components/NavigationBar";
import {
    Box,
    CircularProgress,
    Container,
    Grid,
    Snackbar,
    SnackbarContent,
    Tab,
    Tabs,
    Typography
} from "@material-ui/core";

function ManageGovernmentPage({user, government}) {
    const [tab, setTab] = useState(0);
    const tabs = [
        <TabGeneral government={government}/>,
        <TabRoles government={government}/>,
        <TabUsers government={government}/>,
        <TabTargets government={government}/>,
        <TabTags government={government}/>,
    ];

    return <div className={'page-government-manage'}>
        <NavigationBar/>
        <Container>
            <Typography variant={"h1"}>{government.name}</Typography>
            <Tabs
                value={tab}
                onChange={(_e, v) => setTab(v)}
            >
                <Tab label={"General"}/>
                <Tab label={"Roles"}/>
                <Tab label={"Users"}/>
                <Tab label={"Targets"}/>
                <Tab label={"Tags"}/>
            </Tabs>
            <div>
                {tabs[tab]}
            </div>

            <Snackbar open={!!false} autoHideDuration={3000}>
                <SnackbarContent
                    message={'Something went wrong.'}
                />
            </Snackbar>
        </Container>
    </div>
}

/**
 * SSR Stuff
 */
import {forServer} from "../../../utils/createApolloClient";
import {useState} from "react";
import TabGeneral from "../../../components/pages/government/manage/TabGeneral";
import TabRoles from "../../../components/pages/government/manage/TabRoles";
import TabTargets from "../../../components/pages/government/manage/TabTargets";
import TabTags from "../../../components/pages/government/manage/TabTags";
import TabUsers from "../../../components/pages/government/manage/TabUsers";
const client = forServer();

export async function getServerSideProps(context) {
    const governmentId = context.query.governmentId;

    // Authentication cookie
    const authToken = context.req.cookies['auth.id'];

    // Query to get all Government UIDs to prerender
    const GET_ME_AND_GOV = gql`
        query GetMeAndGovernment($id: ID) {
            government(id: $id) {
                uid
                name
            }
            me {
                uid
                name
                email
            }
        }
    `;

    try {
        const res = await client.query({
            query: GET_ME_AND_GOV,
            variables: {
                id: governmentId
            },
            context: {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        });

        if (!res.data.government) {
            // Government not found
            return {
                notFound: true
            };
        } else if (!res.data.me) {
            // User not logged in
            return {
                redirect: {
                    destination: '/account/login',
                    permanent: false
                }
            };
        }

        return {
            props: {
                government: res.data.government,
                user: res.data.me
            }
        };
    } catch (e) {
        throw e;
    }
}

export default ManageGovernmentPage;