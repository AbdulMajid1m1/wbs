import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from './pages/Login'
import FirstTable from './pages/FirstTable'

const App = () => {
  return (
    <div>
      <BrowserRouter>
          <Routes>
              <Route path='/' element={<Login />}/>
              <Route path='/table' element={<FirstTable />}/>
          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App