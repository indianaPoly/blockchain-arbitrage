import {
    V3RouterGetPrice,
    V3RouterGetPriceV2,
    V2RouterGetPrice,
} from "../../../modules/index.js";

export class PriceFetcher {
    constructor(dex, provider) {
        this.dex = dex;
        this.provider = provider;
    }

    getPrice = async (currentToken, nextToken, amountIn) => {
        let price;
        if (this.dex.routerType === "V3") {
            if (this.dex.quoterType === "V1") {
                // 가격을 불러옴
                price = await V3RouterGetPrice(
                    this.dex.networkName,
                    this.dex.dexName,
                    this.dex.quoterAddress,
                    this.provider,
                    currentToken,
                    nextToken,
                    this.dex.fee,
                    amountIn
                );
            }

            if (this.dex.quoterType === "V2") {
                price = await V3RouterGetPriceV2(
                    this.dex.dexName,
                    this.dex.quoterAddress,
                    this.provider,
                    currentToken,
                    nextToken,
                    this.dex.fee,
                    amountIn
                );
            }
        } else if (this.dex.routerType === "V2") {
            price = await V2RouterGetPrice(
                this.dex.address,
                this.provider,
                amountIn,
                currentToken,
                nextToken
            );
        }

        return price;
    };
}
