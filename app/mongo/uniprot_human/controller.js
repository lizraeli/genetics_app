const getDb = require('./model.js')


const findByUniprotId = (id) =>
  new Promise((resolve, reject) => {
    getDb().then((db) => {
      console.log('got db')
      db.findOne({ name: id })
      .then((entry) => {
        console.log('got entry')
        resolve(entry)
      })
      .catch((err) => {
        reject(err)
      })
    })
    .catch((err) => {
      resolve(err)
    })
  })


module.exports = {
  findByUniprotId,
}
