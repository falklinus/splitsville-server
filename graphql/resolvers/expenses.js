import { AuthenticationError, UserInputError } from 'apollo-server'
import { Expense, User } from '../../models/index.js'
import checkAuth from '../../util/checkAuth.js'

export default {
  Query: {
    getExpenses: async () => {
      try {
        const expenses = Expense.find()
        return expenses
      } catch (error) {
        throw new Error(error)
      }
    },
    getExpense: async (_, { expenseId }) => {
      try {
        const expense = await Expense.findById(expenseId)
        if (!expense) {
          throw new Error('Post not found')
        }
        return expense
      } catch (err) {
        throw new Error('Post not found')
      }
    },
  },
  Mutation: {
    createExpense: async (
      _,
      { createExpenseInput: { title, amount, paidBy, shares } },
      context
    ) => {
      const user = checkAuth(context)

      const error = {}

      if (isNaN(+amount) || amount <= 0) {
        error['amount'] = 'Amount not valid'
      }

      if (!title || title.trim() === '') {
        error['title'] = 'Title not valid'
      }

      if (Object.keys(error).length > 0) {
        throw new UserInputError('Error', { error })
      }

      const newExpense = new Expense({
        title: title ?? '',
        amount,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
        paidBy,
        shares,
      })
      const expense = await newExpense.save()
      return expense
    },
    deleteExpense: async (_, { expenseId }, context) => {
      const user = checkAuth(context)

      try {
        const expense = await Expense.findById(expenseId)
        if (expense.createdBy.toString() === user.id) {
          await expense.delete()
          return 'Expense deleted successfully '
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}
