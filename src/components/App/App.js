import 'normalize.css'

import React from 'react'
// import styles from './App.css'
import Header from '../Header/Header'

class App extends React.Component {
  constructor() {
    super()
    this.name = 'app'
  }
  // eslint-disable-next-line react/no-render-return-value
  render() {
    return (
      <Header />
    )
  }
}

// export default means you can omit curly braces when importing the exported
// function. This is because you are only exporting one object and importing
// that one object.
export default App
