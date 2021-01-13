/**
 * Created on 12/20/20 by jovialis (Dylan Hanson)
 **/

/**
 * Client Rendering Stuff
 */
import {useQuery, gql} from '@apollo/client';
import {Paper, Container, Typography, Link, Chip, Avatar, Divider} from "@material-ui/core";
import * as dayjs from "dayjs";
import NavigationBar from "../../../components/NavigationBar";

function GovernmentPage({government}) {
    return <div>
        <NavigationBar/>
        <Container>
            <Typography variant={"h1"}>
                {government.name}
            </Typography>
            {government.archived && (
                <Paper>
                    <Typography variant={"h2"}>
                        Archived
                    </Typography>
                    <Typography variant={"body1"}>
                        This Government is archived, and its petitions can no longer be signed or modified.
                    </Typography>
                </Paper>
            )}
            <Typography variant={"h3"}>
                Top Petitions
            </Typography>
            <Typography variant={"body1"}>
                These are the most signed petitions during {government.name}.
            </Typography>
            {government.petitions.map(p => (
                <div>
                    <Link href={`/petition/${p.uid}`}>
                        <Typography variant={"h5"}>
                            {p.name}
                        </Typography>
                    </Link>
                    <Typography variant={"body1"}>
                        {p.signatureCount} Signatures
                    </Typography>
                    <Chip
                        size={"medium"}
                        avatar={<Avatar src={p.creator.thumbnail} alt={p.creator.name[0]}/>}
                        label={p.creator.name}
                    />
                    <Divider/>
                </div>
            ))}
        </Container>
    </div>
}

/**
 * SSR Stuff
 */
import {forServer} from "../../../utils/createApolloClient";
import {useEffect, useState} from "react";
const client = forServer();

export async function getStaticPaths() {
    // Query to get all Government UIDs to prerender
    const LIST_GOVERNMENTS = gql`
        query ListGovernments {
            governments {
                uid
            }
        }
    `;

    try {
        const res = await client.query({
            query: LIST_GOVERNMENTS
        });

        const paths = res.data.governments.map(g => ({
            params: { governmentId: g.uid }
        }));

        return {
            paths: paths,
            fallback: true
        };
    } catch (e) {
        throw e;
    }
}

export async function getStaticProps(context) {
    // Query to Get the Government Details
    const GET_GOVERNMENT = gql`
        query GetGovernment($id: ID) {
            government(id: $id) {
                uid
                name
                current
                archived
                petitions {
                    uid
                    name
                    createdOn
                    signatureCount
                    creator {
                        thumbnail
                        name
                    }
                }
            }
        }
    `;

    // Pull out the Government UID
    let governmentId = (context.params && context.params.governmentId) || null;

    // Queries GQL for Government data.
    const res = await client.query({
        query: GET_GOVERNMENT,
        variables: {
            id: governmentId
        }
    });

    // Resolve with Government data
    const government = res.data.government;
    if (!government) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            government
        },
        revalidate: 1 // Regenerate a maximum of once per second
    };
}

export default GovernmentPage;