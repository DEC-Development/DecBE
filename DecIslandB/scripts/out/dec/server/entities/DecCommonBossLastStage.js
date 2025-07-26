import DecBossController from "./DecBossController.js";
export class DecCommonBossLastStage extends DecBossController {
    constructor(e, server, spawn) {
        super(e, server, spawn);
    }
    onDestroy() {
        super.onDestroy();
    }
    onAppear(spawn) {
        super.onAppear(spawn);
    }
    onKilled(e) {
        this.onWin();
        super.onKilled(e);
    }
}
//# sourceMappingURL=DecCommonBossLastStage.js.map