const inquirer = require('inquirer')
const chalk = require('chalk')
const spawn = require('child_process').spawn
const startUniprot = require('./uniprot_human/view.js')
const clear = require('clear')
// const renderTree = require('./tree.js')

const options = [
  {
    type: 'list',
    name: 'title',
    message: 'Please choose an option',
    choices: [
      'uniprot_human',
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
        let child = spawn('node', ['tree.js'], { stdio: 'inherit' })
        child.on('close', prompt())
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
