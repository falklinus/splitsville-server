import { model, Schema } from 'mongoose'

const expenseSchema = new Schema({
  title: String,
  amount: Number,
  createdAt: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  paidBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  shares: [
    {
      share: Number,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  ],
})

export default model('Expense', expenseSchema)
