// Status.ts
export class Status {
    constructor(id, duration) {
        this.elapsedTime = 0;
        this.id = id;
        this.duration = duration;
    }
    // 判断状态是否已经结束
    isExpired() {
        return this.elapsedTime >= this.duration;
    }
}
export class PoisonStatus extends Status {
    constructor(duration) {
        super("Poison", duration);
        this.damagePerSecond = 5;
    }
    update(deltaTime) {
        console.warn(`毒伤害：造成 ${this.damagePerSecond * deltaTime} 点伤害`);
        this.elapsedTime += deltaTime;
    }
}
//# sourceMappingURL=EpicStatus.js.map