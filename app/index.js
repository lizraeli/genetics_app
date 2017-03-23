const inquirer = require('inquirer')
const fork = require('child_process').fork
const uniprot = require('./mongo/uniprot_human/view')
const biogrid = require('./neo4j/biogrid/view')
const entrezUniprot = require('./postgres/entrez_uniprot/view')
const startPatient = require('./postgres/patients/view')
const startGeneStats = require('./postgres/gene_stats/view')
const clear = require('clear')
const firstRun = require('first-run')
const path = require('path')
const PythonShell = require('python-shell')
const connection = require('./db_info')

const pythonOptions = {
  mode: 'text',
  pythonOptions: ['-u'],
  scriptPath: path.join(__dirname, '/python'),
}

// Creating a python process to run in parallel to node
const pyshell = new PythonShell('main.py', pythonOptions)

// logging messages received from python print
pyshell.on('message', (message) => {
  console.log(message)
})

const options = [
  {
    type: 'list',
    name: 'title',
    message: 'Please choose an option',
    choices: [
      'uniprot - gene information',
      'biogrid - gene interactions',
      'entrez-uniprot mapping',
      'patient information',
      'gene statistics',
      'exit',
    ],
  },
]

const prompt = () => {
  clear()
  inquirer.prompt(options).then((choice) => {
    switch (choice.title) {
      case 'other': {
        // const tree = spawn('node', ['tree.js'], { stdio: 'inherit' })
        const tree = fork('tree.js')
        tree.send('hello')
        tree.on('close', () => {
          prompt()
        })
        break
      }
      case 'biogrid - gene interactions': {
        biogrid.start().then(() => {
          prompt()
        })
        break
      }
      case 'uniprot - gene information':
        uniprot.start().then(() => {
          prompt()
        })
        break
      case 'entrez-uniprot mapping':
        entrezUniprot.start().then(() => {
          prompt()
        })
        break
      case 'patient information':
        startPatient().then(() => {
          prompt()
        })
        break
      case 'gene statistics':
        startGeneStats().then(() => {
          prompt()
        })
        break
      case 'exit':
        console.log('goodbye')
        process.exit()
        break
      default:
        console.log('please try again')
        prompt()
    }
  })
}

const firstRunPrompt = [{
  type: 'input',
  name: 'user',
  message: 'postgres username',
}, {
  type: 'input',
  name: 'password',
  message: 'postgres password',
}, {
  type: 'input',
  name: 'gene_expression_file_name',
  message: 'Enter the file name for gene expression profile',
}, {
  type: 'input',
  name: 'gene_expression_file_delimiter',
  message: 'Enter the delimiter (comma: ",", tab: "t", space: " "): ',
}, {
  type: 'input',
  name: 'entrez_uniprot_file_name',
  message: 'Enter the file name for Entrez ID - Uniprot ID',
}, {
  type: 'input',
  name: 'entrez_uniprot_delimiter',
  message: 'Enter the delimiter (comma: ",", tab: "t", space: " "): ',
}, {
  type: 'input',
  name: 'patient_file_name',
  message: 'Enter the file name for patient information',
}, {
  type: 'input',
  name: 'patient_file_delimiter',
  message: 'Enter the delimiter (comma: ",", tab: "t", space: " "): ',
},
]

if (firstRun()) {
  clear()
  console.log('first run')
  // send a message to the Python script via stdin
  inquirer.prompt(firstRunPrompt).then((answers) => {
    const obj = Object.assign({ function: 'first_run' }, connection, answers)
    const pyObj = JSON.stringify(obj)
    pyshell.send(pyObj).end((err) => {
      if (err) console.log(err)
      uniprot.importXml().then(() => {
        biogrid.importTabFile().then(() => {
          prompt()
        })
      })
    })
  })
  // firstRun.clear()
} else {
  prompt()
}
// const tree = spawn('node', ['tree.js'])
