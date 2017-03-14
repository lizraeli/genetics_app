const getDb = require("./model.js")


const findByUniprotId = id => {
	getDb().then(db => {
		db.findOne({ name:findByUniprotId })
		.then(entry => {
			console.log(entry)
		})
		.catch(err => { 
			console.log(err)
		})
	})
	.catch(err => {
		console.log(err)
	})
}

module.exports = {
	findByUniprotId
}

