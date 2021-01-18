module.exports = {
    rewrites: () => [
        { source: '/api/gql', destination: process.env.GRAPHQL_URL }
    ]
}