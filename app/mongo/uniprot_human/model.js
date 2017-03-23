const MongoClient = require('mongodb').MongoClient

// Database URL
const url = 'mongodb://localhost:27017/alzheimer_genetics'
let collection

// Retrun method to connect or fetch the collection
module.exports = () =>
  new Promise((resolve, reject) => {
    // If connection has already been established
    if (collection) {
      resolve(collection)
    }
    MongoClient.connect(url).then((db) => {
      collection = db.collection('uniprot')
      resolve(collection)
    })
    .catch((err) => {
      reject(err)
    })
  })
