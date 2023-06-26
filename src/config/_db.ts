import { type Dialect, Sequelize } from 'sequelize'

if (!process.env.DATABASE_NAME) {
  throw new Error('Name for database not provided. Look up the .env file')
}

if (!process.env.DATABASE_USERNAME) {
  throw new Error('Username for database nor provided. Look up the .env file')
}

if (!process.env.DATABASE_HOST) {
  throw new Error('Host for database nor provided. Look up the .env file')
}

if (!process.env.DATABASE_DIALECT) {
  throw new Error('Dialect for database nor provided. Look up the .env file')
}

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD ?? '', {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT as Dialect,
    logging: false
  })

export default sequelize
