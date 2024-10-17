import PropTypes from 'prop-types';

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

// props에 대한 타입 지정
VillagerCard.propTypes = {
  villager: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    personality: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    mbti: PropTypes.string.isRequired,
  }).isRequired,
};

export default VillagerCard;
