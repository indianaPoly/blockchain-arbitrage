import { makeProvider } from "../../modules/index.js";
import { CyclingMonitorDFS } from "./monitor.js";

process.on("message", async (msg) => {
    if (msg === "start") {
        process.send("ready");
    } else {
        const { pairs, networkName, dexConfig, startToken } = msg;

        // provider 설정
        const provider = await makeProvider(networkName);

        // depth는 2추천
        const depth = 2;

        const tx = new CyclingMonitorDFS(
            pairs,
            startToken,
            depth,
            networkName,
            dexConfig.routerType,
            dexConfig.quoterType,
            dexConfig.dexName,
            provider,
            (log) => process.send({ type: "log", data: log }),
            (result) => process.send({ type: "result", data: result })
        );

        try {
            for (let dollar = 100; dollar < 130; dollar++) {
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
