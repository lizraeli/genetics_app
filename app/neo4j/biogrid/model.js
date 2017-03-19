const neo4j = require('neo4j')

module.exports = (username, password) =>
  new Promise((resolve, reject) => {
    try {
      const db = new neo4j.GraphDatabase(`http://${username}:${password}@localhost:7474`)
      resolve(db)
    } catch (e) {
      reject(e)
    }
  })
