import hre from "hardhat";

// 버전과 필요에 따라서 Abi를 추가 및 체인에 따라 return 되는 Contract가 다르도록 설정

const quoteAbi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "tokenIn",
                type: "address",
            },
            {
                internalType: "address",
                name: "tokenOut",
                type: "address",
            },
            {
                internalType: "uint24",
                name: "fee",
                type: "uint24",
            },
            {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256",
            },
            {
                internalType: "uint160",
                name: "sqrtPriceLimitX96",
                type: "uint160",
            },
        ],
        name: "quoteExactInputSingle",
        outputs: [
            {
                internalType: "uint256",
                name: "amountOut",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];

const quoteAbi_Quickswap_Polygon = [
    {
        inputs: [
            {
                internalType: "address",
                name: "tokenIn",
                type: "address",
            },
            {
                internalType: "address",
                name: "tokenOut",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256",
            },
            {
                internalType: "uint160",
                name: "limitSqrtPrice",
                type: "uint160",
            },
        ],
        name: "quoteExactInputSingle",
        outputs: [
            {
                internalType: "uint256",
                name: "amountOut",
                type: "uint256",
            },
            {
                internalType: "uint16",
                name: "fee",
                type: "uint16",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
];

const quoteAbi_Quickswap_Manta = [
    {
        inputs: [
            {
                internalType: "address",
                name: "tokenIn",
                type: "address",
            },
            {
                internalType: "address",
                name: "tokenOut",
                type: "address",
            },
            {
                internalType: "uint24",
                name: "fee",
                type: "uint24",
            },
            {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256",
            },
            {
                internalType: "uint160",
                name: "sqrtPriceLimitX96",
                type: "uint160",
            },
        ],
        name: "quoteExactInputSingle",
        outputs: [
            {
                internalType: "uint256",
                name: "amountOut",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
];

const quoterV2Abi = [
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "tokenIn",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "tokenOut",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amountIn",
                        type: "uint256",
                    },
                    {
                        internalType: "uint24",
                        name: "fee",
                        type: "uint24",
                    },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IQuoterV2.QuoteExactInputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "quoteExactInputSingle",
        outputs: [
            {
                internalType: "uint256",
                name: "amountOut",
                type: "uint256",
            },
            {
                internalType: "uint160",
                name: "sqrtPriceX96After",
                type: "uint160",
            },
            {
                internalType: "uint32",
                name: "initializedTicksCrossed",
                type: "uint32",
            },
            {
                internalType: "uint256",
                name: "gasEstimate",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
];

const v2Router02Abi = [
    {
        constant: true,
        inputs: [
            { name: "amountIn", type: "uint256" },
            { name: "path", type: "address[]" },
        ],
        name: "getAmountsOut",
        outputs: [{ name: "amounts", type: "uint256[]" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                name: "amountIn",
                type: "uint256",
            },
            {
                name: "amountOutMin",
                type: "uint256",
            },
            {
                name: "path",
                type: "address[]",
            },
            {
                name: "to",
                type: "address",
            },
            {
                name: "deadline",
                type: "uint256",
            },
        ],
        name: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
];

const v3RouterAbi = [
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "tokenIn",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "tokenOut",
                        type: "address",
                    },
                    {
                        internalType: "uint24",
                        name: "fee",
                        type: "uint24",
                    },
                    {
                        internalType: "address",
                        name: "recipient",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "deadline",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "amountIn",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "amountOutMinimum",
                        type: "uint256",
                    },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct ISwapRouter.ExactInputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactInputSingle",
        outputs: [
            {
                internalType: "uint256",
                name: "amountOut",
                type: "uint256",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
];

const v3RouterAbi_Quickswap = [
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

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
];

export const makeERC20Contract = async (tokenAddress, signerOrProvider) => {
    return new hre.ethers.Contract(tokenAddress, ERC20_ABI, signerOrProvider);
};

// quoter contract return하는 함수
export const makeV3QuoteContract = async (
    networkName,
    dexName,
    quoterAddress,
    provider
) => {
    // dex 이름으로 분기하고
    if (dexName === "uniswap") {
        // 네트워크 이름으로 분기
        if (networkName === "eth") {
            return new hre.ethers.Contract(quoterAddress, quoteAbi, provider);
        }
    } else if (dexName === "quickswap") {
        if (networkName === "manta") {
            return new hre.ethers.Contract(
                quoterAddress,
                quoteAbi_Quickswap_Manta,
                provider
            );
        } else if (networkName === "polygon") {
            return new hre.ethers.Contract(
                quoterAddress,
                quoteAbi_Quickswap_Polygon,
                provider
            );
        }
    }
};

export const makeV3QuoteV2Contract = async (quoterAddress, provider) => {
    const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
    return new hre.ethers.Contract(quoterAddress, quoterV2Abi, wallet);
};

export const makeV2RouterContract = async (routerAddress, signer) => {
    return new hre.ethers.Contract(routerAddress, v2Router02Abi, signer);
};

export const makeSwapContract = async (dexName, contractAddress, signer) => {
    if (dexName === "uniswap") {
        return new hre.ethers.Contract(contractAddress, v3RouterAbi, signer);
    } else if (dexName === "quickswap") {
        return new hre.ethers.Contract(
            contractAddress,
            v3RouterAbi_Quickswap,
            signer
        );
    }
    return null;
};
