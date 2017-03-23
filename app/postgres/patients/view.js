const inquirer = require('inquirer')
const connection = require('../../db_info')
const PythonShell = require('python-shell')
const path = require('path')


const pythonOptions = {
  mode: 'text',
  pythonOptions: ['-u'],
  scriptPath: path.join(__dirname, '../../python'),
}

// Creating a python process to run in parallel to node
const pyshell = new PythonShell('main.py', pythonOptions)

// logging messages received from python print
pyshell.on('message', (message) => {
  console.log(message)
})

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
  name: 'patient_id',
  message: 'patient id',
}]

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
      const obj = Object.assign({ function: 'get_patient_info' }, answers, connection)

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
