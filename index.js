import {ApolloServer} from 'apollo-server'
import {connect} from 'mongoose'

import {MONGODB} from './config.js'
import typeDefs from './graphql/typeDefs.js'
import resolvers from './graphql/resolvers/index.js'
import cors from 'cors'

const server = new ApolloServer({
    cors: {
        origin: cors({origin: ['http://127.0.0.1:5173/', 'https://splitsville.netlify.app', 'https://studio.apollographql.com']}),
    },
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
