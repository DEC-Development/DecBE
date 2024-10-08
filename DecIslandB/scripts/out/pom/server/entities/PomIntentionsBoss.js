var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import PomBossController from './PomBossController.js';
import { registerEvent } from '../../../modules/exmc/server/events/eventDecoratorFactory.js';
import ExErrorQueue from '../../../modules/exmc/server/ExErrorQueue.js';
import VarOnChangeListener from '../../../modules/exmc/utils/VarOnChangeListener.js';
export class PomIntentionsBoss1 extends PomBossController {
    constructor(e, server) {
        super(e, server);
    }
    initBossEntity() {
        super.initBossEntity();
        if (this.isFisrtCall)
            this.server.say({ rawtext: [{ translate: "text.wb:summon_intentions.name" }] });
        this.barrier.changeFog("wb:ruin_mind_1_boss");
    }
    onSpawn() {
        super.onSpawn();
    }
    onKilled(e) {
        super.onKilled(e);
    }
    onFail() {
        super.onFail();
    }
    onLongTick(e) {
        try {
            if (this.exEntity.hasComponent("minecraft:is_charged")) {
                this.barrier.particle("wb:ruin_mind_boss_resist_par");
            }
        }
        catch (e) {
            ExErrorQueue.throwError(e);
        }
    }
}
PomIntentionsBoss1.typeId = "wb:intentions_first";
__decorate([
    registerEvent("onLongTick"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PomIntentionsBoss1.prototype, "onLongTick", null);
export class PomIntentionsBoss2 extends PomBossController {
    constructor(e, server) {
        super(e, server);
    }
    initBossEntity() {
        super.initBossEntity();
        this.barrier.changeFog("wb:ruin_mind_2_boss");
    }
    onSpawn() {
        super.onSpawn();
    }
    onKilled(e) {
        super.onKilled(e);
    }
    onFail() {
        super.onFail();
    }
    onLongTick(e) {
        try {
            if (this.exEntity.hasComponent("minecraft:is_baby")) {
                this.barrier.particle("wb:ruin_mind_boss_floor_par");
                this.barrier.changeFog("wb:ruin_mind_3_boss");
            }
            else {
                this.barrier.changeFog("wb:ruin_mind_2_boss");
            }
        }
        catch (e) {
            ExErrorQueue.throwError(e);
        }
    }
}
PomIntentionsBoss2.typeId = "wb:intentions_second";
__decorate([
    registerEvent("onLongTick"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PomIntentionsBoss2.prototype, "onLongTick", null);
export class PomIntentionsBoss3 extends PomBossController {
    constructor(e, server) {
        super(e, server);
    }
    initBossEntity() {
        super.initBossEntity();
        this.state = new VarOnChangeListener((n) => {
            switch (n) {
                case 9:
                    this.exEntity.exDimension.spawnParticle("wb:ruin_mind_boss_third_par", this.exEntity.position);
                    break;
                case 1:
                case 2:
                case 3:
                    this.exEntity.exDimension.spawnParticle("wb:ruin_mind_boss_second_par", this.exEntity.position);
                    break;
            }
        }, 1);
        this.changeFog = new VarOnChangeListener((n) => {
            if (n === "wb:ruin_mind_5_boss") {
                this.barrier.changeFog("wb:ruin_mind_4_boss");
                this.setTimeout(() => {
                    this.barrier.changeFog("wb:ruin_mind_5_boss");
                }, 5000);
            }
            else {
                this.barrier.changeFog(n);
            }
        }, "");
        this.changeFog.upDate("wb:ruin_mind_5_boss");
    }
    onLongTick(e) {
        try {
            if (this.exEntity.hasComponent("minecraft:is_baby")) {
                this.barrier.particle("wb:ruin_mind_boss_floor_par");
                this.changeFog.upDate("wb:ruin_mind_3_boss");
            }
            else {
                this.changeFog.upDate("wb:ruin_mind_5_boss");
            }
            this.state.upDate(this.exEntity.getVariant());
        }
        catch (e) {
            ExErrorQueue.throwError(e);
        }
    }
    onSpawn() {
        super.onSpawn();
    }
    onKilled(e) {
        //设置奖励
        super.onWin();
        this.server.say({ rawtext: [{ translate: "text.wb:defeat_intentions.name" }] });
        super.onKilled(e);
    }
    onFail() {
        super.onFail();
    }
}
PomIntentionsBoss3.typeId = "wb:intentions_third";
__decorate([
    registerEvent("onLongTick"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PomIntentionsBoss3.prototype, "onLongTick", null);
//# sourceMappingURL=PomIntentionsBoss.js.map