// 토큰의 정보를 저장하는 토큰 배열
// decimal: 소수점 자리수
// price: 현재는 0으로 설정이 되어있으나 가격을 가져오는 함수를 사용하면 업데이트가 진행
// price의 경우 1개 토큰이 몇 USD의 가치가 있는지 ex. 1WETH = 3000USD
export const polygonTokens = [
    {
        name: "WMATIC",
        address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        decimal: 18,
        price: 0,
    },
    {
        name: "WBTC",
        address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        decimal: 8,
        price: 0,
    },
    {
        name: "WETH",
        address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        decimal: 18,
        price: 0,
    },
    {
        name: "DAI",
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        decimal: 18,
        price: 0,
    },
    {
        name: "USDC",
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        decimal: 6,
        price: 0,
    },
    {
        name: "USDT",
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        decimal: 6,
        price: 0,
    },
];
