// 아비트럼 메인 체인에 배포 되어있는 주소
// contract 객체에는 솔리디티 코드로 만들어 배포한 주소가 들어가야햠.
// quote : 스왑할 토큰의 개수를 가져오는 컨트랙트
// router : 스왑을 진행할 수 있는 컨트랙트
export const arbConfig = {
    contract: {
        staking: "",
        swap: "",
    },
    // qoute 컨트랙트의 경우 V2에서는 사용하지 않고, V3에서만 사용을 함.
    quote: {
        V1: {
            uniswap: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
        },
        V2: {
            uniswap: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
        },
    },
    // V2에서는 router를 통해서 가격을 가져옴.
    router: {
        V2: {
            uniswap: "",
            sushiswap: "",
        },
        V3: {
            uniswap: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
            sushiswap: "",
        },
    },
    // 슬리피지 적용 퍼센티지 (임의로 정함)
    slippageTolerance: 0.5,
    // V3의 경우 수수료 티어 존재 (0.3% pool이 많기 때문에 3000 으로 설정을 해둠)
    fee_tier: 3000,
};
