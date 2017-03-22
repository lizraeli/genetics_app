const inquirer = require('inquirer')
const fork = require('child_process').fork
const startUniprot = require('./mongo/uniprot_human/view')
const startBiogrid = require('./neo4j/biogrid/view')
const entrezUniprot = require('./postgres/entrez_uniprot/view')
const clear = require('clear')

const options = [
  {
    type: 'list',
    name: 'title',
    message: 'Please choose an option',
    choices: [
      'uniprot - gene information',
      'biogrid - gene interactions',
      'entrez-uniprot mapping',
      'other',
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
        startBiogrid().then(() => {
          prompt()
        })
        break
      }
      case 'uniprot - gene information':
        startUniprot().then(() => {
          prompt()
        })
        break
      case 'entrez-uniprot mapping':
        entrezUniprot.start().then(() => {
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

prompt()
// const tree = spawn('node', ['tree.js'])
