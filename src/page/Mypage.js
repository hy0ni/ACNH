import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth'; // 로그인 상태 확인 함수
import VillagerCart from '../component/VillagerCart';
import useVillagersData from '../hooks/useVillagersData';

function MyPage() {
  const { data: allVillagers, loading: villagersLoading, error: villagersError } = useVillagersData();
  const [ownedVillagers, setOwnedVillagers] = useState([]); // 소유한 주민 목록
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // 로그인된 유저 정보

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchOwnedVillagers(currentUser.uid);
      } else {
        handleLogout();
      }
    });

    return () => unsubscribe(); // 언마운트 시 구독 해제
  }, []);

  const fetchOwnedVillagers = async (uid) => {
    setLoading(true); // 데이터 로딩 시작

    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("Firestore에서 가져온 데이터:", userData);
        setOwnedVillagers(userData.ownedVillagers || []); // ownedVillagers를 가져온다.
      } else {
        setOwnedVillagers([]); // 문서가 존재하지 않을 경우 빈 배열 설정
      }
    } catch (error) {
      setError('데이터를 불러오는 중 에러가 발생했습니다.');
    } finally {
      setLoading(false); // 로딩 상태를 false로 설정
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLoading(false);
    setError('로그인이 필요합니다.');
  };

  // 로딩 및 에러 처리
  const renderLoading = () => {
    if (villagersLoading) return <p>Loading villagers...</p>;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (villagersError) return <p>{villagersError}</p>;
    return null;
  };

  // 로그인 여부 확인
  if (!user) {
    return <p>로그인이 필요합니다.</p>;
  }

  // 로딩 중일 때는 로딩 메시지 출력
  if (loading || villagersLoading) {
    return <p>Loading...</p>;
  }

  // 소유한 주민의 상세 정보 가져오기
  const ownedVillagerDetails = allVillagers.filter(villager => ownedVillagers.includes(villager.name));

  return (
    <div className='mypage'>
      <h2>내가 소유한 주민 목록</h2>
      {renderLoading()}
      {ownedVillagerDetails.length > 0 ? ( // 소유한 주민이 있을 때만 카드를 렌더링
        <VillagerCart villagers={ownedVillagerDetails} />
      ) : (
        <p>소유한 주민이 없습니다.</p>
      )}
    </div>
  );
}

export default MyPage;
