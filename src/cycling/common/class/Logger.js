export class Logger {
    constructor(logCallback, resultCallback) {
        this.logCallback = logCallback;
        this.resultCallback = resultCallback;
    }

    // log를 찍을 수 있는 콜백함수
    logResult(logMsg) {
        this.logCallback(logMsg);
    }

    // 결과를 저장하는 콜백함수
    saveResult(resultData) {
        this.resultCallback(resultData);
    }
}
