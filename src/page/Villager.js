import React, { useState, useEffect, useRef, useCallback } from 'react';
import { speciesKr } from '../translations/translations';
import VillagerList from '../component/VillagerList';
import useVillagersData from '../hooks/useVillagersData';

function Villager() {
  const { data, loading, error } = useVillagersData(); // 주민 데이터 가져오기
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [page, setPage] = useState(1);
  const [visibleVillagers, setVisibleVillagers] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 20;
  const observer = useRef();

  // 페이지네이션을 위한 데이터 필터링
  useEffect(() => {
    const filteredData = selectedSpecies
      ? data.filter(villager => villager.species === selectedSpecies)
      : data;

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    setVisibleVillagers(filteredData.slice(0, endIndex)); // 주민 목록 설정
    setHasMore(filteredData.length > endIndex);
  }, [page, selectedSpecies, data]);

  const handleSpeciesClick = (species) => {
    setSelectedSpecies(species);
    setPage(1); // 동물 종류를 변경하면 첫 페이지로 돌아가기
    setVisibleVillagers([]);
  };

  // 무한 스크롤을 위한 IntersectionObserver 설정
  const lastVillagerRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect(); // 기존 observer 해제
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1); // 페이지 증가
      }
    });
    if (node) observer.current.observe(node); // 새로 로드된 엘리먼트에 observer 적용
  }, [loading, hasMore]);

  if (loading && page === 1) return <p>Loading...</p>; // 처음 로딩 중일 때만 표시
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

      <VillagerList villagers={visibleVillagers} />

      {/* 마지막 주민에 ref 연결 */}
      <div ref={lastVillagerRef} />

      {loading && page > 1 && <p>Loading more...</p>} {/* 추가 데이터 로딩 중일 때 표시 */}
    </div>
  );
}

export default Villager;