import { AuthenticationError, UserInputError } from 'apollo-server'
import { Expense, Group } from '../../models/index.js'
import checkAuth from '../../util/checkAuth.js'

export default {
  Query: {
    getExpenses: async (_, __, context) => {
      checkAuth(context)
      try {
        const expenses = Expense.find()
        return expenses
      } catch (error) {
        throw new Error(error)
      }
    },
    getExpense: async (_, { expenseId }, context) => {
      checkAuth(context)
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
    group_getExpenses: async (_, { groupId }) => {
      try {
        const expenses = Expense.find({ groupId })
        return expenses
      } catch (error) {
        throw new Error(error)
      }
    },
  },
  Mutation: {
    group_createExpense: async (
      _,
      { groupId, createExpenseInput: { title, amount, paidBy, shares } },
      context
    ) => {
      const user = checkAuth(context)
      const group = await Group.findById(groupId)

      if (!group) {
        throw new UserInputError('Error', {
          error: `Could not find group with id ${groupId}`,
        })
      }

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
        groupId,
        title: title ?? '',
        amount,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
        paidBy,
        shares,
      })
      const expense = await newExpense.save()

      group.expenses.push(expense.id)
      await group.save()

      return group
    },
    deleteExpense: async (_, { expenseId }, context) => {
      const user = checkAuth(context)

      try {
        const expense = await Expense.findById(expenseId)

        if (!expense.createdBy.toString() === user.id) {
          throw new AuthenticationError('Action not allowed')
        }

        const group = await Group.findByIdAndUpdate(expense.groupId, {
          $pullAll: {
            expenses: [expenseId],
          },
        })

        await expense.delete()

        return group
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}
