// hooks/useVillagersData.js
import { useState, useEffect } from 'react';
import { villagers } from 'animal-crossing';
import { fetchVillagers } from '../api';
import { genderKr, personalityKr, speciesKr, personalityToMBTI } from '../translations/translations';

const useVillagersData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return { data, loading, error };
};

export default useVillagersData;
