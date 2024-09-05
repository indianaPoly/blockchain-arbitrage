import {
    dualDexTokenPairPriceMonitor,
    makeProvider,
} from "../modules/index.js";

let shuttingDown = false;

process.on("message", async (msg) => {
    if (msg === "start") {
        process.send("ready");
    } else if (msg === "shutdown") {
        shuttingDown = true;
        process.exit(0);
    } else {
        const { pair, monitorConfig } = msg;

        const provider = await makeProvider(monitorConfig.networkName);

        let amountIn;

        try {
            // 100 ~ 150달러(임시값) 사이를 탐색 (RPC node 공짜써서 많이 탐색 못함)
            for (let dollar = 100; dollar < 150; dollar++) {
                if (shuttingDown) break;
                amountIn = dollar / pair.token1.price;

                // amountIn은 토큰의 개수
                await dualDexTokenPairPriceMonitor(
                    pair,
                    amountIn,
                    provider,
                    monitorConfig,
                    (log) => process.send({ type: "log", data: log }),
                    (result) => process.send({ type: "result", data: result })
                );
            }
        } catch (err) {
            console.error(err);
        }

        if (!shuttingDown) {
            process.send("taskComplete");
        }
    }
});
