import axios from "axios";

// 현재 달러 가치에 대해서 토큰들의 가격을 가져오는 함수
export const getExchangeRate = async () => {
    const url = "https://api.coingecko.com/api/v3/simple/price";
    try {
        const response = await axios.get(url, {
            params: {
                ids: "bitcoin,ethereum,usd-coin,tether,uniswap,chainlink,dai,matic-network,manta-network,tia,quickswap",
                vs_currencies: "usd",
            },
        });

        return {
            btc: response.data.bitcoin.usd,
            eth: response.data.ethereum.usd,
            usdc: response.data["usd-coin"].usd,
            usdt: response.data.tether.usd,
            uni: response.data.uniswap.usd,
            link: response.data.chainlink.usd,
            dai: response.data.dai.usd,
            matic: response.data["matic-network"].usd,
            manta: response.data["manta-network"].usd,
            tia: response.data.tia.usd,
            quick: response.data.quickswap.usd,
        };
    } catch (err) {
        console.log(err);
    }
};

getExchangeRate();
