// 토큰의 정보를 저장하는 토큰 배열
// decimal: 소수점 자리수
// price: 현재는 0으로 설정이 되어있으나 가격을 가져오는 함수를 사용하면 업데이트가 진행
// price의 경우 1개 토큰이 몇 USD의 가치가 있는지 ex. 1WETH = 3000USD
export const arbToken = [
    {
        name: "WBTC",
        address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        decimal: 8,
        price: 0, // WBTC의 가상 가격 (단위: USD)
    },
    {
        name: "WETH",
        address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        decimal: 18,
        price: 0, // WETH의 가상 가격 (단위: USD)
    },
    {
        name: "UNI",
        address: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
        decimal: 18,
        price: 0, // UNI의 가상 가격 (단위: USD)
    },
    {
        name: "LINK",
        address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
        decimal: 18,
        price: 0, // LINK의 가상 가격 (단위: USD)
    },
    {
        name: "USDC",
        address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        decimal: 6,
        price: 0, // USDC의 가상 가격 (단위: USD)
    },
    {
        name: "USDT",
        address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        decimal: 6,
        price: 0, // USDT의 가상 가격 (단위: USD)
    },
];
