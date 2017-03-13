import React from 'react'
import styles from './Header.css'

/*
class Header extends React.Component {
  render() {
    return (
      <h1>hey man</h1>
    )
  }
}
*/

// stateless Component
const Header = () => (
  <header className={styles.header}>
    <div className={styles.container}>
      <h1 className={styles.title}>Alzheimer Genetic Database</h1>
      <nav>
        <ul className={styles.list}>
          <li className={styles.listItem}><a className={styles.link} href="#">Posts</a></li>
          <li className={styles.listItem}><a className={styles.link} href="#">About</a></li>
        </ul>
      </nav>
    </div>
  </header>
)

export default Header
