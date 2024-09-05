import { CyclingMonitor } from "../common/class/CyclingMonitor.js";

export class CyclingMonitorDFS extends CyclingMonitor {
    constructor(pairs, startToken, maxDepth, ...args) {
        super(...args);
        this.pairs = pairs;
        this.startToken = startToken;
        this.maxDepth = maxDepth;
    }

    // currentToken 토큰 객체, currentAmountIn 초기 값 입니다.
    // path는 토큰 객체가 들어있는 배열
    // depth는 숫자
    dfs = async (currentToken, currentAmountIn, path, depth) => {
        const visitedTokens = new Set(path);

        // 네트워크 속도 측정하려고 넣은 것
        const label = `RouteTime-${Date.now()}-${Math.random()}`;
        console.time(label);

        // 현재 뎁스가 최대 뎁스보다 큰경우
        if (depth > this.maxDepth) {
            // a -> .. -> a
            // 단위가 토큰의 개수
            const resultAmountOut = await this.priceFetcher.getPrice(
                currentToken,
                this.startToken,
                currentAmountIn
            );
            // 마지막 도착지 추가
            const resultRoute = [...path, this.startToken];

            const profit = resultAmountOut - this.amountIn;
            const isProfit = profit > 0 ? 1 : 0;
            console.timeEnd(label);

            // 데이터 콘솔 출력 및 저장
            await this.logAndSaveResult(
                resultRoute,
                resultAmountOut,
                profit,
                isProfit
            );

            return;
        }

        // pair 토큰들의 객체
        // {
        //     token1: {
        //         name: string,
        //         address: string,
        //         decimal: number,
        //         price: number
        //     } (In)
        //     token2: {토큰겍체} (Out)
        // }
        for (let pair of this.pairs) {
            if (
                pair.token1.name === currentToken.name &&
                !visitedTokens.has(pair.token2.name)
            ) {
                const nextToken = pair.token2;

                const nextAmountOut = await this.priceFetcher.getPrice(
                    currentToken,
                    nextToken,
                    currentAmountIn
                );

                // 경로추가
                path.push(nextToken);
                // 방문여부 추가
                visitedTokens.add(nextToken.name);

                // token2는 무조건 starToken이 되면 안됨.
                // startToken은 무조건 마지막에 호출
                if (nextToken.name !== this.startToken.name) {
                    // dfs 로직을 재귀
                    await this.dfs(nextToken, nextAmountOut, path, depth + 1);
                }

                path.pop();
                visitedTokens.delete(nextToken.name);
            }
        }
    };

    logAndSaveResult = async (
        resultRoute,
        resultAmountOut,
        profit,
        isProfit
    ) => {
        const logMessage = `
        ---------------------------------
        네트워크 : ${this.networkName}
        dex : ${this.dexName}
        시간 : ${new Date().toISOString()}
        depth : ${this.maxDepth}
        경로 : [${resultRoute.map((token) => token.name)}]
        시작 토큰 : ${resultRoute[0].name}
        input : ${this.amountIn.toFixed(this.startToken.decimal)}
        output : ${resultAmountOut.toFixed(this.startToken.decimal)}
        profit : ${profit.toFixed(this.startToken.decimal)}
        profit 여부 : ${isProfit ? 1 : 0}
    `;

        this.logger.logResult(logMessage);

        const resultData = {
            timestamp: new Date().toISOString(),
            network_name: this.networkName,
            dex_name: this.dexName,
            depth: this.maxDepth,
            path: JSON.stringify(resultRoute.map((token) => token.name)),
            start_token: resultRoute[0].name,
            input: this.amountIn.toFixed(this.startToken.decimal),
            output: resultAmountOut.toFixed(this.startToken.decimal),
            profit: profit.toFixed(this.startToken.decimal),
            profit_status: isProfit ? 1 : 0,
        };

        this.logger.saveResult(resultData);
    };

    // 모니터링 실행함수
    // amountIn: 달러 (50, 100, 150)
    monitor = async (amountIn) => {
        // this.amountIn : 토큰의 개수
        this.amountIn = amountIn / this.startToken.price;
        await this.init();
        await this.dfs(this.startToken, this.amountIn, [this.startToken], 1);
    };
}
