import { insertMultiArbitrageData } from "../../db/index.js";
import { createConfig } from "../config/index.js";
import { V2RouterGetPrice, V3RouterGetPrice } from "./index.js";

// 첫 번째 arbitrage와 마지막 swap 하는 dex가 달리 존재
// 기존 DFS와 동일한 절차를 가지게 됨
// (startToken -> x -> destination) => (destination -> startToken)
export class MultiHop {
    constructor(
        networkName,
        provider,
        firstDexConfig, // single arbitrage 거래가 일어나는 dex (uniswap과 같은 dex가 주를 이루어야함.)
        finalDexConfig, // 최종 swap이 일어나는 dex
        pairs, // 토큰들의 pair 정보
        startToken, // 시작 token
        destinationToken // desinationToken (기본 값은 WETH, 왜냐하면 다른 dex pool에서 제일 많이 존재하는 것이 weth이기 때문임.)
    ) {
        // 클래스 생성시에 생성자 초기화
        this.networkName = networkName;
        this.provider = provider;
        this.firstDexConfig = firstDexConfig;
        this.finalDexConfig = finalDexConfig;
        this.pairs = pairs;
        this.startToken = startToken;
        this.destinationToken = destinationToken;
    }

    getPriceFromDex = async (dexConfig, fromToken, toToken, amount) => {
        const config = await createConfig(this.networkName);
        if (dexConfig.routerType === "V3") {
            return await V3RouterGetPrice(
                config.quote.V1[dexConfig.dexName],
                this.provider,
                fromToken,
                toToken,
                config.fee_tier,
                amount
            );
        } else if (dexConfig.routerType === "V2") {
            return await V2RouterGetPrice(
                config.router[dexConfig.routerType][dexConfig.dexName],
                this.provider,
                amount,
                fromToken,
                toToken
            );
        } else {
            throw new Error(`Unsupported DEX type: ${dexConfig.routerType}`);
        }
    };

    // startAmount는 달러. 달러에 따라서 다양하게 모니터링을 하기 위해서 인자로 startAmount 값을 넣어줌
    arbitrage = async (startAmount) => {
        try {
            const swapPath = [this.startToken]; // swap 경로 저장을 위한 변수
            const startAmountIn = startAmount / this.startToken.price; // 최종 profit 계산시 사용되는 상수
            let maxExpectedDestinationToken = {
                token: null,
                price: 0,
            };

            const path = [this.startToken];

            // 해당 로직은 dex1에서 startToken -> B -> destinationToken에서 효율적인 B를 찾는 로직임
            // = wETH를 제일 많이 교환해주는 B 찾기
            for (let pair of this.pairs) {
                if (
                    pair.token1.name === this.startToken.name &&
                    !path.includes(pair.token2.name) &&
                    pair.token2.name !== this.destinationToken.name
                ) {
                    let nextToken = pair.token2;

                    let intermediateAmountIn = await this.getPriceFromDex(
                        this.firstDexConfig,
                        this.startToken,
                        nextToken,
                        startAmountIn
                    );

                    let expectedDestinationToken = await this.getPriceFromDex(
                        this.firstDexConfig,
                        nextToken,
                        this.destinationToken,
                        intermediateAmountIn
                    );

                    if (
                        expectedDestinationToken >
                        maxExpectedDestinationToken.price
                    ) {
                        maxExpectedDestinationToken.price =
                            expectedDestinationToken;
                        maxExpectedDestinationToken.token = nextToken;
                    }
                }
            }

            // 모니터링 진행
            // startToken -> maxExpectedDestinationToken
            let swap1AmountOut = await this.getPriceFromDex(
                this.firstDexConfig,
                this.startToken,
                maxExpectedDestinationToken.token,
                startAmountIn
            );
            swapPath.push(maxExpectedDestinationToken.token);

            // maxExpectedDestinationToken -> destinationToken
            let destinationTokenAmount = await this.getPriceFromDex(
                this.firstDexConfig,
                maxExpectedDestinationToken.token,
                this.destinationToken,
                swap1AmountOut
            );
            swapPath.push(this.destinationToken);

            // destinationToken -> startToken
            let resultAmount = await this.getPriceFromDex(
                this.finalDexConfig,
                this.destinationToken,
                this.startToken,
                destinationTokenAmount
            );
            swapPath.push(this.startToken);

            let profit = resultAmount - startAmountIn;
            if (profit > 0) {
                //실제 거래가 발생하는 코드
            }

            // logCallback 및 resultCallback 진행
            const logMessage = `
                ---------------------------------
                네트워크 : ${this.networkName}
                첫번째 DEX : ${this.firstDexConfig.dexName}
                최종 DEX : ${this.finalDexConfig.dexName}
                시간 : ${new Date().toISOString()}
                경로 : [${swapPath.map((token) => token.name)}]
                시작 토큰 : ${swapPath[0].name}
                input : ${startAmountIn}
                입력되는 weth : ${destinationTokenAmount}
                output : ${resultAmount}
                profit : ${profit}
                profit 여부 : ${profit > 0 ? 1 : 0}
            `;

            console.log(logMessage);

            const resultData = {
                timestamp: new Date().toISOString(),
                network_name: this.networkName,
                first_dex_name: this.firstDexConfig.dexName,
                final_dex_name: this.finalDexConfig.dexName,
                path: JSON.stringify(swapPath.map((token) => token.name)),
                start_token: swapPath[0].name,
                input: startAmountIn.toFixed(this.startToken.decimal),
                output: resultAmount.toFixed(this.startToken.decimal),
                profit,
                profit_status: profit > 0 ? 1 : 0,
            };

            insertMultiArbitrageData(resultData);
        } catch (err) {
            console.error(err);
        }
    };

