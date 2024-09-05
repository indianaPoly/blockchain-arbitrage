import { V3Swap, makeProvider } from "../../modules/index.js";
import { createConfig, updateTokenPrice } from "../../config/index.js";
import { swapAmountOut } from "../unit/getSwapAmount.js";
import hre from "hardhat";

// v3 swap을 테스트 하기 위한 스크립트
const main = async () => {
    const networkName = "polygon";

    const provider = await makeProvider(networkName);

    //exactInputSingleSupportingFeeOnTransferTokens
    const swapABI = [
        {
            constant: false,
            inputs: [
                {
                    components: [
                        {
                            name: "tokenIn",
                            type: "address",
                        },
                        {
                            name: "tokenOut",
                            type: "address",
                        },
                        {
                            name: "recipient",
                            type: "address",
                        },
                        {
                            name: "deadline",
                            type: "uint256",
                        },
                        {
                            name: "amountIn",
                            type: "uint256",
                        },
                        {
                            name: "amountOutMinimum",
                            type: "uint256",
                        },
                        {
                            name: "limitSqrtPrice",
                            type: "uint160",
                        },
                    ],
                    name: "params",
                    type: "tuple",
                },
            ],
            name: "exactInputSingleSupportingFeeOnTransferTokens",
            outputs: [
                {
                    name: "amountOut",
                    type: "uint256",
                },
            ],
            stateMutability: "nonpayable",
            type: "function",
        },
    ];

    const config = await createConfig(networkName);
    await updateTokenPrice(config.tokens);

    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const swapContract = new hre.ethers.Contract(
        config.router.V3.quickswap,
        swapABI,
        signer
    );

    const params = {
        tokenIn: config.tokens[0].address,
        tokenOut: config.tokens[5].address,
        recipient: process.env.METAMASK_ADDRESS,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
        amountIn: hre.ethers.parseUnits("1", 18),
        amountOutMinimum: 0,
        limitSqrtPrice: 0,
    };

    try {
        const tx =
            await swapContract.exactInputSingleSupportingFeeOnTransferTokens.estimateGas(
                params
            );

        const a = (await provider.getFeeData()).gasPrice;

        console.log(hre.ethers.formatUnits(a * tx, 18));

        // const amountOut = await swapAmountOut(
        //     networkName,
        //     tx.hash,
        //     config.tokens[2].decimal
        // );
    } catch (err) {
        console.log(err);
    }
};

await main();
