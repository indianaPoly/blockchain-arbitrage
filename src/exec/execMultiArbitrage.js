import { createTable, insertMultiArbitrageData } from "../../db/index.js";
import { createConfig, ethTokens, updateTokenPrice } from "../config/index.js";
import { fork } from "child_process";
import { getRandomTokens } from "../modules/index.js";

const main = async () => {
    const monitorConfig = {
        networkName: "polygon",

        firstDexConfig: {
            dexName: "uniswap",
            routerType: "V3",
        },

        finalDexConfig: {
            dexName: "sushiswap",
            routerType: "V2",
        },
    };

    // 데이터 테이블 생성
    createTable("multi");

    const config = await createConfig(monitorConfig.networkName);
    await updateTokenPrice(config.tokens);
    const scripts = "src/process/processMulti.js";

    // desinationToken은 반환점이 되는 토큰을 의미 (2개의 dex중에서 가장 유동성이 많은 pool인 weth를 기준으로 하였음.)
    // dex1: a -> b -> destinationToken
    // dex2: destinationtoken -> a
    const destinationTokenName = "WETH";
    const destinationToken = ethTokens.find(
        (item) => item.name === destinationTokenName
    );

    const token = ethTokens.filter(
        (item) => item.name !== destinationTokenName
    );

    // 시작토큰을 3개로 선택함 (이 때 시작토큰은 destinationToken이 있으면 안됨.)
    const tokens = await getRandomTokens(token, 3);

    const childProcess = [];
    let completeTasks = 0;

    // 시작토큰들에 대해서 프로세스를 생성
    tokens.forEach((startToken) => {
        const child = fork(scripts);

        child.on("message", (msg) => {
            if (msg === "ready") {
                console.log("child process is ready");
                child.send({
                    monitorConfig,
                    pairs: config.tokenPairs,
                    startToken,
                    destinationToken,
                });
            } else if (msg === "taskComplete") {
                completeTasks += 1;
                if (completeTasks === childCount) {
                    console.log("All tasks complete");
                    // task가 다 끝이 나면 shutdown 메세지를 보내서 프로세스 종료
                    childProcess.forEach((child) => child.send("shutdown"));
                }
            }
        });

        child.on("exit", () => {
            console.log("childe process exit");
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
