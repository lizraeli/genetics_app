const inquirer = require('inquirer')
// const spawn = require('child_process').spawn
const startUniprot = require('./mongo/uniprot_human/view.js')
const startBiogrid = require('./neo4j/biogrid/view.js')
const clear = require('clear')
// const renderTree = require('./tree.js')

const options = [
  {
    type: 'list',
    name: 'title',
    message: 'Please choose an option',
    choices: [
      'uniprot_human',
      'biogrid',
      'exit',
    ],
  },
]

const prompt = () => {
  clear()
  inquirer.prompt(options).then((choice) => {
    switch (choice.title) {
      case 'biogrid': {
        startBiogrid().then(() => {
          prompt()
        })
        break
      }
      case 'uniprot_human':
        startUniprot().then(() => {
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
