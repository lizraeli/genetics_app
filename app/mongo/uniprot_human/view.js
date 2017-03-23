const inquirer = require('inquirer')
const treeify = require('treeify')
const controller = require('./controller.js')
const chalk = require('chalk')
const utils = require('./utils.js')
const entrezUniprotView = require('../../postgres/entrez_uniprot/view')
const entrezUniprotController = require('../../postgres/entrez_uniprot/controller')

// const clear = require('clear')

const select = {
  type: 'list',
  name: 'title',
  message: 'What would you like to do',
  choices: [
    'find gene information',
    'import XML',
    'return',
  ],
}
const input = {
  type: 'input',
  name: 'entrezId',
  message: 'Enter enterz Id',
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

const printGeneInfo = (gene) => {
  // Displaying gene object as tree
  const arr = treeify.asTree(gene, true).split('\n')
  arr.forEach((line) => {
    const parts = line.split(':')
    if (parts.length === 1) {
      console.log(chalk.green(parts[0]))
    } else {
      console.log(chalk.green(parts[0]), ':', chalk.yellow(parts[1]))
    }
  })
}

const queryDb = () =>
  new Promise((resolve) => {
      // console.log(response.entrezId)
    entrezUniprotView.login().then(() => {
      inquirer.prompt(input).then((response) => {
        entrezUniprotController.getUniprotByEntrezId(response.entrezId)
        .then((uniprotIds) => {
          controller.findByUniprotIds(uniprotIds).then((genes) => {
            if (!genes || genes === []) {
              console.log('not found')
            } else {
              const geneList = genes.map((gene) => gene.name)
              inquirer.prompt({
                type: 'list',
                name: 'name',
                message: 'The following genes were found',
                choices: [...geneList, 'show all'],
              }).then((choice) => {
                if (choice.name === 'show all') {
                  genes.forEach((gene) => {
                    printGeneInfo(gene)
                  })
                } else {
                  const selected = genes.filter((gene) => gene.name === choice.name)
                  printGeneInfo(selected)
                }
                inquirer.prompt(continuePrompt).then(() => {
                  resolve()
                })
              })
            }
          })
        })
        .catch((e) => {
          console.log(e)
          console.log('error connecting to database')
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

const showMenu = () =>
    new Promise((resolve) => {
      // clear()
      inquirer.prompt(select).then((choice) => {
        switch (choice.title) {
          case 'find gene information':
            queryDb().then(() => {
              showMenu().then(() => {
                resolve()
              })
            })
            break
          case 'import XML':
            utils.importXML().then(() => {
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
  importXml: utils.importXml,
}
