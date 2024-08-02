import ExGame from "./ExGame.js";
export default class ExServerTickDelayTask {
    getDelay() {
        return this.time;
    }
    constructor(looper) {
        this.time = 20;
        this.looper = looper;
    }
    delay(time) {
        if (this.isStarted())
            throw new Error('TickDelayTask already started');
        this.time = time;
        return this;
    }
    isStarted() {
        return this.func !== undefined;
    }
    startOnce() {
        if (this.isStarted())
            return this;
        this.func = () => {
            this.looper();
            this.func = undefined;
        };
        this.id = ExGame.runTimeout(() => { var _a; return (_a = this === null || this === void 0 ? void 0 : this.func) === null || _a === void 0 ? void 0 : _a.call(this); }, this.time);
        return this;
    }
    start() {
        if (this.isStarted())
            return this;
        this.func = () => {
            this.looper();
        };
        this.id = ExGame.runInterval(() => { var _a; return (_a = this === null || this === void 0 ? void 0 : this.func) === null || _a === void 0 ? void 0 : _a.call(this); }, this.time);
        return this;
    }
    stop() {
        if (!this.func)
            return this;
        if (!this.id)
            throw new Error("error id is required");
        ExGame.clearRun(this.id);
        this.func = undefined;
        return this;
    }
    dispose() {
        this.stop();
    }
}
//# sourceMappingURL=ExServerTickDelayTask.js.map