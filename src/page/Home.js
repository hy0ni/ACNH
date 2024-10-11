import React from 'react';
import useVillagersData from '../hooks/useVillagersData';
import VillagerCard from '../component/VillagerCard'; // 주민 카드 컴포넌트

const Home = () => {
  const { data, loading, error } = useVillagersData();

  // 랜덤 주민을 선택하는 함수 (매일 바뀜)
  const getDailyRandomVillagers = (data) => {
    const currentDate = new Date();
    const dayOfYear = Math.floor((currentDate - new Date(currentDate.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

    const uniqueRandomIndexes = new Set();

    while (uniqueRandomIndexes.size < 2 && uniqueRandomIndexes.size < data.length) {
      const randomIndex = (dayOfYear + uniqueRandomIndexes.size) % data.length; // 데이터 길이에 맞춰 인덱스 조정
      uniqueRandomIndexes.add(randomIndex);
    }

    return Array.from(uniqueRandomIndexes).map(index => data[index]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>에러: {error}</p>;

  const dailyRandomVillagers = getDailyRandomVillagers(data);

  return (
    <div className="home-container">
      <h1>오늘의 랜덤 주민 카드</h1>
      <div className="villager-cards">
        {dailyRandomVillagers.map((villager, index) => (
          <VillagerCard key={index} villager={villager} />
        ))}
      </div>
    </div>
  );
};

export default Home;
