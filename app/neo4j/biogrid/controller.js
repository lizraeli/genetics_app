const connect = require('./model')
let db

const connectToDb = (username, password) =>
  new Promise((resolve, reject) => {
    console.log('trying to connect')
    connect(username, password).then((resDb) => {
      db = resDb
      console.log('connected: ', db)
      resolve()
    })
    .catch((e) => reject(e))
  })

/*
 *  Find n-order interactions of a gene
 *  params: entrezId: string
 *          n: number, the order of interactions
 */
const findNOrderInteractions = (entrezId, n) =>
  new Promise((resolve, reject) => {
    try {
      console.log('querying db')
      db.cypher({
        query: `MATCH (g1:Gene)-[:interacts_with*${n}]-(g2:Gene)
                WHERE g1.entrez_id = '${entrezId}'
                RETURN g1, g2`,
      }, (err, response) => err ? reject(err) : resolve(response))
    } catch (e) {
      reject(e)
    }
  })


module.exports = {
  connectToDb,
  findNOrderInteractions,
}
