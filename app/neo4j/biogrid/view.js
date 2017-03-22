const inquirer = require('inquirer')
const controller = require('./controller.js')

const queryPrompt = [{
  type: 'input',
  name: 'entrezId',
  message: 'Entrez Id',
}, {
  type: 'input',
  name: 'order',
  message: 'Order of interactions',
}]

const getNOrderInteractions = (entrezId, order, n = 1) =>
  new Promise((resolve) => {
    if (n > order) {
      resolve()
      return
    }
    console.log(`${n}- order of interactions:'`)
    controller.findNOrderInteractions(entrezId, n)
    .then((interactions) => {
      console.log((interactions.map((interaction) => interaction.g2.properties.entrez_id)).toString())
      // console.log(treeify.asTree(interactions, true))
      getNOrderInteractions(entrezId, order, n + 1).then(() => {
        resolve()
      })
    })
  })


const getInteractions = () =>
  new Promise((resolve) => {
    inquirer.prompt(queryPrompt).then((query) => {
      getNOrderInteractions(query.entrezId, Number(query.order)).then(() => {
        resolve()
      })
    })
  })

const credentialsPrompt = [{
  type: 'input',
  name: 'username',
  message: 'neo4j username',
}, {
  type: 'input',
  name: 'password',
  message: 'neo4j password',
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
  new Promise((resolve, reject) => {
    // Prompting for login credetials
    inquirer.prompt(credentialsPrompt).then((credentials) => {
      controller.connectToDb(credentials.username, credentials.password)
      .then(() => {
        getInteractions().then(() => {
          inquirer.prompt(continuePrompt).then(() => {
            resolve()
          })
        })
      })
    })
    .catch((err) => {
      reject(err)
    })
  })
