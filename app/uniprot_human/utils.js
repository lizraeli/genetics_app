const spawn = require('child_process').spawn

function parseXml() {
   // Spawning child process to execute python script
  const py = spawn('python', ['parseXML.py'], { stdio: 'inherit' })

  py.on('close', () => {
    console.log('node: success')
  })
}

module.exports = {
  parseXml,
}

parseXml()


// function importJsonToMongo(filePath){
//   var cmd = "mongoimport --jsonArray --db big_data --collection genes --drop --file data.json"
//   // Executing command in shell
//   var child = exec(cmd);

//   child.stdout.on('data', function(data) {
//       console.log('stdout: ' + data);
//   });
//   child.stderr.on('data', function(data) {
//       console.log('stdout: ' + data);
//   });
//   child.on('close', function(code) {
//       console.log('closing code: ' + code);
//   });
// }
