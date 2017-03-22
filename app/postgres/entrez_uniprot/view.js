const inquirer = require('inquirer')
// const controller = require('./controller.js')
const utils = require('./utils')
const controller = require('./controller')

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
const menuPrompt = {
  type: 'list',
  name: 'title',
  message: 'What would you like to do',
  choices: [
    'import tab file',
    'return',
  ],
}

const loginQuestions = [
  {
    type: 'input',
    name: 'username',
    message: 'postgres username: ',
  },
  {
    type: 'input',
    name: 'password',
    message: 'postgres password: ',
  },
]

const login = () =>
  new Promise((resolve, reject) => {
    inquirer.prompt(loginQuestions).then((credetials) => {
      controller.connectToDb(credetials.username, credetials.password)
      .then(() => {
        resolve()
      })
      .catch(() => {
        console.log('failed to connect to postgres')
        reject()
      })
    })
  })


const start = () =>
  new Promise((resolve) => {
    // Prompting for login credetials
    inquirer.prompt(menuPrompt).then((choice) => {
      switch (choice.title) {
        case 'return':
          resolve()
          break
        case 'import tab file':
          utils.importTabFile().then(() => {
            inquirer.prompt(continuePrompt).then(() => {
              resolve()
            })
          })
          break
        default:
          resolve()
          break
      }
    })
  })

module.exports = {
  start,
  login,
}
