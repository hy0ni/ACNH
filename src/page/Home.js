import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VillagerList from '../component/VillagerList';
import { villagers } from 'animal-crossing';

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const URL = "https://api.nookipedia.com/villagers";

    try {
      setLoading(true);
      const response = await axios.get(URL, {
        headers: {
          "X-API-KEY": process.env.REACT_APP_API_KEY,
          "Accept-Version": "1.0.0",
        },
      });
      const animal = response.data.map(currentVillager => {
        const matchingVillager = villagers.find(villager => villager.name === currentVillager.name);
        if (matchingVillager) {
          return {
            ...currentVillager,
            name: matchingVillager.translations.kRko,
          };
        }
        // 매칭되는 주민이 없으면 해당 주민 제외
        return null;
      })
        .filter(villager => villager !== null) // null이 아닌 객체만 필터링
        .filter((villager, index, self) =>
          // 이름이 배열에서 처음 등장하는 경우에만 포함
          self.findIndex(v => v.name === villager.name) === index
        );
      console.log(villagers)
      console.log(animal)
      setData(animal);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>에러: {error}</p>;

  return (
    <div className='container'>
      <h1>동물의 숲</h1>
      <VillagerList villagers={data} />
    </div>
  );
}

export default Home;
