import { model, Schema } from 'mongoose'

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  ],
})

export default model('User', userSchema)
