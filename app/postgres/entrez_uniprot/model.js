const Sequelize = require('sequelize')


const connect = (username, password) =>
  new Promise((resolve, reject) => {
    try {
      const db = new Sequelize('alzheimer_genetics', username, password, {
        host: 'localhost',
        dialect: 'postgres',
      })
      resolve(db)
    } catch (e) {
      reject(e)
    }
  })

module.exports = connect
