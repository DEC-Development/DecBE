import { EntityDamageCause } from '@minecraft/server';
import ExEntityController from '../../../modules/exmc/server/entity/ExEntityController.js';
import PomBossBarrier from './barrier/PomBossBarrier.js';
import { ExBlockArea } from '../../../modules/exmc/server/block/ExBlockArea.js';
export default class PomBossController extends ExEntityController {
    constructor(e, server) {
        super(e, server);
        this.isFisrtCall = false;
        this.startPos = this.exEntity.position;
        let barrier = PomBossBarrier.find(this.startPos);
        if (!barrier) {
            this.isFisrtCall = true;
            barrier = new PomBossBarrier(server, this.exEntity.exDimension, new ExBlockArea(this.startPos.cpy().sub(32, 32, 32), this.startPos.cpy().add(32, 32, 32), true), this);
        }
        else {
            barrier.setBoss(this);
        }
        this.barrier = barrier;
        if (barrier.players.size === 0) {
            this.despawn();
            this.stopBarrier();
            this.destroyBossEntity();
        }
        else {
            this.initBossEntity();
        }
    }
    despawn() {
        this.entity.remove();
    }
    onFail() {
        console.warn("onFail");
        this.stopBattle();
        this.destroyBossEntity();
        this.server.say({ rawtext: [{ translate: "text.dec:killed_by_boss.name" }] });
        this.despawn();
    }
    onWin() {
        //设置奖励
        for (let c of this.barrier.clientsByPlayer()) {
            c.progressTaskFinish(this.entity.typeId, c.ruinsSystem.causeDamage);
            c.ruinsSystem.causeDamageShow = false;
        }
        this.stopBarrier();
        console.warn("onWin");
    }
    onKilled(e) {
        this.destroyBossEntity();
        if (e.damageSource.cause === EntityDamageCause.suicide || e.damageSource.cause === EntityDamageCause.selfDestruct) {
            this.stopBattle();
        }
        super.onKilled(e);
    }
    onSpawn() {
        super.onSpawn();
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
    destroyBossEntity() {
    }
    initBossEntity() {
        for (let c of this.barrier.clientsByPlayer()) {
            c.ruinsSystem.causeDamageShow = true;
            c.ruinsSystem.causeDamageType.add(this.entity.typeId);
        }
    }
}
//# sourceMappingURL=PomBossController.js.map