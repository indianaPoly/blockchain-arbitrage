// 토큰의 정보를 저장하는 토큰 배열
// decimal: 소수점 자리수
// price: 현재는 0으로 설정이 되어있으나 가격을 가져오는 함수를 사용하면 업데이트가 진행
// price의 경우 1개 토큰이 몇 USD의 가치가 있는지 ex. 1WETH = 3000USD
export const mantaTokens = [
    {
        name: "MANTA",
        address: "0x95CeF13441Be50d20cA4558CC0a27B601aC544E5",
        decimal: 18,
        price: 0
    },
    {
        name: "WBTC",
        address: "0x305E88d809c9DC03179554BFbf85Ac05Ce8F18d6",
        decimal: 8,
        price: 0
    },
    {
        name: "WETH",
        address: "0x0Dc808adcE2099A9F62AA87D9670745AbA741746",
        decimal: 18,
        price: 0
    },
    {
        name: "DAI",
        address: "0x1c466b9371f8aBA0D7c458bE10a62192Fcb8Aa71",
        decimal: 18,
        price: 0
    },
    {
        name: "USDC",
        address: "0xb73603C5d87fA094B7314C74ACE2e64D165016fb",
        decimal: 6,
        price: 0
    },
    {
        name: "USDT",
        address: "0xf417F5A458eC102B90352F697D6e2Ac3A3d2851f",
        decimal: 6,
        price: 0
    },
    {
        name: "TIA",
        address: "0x6Fae4D9935E2fcb11fC79a64e917fb2BF14DaFaa",
        decimal: 6,
        price: 0
    },
    {
        name: "QUICK",
        address: "0xE22E3D44Ea9Fb0A87Ea3F7a8f41D869C677f0020",
        decimal: 18,
        price: 0
    },
];
