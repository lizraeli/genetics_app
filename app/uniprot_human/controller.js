const getDb = require('./model.js')


const findByUniprotId = (id) =>
  new Promise((resolve, reject) => {
    getDb().then((db) => {
      db.findOne({ name: id })
      .then((entry) => {
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
