var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ExContext from "../interface/ExContext.js";
import MonitorManager from "../utils/MonitorManager.js";
import ExGame from "./ExGame.js";
export default class ExGameObject extends ExContext {
    constructor(parrent) {
        super();
        this.tickMonitor = new MonitorManager();
        this.longTickMonitor = new MonitorManager();
        this.beforeTickMonitor = new MonitorManager();
        this._waitCode = [];
        this.interrupt = false;
        this.parent = parrent;
        this.tickMonitorListener = this.parent.tickMonitor.addMonitor((arg) => {
            if (this.interrupt)
                return;
            this.tickMonitor.trigger(arg);
        });
        this.beforeTickMonitorListener = this.parent.beforeTickMonitor.addMonitor((arg) => {
            if (this.interrupt)
                return;
            this.beforeTickMonitor.trigger(arg);
        });
        this.longTickMonitorListener = this.parent.longTickMonitor.addMonitor((arg) => {
            if (this.interrupt)
                return;
            this.longTickMonitor.trigger(arg);
        });
    }
    sleep(timeout) {
        return new Promise((resolve, reject) => {
            this.runTimeout(() => {
                resolve();
            }, timeout);
        });
    }
    sleepByTick(timeout) {
        return new Promise((resolve, reject) => {
            this.runTimeoutByTick(() => {
                resolve();
            }, timeout);
        });
    }
    clearRun(runId) {
        this.tickMonitor.removeId(runId);
        this.longTickMonitor.removeId(runId);
        this.beforeTickMonitor.removeId(runId);
        // console.warn("clear run:"+runId+"/"+JSON.stringify(Array.from(this.tickMonitor.idMap.keys())));
    }
    run(func) {
        return this.parent.run(() => __awaiter(this, void 0, void 0, function* () {
            yield ExContext.wait(this);
            func();
        }));
    }
    runTimeout(fun, timeout) {
        let time = 0;
        let id = 0;
        let nowDate = Date.now();
        let method = () => {
            let now = Date.now();
            let deltaTime = now - nowDate;
            nowDate = now;
            if (this.interrupt)
                return;
            time += deltaTime;
            if (time > timeout) {
                this.clearRun(id);
                fun();
            }
        };
        return id = this.runIntervalByTick(method);
    }
    runTimeoutByTick(fun, timeout) {
        let time = 0;
        let id = 0;
        let method = () => {
            if (this.interrupt)
                return;
            time += 1;
            if (time > timeout) {
                this.clearRun(id);
                fun();
            }
        };
        return id = this.runIntervalByTick(method);
    }
    runIntervalByTick(fun, timeout = 1) {
        let id = 0;
        timeout = Math.max(1, Math.floor(timeout));
        let method = () => {
            if (this.interrupt || ExGame.nowTick % timeout != 0)
                return;
            fun();
        };
        this.tickMonitor.addMonitor(method);
        // console.warn("create runIntervalByTick");
        id = this.tickMonitor.idMap.get(method);
        return id;
    }
    stopContext() {
        this._waitCode = [];
        this.interrupt = true;
        this.parent.tickMonitor.removeMonitor(this.tickMonitorListener);
        this.parent.tickMonitor.removeMonitor(this.beforeTickMonitorListener);
        this.parent.tickMonitor.removeMonitor(this.longTickMonitorListener);
    }
    startContext() {
        this.interrupt = false;
        this._waitCode.forEach(([p, res]) => __awaiter(this, void 0, void 0, function* () {
            p(res);
        }));
        this._waitCode = [];
        this.parent.tickMonitor.addMonitor(this.tickMonitorListener);
        this.parent.tickMonitor.addMonitor(this.beforeTickMonitorListener);
        this.parent.tickMonitor.addMonitor(this.longTickMonitorListener);
    }
    waitContext(promise) {
        return new Promise((resolve, reject) => {
            promise.then(res => {
                if (!this.interrupt) {
                    resolve(res);
                }
                else {
                    this._waitCode.push([resolve, res]);
                }
            }, onrejectionhandled => {
                this._waitCode.push([reject, onrejectionhandled]);
            });
        });
    }
    dispose() {
        this.stopContext();
    }
}
//# sourceMappingURL=ExGameObject.js.map