import PomBossController from './PomBossController.js';
class PomHeadlessGuardBoss extends PomBossController {
    constructor(e, server, spawn) {
        super(e, server, spawn);
    }
    initBossEntity() {
        super.initBossEntity();
        this.music = this.server.getMusic("music.wb.unknown_world");
        this.music.trackPlayers(Array.from(this.barrier.getPlayers()));
        if (this.isFisrtCall) {
            this.server.say({ rawtext: [{ translate: "text.wb:summon_headless_guard.name" }] });
            this.music.loop();
        }
    }
    onAppear(spawn) {
        super.onAppear(spawn);
    }
    onKilled(e) {
        //设置奖励
        super.onWin();
        this.server.say({ rawtext: [{ translate: "text.wb:defeat_headless_guard.name" }] });
        this.music.stop();
        super.onKilled(e);
    }
    onFail() {
        this.music.stop();
        super.onFail();
    }
}
PomHeadlessGuardBoss.typeId = "wb:headless_guard";
export default PomHeadlessGuardBoss;
//# sourceMappingURL=PomHeadlessGuardBoss.js.map