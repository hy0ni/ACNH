import axios from 'axios';
import { useEffect, useState } from 'react';
import './css/App.css';
import VillagerList from './component/VillagerList';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const URL = "https://api.nookipedia.com/villagers";

    try {
      setLoading(true); // 요청 시작 시 로딩 상태를 true로 설정
      const response = await axios.get(URL, {
        headers: {
          "X-API-KEY": process.env.REACT_APP_API_KEY,
          "Accept-Version": "1.0.0",
        },
      });
      setData(response.data); // 요청이 성공하면 데이터를 설정
      console.log(response);
    } catch (error) {
      setError(error.message); // 에러가 발생하면 에러 메시지를 설정
    } finally {
      setLoading(false); // 요청이 완료되면 로딩 상태를 false로 설정
    }
  }

  useEffect(() => {
    fetchData(); // 컴포넌트가 마운트될 때 fetchData 함수를 호출
  }, []);


  if (loading) return <p>Loading...</p>; // 로딩 중일 때 로딩 메시지 표시
  if (error) return <p>Error: {error}</p>; // 에러가 발생하면 에러 메시지 표시

  return (
    <div className='container'>
      <h1>Animal Crossing</h1>
      <VillagerList villagers={data} />
    </div>
  );
}

export default App;
