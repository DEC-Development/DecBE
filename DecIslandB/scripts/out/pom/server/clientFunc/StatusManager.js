export class StatusManager {
    constructor(owner) {
        this.statusList = [];
        this.owner = owner;
    }
    addStatus(status) {
        this.statusList.push(status);
        this.owner.runCommand("/say 添加毒");
    }
    removeStatus(status) {
        const index = this.statusList.indexOf(status);
        if (index > -1) {
            this.statusList.splice(index, 1);
        }
    }
    update(deltaTime) {
        for (let i = this.statusList.length - 1; i >= 0; i--) {
            const s = this.statusList[i];
            s.update(deltaTime);
            if (s.isExpired()) {
                this.removeStatus(s);
            }
        }
    }
}
//# sourceMappingURL=StatusManager.js.map