import PropTypes from 'prop-types';
import '../css/VillagerList.css';

const VillagerList = ({ villagers, ownedVillagers = [], toggleOwnership, isUserLoggedIn }) => {
  const renderVillagerItem = (villager) => {
    const isOwned = ownedVillagers.includes(villager.name);
    return (
      <li key={villager.id} className="villager-item"> {/* 고유 ID 사용 */}
        <img src={villager.image_url} alt={villager.name} />
        <h2>{villager.name}</h2>
        <p>종: {villager.species}</p>
        <p>성격: {villager.personality}</p>
        <p>성별: {villager.gender}</p>
        <p>MBTI: {villager.mbti || '정보 없음'}</p>
        {isUserLoggedIn && ( // 로그인 상태일 때만 버튼 렌더링
          <button
            onClick={() => toggleOwnership(villager.name)}
            className={isOwned ? 'owned' : ''}
          >
            {isOwned ? '❤️' : '🤍'}
          </button>
        )}
      </li>
    );
  };

  return (
    <ul className="villager-list">
      {villagers.length === 0 ? (
        <p>등록된 주민이 없습니다.</p>
      ) : (
        villagers.map(renderVillagerItem)
      )}
    </ul>
  );
};

// props에 대한 타입을 지정
VillagerList.propTypes = {
  villagers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      species: PropTypes.string.isRequired,
      personality: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
      mbti: PropTypes.string,
      image_url: PropTypes.string.isRequired,
    })
  ).isRequired,
  ownedVillagers: PropTypes.arrayOf(PropTypes.string),
  toggleOwnership: PropTypes.func.isRequired,
  isUserLoggedIn: PropTypes.bool.isRequired,
};

export default VillagerList;
