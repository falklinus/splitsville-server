import User from '../../models/User.js'
import expenseResolver from './expenses.js'
import userResolver from './users.js'
import groupResolver from './groups.js'
import Expense from '../../models/Expense.js'

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
  Group: {
    members: async (parent) =>
      await User.find({
        _id: { $in: parent.members },
      }),
    expenses: async (parent) =>
      await Expense.find({
        _id: { $in: parent.expenses },
      }),
    createdBy: async (parent) => await User.findById(parent.createdBy),
  },
  Query: {
    ...expenseResolver.Query,
    ...groupResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...expenseResolver.Mutation,
    ...groupResolver.Mutation,
  },
}
