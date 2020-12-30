module.exports = {
    rewrites: () => [
        { source: '/api/gql', destination: 'http://localhost:5000/graphql' }
    ]
}