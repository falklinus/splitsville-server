import { model, Schema } from 'mongoose'

const groupSchema = new Schema({
  title: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  expenses: [{ type: Schema.Types.ObjectId, ref: 'expenses' }],
  createdAt: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
})

export default model('Group', groupSchema)
