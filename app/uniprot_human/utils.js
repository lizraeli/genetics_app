const spawn = require('child_process').spawn
// var xmlPath = 'uniprot-human.xml'


function parseXml(xmlPath) {
  let jsonPath = ''
   // Spawning child process to execute python script
  const py = spawn('python', ['parseXML.py'])

  py.stdout.on('data', (data) => {
    console.log('data: ', data)
    jsonPath = data.toString('utf8')
  })

  py.stdout.on('end', () => {
    if (!jsonPath) {
      console.log('child process failed')
      return
    }
    console.log('success')
  })

  py.stdin.write(xmlPath)
  py.stdin.end()
}

module.exports = {
  parseXml,
}

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
