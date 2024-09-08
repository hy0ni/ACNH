import { Link } from "react-router-dom";
import '../css/Header.css';

function Header() {
  return (
    <header className="header">
      <h1>동물의숲</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/music">MusicPlayer</Link>
      </nav>
    </header>
  )
}
export default Header;