import { DecCommonBossLastStage } from "./DecCommonBossLastStage.js";
export class DecLeavesGolemBoss extends DecCommonBossLastStage {
    constructor(e, server, spawn) {
        super(e, server, spawn);
        this.music = server.getMusic("music.wb.wooden_heart");
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
//# sourceMappingURL=DecLeavesGolemBoss.js.map