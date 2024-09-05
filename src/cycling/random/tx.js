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

const main = async () => {
    createTable("single");

    const config = await createConfig(networkName);
    await updateTokenPrice(config.tokens);

    const randomScript = "src/cycling/random/process.js";

    const randomMessageHandler = (msg) => {
        if (msg === "ready") {
            childRandom.send({
                networkName: networkName,
                tokens: config.tokens,
                dexConfig: dexConfig,
            });
        } else if (msg === "taskComplete") {
            console.log("random task complete");
            childRandom.kill();
        } else if (msg.type === "log") {
            console.log(msg.data);
        } else if (msg.type === "result") {
            insertSingleArbitrageData(msg.data);
        }
    };

    const childRandom = startChildProcess(randomScript, randomMessageHandler);

    childRandom.send("start");
};

await main();
