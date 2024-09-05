// 폴리곤 메인 체인에 배포 되어있는 주소
// contract 객체에는 솔리디티 코드로 만들어 배포한 주소가 들어가야햠.
// quote : 스왑할 토큰의 개수를 가져오는 컨트랙트
// router : 스왑을 진행할 수 있는 컨트랙트
export const polygonConfig = {
    contract: {
        staking: "",
        swap: "",
    },
    quote: {
        V1: {
            uniswap: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
            quickswap: "0xa15F0D7377B2A0C0c10db057f641beD21028FC89",
        },
        V2: {
            uniswap: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
            sushiswap: "0xb1E835Dc2785b52265711e17fCCb0fd018226a6e",
        },
    },
    router: {
        V2: {
            uniswap: "0xedf6066a2b290C185783862C7F4776A2C8077AD1",
            sushiswap: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        },
        V3: {
            uniswap: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
            sushiswap: "",
            quickswap: "0xf5b509bB0909a69B1c207E495f687a596C168E12",
        },
    },
    slippageTolerance: 0.5,
    fee_tier: 3000,
};
