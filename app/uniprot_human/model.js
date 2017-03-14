var MongoClient = require('mongodb').MongoClient;

// Database URL
var url = 'mongodb://localhost:27017/big_data';
var collection

// Retrun method to connect or fetch the collection
module.exports = function(){
	return new Promise( (resolve, reject) => {
  		// If connection has already been established
  		if (collection){
  			resolve(collection)
  		}
  		MongoClient.connect(url).then(db => {
  			collection = db.collection("genes")
  			resolve(collection)
 		})
 		.catch(err => {
 			reject(err)
 		})
 	})
}
