import hre from "hardhat";

// 토큰의 개수랑, 소수점 자리를 넣으면 wei 단위로 변경
export const roundToDecimals = (value, decimals) => {
    const factor = Math.pow(10, decimals);
    const amountInRounded = Math.round(value * factor) / factor;
    return hre.ethers.parseUnits(amountInRounded.toString(), decimals);
};

// 토큰들의 쌍을 만들어 주는 pair
export const makeTokenPairs = async (tokens) => {
    const tokenPairs = [];

    tokens.forEach((token1, index1) => {
        tokens.forEach((token2, index2) => {
            if (index1 !== index2) {
                tokenPairs.push({
                    token1: token1,
                    token2: token2,
                });
            }
        });
    });

    return tokenPairs;
};

// 토큰 count만큼 랜덤 선택
export const getRandomTokens = async (tokens, count) => {
    const shuffled = tokens.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// 선택한 토큰에 대해서 사이클생성
export const getPermuteToken = async (arr) => {
    let result = [];
    if (arr.length === 1) return [arr];
    for (let i = 0; i < arr.length; i++) {
        const currentToken = arr[i];
        const remainingTokens = arr.slice(0, i).concat(arr.slice(i + 1));
        const remainingPermutations = await getPermuteToken(remainingTokens); // 수정된 부분
        for (let perm of remainingPermutations) {
            result.push([currentToken].concat(perm));
        }
    }
    return result;
};
