import React, { useState, useEffect, useRef } from 'react';
import musicData from '../data/musicData.json';

function MusicPlayer() {
  const [currentMusic, setCurrentMusic] = useState(null); // 현재 재생 중인 음악 정보
  const [isPlaying, setIsPlaying] = useState(false); // 재생 중인지 여부
  const audioRef = useRef(null); // 오디오 객체를 ref로 관리

  useEffect(() => {
    if (currentMusic) {
      // 기존 오디오 객체를 정리하고 새 오디오 객체 생성
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const musicUrl = `/music/${currentMusic['file-name']}.mp3`; // 파일 URL 생성
      const newAudio = new Audio(musicUrl);
      audioRef.current = newAudio;
      audioRef.current.play();
      setIsPlaying(true); // 음악 재생 중 상태로 변경

      // 컴포넌트가 언마운트되거나 음악이 변경될 때 기존 오디오 정리
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [currentMusic]);

  const handlePlayPause = (musicKey) => {
    const music = musicData[musicKey]; // JSON에서 음악 데이터 가져오기

    if (currentMusic && currentMusic['file-name'] === music['file-name']) {
      // 현재 재생 중인 음악과 같은 음악 클릭 시 재생/일시정지
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      // 다른 음악 클릭 시 새로운 음악 재생
      setCurrentMusic(music);
    }
  };

  return (
    <div className='music-player'>
      <ul>
        {Object.keys(musicData).map((key) => {
          const music = musicData[key];
          const imageUrl = `/images/${music['file-name']}.png`; // 파일 URL 생성
          return (
            <li key={music.id}>
              <img src={imageUrl} alt={music.name["name-KRko"]} width={100} height={100} />
              <button onClick={() => handlePlayPause(key)}>
                {currentMusic && currentMusic['file-name'] === music['file-name'] && isPlaying
                  ? "Pause"
                  : "Play"}{''}
                {music.name["name-KRko"]}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MusicPlayer;
