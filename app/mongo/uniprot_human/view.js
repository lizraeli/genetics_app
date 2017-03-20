const inquirer = require('inquirer')
const treeify = require('treeify')
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
          // Displaying returned object as tree
          console.log(treeify.asTree(obj, true))
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
