// 이더 메인 체인에 배포 되어있는 주소
// contract 객체에는 솔리디티 코드로 만들어 배포한 주소가 들어가야햠.
// quote : 스왑할 토큰의 개수를 가져오는 컨트랙트
// router : 스왑을 진행할 수 있는 컨트랙트
export const ethConfig = {
    contract: {
        staking: "",
        swap: "0x2eC85283dDA6787383009376580Ee1d757666501",
    },
    // qoute 컨트랙트의 경우 V2에서는 사용하지 않고, V3에서만 사용을 함.
    quote: {
        V1: {
            uniswap: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
            sushiswap: "0x64e8802FE490fa7cc61d3463958199161Bb608A7",
        },
        V2: {
            uniswap: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
            sushiswap: "0x64e8802FE490fa7cc61d3463958199161Bb608A7",
            pancakeswap: "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
        },
    },
    // V2에서는 router를 통해서 가격을 가져옴.
    router: {
        V2: {
            uniswap: "0x7a250d5630b4cf539739df2c5dacf4c73e15f9b7",
            sushiswap: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
        },
        V3: {
            uniswap: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
            sushiswap: "0x2E6cd2d30aa43f40aa81619ff4b6E0a41479B13F",
        },
    },
    // 슬리피지 적용 퍼센티지 (임의로 정함)
    slippageTolerance: 0.5,
    // V3의 경우 수수료 티어 존재 (0.3% pool이 많기 때문에 3000 으로 설정을 해둠)
    fee_tier: 3000,
};
