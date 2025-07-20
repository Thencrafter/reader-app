import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Test } from './test'
import BookUpload from './BookUpload'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        {/*<Test/>*/}
        <BookUpload/>
      </div>
    </>
  )
}

export default App
