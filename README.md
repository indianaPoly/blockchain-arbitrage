# Dex to Dex Cycling Arbitrage Monitoring System

현장실습에서 진행한 탈중앙화 거래소간 차익거래 모니터링 시스템 입니다.

## 주요 기능

#### 1. 차익거래 탐지 알고리즘 구현

- DFS 알고리즘 
- Random 알고리즘

#### 2. 병렬 탐색 구현

- NodeJS의 message 기반 프로세스를 활용

## 기술 스택 및 개발 상세 내용

- NodeJS를 활용한 모니터링 시스템 구축
- 4개의 자식 프로세스를 활용한 Free tier에서 동작
- 자식 프로세스로 데이터 전달시 역직렬화 과정에서 발생한 에러 핸들링 진행
- PM2를 활용한 백그라운드 동작가능하도록 설정
- SQLite3에 데이터 저장 및 결과 분석

## 보유 기술

NodeJS, JavaScript, SQL Query

## 동작 링크

- [https://youtube.com/shorts/_YthQ2fvJHY?feature=share]
