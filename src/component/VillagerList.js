import '../css/VillagerList.css';

function VillagerList({ villagers }) {
  return (
    <ul className="villager-list">
      {villagers.map((villager, idx) => (
        <li key={idx} className="villager-item">
          <img src={villager.image_url} alt={villager.name} />
          <h2>{villager.name}</h2>
          <p>종: {villager.species}</p>
          <p>성격: {villager.personality}</p>
          <p>성별: {villager.gender}</p>
        </li>
      ))}
    </ul>
  )
}
export default VillagerList