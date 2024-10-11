import React, { useState, useEffect, useRef, useCallback } from 'react';
import { villagers } from 'animal-crossing';
import { fetchVillagers } from '../api';
import { genderKr, personalityKr, speciesKr, personalityToMBTI } from '../translations/translations';
import VillagerList from '../component/VillagerList';

function Villager() {
  const [data, setData] = useState([]); // 전체 주민 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [page, setPage] = useState(1); // 현재 페이지
  const [visibleVillagers, setVisibleVillagers] = useState([]); // 현재 페이지에서 보여줄 주민들
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부

  const ITEMS_PER_PAGE = 20; // 한 페이지에 보여줄 주민 수
  const observer = useRef(); // IntersectionObserver를 위한 ref

  const fetchData = async () => {
    try {
      const villagersData = await fetchVillagers();
      const animal = villagersData.map(currentVillager => {
        const matchingVillager = villagers.find(villager => villager.name === currentVillager.name);
        if (matchingVillager) {
          const personality = matchingVillager.personality;
          return {
            ...currentVillager,
            name: matchingVillager.translations.kRko,
            species: speciesKr[matchingVillager.species],
            personality: personalityKr[matchingVillager.personality],
            gender: genderKr[matchingVillager.gender],
            mbti: personalityToMBTI[personality]
          }
        }
        return null;
      }).filter(villager => villager !== null);

      setData(animal); // 전체 데이터 저장
      setVisibleVillagers(animal.slice(0, ITEMS_PER_PAGE)); // 첫 페이지 주민들만 보여줌
      setHasMore(animal.length > ITEMS_PER_PAGE); // 더 불러올 데이터가 있는지 확인

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 페이지네이션을 위한 데이터 필터링
  useEffect(() => {
    const filteredData = selectedSpecies
      ? data.filter(villager => villager.species === selectedSpecies)
      : data;

    // 페이지 번호에 따라 주민 목록 설정
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    setVisibleVillagers(filteredData.slice(0, endIndex)); // 처음 로딩 시에는 전체 데이터의 앞부분만 보여줌
    setHasMore(filteredData.length > endIndex); // 더 불러올 데이터가 있는지 확인
  }, [page, selectedSpecies, data]);

  // 동물 종류 선택 처리
  const handleSpeciesClick = (species) => {
    setSelectedSpecies(species);
    setPage(1); // 동물 종류를 변경하면 첫 페이지로 돌아가기
    setVisibleVillagers([]); // 현재 화면 주민 초기화
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
        <select
          value={selectedSpecies}
          onChange={(e) => handleSpeciesClick(e.target.value)}>
          {Object.values(speciesKr).map((species, idx) => (
            <option key={idx} value={species}>
              {species}
            </option>
          ))}
          <option value="">전체 보기</option>
        </select>
      </div>

      <VillagerList villagers={visibleVillagers} />

      {/* 마지막 주민에 ref 연결 */}
      <div ref={lastVillagerRef} />

      {loading && page > 1 && <p>Loading more...</p>} {/* 추가 데이터 로딩 중일 때 표시 */}
    </div>
  );
}

export default Villager;