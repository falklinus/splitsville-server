import { UserInputError } from 'apollo-server'
import Group from '../../models/Group.js'
import User from '../../models/User.js'
import checkAuth from '../../util/checkAuth.js'

export default {
  Query: {
    getGroups: async (_, __, context) => {
      const user = checkAuth(context)
      try {
        const groups = await Group.find({ members: user.id })
        return groups
      } catch (error) {
        throw new Error(error)
      }
    },
    getGroup: async (_, { groupId }, context) => {
      checkAuth(context)
      try {
        const group = await Group.findById(groupId)
        return group
      } catch (error) {
        throw new Error(error)
      }
    },
  },
  Mutation: {
    createGroup: async (_, { userIds, title }, context) => {
      const user = checkAuth(context)

      const groupUserIds = [...userIds, user.id]

      if (groupUserIds.length < 2) {
        throw new UserInputError('A group needs to have at least two members')
      }

      const usersInGroup = await User.find({
        _id: { $in: groupUserIds },
      })

      if (!usersInGroup.length == groupUserIds.length) {
        throw new UserInputError('Could not find all users')
      }

      const fallBackTitle = `${usersInGroup
        .map((user) => user.username)
        .join(' + ')} = Sant`

      const newGroup = new Group({
        title: title && title.trim() !== '' ? title : fallBackTitle,
        members: groupUserIds,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
      })

      usersInGroup.forEach((user_a) => {
        usersInGroup.forEach(async (user_b) => {
          if (user_a.id != user_b.id) {
            if (!user_a.friends.includes(user_b.id)) {
              user_a.friends.push(user_b.id)
              user_b.friends.push(user_a.id)
              await user_a.save()
              await user_b.save()
            }
          }
        })
      })

      const group = await newGroup.save()
      return group
    },
  },
}
