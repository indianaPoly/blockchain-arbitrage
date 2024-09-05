import { fork } from "child_process";

import { createTable, insertSingleArbitrageData } from "../../../db/index.js";
import { createConfig, updateTokenPrice } from "../../config/index.js";

const networkName = "eth";

const dexConfig = {
    dexName: "uniswap",
    routerType: "V3",
    quoterType: "V1",
};

const startChildProcess = (script, messageHandler) => {
    const child = fork(script);
    child.on("message", messageHandler);
    child.on("exit", () => {
        console.log(`${script} child process exited`);
    });
    child.on("error", (err) => {
        console.log(`child process error : ${err}`);
    });
    return child;
};

export const main = async () => {
    // 데이터테이블 만듦
    createTable("single");

    const config = await createConfig(networkName);
    // 가격정보(1개 토큰에 대한 달러정보, ex. 1WETH = $3000)를 업데이트하는 함수
    await updateTokenPrice(config.tokens);
    const pairs = config.tokenPairs;

    // 프로세스 경로 설정
    const dfsScript = "src/cycling/dfs/process.js";

    // dfs 알고리즘에서 사용될 startToken 배열
    const startTokens = config.tokens.filter(
        (token) => token.name === "WETH" || token.name === "WBTC"
    );

    console.log(startTokens);
    const numProcesses = startTokens.length; // 생성할 프로세스의 수
    const processes = []; // 프로세스 배열

    for (let i = 0; i < numProcesses; i++) {
        console.log(i);
        const dfsMessageHandler = (msg) => {
            if (msg === "ready") {
                processes[i].send({
                    pairs: pairs,
                    networkName: networkName,
                    dexConfig: dexConfig,
                    startToken: startTokens[i],
                });
            } else if (msg === "taskComplete") {
                console.log(`DFS task complete in process ${i}`);
                processes[i].kill();
            } else if (msg.type === "log") {
                console.log(msg.data);
            } else if (msg.type === "result") {
                insertSingleArbitrageData(msg.data);
            }
        };

        const child = startChildProcess(dfsScript, dfsMessageHandler);
        processes.push(child);
    }

    // 모든 프로세스에 "start" 메시지 전송
    processes.forEach((process) => {
        process.send("start");
    });
};

main();

setInterval(async () => {
    main();
}, 20 * 60 * 1000);
