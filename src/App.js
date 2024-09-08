import './css/App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from './page/Home';
import MusicPlayer from './page/MusicPlayer';
import Header from './component/Header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/music' element={<MusicPlayer />} />
      </Routes>
    </Router>
  )
}

export default App;
