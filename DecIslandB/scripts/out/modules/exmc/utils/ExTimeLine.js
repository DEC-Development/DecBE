import ExSystem from "./ExSystem.js";
export default class ExTimeLine {
    constructor(tasks) {
        this.arr = [];
        this.tickMap = new Map();
        for (let k in tasks) {
            this.arr.push([parseFloat(k), tasks[k]]);
        }
        this.arr.sort((a, b) => a[0] - b[0]);
        this.timer = ExSystem.tickTask(() => {
            if (this.arr.length === 0) {
                this.stop();
                return;
            }
            if (this.getTime() - this.startTime > this.arr[0][0] * 1000) {
                this.arr.shift()[1](this);
            }
            this.tickMap.forEach((v, k) => {
                v[1]((this.getTime() - this.startTime) / 1000, (this.getTime() - v[0]) / 1000);
            });
        }).delay(1);
    }
    registerTick(path, task) {
        this.tickMap.set(path, [this.getTime(), task]);
    }
    cancelTick(path) {
        this.tickMap.delete(path);
    }
    getTime() {
        return new Date().getTime();
    }
    start() {
        this.startTime = this.getTime();
        this.timer.start();
        return this;
    }
    dispose() {
        this.stop();
    }
    stop() {
        this.timer.stop();
    }
}
//# sourceMappingURL=ExTimeLine.js.map