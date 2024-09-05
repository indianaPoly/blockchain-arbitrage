import hre from "hardhat";

// 네트워크를 추가하고 싶으면 아래와 같이 추가
// jsonRPCProvider or WebSocketProvider를 쓰면 됨. (속도는 WebSocket이 조금 더 빠릅니다. 노드 접근함에 있어서)
export const makeProvider = async (networkName) => {
    let url, provider;
    switch (networkName) {
        case "eth":
            url = `wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
            provider = new hre.ethers.WebSocketProvider(url);
            return provider;
        case "polygon":
            url = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
            provider = new hre.ethers.JsonRpcProvider(url);
            return provider;
        case "bsc":
            url = "https://bsc-dataseed1.defibit.io/";
            provider = new hre.ethers.JsonRpcProvider(url);
            return provider;
        case "arb":
            url = `https://arb-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`;
            provider = new hre.ethers.JsonRpcProvider(url);
            return provider;
        case "manta":
            url = "https://pacific-rpc.manta.network/http";
            provider = new hre.ethers.JsonRpcProvider(url);
            return provider;
    }
};
