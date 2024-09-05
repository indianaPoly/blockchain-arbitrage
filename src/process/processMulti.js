import { MultiHop, makeProvider } from "../modules/index.js";

process.on("message", async (msg) => {
    if (msg === "start") {
        process.send("ready");
    } else {
        const { monitorConfig, pairs, startToken, destinationToken } = msg;

        const { networkName, firstDexConfig, finalDexConfig } = monitorConfig;

        const provider = await makeProvider(networkName);

        // multiHop이라는 모니터링 클래스를 받아옴.
        const tx = new MultiHop(
            networkName,
            provider,
            firstDexConfig,
            finalDexConfig,
            pairs,
            startToken,
            destinationToken
        );

        try {
            for (let dollar = 80; dollar < 130; dollar++) {
                await tx.monitor(dollar);
            }
        } catch {}

        process.send("taskComplete");
    }
});
