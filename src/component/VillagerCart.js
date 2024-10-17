import PropTypes from 'prop-types';

const VillagerCart = ({ villagers }) => {
  return (
    <ul className="villager-card">
      {villagers.length === 0 ? (
        <p>소유한 주민이 없습니다.</p>
      ) : (
        villagers.map((villager) => (
          <li key={villager.name} className="villager-card">
            <img src={villager.image_url} alt={villager.name} />
            <h3>{villager.name}</h3>
            <p>종: {villager.species}</p>
            <p>성격: {villager.personality}</p>
            <p>성별: {villager.gender}</p>
            <p>MBTI: {villager.mbti}</p>
          </li>
        ))
      )}
    </ul>
  );
};

// props에 대한 타입 지정
VillagerCart.propTypes = {
  villagers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      species: PropTypes.string.isRequired,
      personality: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
      mbti: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default VillagerCart;
