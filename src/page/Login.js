import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert(`로그인 성공! ${userCredential.user.email}`);
      navigate('/');
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-credential':
          setError('이메일 및 비밀번호를 확인해주세요.');
          break;
        default:
          setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className='form-wrap'>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='btn btn-login' type="submit">로그인</button>
        <button className='btn btn-signup' onClick={() => navigate('/signup')}>회원가입하러가기</button>
      </form>
      {error && <p className='error-message'>{error}</p>}
    </div>
  );
}
export default Login;
