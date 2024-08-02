"use strict";
var _a;
class System {
    constructor() {
        this.run = [];
    }
    runInterval(func, tickInterval) {
        this.run.push(func);
    }
}
const system = new System();
class ExGame {
    static clearRun(runId) {
        if (this.idToTrigger.has(runId)) {
            let time = this.idToTrigger.get(runId);
            let list = this.tickDelayTriggers.get(time);
            if (list) {
                list.splice(list.findIndex(e => e[0] == runId), 1);
            }
            this.idToTrigger.delete(runId);
        }
        else if (this.idToIntevalTrigger.has(runId)) {
            let time = this.idToIntevalTrigger.get(runId);
            let list = this.intevalTask.get(time);
            if (list) {
                list.splice(list.findIndex(e => e[0] == runId), 1);
            }
            this.idToIntevalTrigger.delete(runId);
        }
    }
    static runInterval(callback, tickDelay) {
        var _b;
        tickDelay = Math.max(1, tickDelay !== null && tickDelay !== void 0 ? tickDelay : 1);
        this.idRunSeq = (1 + this.idRunSeq) % this.tickDelayMax;
        const willId = this.idRunSeq;
        this.idToIntevalTrigger.set(willId, tickDelay);
        if (!this.intevalTask.has(tickDelay)) {
            this.intevalTask.set(tickDelay, []);
        }
        (_b = this.intevalTask.get(tickDelay)) === null || _b === void 0 ? void 0 : _b.push([this.idRunSeq, callback]);
        return willId;
    }
    static runTimeout(callback, tickDelay) {
        var _b;
        tickDelay = Math.max(1, tickDelay !== null && tickDelay !== void 0 ? tickDelay : 1);
        this.idRunSeq = (1 + this.idRunSeq) % this.tickDelayMax;
        let tar = this.nowTick + tickDelay;
        this.idToTrigger.set(this.idRunSeq, tar);
        if (!this.tickDelayTriggers.has(tar)) {
            this.tickDelayTriggers.set(tar, []);
        }
        (_b = this.tickDelayTriggers.get(tar)) === null || _b === void 0 ? void 0 : _b.push([this.idRunSeq, callback]);
        return this.idRunSeq;
    }
}
_a = ExGame;
ExGame.idRunSeq = 0;
ExGame.nowTick = 0;
ExGame.tickDelayTriggers = new Map();
ExGame.idToTrigger = new Map();
ExGame.intevalTask = new Map();
ExGame.idToIntevalTrigger = new Map();
ExGame.tickDelayMax = 2300000000;
(() => {
    const func = () => {
        _a.nowTick = (_a.nowTick + 1) % _a.tickDelayMax;
        let list = _a.tickDelayTriggers.get(_a.nowTick);
        if (list) {
            for (let [id, func] of list) {
                try {
                    func();
                }
                catch (err) {
                }
                _a.idToTrigger.delete(id);
            }
        }
        _a.tickDelayTriggers.delete(_a.nowTick);
        for (let [time, list] of _a.intevalTask.entries()) {
            if (_a.nowTick % time === 0) {
                list.forEach(e => {
                    try {
                        if (_a.idToIntevalTrigger.has(e[0]))
                            e[1]();
                    }
                    catch (err) {
                    }
                });
            }
        }
    };
    system.runInterval(() => {
        func();
    }, 1);
})();
let i = 0;
let id = 0;
while (i < 100) {
    system.run.forEach(e => e());
    i++;
    if (i === 10) {
        id = ExGame.runInterval(() => {
            console.log("runInterval");
        }, 3);
        ExGame.runInterval(() => {
            console.log("run2");
        }, 8);
    }
    if (i === 20) {
        ExGame.runTimeout(() => {
            console.log("runTimeout");
        }, 1);
        ExGame.runTimeout(() => {
            console.log("runTimeout");
        }, 2);
        ExGame.runTimeout(() => {
            ExGame.clearRun(id);
            ExGame.runTimeout(() => {
                console.log("runTimeout999");
            }, 50);
        }, 3);
        ExGame.runTimeout(() => {
            console.log("runTimeout");
        }, 5);
    }
}
//# sourceMappingURL=exGame.js.map