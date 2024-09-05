import hre from "hardhat";
import {
    makeV3QuoteContract,
    makeV3QuoteV2Contract,
    makeV2RouterContract,
    makeSwapContract,
    makeERC20Contract,
    roundToDecimals,
    makeProvider,
} from "./index.js";

// tokenIn, tokenOut은 주소가 아니고 객체로 넘겨짐
// fee는 문자열도 숫자도 가능함. 500, 3000
// amountIn: 토큰의 개수
export const V3RouterGetPrice = async (
    networkName,
    dexName,
    quoteAddress,
    provider,
    tokenIn,
    tokenOut,
    fee,
    amountIn
) => {
    // provider 통해서 signer 지정
    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // quoter contract를 만듦
    const quote = await makeV3QuoteContract(
        networkName,
        dexName,
        quoteAddress,
        signer
    );

    // 입력되는 값 wei 단위로 변환하는 함수
    // amountIn: 토큰의 개수
    // tokenIn의 소수점
    const amountInWei = roundToDecimals(amountIn, tokenIn.decimal);

    // provider를 통해서 gasPrice
    const gasPrice = (await provider.getFeeData()).gasPrice;
    // 30만으로 하드코딩 (estimateGas staticCall 함수로 부르면 gasLimit)
    const gasLimit = 250000n;
    const gas = gasPrice * gasLimit; // wei 단위

    let amountOut;
    // dexName quoter contract를 통해서 가격을 불러오는데
    // 유니스왑의 함수는 view 가스비가 안듦
    // 만타에 있는 quickswap은 가격불러오는 함수가 가스비가 듦 -> staticCall를 사용해서 가격을 불러옴
    if (dexName === "uniswap") {
        // a을 i넣었을 때 b 토큰 몇개 ?
        // 반환되는 값의 단위는 wei
        amountOut = await quote.quoteExactInputSingle(
            tokenIn.address,
            tokenOut.address,
            fee,
            amountInWei,
            0
        );

        // wei -> 토큰의 개수로 변경 (formatUnits 함수 사용)
        // 0.997(수수료)을 하드코딩함. (바뀔수 있습니다. 500 -> 0.9995, 0 -> x)
        return parseFloat(hre.ethers.formatUnits(amountOut, tokenOut.decimal));
    } else if (dexName === "quickswap") {
        if (networkName === "manta") {
            const result = await quote.quoteExactInputSingle.staticCall(
                tokenIn.address,
                tokenOut.address,
                fee,
                amountInWei,
                0
            );

            return parseFloat(
                hre.ethers.formatUnits(result, tokenOut.decimal) * 0.997
            );
        }

        if (networkName === "polygon") {
            // 반환되는 값이 배열, 배열의 첫번재 값이 원하는 값(단위는 wei)
            const result = await quote.quoteExactInputSingle.staticCall(
                tokenIn.address,
                tokenOut.address,
                amountInWei,
                0
            );

            return parseFloat(
                hre.ethers.formatUnits(result[0], tokenOut.decimal) * 0.997
            );
        }
    }
};

export const V3RouterGetPriceV2 = async (
    quoteAddress,
    provider,
    tokenIn,
    tokenOut,
    fee,
    amountIn
) => {
    const quoteV2 = await makeV3QuoteV2Contract(quoteAddress, provider);
    // 토큰의 개수
    const initAmountIn = amountIn.toFixed(tokenIn.decimal);
    // quoter V2, 인자를 객체로 넣음
    const params = {
        tokenIn: tokenIn.address,
        tokenOut: tokenOut.address,
        amountIn: hre.ethers.parseUnits(initAmountIn, tokenIn.decimal),
        fee: fee,
        sqrtPriceLimitX96: 0,
    };

    // quoterV2는 전부 staticCall로 가격을 호출함.
    const output = await quoteV2.quoteExactInputSingle.staticCall(params);

    // output이 wei 단위 이므로 개수로 변경
    const amountOut = hre.ethers.formatUnits(
        output.amountOut,
        tokenOut.decimal
    );

    // 수수료 적용 및 가스비 적용
    return parseFloat(amountOut * 0.997);
};

// tokenIn, tokenOut은 객체
export const V2RouterGetPrice = async (
    routerAddress,
    provider,
    amountIn,
    tokenIn,
    tokenOut
) => {
    // router를 통해서 가격을 불러옴.
    const V2Router = await makeV2RouterContract(routerAddress, provider);
    const gasPrice = hre.ethers.formatEther("300000", "wei");

    const initAmountIn = hre.ethers.formatUnits(amountIn, tokenIn.decimal);
    // 토큰의 개수를 wei 단위로 변경
    const amountInWei = roundToDecimals(initAmountIn, tokenIn.decimal);

    // getAmountsOut 함수를 사용
    // 2번째 인자가 path => [address1, address2]
    // 배열이 리턴이 됨
    // 배열의 두번재 값이 원하는 값 (wei 단위)
    // 수수료를 적용해서 값을 리턴함
    const amountOut = await V2Router.getAmountsOut(amountInWei, [
        tokenIn.address,
        tokenOut.address,
    ]);

    return parseFloat(
        hre.ethers.formatUnits(amountOut[1], tokenOut.decimal) - gasPrice
    );
};

