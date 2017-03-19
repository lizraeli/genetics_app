const controller = require('./controller.js')


controller.connectToDb('neo4j', '123qweasd').then(() => {
  controller.findNOrderInteractions('333', 1)
  .then((response) => {
    response.forEach((gene) => {
      console.log(gene)
      // console.log('g1: ', gene.g1.properties)
      // console.log('g2: ', gene.g2.properties)
      console.log('-----------')
    })
    // console.log(response)
  })
  .catch((e) => {
    console.log(e)
  })
})
.catch((e) => {
  console.log(e)
})
