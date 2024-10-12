import '../css/VillagerList.css';

function VillagerList({ villagers, ownedVillagers, toggleOwnership }) {
  return (
    <ul className="villager-list">
      {villagers.map((villager, idx) => (
        <li key={idx} className="villager-item">
          <img src={villager.image_url} alt={villager.name} />
          <h2>{villager.name}</h2>
          <p>종: {villager.species}</p>
          <p>성격: {villager.personality}</p>
          <p>성별: {villager.gender}</p>
          <p>MBTI: {villager.mbti || '정보 없음'}</p>
          <button
            onClick={() => toggleOwnership(villager.name)} // 이름 전달
            style={{ color: ownedVillagers.includes(villager.name) ? 'red' : 'gray' }} // 소유한 주민 목록 이름이 일치하면 red, 없으면 gray
          >
            ♥
          </button>
        </li>
      ))}
    </ul>
  )
}
export default VillagerList