import hre from "hardhat";
import {
    makeSwapContract,
    makeProvider,
    makeERC20Contract,
} from "../../modules/index.js";
import { createConfig, updateTokenPrice } from "../../config/index.js";

/**
 * 토큰을 스왑하는 과정에 있어 필요한 approve를 진행하는 함수 제작
 * @owner 토큰을 보내는 wallet이 필요함.
 * @spender 토큰을 받는 주소
 * @tokenAddress approve할 토큰 주소
 */
const tokenApprove = async (networkName, spender, tokenAddress) => {
    const provider = await makeProvider(networkName);

    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const erc20Contract = await makeERC20Contract(tokenAddress, signer);
    const allowance = await erc20Contract.allowance(signer, spender);

    if (allowance === 0n) {
        console.log("approve를 진행하고 있습니다.");
        const tx = await erc20Contract.approve(spender, hre.ethers.MaxUint256);
        await tx.wait();
        console.log("approve가 끝났습니다.");
    } else {
        console.log("approve가 이미 되었습니다.");
    }
};

// 폴리곤 메인넷에 배포되어있는 uniswapdml
const main = async () => {
    const networkName = "polygon";

    const config = await createConfig(networkName);
    await updateTokenPrice(config.tokens);

    const WMATIC = config.tokens[0].address; // WMATIC
    const USDC = config.tokens[1].address; // USDC
    const swapRouterAddress = config.router.V3.uniswap;

    const provider = await makeProvider(networkName);
    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const swap = await makeSwapContract(swapRouterAddress, signer);

    await tokenApprove(networkName, swapRouterAddress, tokenIn);

    // 가스비를 측정함에 있어서도 approve를 진행해야함.
    const gasPrice = await swap.exactInputSingle.estimateGas({
        tokenIn: USDC,
        tokenOut: WMATIC,
        fee: config.fee_tier,
        recipient: process.env.METAMASK_ADDRESS,
        deadline: Math.floor(Date.now() / 1000 + 60 * 10),
        amountIn: hre.ethers.parseUnits("1", 6),
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
    });

    console.log(gasPrice);
};

await main();
