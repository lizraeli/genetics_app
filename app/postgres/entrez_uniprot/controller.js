const connect = require('./model')
let db

const connectToDb = (username, password) =>
  new Promise((resolve, reject) => {
    connect(username, password).then((resDb) => {
      db = resDb
      resolve()
    })
    .catch((e) => {
      reject(e)
    })
  })

const getUniprotByEntrezId = (entrezId) =>
  new Promise((resolve, reject) => {
    if (!db) {
      reject('no db')
    }
    db.query(`SELECT uniprot_id FROM public.entrez_uniprot WHERE entrez_id = ${entrezId}`,
      {
        type: db.QueryTypes.SELECT,
      })
    .then((response) => {
      resolve(response[0].uniprot_id)
    })
    .catch((err) => {
      reject(err)
    })
  })

module.exports = {
  connectToDb,
  getUniprotByEntrezId,
}
