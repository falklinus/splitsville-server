import {config} from 'dotenv'

config()

const mongoKey = process.env.MONGO_KEY || 'mongoKey'
const jwtSecretKet = process.env.JWT_SECRET_KEY || 'jwtSecretKet'

export const MONGODB =
    `mongodb+srv://falklinus:${mongoKey}@splitsville.rklyhra.mongodb.net/splitsville?retryWrites=true&w=majority`

export const JWT_SECRET_KEY = jwtSecretKet
