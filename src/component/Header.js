import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <header className='header'>
      <h1 className='title' onClick={() => navigate('/')}>VillageHub</h1>
      <nav>
        {user ? (
          <>
            <h2>Welcome, {user.email}</h2>
            <button className='btn' onClick={() => navigate('/mypage')}>마이페이지</button>
            <button className='btn' onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <button className='btn' onClick={() => navigate('/login')} aria-label="로그인 페이지로 이동">로그인</button>
        )}
        <button className='btn' onClick={() => navigate('/villager')}>주민 리스트</button>
      </nav>
    </header >
  )
}
export default Header;