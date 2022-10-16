import {ApolloServer} from 'apollo-server'
import {connect} from 'mongoose'

import {MONGODB} from './config.js'
import typeDefs from './graphql/typeDefs.js'
import resolvers from './graphql/resolvers/index.js'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req}),
})

connect(MONGODB, {useNewUrlParser: true}).then(() => {
    console.log('MongoDB connected')
    return server
        .listen({port: process.env.PORT || 3001})
        .then((res) => console.log(`Server running at ${res.url}`))
})
