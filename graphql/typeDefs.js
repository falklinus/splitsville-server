import { gql } from 'apollo-server'

export default gql`
  scalar ObjectId

  type User {
    id: ID!
    username: String
    password: String
    email: String
    createdAt: String
    token: String
  }

  type ExpenseShare {
    share: Float!
    user: User!
  }

  type Expense {
    id: ID!
    title: String!
    amount: Float!
    createdAt: String!
    createdBy: User!
    paidBy: User!
    shares: [ExpenseShare!]!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ExpenseShareInput {
    share: Float!
    user: ID!
  }

  input CreateExpenseInput {
    title: String
    amount: Float!
    paidBy: ID!
    shares: [ExpenseShareInput!]!
  }

  type Query {
    getExpenses: [Expense]
    getExpense(expenseId: ID!): Expense
  }

  type Mutation {
    register(registerInput: RegisterInput!): User!
    login(loginInput: LoginInput!): User!
    createExpense(createExpenseInput: CreateExpenseInput!): Expense!
    deleteExpense(expenseId: ID!): String!
  }
`
