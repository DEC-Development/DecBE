var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityDamageCause } from '@minecraft/server';
import ExEntityController from '../../../modules/exmc/server/entity/ExEntityController.js';
import PomBossBarrier from './barrier/PomBossBarrier.js';
import { ExBlockArea } from '../../../modules/exmc/server/block/ExBlockArea.js';
import Vector3 from '../../../modules/exmc/utils/math/Vector3.js';
import ExSystem from '../../../modules/exmc/utils/ExSystem.js';
import { registerEvent } from '../../../modules/exmc/server/events/eventDecoratorFactory.js';
import { ExOtherEventNames } from '../../../modules/exmc/server/events/events.js';
export default class PomBossController extends ExEntityController {
    constructor() {
        super(...arguments);
        this.isFisrtCall = false;
        this.lastPosition = new Vector3(this.barrier.center);
    }
    onFail() {
        console.info("onFail");
        this.stopBattle();
        this.server.say({ rawtext: [{ translate: "text.dec:killed_by_boss.name" }] });
        this.destroyTrigger();
    }
    onWin() {
        //设置奖励
        for (let c of this.barrier.clientsByPlayer()) {
            c.progressTaskFinish(this.entity.typeId, c.ruinsSystem.causeDamage);
            c.ruinsSystem.causeDamageShow = false;
        }
        this.stopBarrier();
        console.info("onWin");
    }
    onKilled(e) {
        if (e.damageSource.cause === EntityDamageCause.suicide || e.damageSource.cause === EntityDamageCause.selfDestruct) {
            this.stopBattle();
        }
        super.onKilled(e);
    }
    onAppear(spawn) {
        super.onAppear(spawn);
        this.startPos = this.exEntity.position;
        let barrier = PomBossBarrier.find(this.startPos);
        this.isFisrtCall = spawn;
        if (!barrier) {
            barrier = new PomBossBarrier(this.server, this.exEntity.exDimension, new ExBlockArea(this.startPos.cpy().sub(32, 32, 32), this.startPos.cpy().add(32, 32, 32), true), this);
        }
        else {
            barrier.setBoss(this);
        }
        this.barrier = barrier;
        if (barrier.players.size === 0) {
            this.destroyTrigger();
            this.stopBarrier();
        }
        else {
            this.initBossEntity();
        }
    }
    stopBarrier() {
        this.barrier.stop();
    }
    stopBattle() {
        for (let c of this.barrier.clientsByPlayer()) {
            c.ruinsSystem.causeDamageShow = false;
        }
        this.stopBarrier();
    }
    initBossEntity() {
        for (let c of this.barrier.clientsByPlayer()) {
            c.ruinsSystem.causeDamageShow = true;
            c.ruinsSystem.causeDamageType.add(this.entity.typeId);
        }
    }
    _lastPositionUpdater(e) {
        this.lastPosition.set(this.entity.location);
    }
    onMemoryRemove() {
        var _a;
        super.onMemoryRemove();
        const dim = this.exEntity.exDimension;
        (_a = this.autoJudgeTimer) === null || _a === void 0 ? void 0 : _a.stop();
        this.autoJudgeTimer = ExSystem.tickTask(this.server, () => {
            var _a, _b;
            if (this.isKilled) {
                (_a = this.autoJudgeTimer) === null || _a === void 0 ? void 0 : _a.stop();
                return;
            }
            if (dim.chunkIsLoaded(this.lastPosition)) {
                (_b = this.autoJudgeTimer) === null || _b === void 0 ? void 0 : _b.stop();
                console.info("onKilled - by autoJudge");
                this.onKilled({
                    "damageSource": {
                        "cause": EntityDamageCause.suffocation
                    },
                    "deadEntity": this.entity
                });
            }
        }).delay(20 * 2).start();
    }
    onMemoryLoad() {
        super.onMemoryLoad();
        if (this.autoJudgeTimer) {
            this.autoJudgeTimer.stop();
            this.autoJudgeTimer = undefined;
        }
    }
}
__decorate([
    registerEvent(ExOtherEventNames.onLongTick),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PomBossController.prototype, "_lastPositionUpdater", null);
//# sourceMappingURL=PomBossController.js.map