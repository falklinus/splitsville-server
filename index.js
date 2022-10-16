import { ApolloServer } from 'apollo-server'
import mongoose from 'mongoose'

import { MONGODB } from './config.js'
import typeDefs from './graphql/typeDefs.js'
import resolvers from './graphql/resolvers/index.js'
import cors from 'cors'

const server = new ApolloServer({
  cors: {
    origin: cors<cors.CorsRequest>({ origin: ['https://splitsville.netlify.app/', 'https://studio.apollographql.com'] }),
  },
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
})

mongoose.connect(MONGODB, { useNewUrlParser: true }).then(() => {
  console.log('MongoDB connected')
  return server
    .listen({ port: 3001 })
    .then((res) => console.log(`Server running at ${res.url}`))
})
