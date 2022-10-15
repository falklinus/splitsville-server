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
  },
  Mutation: {
    createGroup: async (_, { userIds, title }, context) => {
      const user = checkAuth(context)

      const groupUserIds = [...userIds, user.id]

      const usersInGroup = await User.find({
        _id: { $in: groupUserIds },
      })

      if (!usersInGroup.length == groupUserIds.length) {
        throw new UserInputError('Error', { error: 'Could not find all users' })
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

      const group = await newGroup.save()
      return group
    },
  },
}
