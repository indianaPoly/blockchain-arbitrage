import { getExchangeRate, makeTokenPairs } from "../modules/index.js";
import {
    arbConfig,
    arbToken,
    bscConfig,
    bscTokens,
    ethConfig,
    ethTokens,
    polygonConfig,
    polygonTokens,
    mantaConfig,
    mantaTokens,
} from "./index.js";

// 가격 정보를 업데이트 하는 함수
export const updateTokenPrice = async (tokens) => {
    // getExchangeRate 함수는 src/modules/api.js에 구현
    const exchangeRates = await getExchangeRate();
    // 가져온 가격 정보를 기반으로 하여 업데이트
    if (exchangeRates) {
        tokens.forEach((token) => {
            switch (token.name) {
                case "WBTC":
                    token.price = exchangeRates.btc;
                    break;
                case "WETH":
                    token.price = exchangeRates.eth;
                    break;
                case "UNI":
                    token.price = exchangeRates.uni;
                    break;
                case "LINK":
                    token.price = exchangeRates.link;
                    break;
                case "USDC":
                    token.price = exchangeRates.usdc;
                    break;
                case "USDT":
                    token.price = exchangeRates.usdt;
                    break;
                case "DAI":
                    token.price = exchangeRates.dai;
                    break;
                case "WMATIC":
                    token.price = exchangeRates.matic;
                    break;
                case "MANTA":
                    token.price = exchangeRates.manta;
                    break;
                case "TIA":
                    token.price = exchangeRates.tia;
                    break;
                case "QUICK":
                    token.price = exchangeRates.quick;
                    break;
                default:
                    break;
            }
        });
    }
    console.log("Update exchange Rate!");
};

// 네트워크 이름에 따라서 config를 만듦.
export const createConfig = async (networkName) => {
    let tokens;

    switch (networkName) {
        case "eth":
            tokens = ethTokens;
            break;
        case "bsc":
            tokens = bscTokens;
            break;
        case "polygon":
            tokens = polygonTokens;
            break;
        case "arb":
            tokens = arbToken;
            break;
        case "manta":
            tokens = mantaTokens;
        default:
            break;
    }

    // makeTokenPairs도 같이 만듦 -> DFS 알고리즘에서 tokenPairs를 사용하기 때문
    const tokenPairs = await makeTokenPairs(tokens);

    // 네트워크 이름에 따라서 config를 리턴함
    switch (networkName) {
        case "eth":
            return {
                tokens: tokens,
                tokenPairs: tokenPairs,
                ...ethConfig,
            };
        case "bsc":
            return {
                tokens: tokens,
                tokenPairs: tokenPairs,
                ...bscConfig,
            };
        case "polygon":
            return {
                tokens: tokens,
                tokenPairs: tokenPairs,
                ...polygonConfig,
            };
        case "arb":
            return {
                tokens: tokens,
                tokenPairs: tokenPairs,
                ...arbConfig,
            };
        case "manta":
            return {
                tokens: tokens,
                tokenPairs: tokenPairs,
                ...mantaConfig,
            };
    }
};
