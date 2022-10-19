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
    friends: [User!]!
  }

  type ExpenseShare {
    share: Float!
    user: User!
  }

  type Expense {
    id: ID!
    groupId: ID!
    title: String!
    amount: Float!
    createdAt: String!
    createdBy: User!
    paidBy: User!
    shares: [ExpenseShare!]!
  }

  type Group {
    id: ID!
    title: String!
    members: [User!]!
    expenses: [Expense!]!
    createdAt: String!
    createdBy: User!
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
    getMe: User
    getExpenses: [Expense]
    getExpense(expenseId: ID!): Expense
    group_getExpenses(groupId: ID!): [Expense]
    getGroups: [Group]
    getGroup(groupId: ID!): Group
  }

  type Mutation {
    register(registerInput: RegisterInput!): User!
    login(loginInput: LoginInput!): User!
    addFriend(email: String!): User
    createGroup(userIds: [ID!]!, title: String): Group!
    group_createExpense(
      groupId: ID!
      createExpenseInput: CreateExpenseInput!
    ): Group!
    deleteExpense(expenseId: ID!): Group!
  }
`
