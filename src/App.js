import './css/App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Header from './component/Header';
import Home from './page/Home';
import Login from './page/Login';
import Signup from './page/Signup';
import Villager from './page/Villager';
import Mypage from './page/Mypage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='mypage' element={<Mypage />} />
        <Route path='/villager' element={<Villager />} />
      </Routes>
    </Router>
  )
}

export default App;
