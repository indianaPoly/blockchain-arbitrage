// 만타 메인 체인에 배포 되어있는 주소
// contract 객체에는 솔리디티 코드로 만들어 배포한 주소가 들어가야햠.
// quote : 스왑할 토큰의 개수를 가져오는 컨트랙트
// router : 스왑을 진행할 수 있는 컨트랙트

// 만타의 경우 uniswap이 없고 quickswap이 존재
export const mantaConfig = {
    contract: {
        staking: "",
        swap: "",
    },
    quote: {
        V1: {
            quickswap: "0x3005827fB92A0cb7D0f65738D6D645d98A4Ad96b",
        },
        V2: {},
    },
    router: {
        V2: {},
        V3: {
            quickswap: "0xfdE3eaC61C5Ad5Ed617eB1451cc7C3a0AC197564",
        },
    },
    slippageTolerance: 0.5,
    fee_tier: 3000,
};
