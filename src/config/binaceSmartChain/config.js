// 바이난스 메인 체인에 배포 되어있는 주소
// contract 객체에는 솔리디티 코드로 만들어 배포한 주소가 들어가야햠.
// quote : 스왑할 토큰의 개수를 가져오는 컨트랙트
// router : 스왑을 진행할 수 있는 컨트랙트
export const bscConfig = {
    contract: {
        staking: "",
        swap: "",
    },
    // qoute 컨트랙트의 경우 V2에서는 사용하지 않고, V3에서만 사용을 함.
    quote: {
        V1: {
            uniswap: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
            sushiswap: "",
        },
        V2: {
            pancakeswap: "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
        },
    },
    // V2에서는 router를 통해서 가격을 가져옴.
    router: {
        V2: {
            uniswap: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
            sushiswap: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
        },
        V3: {
            uniswap: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
            sushiswap: "",
            pancakeswap: "0x1b81D678ffb9C0263b24A97847620C99d213eB14",
        },
    },
    // 슬리피지 적용 퍼센티지 (임의로 정함)
    slippageTolerance: 0.1,
    // V3의 경우 수수료 티어 존재 (0.3% pool이 많기 때문에 3000 으로 설정을 해둠)
    fee_tier: 3000,
};
