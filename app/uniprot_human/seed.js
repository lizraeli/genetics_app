 var spawn = require('child_process').spawn
 var exec = require('child_process').exec
 var xmlPath = 'uniprot-human.xml'


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

function parseXMLWithPython(){
	 var jsonPath = '';
	// Spawning child process to execute python script
	var py = spawn('python', ['parseXML.py'])

	py.stdout.on('data', function(data){
	   console.log('data: ', data) 
	   jsonPath = data.toString('utf8')
	});

	py.stdout.on('end', function(){
	  if (!jsonPath){
	  	console.log("child process failed")
	  	return
	  } 
	  
	  console.log("success")
	});


	py.stdin.write(xmlPath);

	py.stdin.end();
}




parseXMLWithPython();
