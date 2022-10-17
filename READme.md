# Bacharta-BE

<br/>
<br/>

## 🙉서비스 개요

Bacharta Project를 위한 백엔드 서버
다양한 자료들을 chart.js를 이용해 보여주는 사이트입니다!

- 카카오를 이용한 소셜로그인 구현
- 공공 api에서 받아온 xml 데이터를 json으로 파싱
- 브라우저 간의 cors에러 해결

<br/>

## 실행 방법

    $ git clone https://github.com/dlsxody1/bacharta-BE.git
    $ npm install
    $ nodemon server.js
 

## .env key value

- .env 파일을 올리지 않을 것이기 때문에 키값과 value에 어떤 것이 들어가야하는지 적어놓겠습니다.
- EXCHANGE_KEY,ATMOSPHERE_KEY,COVID_KEY 는 https://www.data.go.kr/index.do 에서 회원가입 하신 후에 맨 아래에 있는 링크에서 
사용허가를 받으시면 키가 나옵니다.
- OPEN_WEATHER_KEY 는 https://openweathermap.org/api/one-call-3에서 회원가입 후에 api키 발급 받으시고 이용하시면 됩니다!

```
MONGODB_KEY = mongodb id와 password입니다 -> mongodbID:password
SECRET_KEY = jwt 토큰을 발급할 때 필요한 값입니다 임의로 정해줘도 괜찮습니다.
EXCHANGE_KEY  = ...
ATMOSPHERE_KEY = ...
OPEN_WEATHER_KEY = ...
COVID_KEY = ...
```

## ✔기술 스택
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white">

<br/>

## ✔폴더구조
```.
├── README.md
├── api
│   └── api.js
├── routes
|   ├── atmosphereRouter.js
|   ├── covidRouter.js
|   ├── crimeRouter.js
|   ├── exchangeRouter.js
|   ├── locationRouter.js
|   └── loginRouter.js
├── .env
├── .gitignore
├── atmosphere.json
├── locationData.json
├── server.js
├── node_modules
├── package-lock.json
└── package.json
```

## ✔구현내용

- 로그인 (/user/sign)

  1. 클라이언트가 로그인을 성공했을시에 프론트에서 받은 유저의 카카오 토큰을 받아옵니다. 
  2. KakaoPk라는 변수에 유저를 식별할 수 있는 unique key 값을 저장합니다.
  3. userRow라는 변수에 db안의 collection에서 ,2번에서 저장한 unique key값이 있는지 찾는 함수를 선언합니다.
  4. db안에 값이 없으면 저장하고 있으면 그대로 실행합니다.
  5. 헤더에 jwt.sign 을 이용해서 발급된 서비스 토큰을 넣어 발급합니다.
 
 <br/>
 
- 대기 api (/atmosphere/:location)

  1. 유저가 요청할 때 1~10까지 path parameter로 요청할 수 있게 만들었습니다.
  2. 위치에 따른 현재 대기오염 상태를 불러오는 api를 axios로 요청하고 받아온 데이테를 파싱합니다.
  3. 파싱한 데이터를 성공 메세지와 함께 보내줍니다.
 
 <br/>
 
- 코로나 api (/covid)
  
  1. 유저가 요청할 때 로 일주일간 코로나 발생자 수를 불러오는 api를 요청합니다.
  2. 통신이 성공하면 데이터를 json 형태로 클라이언트에게 보내줍니다.
 
 <br/>
 
 - 환율 api (/exchage)
  
  1. 유저가 요청할 때 로 일주일간 코로나 발생자 수를 불러오는 api를 요청합니다.
  2. 통신이 성공하면 데이터를 json 형태로 클라이언트에게 보내줍니다.
  
   <br/>
   
 - 날씨 api (/location)
 
  1. 유저가 요청했을 때 지역별 날씨를 보내주는 api를 요청합니다.
  2. 요청 할 때 다양한 지역에 대해서 요청 해줘야 하기 때문에 locationData.json 으로 map 함수를 써서 요청한 모든 데이터를 저장해서 보내줬습니다.
  
   <br/>
    
  - 범죄 api (/crime)
  
  1. 유저가 요청할 때 지역별 성범죄자들 수를 불러오는 api를 요청합니다.
  2. 받아온 데이테를 파싱합니다.
  3. 파싱한 데이터를 성공 메세지와 함께 보내줍니다.
  

## 사용된 공공 api 목록

```
- 환율 api : https://www.koreaexim.go.kr/index
- 코로나 api : https://www.data.go.kr/data/15099842/openapi.do
- 범죄 api : https://www.data.go.kr/data/3072018/openapi.do
- 대기 api : https://www.data.go.kr/data/15073861/openapi.do
- 낳씨 api : https://openweathermap.org/api/one-call-3

```



