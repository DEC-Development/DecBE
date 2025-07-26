import { world } from "@minecraft/server";
import ExScoresManager from "./ExScoresManager.js";
import ExCommand from '../env/ExCommand.js';
import { MinecraftDimensionTypes } from "../../../vanilla-data/lib/index.js";
export default class ExNullEntity {
    constructor(name) {
        this.command = new ExCommand(this);
        this.nameTag = name;
    }
    runCommandAsync(command) {
        return world.getDimension(MinecraftDimensionTypes.Overworld).runCommandAsync(command);
    }
    runCommand(command) {
        return world.getDimension(MinecraftDimensionTypes.Overworld).runCommand(command);
    }
    getScoresManager() {
        return new ExScoresManager(this);
    }
}
//# sourceMappingURL=ExNullEntity.js.map