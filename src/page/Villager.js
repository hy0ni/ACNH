import React, { useState, useEffect, useRef, useCallback } from 'react';
import { speciesKr } from '../translations/translations';
import VillagerList from '../component/VillagerList';
import useVillagersData from '../hooks/useVillagersData';
import { auth, db } from '../firebase';
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';

function Villager() {
  const { data, loading, error } = useVillagersData();
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [page, setPage] = useState(1);
  const [visibleVillagers, setVisibleVillagers] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [ownedVillagers, setOwnedVillagers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(!!auth.currentUser);// 사용자 로그인 상태 관리

  const ITEMS_PER_PAGE = 20;
  const observer = useRef();

  // Firestore에서 유저가 소유한 주민 데이터 불러오기
  useEffect(() => {
    const fetchOwnedVillagers = async () => {
      setIsLoading(true);
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setOwnedVillagers(userDoc.data().ownedVillagers || []);
        }
      }
      setIsLoading(false);
    };

    fetchOwnedVillagers();
  }, []);

  // 인증 상태 변화 감지
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsUserLoggedIn(!!user);// 로그인 상태 업데이트
      if (!user) {
        setOwnedVillagers([]);// 로그아웃 시 소유한 주민 리스트 초기화
      }
    });

    return () => unsubscribe();// 컴포넌트 언마운트 시 리스너 해제
  }, []);

  // 페이지네이션을 위한 데이터 필터링
  useEffect(() => {
    if (!data) return;

    const filteredData = selectedSpecies
      ? data.filter(villager => villager.species === selectedSpecies)
      : data;

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    setVisibleVillagers(filteredData.slice(0, endIndex));
    setHasMore(filteredData.length > endIndex);
  }, [page, selectedSpecies, data]);

  // 종 선택 핸들러
  const handleSpeciesClick = (species) => {
    setSelectedSpecies(species);
    setPage(1);
    setVisibleVillagers([]);
  };

  // 주민 선택/제거 Firestore 업데이트
  const toggleOwnership = async (villagerName) => {
    const user = auth.currentUser;

    if (!user) {
      alert('로그인한 사용자만 주민을 담을 수 있습니다.');
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      updateOwnership(userDocRef, villagerName);
    } else {
      await setDoc(userDocRef, { ownedVillagers: [villagerName] });
      setOwnedVillagers([villagerName]);
    }
  };

  // 소유권 업데이트 핸들러
  const updateOwnership = async (userDocRef, villagerName) => {
    setOwnedVillagers((prevOwned) => {
      const isOwned = prevOwned.includes(villagerName);
      const updateFunction = isOwned ? arrayRemove : arrayUnion;

      updateDoc(userDocRef, {
        ownedVillagers: updateFunction(villagerName)
      });

      return isOwned ? prevOwned.filter(name => name !== villagerName) : [...prevOwned, villagerName];
    });
  };

  // 무한 스크롤을 위한 IntersectionObserver 설정
  const lastVillagerRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // 로딩 및 에러 처리
  if (isLoading || (loading && page === 1)) return <p>Loading...</p>;
  if (error) return <p>에러: {error}</p>;

  return (
    <div className='container'>
      <div className="species-selector">
        <button
          onClick={() => handleSpeciesClick('')}
          className={`species-button ${selectedSpecies === '' ? 'active' : ''}`}
        >
          전체 보기
        </button>
        {Object.values(speciesKr).map((species, idx) => (
          <button
            key={idx}
            onClick={() => handleSpeciesClick(species)}
            className={`species-button ${selectedSpecies === species ? 'active' : ''}`}
          >
            {species}
          </button>
        ))}
      </div>

      <VillagerList
        villagers={visibleVillagers}
        ownedVillagers={ownedVillagers}
        toggleOwnership={toggleOwnership}
        isUserLoggedIn={isUserLoggedIn}// 로그인 상태 전달
      />

      <div ref={lastVillagerRef} />

      {loading && page > 1 && <p>Loading more...</p>}
    </div>
  );
}

export default Villager;
