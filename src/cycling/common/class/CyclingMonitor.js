import { DexConfig } from "./DexConfig.js";
import { PriceFetcher } from "./PriceFetcher.js";
import { Logger } from "./Logger.js";

export class CyclingMonitor {
    constructor(
        networkName,
        routerType,
        quoterType,
        dexName,
        provider,
        logCallback,
        resultCallback
    ) {
        this.networkName = networkName;
        this.routerType = routerType;
        this.quoterType = quoterType;
        this.dexName = dexName;
        this.provider = provider;
        this.logCallback = logCallback;
        this.resultCallback = resultCallback;
    }

    // 하위 클래스를 지정하는 내부 함수
    init = async () => {
        // DexConfig 클래스 설정
        this.dexConfig = new DexConfig(
            this.networkName,
            this.routerType,
            this.quoterType,
            this.dexName
        );
        // config 초기 설정
        await this.dexConfig.configInitialize();

        // PriceFetcher 클래스 설정
        this.priceFetcher = new PriceFetcher(this.dexConfig.dex, this.provider);
        // logger 클래스 설정
        this.logger = new Logger(this.logCallback, this.resultCallback);
    };
}
