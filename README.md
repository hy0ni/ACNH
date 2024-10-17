# 동물의 숲 주민 정보 사이트(VillageHub)

개인 프로젝트 [React, Firebase, HTML, CSS]

## 프로젝트 소개

동물의 숲 API를 활용하여 주민 데이터를 불러오고, Firebase를 이용한 로그인 및 회원가입 기능을 구현한 웹 애플리케이션입니다. 사용자는 자신의 계정을 만들고 로그인하여, 좋아하는 주민을 찜할 수 있는 기능을 제공합니다. 찜한 주민은 마이페이지에서 확인할 수 있으며, 메인 페이지에서는 매일 랜덤으로 선정된 주민을 표시하여 새로운 주민을 발견할 수 있는 기회를 제공합니다.

## 기능

1. `주민 데이터 조회`: 동물의 숲 API를 통해 다양한 주민 정보를 불러와 사용자에게 제공합니다.
2. `로그인/회원가입`: Firebase 인증을 통해 사용자 계정을 생성하고 관리할 수 있습니다.
3. `오늘의 랜덤 주민 카드 표시`: 메인 페이지에서는 매일 랜덤으로 선정된 주민을 표시하여, 사용자가 새로운 주민을 발견할 수 있도록 합니다.
4. `주민 목록 필터링 및 검색 기능`: 주민의 종류와 성격으로 목록을 필터링하여 사용자가 원하는 주민 카드를 쉽게 찾을 수 있습니다.
5. `주민 찜하기`: 로그인한 사용자는 마음에 드는 주민을 찜하고, 찜한 주민 목록은 마이페이지에서 관리할 수 있습니다.

## 추가 사항

이 프로젝트에서는 한글 번역이 제공되지 않는 API를 보완하기 위해, 주민 이름 번역본을 제공하는 공개 Google 스프레드시트에서 생성된 데이터베이스를 활용했습니다. 또한, 일부 번역되지 않았거나 중복된 부분을 보완하고 주민 데이터에 대한 추가 정보를 제공하여 사용자에게 보다 친숙한 경험을 제공하기 위해 translations.js 파일을 구현했습니다.

```javascript
// 종류
const speciesKr = {
  "Alligator": "악어",
  "Anteater": "개미핥기",
  ...
};

// 성격
const personalityKr = {
  "Smug": "느끼함",
  "Big Sister": "단순활발",
  ...
};

// 성격에 따른 MBTI 정보
const personalityToMBTI = {
  "Smug": "ENTP",
  "Big Sister": "ESFJ",
  ...
};

// 성별
const genderKr = {
  "Male": "남 ♂",
  "Female": "여 ♀",
};

export { speciesKr, personalityKr, genderKr, personalityToMBTI };

```

```javascript
const fetchData = async () => {
  try {
    const villagersData = await fetchVillagers();
    const animal = villagersData
      .map((currentVillager) => {
        const matchingVillager = villagers.find(
          (villager) => villager.name === currentVillager.name
        );
        if (matchingVillager) {
          const personality = matchingVillager.personality;
          return {
            ...currentVillager,
            name: matchingVillager.translations.kRko, // 한글 번역된 이름
            species: speciesKr[matchingVillager.species], // 한글 번역된 종
            personality: personalityKr[matchingVillager.personality], // 한글 번역된 성격
            gender: genderKr[matchingVillager.gender], // 한글 번역된 성별
            mbti: personalityToMBTI[personality], // MBTI 정보
          };
        }
        return null;
      })
      .filter((villager) => villager !== null);

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
```
