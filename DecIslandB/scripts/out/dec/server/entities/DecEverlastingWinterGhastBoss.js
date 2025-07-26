import { EntityDamageCause } from "@minecraft/server";
import DecBossController from "./DecBossController.js";
import { DecCommonBossLastStage } from "./DecCommonBossLastStage.js";
export class DecEverlastingWinterGhastBoss1 extends DecBossController {
    constructor(e, server, spawn) {
        super(e, server, spawn);
        this.music = server.getMusic("music.wb.ghost_tears");
        this.music.trackPlayers(Array.from(this.barrier.getPlayers()));
        this.music.loop();
    }
    onKilled(e) {
        super.onKilled(e);
        if (e.damageSource.cause === EntityDamageCause.selfDestruct) {
            this.music.stop();
        }
    }
    onFail() {
        this.music.stop();
        super.onFail();
    }
    onAppear(spawn) {
        super.onAppear(spawn);
    }
}
export class DecEverlastingWinterGhastBoss2 extends DecCommonBossLastStage {
    constructor(e, server, spawn) {
        super(e, server, spawn);
        this.music = server.getMusic("music.wb.the_peotry_of_ghost");
        this.music.trackPlayers(Array.from(this.barrier.getPlayers()));
        this.music.loop();
    }
    onDestroy() {
        this.music.stop();
        super.onDestroy();
    }
    onAppear(spawn) {
        super.onAppear(spawn);
    }
}
//# sourceMappingURL=DecEverlastingWinterGhastBoss.js.map