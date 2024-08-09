var _a;
import { system } from "@minecraft/server";
import "../../reflect-metadata/Reflect.js";
import ExSystem from "../utils/ExSystem.js";
import MonitorManager from "../utils/MonitorManager.js";
import ExErrorQueue from "./ExErrorQueue.js";
export default class ExGame {
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
        tickDelay = Math.round(Math.max(1, tickDelay !== null && tickDelay !== void 0 ? tickDelay : 1));
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
        tickDelay = Math.round(Math.max(1, tickDelay !== null && tickDelay !== void 0 ? tickDelay : 1));
        this.idRunSeq = (1 + this.idRunSeq) % this.tickDelayMax;
        let tar = this.nowTick + tickDelay;
        this.idToTrigger.set(this.idRunSeq, tar);
        if (!this.tickDelayTriggers.has(tar)) {
            this.tickDelayTriggers.set(tar, []);
        }
        (_b = this.tickDelayTriggers.get(tar)) === null || _b === void 0 ? void 0 : _b.push([this.idRunSeq, callback]);
        return this.idRunSeq;
    }
    static run(callback) {
        return system.run(() => {
            try {
                callback();
            }
            catch (err) {
                ExErrorQueue.reportError(err);
                throw err;
            }
        });
    }
    static runJob(r) {
        system.runJob(r());
    }
    static createServer(serverCons, config) {
        let server = new serverCons(config);
        this.serverMap.set(serverCons, server);
    }
    static postMessageBetweenServer() {
    }
    static postMessageBetweenClient(client, s, exportName, args) {
        ExGame.run(() => {
            let server = this.serverMap.get(s);
            if (!server)
                return;
            let finder = server.findClientByPlayer(client.player);
            if (!finder)
                return;
            for (let k of ExSystem.keys(finder)) {
                let data = Reflect.getMetadata("exportName", finder, k);
                if (data === exportName) {
                    Reflect.get(finder, k).apply(finder, args);
                }
            }
        });
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
                    ExErrorQueue.throwError(err);
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
                        ExErrorQueue.throwError(err);
                    }
                });
            }
        }
    };
    system.runInterval(() => {
        func();
    }, 1);
})();
ExGame.beforeTickMonitor = new MonitorManager();
ExGame.tickMonitor = new MonitorManager();
ExGame.longTickMonitor = new MonitorManager();
ExGame.scriptEventReceive = new MonitorManager();
(() => {
    let tickNum = 0, tickTime = 0;
    const fun = () => {
        const n = Date.now();
        let event = {
            currentTick: tickNum,
            deltaTime: (n - tickTime) / 1000
        };
        tickTime = n;
        tickNum = (tickNum + 1) % 72000;
        _a.beforeTickMonitor.trigger(event);
        _a.tickMonitor.trigger(event);
    };
    ExGame.runInterval(fun, 1);
})();
(() => {
    let tickNum = 0, tickTime = 0;
    const fun = () => {
        const n = Date.now();
        let event = {
            currentTick: tickNum,
            deltaTime: (n - tickTime) / 1000
        };
        tickTime = n;
        tickNum = (tickNum + 1) % 72000;
        _a.longTickMonitor.trigger(event);
    };
    ExGame.runInterval(fun, 5);
})();
(() => {
    system.afterEvents.scriptEventReceive.subscribe(e => {
        ExGame.scriptEventReceive.trigger(e);
    });
})();
ExGame.serverMap = new Map;
export function receiveMessage(exportName) {
    return function (target, propertyName, descriptor) {
        Reflect.defineMetadata("exportName", exportName, target, propertyName);
    };
}
//# sourceMappingURL=ExGame.js.map