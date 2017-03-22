const blessed = require('blessed')
const contrib = require('blessed-contrib')


// must append before setting data
const render = () => {
  process.on('message', (m) => {
    console.log(m)
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
