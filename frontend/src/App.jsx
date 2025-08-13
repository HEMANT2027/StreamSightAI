import React from 'react'
import { Routes, Route } from "react-router-dom"
import MainLayout from './components/layout/mainLayout'
import Welcome from './pages/Welcome/Welcome'
import Demo from './pages/Welcome/Demo'
import Features from './pages/Welcome/Features'
import Chat from './pages/Chatbot/Chat'
import PageNotFound from './pages/Welcome/PageNotFound'

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<MainLayout/>} >
          <Route path="/" element={<Welcome />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/chat" element={<Chat />} />

          {/* <Route path="/about" element={<AboutUs />} /> */}
            <Route path="/features" element={<Features />} />
            {/* <Route path="/contact" element={<ContactPage />} /> */}
            <Route path='*' element={<PageNotFound/>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
