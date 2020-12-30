import {ApolloClient, InMemoryCache} from "@apollo/client";

/**
 * Created on 12/20/20 by jovialis (Dylan Hanson)
 **/

export function forClient() {
    return new ApolloClient({
        uri: '/api/gql',
        cache: new InMemoryCache(),
        credentials: 'include'
    });
}

export function forServer() {
    return new ApolloClient({
        uri: 'http://localhost:5000/graphql',
        cache: new InMemoryCache(),
        credentials: 'include'
    });
}