// 실제 스왑을 진행하는 함수
export const V3Swap = async (
    networkName,
    dexName,
    swapRouterAddress,
    params
) => {
    const { tokenIn, tokenOut, fee, amountIn, amountOutMinimum } = params;

    const provider = await makeProvider(networkName);
    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const V3Router = await makeSwapContract(dexName, swapRouterAddress, signer);

    const tokenInContract = await makeERC20Contract(tokenIn, signer);

    // 스왑을 진행할 때 나의 계좌와 router간의 승인된 금액을 확인
    const allowance = await tokenInContract.allowance(
        signer.address,
        swapRouterAddress
    );

    // 승인된 금액이 없다면 approve 통해 금액을 승인
    if (allowance === 0n) {
        console.log("apprvoe를 진행하고 있습니다.");
        const tx = await tokenInContract.approve(
            swapRouterAddress,
            hre.ethers.MaxUint256
        );
        await tx.wait();
        console.log("approve가 끝났습니다.");
    }

    // dex에 맞게 스왑을 진행
    if (dexName === "uniswap") {
        const tx = await V3Router.exactInputSingle({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: fee,
            recipient: process.env.METAMASK_ADDRESS,
            deadline: Math.floor(Date.now() / 1000) + 60 * 10,
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum,
            sqrtPriceLimitX96: 0,
        });

        return tx;
    } else if (dexName === "quickswap") {
        const tx = await V3Router.exactInputSingleSupportingFeeOnTransferTokens(
            {
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                recipient: process.env.METAMASK_ADDRESS,
                deadline: Math.floor(Date.now() / 1000) + 60 * 10,
                amountIn: amountIn,
                amountOutMinimum: 0,
                limitSqrtPrice: 0,
            }
        );

        return tx;
    }
};

export const V2Swap = async (networkName, swapRouterAddress, params) => {
    const { tokenIn, tokenOut, amountIn, amountOutMinimum } = params;
    const provider = await makeProvider(networkName);
    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const V2Router = await makeV2RouterContract(swapRouterAddress, signer);

    const erc20 = await makeERC20Contract(tokenIn, signer);

    const allowance = await erc20.allowance(signer.address, swapRouterAddress);

    if (allowance === 0n) {
        console.log("approve를 진행하고 있습니다.");
        const tx = await erc20.approve(
            swapRouterAddress,
            hre.ethers.MaxUint256
        );
        await tx.wait();
        console.log("approve가 끝났습니다.");
    }

    const swapTX =
        await V2Router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            amountIn,
            amountOutMinimum,
            [tokenIn, tokenOut],
            signer.address,
            Math.floor(Date.now() / 1000) + 60 * 10
        );
    await swapTX.wait();

    return swapTX;
};

export const swapDex2Dex = async (
    swapContractAddress,
    router1Address,
    router2Address,
    provider,
    tokenIn,
    tokenOut,
    fee,
    amountIn,
    direction,
    router1isV3,
    router2isV3
) => {
    const swapContract = await makeSwapContract(swapContractAddress, provider);
    const amountInWei = hre.ethers.parseUnits(
        amountIn.toString(),
        tokenIn.decimal
    );

    if (router1isV3 && router2isV3) {
        const tx = await swapContract.tradeV3V3(
            router1Address,
            router2Address,
            tokenIn,
            tokenOut,
            amountInWei,
            fee,
            direction
        );

        await tx.wait();
    }

    if (router1isV3 && !router2isV3) {
        const tx = await swapContract.tradeV3V2(
            router1Address,
            router2Address,
            tokenIn,
            tokenOut,
            amountInWei,
            fee,
            direction
        );

        await tx.wait();
    }

    if (!router1isV3 && router2isV3) {
        const tx = await swapContract.tradeV2V3(
            router1Address,
            router2Address,
            tokenIn,
            tokenOut,
            amountInWei,
            fee,
            direction
        );

        await tx.wait();
    }

    if (!router1isV3 && !router2isV3) {
        const tx = await swapContract.tradeV2V2(
            router1Address,
            router2Address,
            tokenIn,
            tokenOut,
            amountInWei,
            direction
        );

        await tx.wait();
    }
};

export const swapAmountOut = async (provider, hash, amountOutDecimals) => {
    const receipt = await provider.getTransactionReceipt(hash);
    const iface = new hre.ethers.Interface([
        "event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)",
    ]);

    for (const log of receipt.logs) {
        try {
            const parsedLog = iface.parseLog(log);
            if (parsedLog) {
                const amount = -parsedLog.args[3];
                return hre.ethers.formatUnits(
                    amount.toString(),
                    amountOutDecimals
                );
            }
        } catch {}
    }
    return null;
};
