const inquirer = require('inquirer')
const chalk = require('chalk')
const controller = require('./controller.js')

const input = {
  type: 'input',
  name: 'uniprotId',
  message: 'Insert Uniprot Id',
}

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
    inquirer.prompt(input).then((response) => {
      console.log(response.uniprotId)
      controller.findByUniprotId(response.uniprotId)
      .then((obj) => {
        if (!obj) {
          console.log('not found')
        } else {
          console.log(JSON.stringify(obj, null, 2))
        }
        inquirer.prompt(continuePrompt).then(() => {
          resolve()
        })
      })
      .catch((err) => {
        console.log(err)
        inquirer.prompt(continuePrompt).then(() => {
          resolve()
        })
      })
    })
  })
