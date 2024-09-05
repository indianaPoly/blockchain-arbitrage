import hre from "hardhat";
import { V2Swap } from "../../modules/index.js";
import { createConfig, updateTokenPrice } from "../../config/index.js";
import { swapAmountOut } from "../unit/getSwapAmount.js";

// v2 swap을 테스트 하기 위한 스크립트
const main = async () => {
    const networkName = "polygon";

    const config = await createConfig(networkName);
    await updateTokenPrice(config.tokens);

    // const params = {
    //     tokenIn: config.tokens[0].address,
    //     tokenOut: config.tokens[2].address,
    //     amountIn: hre.ethers.parseUnits("1", 18),
    //     amountOutMinimum: 0,
    // };

    // const tx = await V2Swap(networkName, config.router.V2.sushiswap, params);

    // await tx.wait();

    // console.log(tx);

    const amountOut = await swapAmountOut(
        networkName,
        "0x4ec335291fe98ffd7238c10da779ad54f45e9b617049be18d25ccb7d11d30c43",
        config.tokens[2].decimal
    );

    console.log(amountOut);
};

await main();
