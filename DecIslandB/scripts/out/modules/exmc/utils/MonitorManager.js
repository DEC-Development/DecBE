import ExErrorQueue from "../server/ExErrorQueue.js";
import BidirectionalMap from "./BidirectionalMap.js";
export default class MonitorManager {
    constructor() {
        this.idMap = new BidirectionalMap();
        this.mixer = [];
    }
    subscribe(callback) {
        this.addMonitor(callback);
        return callback;
    }
    unsubscribe(callback) {
        this.removeMonitor(callback);
        return callback;
    }
    addMonitor(monitor) {
        this.mixer.push(monitor);
        this.idMap.set(MonitorManager.id++, monitor);
        return monitor;
    }
    removeId(id) {
        if (!this.idMap.has(id))
            return;
        this.removeMonitor(this.idMap.get(id));
    }
    removeMonitor(monitor) {
        let index = this.mixer.indexOf(monitor);
        if (index === -1)
            return;
        this.mixer.splice(index, 1);
        this.idMap.delete(monitor);
    }
    hasMonitor(monitor) {
        let index = this.mixer.indexOf(monitor);
        return index !== -1;
    }
    trigger(args) {
        for (let e of this.mixer) {
            try {
                e(args);
            }
            catch (err) {
                ExErrorQueue.throwError(err);
            }
        }
    }
    get length() {
        return this.mixer.length;
    }
    *[Symbol.iterator]() {
        for (let e of this.mixer) {
            yield e;
        }
    }
    forEach(arg0) {
        for (let e of this.mixer) {
            try {
                arg0(e);
            }
            catch (err) {
                ExErrorQueue.throwError(err);
            }
        }
    }
}
MonitorManager.id = 0;
//# sourceMappingURL=MonitorManager.js.map