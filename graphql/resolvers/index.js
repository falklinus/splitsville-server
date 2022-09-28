import User from '../../models/User.js'
import expenseResolver from './expenses.js'
import userResolver from './users.js'

export default {
  Expense: {
    paidBy: async (parent) => await User.findById(parent.paidBy),
    createdBy: async (parent) => await User.findById(parent.createdBy),
    shares: (parent) =>
      parent.shares.map(async (s) => ({
        share: s.share,
        user: await User.findById(s.user),
      })),
  },
  Query: {
    ...expenseResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...expenseResolver.Mutation,
  },
}
