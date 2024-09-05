// 토큰의 정보를 저장하는 토큰 배열
// decimals: 소수점 자리수
// price: 현재는 0으로 설정이 되어있으나 가격을 가져오는 함수를 사용하면 업데이트가 진행
// price의 경우 1개 토큰이 몇 USD의 가치가 있는지 ex. 1WETH = 3000USD
export const ethTokens = [
    {
        name: "WBTC",
        address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        decimal: 8,
        price: 0
    },
    {
        name: "WETH",
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        decimal: 18,
        price: 0
    },
    {
        name: "UNI",
        address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        decimal: 18,
        price: 0
    },
    {
        name: "LINK",
        address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        decimal: 18,
        price: 0
    },
    {
        name: "USDC",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimal: 6,
        price: 0
    },
    {
        name: "USDT",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        decimal: 6,
        price: 0
    },
];
