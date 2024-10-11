import './css/App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Header from './component/Header';
import Home from './page/Home';
import Login from './page/Login';
import MusicPlayer from './page/MusicPlayer';
import Signup from './page/Signup';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/music' element={<MusicPlayer />} />
      </Routes>
    </Router>
  )
}

export default App;
