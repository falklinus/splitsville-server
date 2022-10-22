import { model, Schema } from 'mongoose'

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  ],
}, {
  statics: {
    searchFields(searchTerm) {
      const stringSearchFields = ['email', 'username'];
      const query = {
        $or: [
          ...stringSearchFields.map(field => ({
            [field]: new RegExp('^' + searchTerm, 'i')
          })),
        ]
      };
      return this.find(query);
    }
  },
})

export default model('User', userSchema)
