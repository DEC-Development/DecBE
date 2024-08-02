import { EntityDamageCause } from "@minecraft/server";
import DecBossController from "./DecBossController.js";
import { DecCommonBossLastStage } from "./DecCommonBossLastStage.js";
export class DecEscapeSoulBoss3 extends DecBossController {
    constructor(e, server) {
        super(e, server);
        this.music = server.getMusic("music.wb.chasing_stage1");
        this.music.trackPlayers(Array.from(this.barrier.getPlayers()));
        this.music.loop();
    }
    onKilled(e) {
        super.onKilled(e);
        if (e.damageSource.cause === EntityDamageCause.suicide || e.damageSource.cause === EntityDamageCause.selfDestruct) {
            this.music.stop();
        }
    }
    onFail() {
        this.music.stop();
        super.onFail();
    }
    onSpawn() {
        super.onSpawn();
    }
}
export class DecEscapeSoulBoss4 extends DecBossController {
    constructor(e, server) {
        super(e, server);
        this.music = server.getMusic("music.wb.chasing_stage2");
        this.music.trackPlayers(Array.from(this.barrier.getPlayers()));
        this.music.loop();
    }
    onKilled(e) {
        super.onKilled(e);
        if (e.damageSource.cause === EntityDamageCause.suicide || e.damageSource.cause === EntityDamageCause.selfDestruct) {
            this.music.stop();
        }
    }
    onFail() {
        this.music.stop();
        super.onFail();
    }
    onSpawn() {
        super.onSpawn();
    }
}
export class DecEscapeSoulBoss5 extends DecCommonBossLastStage {
    constructor(e, server) {
        super(e, server);
        this.music = server.getMusic("music.wb.chasing_stage3");
        this.music.trackPlayers(Array.from(this.barrier.getPlayers()));
        this.music.loop();
    }
    onDestroy() {
        this.music.stop();
        super.onDestroy();
    }
    onSpawn() {
        super.onSpawn();
    }
}
//# sourceMappingURL=DecEscapeSoulBoss.js.map