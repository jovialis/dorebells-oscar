
/**
 * Created on 12/20/20 by jovialis (Dylan Hanson)
 **/

import {ApolloClient, InMemoryCache} from "@apollo/client";

export function forClient() {
    return new ApolloClient({
        uri: '/api/gql',
        cache: new InMemoryCache(),
        credentials: 'include'
    });
}

export function forServer() {
    return new ApolloClient({
        uri: process.env.GRAPHQL_URL,
        cache: new InMemoryCache(),
        credentials: 'include'
    });
}