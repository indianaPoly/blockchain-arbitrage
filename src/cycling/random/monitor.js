import { CyclingMonitor } from "../common/class/CyclingMonitor.js";
import { getRandomTokens, getPermuteToken } from "../../modules/index.js";

export class CyclingMonitorRandom extends CyclingMonitor {
    constructor(tokens, count, ...args) {
        super(...args);
        this.tokens = tokens;
        this.count = count;
    }

    // MARK: - randomSelect
    randomSelect = async (amountIn) => {
        // 토큰을 선택하는 로직
        const selectedToken = await getRandomTokens(this.tokens, this.count);
        // 사이클 형성
        const permutes = await getPermuteToken(selectedToken);

        //
        for (let permute of permutes) {
            console.time("RouteTime");

            // 초기 정보를 생성
            const { startToken, startAmountIn, path } =
                await this.initalizePath(permute, amountIn);

            const resultAmountOut = await this.caculateRouteProfit(
                permute,
                startAmountIn,
                path
            );

            if (resultAmountOut === null) {
                console.timeEnd("RouteTime");
                continue;
            }

            const profit = resultAmountOut - startAmountIn;

            console.timeEnd("RouteTime");

            // 이득이나 판단이 되는 경우에 스왑을 실행함.
            // if (profit > 0) {
            //     const tx = await this.executeSwaps(path, startAmountIn);
            //     await tx.wait();
            // }

            this.logAndSaveResult(
                path,
                startToken,
                startAmountIn,
                resultAmountOut,
                profit
            );
        }
    };

    // MARK: - initPath
    // 내부함수를 쓰면 시작토큰, 시작 가격, path의 초기 정보를 확인
    initalizePath = async (permute, amountIn) => {
        const startToken = permute[0];
        const startAmountIn = amountIn / startToken.price;
        const path = [startToken.name];

        return { startToken, startAmountIn, path };
    };

    // MARK: - calculateRouteProfit
    // permute : 1개의 경로 (토큰 객체 배열)
    // startAmount : 토큰의 개수
    // path : 토큰이름
    caculateRouteProfit = async (permute, startAmountIn, path) => {
        let nextAmountOut = startAmountIn;

        for (let i = 0; i < permute.length - 1; i++) {
            const currentToken = permute[i];
            const nextToken = permute[i + 1];

            path.push(nextToken.name);

            nextAmountOut = await this.priceFetcher.getPrice(
                currentToken,
                nextToken,
                nextAmountOut
            );

            if (isNaN(nextAmountOut)) {
                return null;
            }
        }

        path.push(path[0]); // Closing the loop by returning to the start token

        const finalAmountOut = await this.priceFetcher.getPrice(
            permute[permute.length - 1],
            permute[0],
            nextAmountOut
        );

        if (isNaN(finalAmountOut)) {
            return null;
        }

        return finalAmountOut;
    };

    // MARK: - logAndSaveResult
    logAndSaveResult = async (
        path,
        startToken,
        startAmountIn,
        resultAmountOut,
        profit
    ) => {
        const logMessage = `
                ---------------------------------
                network : ${this.networkName}
                dex : ${this.dexName}
                time : ${new Date().toISOString()}
                numOfToken  : ${this.count}
                path : [${path}]
                starttoken : ${path[0]}
                input : ${startAmountIn.toFixed(startToken.decimal)}
                output : ${resultAmountOut.toFixed(startToken.decimal)}
                profit : ${profit}
                profit status : ${profit > 0 ? 1 : 0}
            `;

        this.logger.logResult(logMessage);

        const resultData = {
            timestamp: new Date().toISOString(),
            network_name: this.network,
            dex_name: this.dexName,
            count: this.count,
            path: JSON.stringify(path),
            start_token: path[0],
            input: startAmountIn.toFixed(startToken.decimal),
            output: resultAmountOut.toFixed(startToken.decimal),
            profit,
            profit_status: profit > 0 ? 1 : 0,
        };

        this.logger.saveResult(resultData);
    };

    // MARK: - monitor
    monitor = async (amountIn) => {
        await this.init();
        await this.randomSelect(amountIn);
    };
}
