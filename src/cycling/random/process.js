import { makeProvider } from "../../modules/index.js";
import { CyclingMonitorRandom } from "./monitor.js";

process.on("message", async (msg) => {
    if (msg === "start") {
        process.send("ready");
    } else {
        const { networkName, tokens, dexConfig } = msg;

        const provider = await makeProvider(networkName);
        // 선택하고자 하는 토큰 개수 지정
        const count = 3;

        const tx = new CyclingMonitorRandom(
            tokens,
            count,
            networkName,
            dexConfig.routerType,
            dexConfig.quoterType,
            dexConfig.dexName,
            provider,
            (log) => process.send({ type: "log", data: log }),
            (result) => process.send({ type: "result", data: result })
        );

        try {
            for (let dollar = 50; dollar < 120; dollar++) {
                try {
                    await tx.monitor(dollar);
                } catch (err) {
                    console.log(err);
                    continue;
                }
            }
        } catch (error) {
            process.send({ type: "log", data: error });
        } finally {
            process.send("taskComplete");
        }
    }
});
