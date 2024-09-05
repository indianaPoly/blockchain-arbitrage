import { createTable, insertDualArbitrageData } from "../../db/index.js";
import { createConfig, updateTokenPrice } from "../config/index.js";
import {
    V2RouterGetPrice,
    V3RouterGetPrice,
    makeProvider,
} from "../modules/index.js";
import { fork } from "child_process";

// 가능성이 좋은 pair를 뽑음(=가능한 모든 페어 찾아서 매트릭스에 넣는 함수)
const makePair = async (processInfo, config) => {
    const dollar = 50; // 50달러를 기준으로 하여 pair를 뽑음(=50달러 어치의 토큰 개수)

    try {
        const networkProvider = await makeProvider(processInfo.networkName);

        let swap1AmountOut, swap2AmountOut;
        const matrix = [];

        // profit 리스트 만듦
        for (const pair of config.tokenPairs) {
            const amountIn = dollar / pair.token1.price; // 50달러 가치에 해당하는 토큰 개수

            try {
                // DEX가 V3일 때,
                if (processInfo.router1isV3) {
                    swap1AmountOut = await V3RouterGetPrice(
                        config.quote[processInfo.router1Name],
                        networkProvider,
                        pair.token1,
                        pair.token2,
                        3000,
                        amountIn
                    );
                    // DEX가 V2일 때,
                } else {
                    swap1AmountOut = await V2RouterGetPrice(
                        config.router.V2[processInfo.router1Name],
                        networkProvider,
                        amountIn,
                        pair.token1,
                        pair.token2
                    );
                }

                if (processInfo.router2isV3) {
                    swap2AmountOut = await V3RouterGetPrice(
                        config.quote[processInfo.router2Name],
                        networkProvider,
                        pair.token2,
                        pair.token1,
                        3000,
                        swap1AmountOut
                    );
                } else {
                    swap2AmountOut = await V2RouterGetPrice(
                        config.router.V2[processInfo.router2Name],
                        networkProvider,
                        swap1AmountOut,
                        pair.token2,
                        pair.token1
                    );
                }

                matrix.push({
                    token1: pair.token1,
                    token2: pair.token2,
                    profit: swap2AmountOut,
                });
            } catch {
                matrix.push({
                    token1: pair.token1,
                    token2: pair.token2,
                    profit: null,
                });
            }
        }

        // profit을 기반으로 하여 내림차순 정렬
        const sortedMatrix = matrix.sort((a, b) => {
            if (a.profit === null) return 1;
            if (b.profit === null) return -1;
            return b.profit * b.token1.price - a.profit * a.token1.price;
        });

        console.log("가능성이 높은 pair를 만들었습니다.");
        // 가능성이 높은 pair 3개를 선택(=1,2,3등 뽑기)
        return sortedMatrix.slice(0, 2);
    } catch (error) {
        console.log(`Error processing network ${processInfo.networkName}`);
        console.error(error);
    }
};

const main = async () => {
    createTable("dual");

    const monitorConfig = {
        networkName: "eth",
        router1isV3: true,
        router1Name: "uniswap",
        router2isV3: false,
        router2Name: "sushiswap",
    };

    const config = await createConfig(monitorConfig.networkName);
    await updateTokenPrice(config.tokens);

    const pairs = await makePair(monitorConfig, config);

    const childProcess = [];
    let completeTasks = 0;

    // 가능성이 높은 pair들을 각각의 process들로 만들어 실행
    pairs.forEach((pair) => {
        const child = fork("src/process/processDex2Dex.js");

        child.on("message", (msg) => {
            if (msg === "ready") {
                console.log("Child process is ready");
                child.send({ pair, monitorConfig });
            } else if (msg === "taskComplete") {
                completeTasks += 1;
                if (completeTasks === pairs.length) {
                    console.log("All tasks complete");
                    // task가 전부 끝나고 나면 shutdown 메세지를 보내서 프로세스를 종료시킴
                    childProcess.forEach((child) => child.send("shutdown"));
                }
            } else if (msg.type === "log") {
                msg.data.map((item) => console.log(item));
            } else if (msg.type === "result") {
                insertDualArbitrageData(msg.data);
            }
        });

        child.on("exit", () => {
            console.log("child process exit");
        });

        child.on("error", (err) => {
            console.log(`child process error: ${err}`);
        });

        child.send("start");

        childProcess.push(child);
    });
};

main();
setInterval(main, 1000 * 60 * 20);
