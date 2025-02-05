export default class ExServerTickDelayTask {
    getDelay() {
        return this.time;
    }
    constructor(context, looper) {
        this.context = context;
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
            this.func = undefined;
            this.looper();
        };
        this.id = this.context.runTimeoutByTick(() => { var _a; return (_a = this === null || this === void 0 ? void 0 : this.func) === null || _a === void 0 ? void 0 : _a.call(this); }, this.time);
        return this;
    }
    start() {
        if (this.isStarted())
            return this;
        this.func = () => {
            if (this.context.interrupt)
                return;
            this.looper();
        };
        this.id = this.context.runIntervalByTick(() => {
            var _a;
            (_a = this === null || this === void 0 ? void 0 : this.func) === null || _a === void 0 ? void 0 : _a.call(this);
        }, this.time);
        return this;
    }
    stop() {
        if (!this.func)
            return this;
        if (!this.id)
            throw new Error("error id is required");
        this.context.clearRun(this.id);
        this.func = undefined;
        return this;
    }
    dispose() {
        this.stop();
    }
}
//# sourceMappingURL=ExServerTickDelayTask.js.map