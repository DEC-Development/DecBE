import { EntityDamageCause } from "@minecraft/server";
import DecBossController from "./DecBossController.js";
import { DecCommonBossLastStage } from "./DecCommonBossLastStage.js";
export class DecHostOfDeepBoss1 extends DecBossController {
    constructor(e, server, spawn) {
        super(e, server, spawn);
        this.music = server.getMusic("music.wb.from_the_burning_deep");
        this.music.trackPlayers(Array.from(this.barrier.getPlayers()));
        this.music.loop();
    }
    onAppear(spawn) {
        super.onAppear(spawn);
    }
    onFail() {
        this.music.stop();
        super.onFail();
    }
    onKilled(e) {
        super.onKilled(e);
        if (e.damageSource.cause === EntityDamageCause.suicide || e.damageSource.cause === EntityDamageCause.selfDestruct) {
            this.music.stop();
        }
    }
}
export class DecHostOfDeepBoss2 extends DecBossController {
    constructor(e, server, spawn) {
        super(e, server, spawn);
        this.music = server.getMusic("music.wb.from_the_burning_deep");
        this.music.trackPlayers(Array.from(this.barrier.getPlayers()));
    }
    onAppear(spawn) {
        super.onAppear(spawn);
    }
    onFail() {
        this.music.stop();
        super.onFail();
    }
    onKilled(e) {
        super.onKilled(e);
        if (e.damageSource.cause === EntityDamageCause.suicide || e.damageSource.cause === EntityDamageCause.selfDestruct) {
            this.music.stop();
        }
    }
}
export class DecHostOfDeepBoss3 extends DecCommonBossLastStage {
    constructor(e, server, spawn) {
        super(e, server, spawn);
        this.music = server.getMusic("music.wb.from_the_burning_deep");
        this.music.trackPlayers(Array.from(this.barrier.getPlayers()));
    }
    onDestroy() {
        this.music.stop();
        super.onDestroy();
    }
    onAppear(spawn) {
        super.onAppear(spawn);
    }
}
//# sourceMappingURL=DecHostOfDeepBoss.js.map