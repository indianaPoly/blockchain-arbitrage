require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
    },
    networks: {
        hardhat: {
            forking: {
                url: "https://mainnet.infura.io/v3/42dc613d1e444294bd1c5bfbc370ac69",
                blockNumber: 14390000,
            },
        },
        mainnet: {
            url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts: [`0x${process.env.PRIVATE_KEY}`],
        },
        sepolia: {
            url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts: [`0x${process.env.PRIVATE_KEY}`],
        },
        botanixTestnet: {
            url: "https://node.botanixlabs.dev",
            chainId: 3636,
            accounts: [`0x${process.env.PRIVATE_KEY}`],
        },
        "kroma-mainnet": {
            url: "https://api.kroma.network",
            chainId: 255,
            accounts: [`0x${process.env.PRIVATE_KEY}`],
        },
    },
    gasReporter: {
        enabled: true,
    },
};
