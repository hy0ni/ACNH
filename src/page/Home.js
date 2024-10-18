import useVillagersData from '../hooks/useVillagersData';
import VillagerCard from '../component/VillagerCard';
import { useState } from 'react';

const Home = () => {
  const { data = [], loading, error } = useVillagersData();
  const [isRevealed, setIsRevealed] = useState({});

  // 랜덤 주민을 선택하는 함수 (매일 바뀜)
  const getDailyRandomVillagers = (data) => {
    if (!data.length) return []; // 데이터가 없을 경우 처리

    const currentDate = new Date();
    const dayOfYear = Math.floor((currentDate - new Date(currentDate.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const uniqueRandomIndexes = new Set();

    while (uniqueRandomIndexes.size < Math.min(2, data.length)) {
      const randomIndex = (dayOfYear + uniqueRandomIndexes.size) % data.length; // 데이터 길이에 맞춰 인덱스 조정
      uniqueRandomIndexes.add(randomIndex);
    }

    return Array.from(uniqueRandomIndexes).map(index => data[index]);
  };

  // 로딩 및 에러 처리
  if (loading) return <p>Loading...</p>;
  if (error) return <p>에러: {error.message || error}</p>;

  const dailyRandomVillagers = getDailyRandomVillagers(data);

  const handleCardClick = (villagerId) => {
    setIsRevealed((prev) => ({
      ...prev,
      [villagerId]: true,
    }));
  };

  return (
    <div className="home-container">
      <h1>오늘의 랜덤 주민 카드</h1>
      <div className="villager-cards">
        {dailyRandomVillagers.length === 0 ? (
          <p>오늘의 랜덤 주민이 없습니다.</p>
        ) : (
          dailyRandomVillagers.map(villager => (
            <div
              key={villager.id}
              className={`villager-card ${isRevealed[villager.id] ? 'revealed' : ''}`}
              onClick={() => handleCardClick(villager.id)}
            >
              {!isRevealed[villager.id] ? (
                <div className="card-back">
                  <p>카드를 클릭하세요</p>
                </div>
              ) : (
                <VillagerCard villager={villager} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
