import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Chat from './components/Chat'
import Register from './components/Register'
import ChatProvider from './context/chatProvider'

function App() {

  return (
    <>
    <ChatProvider>
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </ChatProvider>
    </>
  )
}

export default App
