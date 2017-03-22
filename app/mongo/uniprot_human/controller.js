const getDb = require('./model.js')


const findByUniprotIds = (ids) =>
  new Promise((resolve, reject) => {
    getDb().then((db) => {
      const entries = db.find({ name: { $in: ids } })
      resolve(entries.toArray())
    })
    .catch((err) => {
      reject(err)
    })
  })

module.exports = {
  findByUniprotIds,
}
