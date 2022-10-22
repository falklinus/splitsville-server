import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../../models/index.js'
import { JWT_SECRET_KEY } from '../../config.js'
import { UserInputError } from 'apollo-server'
import {
  validateEmail,
  validateLoginInput,
  validateRegisterInput,
} from '../../util/validators.js'
import checkAuth from '../../util/checkAuth.js'

const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    JWT_SECRET_KEY
  )

export default {
  Query: {
    getMe: async (_, __, context) => {
      const user = checkAuth(context)
      const me = await User.findById(user.id)
      return me
    },
    searchUsers: async(_, {searchTerm}, context) => {
      checkAuth(context)
        return User.searchFields(searchTerm)
    }
  },
  Mutation: {
    register: async (
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) => {
      const { errors, valid } = validateRegisterInput({
        username,
        email,
        password,
        confirmPassword,
      })

      if (!valid) {
        throw new UserInputError('Bad input', { errors })
      }

      const usernameAlreadyTaken = await User.findOne({ username })
      const emailAlreadyTaken = await User.findOne({ email })

      const userExists = usernameAlreadyTaken || emailAlreadyTaken

      if (userExists) {
        throw new UserInputError('User already registered', {
          errors: {
            username: `This ${
              usernameAlreadyTaken
                ? emailAlreadyTaken
                  ? 'username and email'
                  : 'username'
                : 'email'
            } is taken`,
          },
        })
      }

      password = await bcrypt.hash(password, 12)

      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      })

      const user = await newUser.save()

      const token = generateToken(user)

      return {
        ...user._doc,
        id: user.id,
        token,
      }
    },

    login: async (_, { loginInput: { email, password } }) => {
      const { errors, valid } = validateLoginInput({ email, password })

      if (!valid) {
        throw new UserInputError('Bad input', { errors })
      }

      const user = await User.findOne({ email })

      if (!user) {
        throw new UserInputError('User not found', {
          errors: {
            general: 'User not found',
          },
        })
      }

      const correctPassword = bcrypt.compareSync(password, user.password)

      if (!correctPassword) {
        throw new UserInputError('Wrong credentials', {
          errors: {
            general: 'Wrong credentials',
          },
        })
      }

      const token = generateToken(user)

      return {
        ...user._doc,
        id: user.id,
        token,
      }
    },

    addFriend: async (_, { email }, context) => {
      const { errors, valid } = validateEmail(email)

      if (!valid) {
        throw new UserInputError('Bad input', { errors })
      }

      const newFriend = await User.findOne({ email })
      if (!newFriend) {
        throw new Error('Error', `Could not find user with email ${email}`)
      }

      const contextUser = checkAuth(context)

      const dbUser = await User.findById(contextUser.id)
      dbUser.friends.push(newFriend._id.toString())
      dbUser.save()

      newFriend.friends.push(contextUser.id)
      newFriend.save()

      return dbUser
    },
  },
}
