import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VillagerList from '../component/VillagerList';
import { villagers } from 'animal-crossing';
import { genderKr, personalityKr, speciesKr } from '../translations/translations';


function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const URL = "https://api.nookipedia.com/villagers?game=nh&game=pc";

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
            species: speciesKr[matchingVillager.species],
            personality: personalityKr[matchingVillager.personality],
            gender: genderKr[matchingVillager.gender],
          }
        }
        return null;// 일치하는 Villager가 없을 때는 null을 반환
      });
      // console.log(animal);
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
