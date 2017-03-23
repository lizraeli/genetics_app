const inquirer = require('inquirer')
const connection = require('../../db_info')
const PythonShell = require('python-shell')
const path = require('path')


const pythonOptions = {
  mode: 'text',
  pythonOptions: ['-u'],
  scriptPath: path.join(__dirname, '../../python'),
}

const queryPrompt = [{
  type: 'input',
  name: 'user',
  message: 'postgres username',
}, {
  type: 'input',
  name: 'password',
  message: 'postgres password',
}, {
  type: 'input',
  name: 'entrez_id',
  message: 'entrez id',
}]

const diagnosisPrompt = {
  type: 'list',
  name: 'diagnosis',
  message: 'select the diagnosis',
  choices: ['nci', 'mci', 'ad', 'other', 'na'],
}

const statPrompt = {
  type: 'list',
  name: 'stat',
  message: 'select stat',
  choices: ['mean', 'std_pop'],
}
// Creating a python process to run in parallel to node
const pyshell = new PythonShell('main.py', pythonOptions)

// logging messages received from python print
pyshell.on('message', (message) => {
  console.log(message)
})

const continuePrompt = [
  {
    type: 'list',
    name: 'title',
    message: '---',
    choices: [
      'return',
    ],
  },
]

module.exports = () =>
  new Promise((resolve) => {
    inquirer.prompt(queryPrompt).then((answers) => {
      inquirer.prompt(diagnosisPrompt).then((diagnosis) => {
        inquirer.prompt(statPrompt).then((stat) => {
          const obj = Object.assign({ function: 'get_gene_stat' },
            stat, answers, connection, diagnosis)
          const pyObj = JSON.stringify(obj)
          pyshell.send(pyObj).end((err) => {
            if (err) console.log(err)
          })
          pyshell.end(() => {
            inquirer.prompt(continuePrompt).then(() => {
              resolve()
            })
          })
        })
      })
    })
  })
