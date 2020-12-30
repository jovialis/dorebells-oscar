/**
 * Created on 12/20/20 by jovialis (Dylan Hanson)
 **/

/**
 * Client Rendering Stuff
 */
import {useQuery, gql} from '@apollo/client';

function GovernmentPage({government}) {
    return <div>
        <h1>{government.name}</h1>
    </div>
}

/**
 * SSR Stuff
 */
import {forServer} from "../../../utils/createApolloClient";
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