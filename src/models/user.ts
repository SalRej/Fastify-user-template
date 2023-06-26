import Sequelize from 'sequelize'
import sequelize from '../config/_db' // Path to your db.js file
import { type Model } from 'sequelize'
import type IUser from '../interfaces/user'

const User = sequelize.define<IUser & Model>('User', {
  // Define your User model properties
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

User.sync({ alter: true })
export default User
