const blessed = require('blessed')
const contrib = require('blessed-contrib')


// must append before setting data
const render = () => {
  process.on('message', (obj) => {
    // console.log(obj)
    const screen = blessed.screen()

    const tree = contrib.tree({ fg: 'green' })

    // Allow to control the table with the keyboard
    tree.focus()
    // tree.on('select', (node) => {
    //   if (node.myCustomProperty) {
    //     console.log(node.myCustomProperty)
    //   }
    //   console.log(node.name)
    // })

    screen.append(tree)
    tree.setData(
   { extended: true
   , children:
     {
       'Fruit':
       { children:
         { 'Banana': {}
         , 'Apple': {}
         , 'Cherry': {}
         , 'Exotics': {
             children:
             { 'Mango': {}
             , 'Papaya': {}
             , 'Kiwi': { name: 'Kiwi (not the bird!)', myCustomProperty: "hairy fruit" }
             }}
         , 'Pear': {}}}
     , 'Vegetables':
       { children:
         { 'Peas': {}
         , 'Lettuce': {}
         , 'Pepper': {}}}}})


    screen.key(['escape', 'q', 'C-c'], () => {
      // screen.leave()
      process.exit()
    })

    screen.render()
  })

  /*
  const screen = blessed.screen()

  const line = contrib.line({
    style: {
      line: 'yellow',
      text: 'green',
      baseline: 'black',
    },
    xLabelPadding: 3,
    xPadding: 5,
    label: 'Title',
  })

  const data = {
    x: ['t1', 't2', 't3', 't4'],
    y: [5, 1, 7, 5],
  }

  screen.append(line)
  line.setData([data])
  screen.render()
  screen.key(['escape', 'q', 'C-c'], () => {
    screen.leave()
    process.exit()
    // resolve()
  })
  */
}

module.exports = () => render()

render()
