import ExEntityController from "../../../modules/exmc/server/entity/ExEntityController.js";
import Vector3 from "../../../modules/exmc/utils/math/Vector3.js";
import { MinecraftBlockTypes } from "../../../modules/vanilla-data/lib/index.js";
import { Objective } from "../../../modules/exmc/server/entity/ExScoresManager.js";
import GlobalSettings from "../../../pom/server/cache/GlobalSettings.js";
import ExGame from "../../../modules/exmc/server/ExGame.js";
export default class DecNukeController extends ExEntityController {
    constructor(e, server) {
        super(e, server);
    }
    despawn() {
        this.entity.triggerEvent("minecraft:despawn");
    }
    onSpawn() {
        super.onSpawn();
        if (!new GlobalSettings(new Objective("wpsetting")).nuclearBomb) {
            this.entity.remove();
            return;
        }
        this.setTimeout(() => {
            const tmpV = new Vector3();
            // for (let i = 0; i <= 50; i += 10) {
            const i = 50;
            this.setTimeout(() => {
                const dim = this.exEntity.exDimension;
                const pos = this.entity.location;
                ExGame.runJob(function* () {
                    console.warn("start");
                    for (let x = -i; x <= i; x++) {
                        for (let y = -i; y <= i; y++) {
                            for (let z = -i; z <= i; z++) {
                                tmpV.set(x, y, z);
                                if (tmpV.len() <= i) {
                                    dim.setBlock(tmpV.add(pos), MinecraftBlockTypes.Air);
                                }
                            }
                            dim.spawnParticle("dec:nuke_blast", pos);
                            yield void 0;
                        }
                    }
                });
            }, 3000);
            // }
        }, 10000);
    }
}
//# sourceMappingURL=DecNukeController.js.map