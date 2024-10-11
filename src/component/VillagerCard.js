const VillagerCard = ({ villager }) => {
  return (
    <div className="villager-card">
      <h2>{villager.name}</h2>
      <img src={villager.image_url} alt={villager.name} />
      <p>종족: {villager.species}</p>
      <p>성격: {villager.personality}</p>
      <p>성별: {villager.gender}</p>
      <p>MBTI: {villager.mbti}</p>
    </div>
  );
};

export default VillagerCard;
