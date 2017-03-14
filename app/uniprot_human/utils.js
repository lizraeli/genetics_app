 var spawn = require('child_process').spawn
 var exec = require('child_process').exec
 // var xmlPath = 'uniprot-human.xml'


const parseXml = xmlPath => {
	 var jsonPath = '';
	// Spawning child process to execute python script
	var py = spawn('python', ['parseXML.py'])

	py.stdout.on('data', data => {
	   console.log('data: ', data) 
	   jsonPath = data.toString('utf8')
	});

	py.stdout.on('end', () => {
	  if (!jsonPath){
	  	console.log("XML parsing failed")
	  	return
	  } 
	  
	  console.log("inserted into genes db")
	});


	py.stdin.write(xmlPath);
	py.stdin.end();
}


module.exports = {
	parseXml
}





// function importJsonToMongo(filePath){
// 	var cmd = "mongoimport --jsonArray --db big_data --collection genes --drop --file data.json"
// 	// Executing command in shell
// 	var child = exec(cmd);

// 	child.stdout.on('data', function(data) {
// 	    console.log('stdout: ' + data);
// 	});
// 	child.stderr.on('data', function(data) {
// 	    console.log('stdout: ' + data);
// 	});
// 	child.on('close', function(code) {
// 	    console.log('closing code: ' + code);
// 	});
// }