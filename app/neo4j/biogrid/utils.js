const spawn = require('child_process').spawn
const path = require('path')

const importTabFile = () =>
  new Promise((resolve) => {
    try {
      // Spawning child process to execute python script
      const py = spawn('python3', [path.join(__dirname, '/importTabFile.py')], { stdio: 'inherit' })

      py.on('close', () => {
        console.log('import script closed')
        resolve()
      })
    } catch (e) {
      console.log(e)
      resolve()
    }
  })

module.exports = {
  importTabFile,
}