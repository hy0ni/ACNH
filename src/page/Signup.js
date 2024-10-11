import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      alert(`회원가입 성공! ${userCredential.user.email}`);
      navigate('/');
    } catch (error) {
      console.log(error);
      switch (error.code) {
        case 'auth/invalid-email':
          setError('유효하지 않은 이메일 형식입니다.');
          break;
        case 'auth/email-already-in-use':
          setError('이미 등록된 계정입니다.');
          break;
        case 'auth/password-does-not-meet-requirements':
          setError('비밀번호를 다시 확인해주세요.(예: 최소 6자 이상, 문자, 숫자, 특수문자 포함)');
          break;
        default:
          setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className='form-wrap'>
      <h2>회원가입</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className='btn btn-login' type="submit">가입하기</button>
      </form>
      {error && <p className='error-message'>{error}</p>}
    </div>
  );
};

export default Signup;