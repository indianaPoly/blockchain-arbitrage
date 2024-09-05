import { createConfig } from "../../../config/index.js";

export class DexConfig {
    // network string
    // router type : V2, V3 (uniswap 기반)
    // quoter type : V2은 없음 , V3의 경우 V1, V2로 분기가 되어있음.
    // dexName: string ex. uniswap
    constructor(networkName, routerType, quoterType, dexName) {
        if (!networkName && !routerType && !quoterType && !dexName) {
            throw Error("empty!");
        }

        this.networkName = networkName;
        this.routerType = routerType;
        this.quoterType = quoterType;
        this.dexName = dexName;

        // dex를 활용해서 설정을 진행함.
        this.dex = {
            networkName: this.networkName,
            dexName: this.dexName,
            routerType: this.routerType,
            quoterType: this.quoterType,
            quoterAddress: "",
            swapAddress: "",
            fee: 0,
        };
    }

    // config 초기 설정
    configInitialize = async () => {
        const config = await createConfig(this.networkName);

        switch (this.routerType) {
            case "V3":
                this.dex.quoterAddress =
                    config.quote[this.quoterType][this.dexName];
                this.dex.swapAddress =
                    config.router[this.routerType][this.dexName];

                this.dex.fee = config.fee_tier;
                break;
            case "V2":
                this.dex.quoterAddress =
                    config.router[this.routerType][this.dexName];
                this.dex.swapAddress =
                    config.router[this.routerType][this.dexName];

                this.dex.fee = null;
                break;
        }
    };
}