    monitor = async (amountIn) => {
        await this.arbitrage(amountIn);
    };
}

export const dualDexTokenPairPriceMonitor = async (
    pair,
    amountIn,
    networkProvider,
    monitorConfig,
    logCallback,
    resultCallback
) => {
    const { networkName, router1isV3, router1Name, router2isV3, router2Name } =
        monitorConfig;

    const config = await createConfig(networkName);

    let router1Price, router2Price;

    const logs = [];

    try {
        logs.push("------------------------");
        logs.push(`모니터링 시간: ${new Date().toLocaleString()}`);
        logs.push(`모니터링 네트워크: ${networkName}`);
        logs.push(`token pair: ${pair.token1.name} / ${pair.token2.name}`);
        logs.push(
            `처음 금액 : ${amountIn.toFixed(pair.token1.decimal)} ${
                pair.token1.name
            }`
        );

        if (router1isV3) {
            router1Price = await V3RouterGetPrice(
                config.quote.V1[router1Name],
                networkProvider,
                pair.token1,
                pair.token2,
                3000,
                amountIn
            );
        } else {
            router1Price = await V2RouterGetPrice(
                config.router.V2[router1Name],
                networkProvider,
                amountIn,
                pair.token1,
                pair.token2
            );
        }

        logs.push(
            `${router1Name}에서 ${pair.token1.name} -> ${
                pair.token2.name
            } 예상 수량: ${router1Price.toFixed(pair.token2.decimal)} ${
                pair.token2.name
            }`
        );

        if (router2isV3) {
            router2Price = await V3RouterGetPrice(
                config.quote.V1[router2Name],
                networkProvider,
                pair.token2,
                pair.token1,
                3000,
                router1Price
            );
        } else {
            router2Price = await V2RouterGetPrice(
                config.router.V2[router2Name],
                networkProvider,
                router1Price,
                pair.token2,
                pair.token1
            );
        }

        logs.push(
            `${router2Name}에서 ${pair.token2.name} -> ${
                pair.token1.name
            } 예상 수량: ${router2Price.toFixed(pair.token1.decimal)} ${
                pair.token1.name
            }`
        );

        const profit = router2Price - amountIn;

        logs.push(
            `아비트리지 여부: ${
                profit > 0 ? "True" : "False"
            } (수익: ${profit} ${pair.token1.name})`
        );

        logCallback(logs);

        const result = {
            timestamp: new Date().toLocaleString(),
            network_name: networkName,
            first_dex_name: router1Name,
            second_dex_name: router2Name,
            start_token: pair.token1.name,
            swap_token: pair.token2.name,
            input: amountIn.toFixed(pair.token1.decimal),
            output: router2Price.toFixed(pair.token2.decimal),
            profit: profit,
            profit_status: profit > 0 ? 1 : 0,
        };

        resultCallback(result);
    } catch {}
};
