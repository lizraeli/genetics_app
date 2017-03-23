const inquirer = require('inquirer')
const controller = require('./controller.js')
const utils = require('./utils.js')

const select = {
  type: 'list',
  name: 'title',
  message: 'What would you like to do',
  choices: [
    'find gene interactions',
    'import tab-separated file',
    'return',
  ],
}

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

const queryDb = () =>
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

const showMenu = () =>
    new Promise((resolve) => {
      // clear()
      inquirer.prompt(select).then((choice) => {
        switch (choice.title) {
          case 'find gene interactions':
            queryDb().then(() => {
              showMenu().then(() => {
                resolve()
              })
            })
            break
          case 'import tab-separated file':
            utils.importTabFile().then(() => {
              showMenu().then(() => {
                resolve()
              })
            })
            break
          case 'return':
            resolve()
            break
          default: {
            console.log('invalid choice')
            showMenu().then(() => {
              resolve()
            })
            break
          }
        }
      })
    })


module.exports = {
  start: showMenu,
  importTabFile: utils.importTabFile,
}
