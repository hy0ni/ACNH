import React, { useState, useEffect } from 'react';
import VillagerList from '../component/VillagerList';
import { villagers } from 'animal-crossing';
import { genderKr, personalityKr, speciesKr } from '../translations/translations';
import { fetchVillagers } from '../api/api';

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState('');

  const fetchData = async () => {
    try {
      const data = await fetchVillagers();
      const animal = data.map(currentVillager => {
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
        return null;
      });
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

  // 선택된 동물 종류에 따른 필터링
  const filteredVillagers = selectedSpecies
    ? data.filter(villager => villager.species === selectedSpecies)
    : data;

  // 동물 종류를 클릭했을 때 호출되는 함수
  const handleSpeciesClick = (species) => {
    setSelectedSpecies(species);
  };

  if (loading) return <p>Loading...</p>;
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
      <VillagerList villagers={filteredVillagers} />
    </div>
  );
}

export default Home;
