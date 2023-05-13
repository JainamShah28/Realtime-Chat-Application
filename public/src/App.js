import './index.css';

import { Routes, Route } from 'react-router-dom';

import Register from './pages/Register.js';
import Login from './pages/Login.js';
import Chat from './pages/Chat.js';
import SetAvatar from './pages/SetAvatar.js';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/setavatar/:userID' element={<SetAvatar />} />
                <Route path='/' element={<Chat />} />
            </Routes>

        </div>
    );
}

export default App;