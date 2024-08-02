import { GameMode } from '@minecraft/server';
import ExEntity from "./ExEntity.js";
import ExPlayerBag from './ExPlayerBag.js';
export default class ExPlayer extends ExEntity {
    get entity() {
        return super.entity;
    }
    set entity(e) {
        super.entity = e;
    }
    set gameModeCode(gameMode) {
        this.gamemode = this.gamemodeMap[gameMode];
    }
    get gameModeCode() {
        return this.gamemodeMap[this.gamemode];
    }
    set gamemode(mode) {
        this.entity.setGameMode(mode);
    }
    get gamemode() {
        return this.entity.getGameMode();
    }
    title(title, subtitle) {
        // this.runCommandAsync(`titleraw @s title {"rawtext":[{"text":"${title}"}]}`);
        // if (subtitle) this.runCommandAsync(`titleraw @s subtitle {"rawtext":[{"text":"${subtitle}"}]}`);
        this.entity.onScreenDisplay.setTitle(title);
        if (subtitle)
            this.entity.onScreenDisplay.updateSubtitle(subtitle);
    }
    titleActionBar(str) {
        //this.runCommandAsync(`titleraw @s actionbar {"rawtext":[{"text":"${str}"}]}`);
        this.entity.onScreenDisplay.setActionBar(str);
    }
    get selectedSlotIndex() {
        return this.entity.selectedSlotIndex;
    }
    set selectedSlotIndex(value) {
        this.entity.selectedSlotIndex = value;
    }
    get viewDirection() {
        return super.viewDirection;
    }
    set viewDirection(ivec) {
        this.teleport(this.position, {
            "rotation": {
                x: ivec.rotateAngleX(),
                y: ivec.rotateAngleY()
            }
        });
    }
    setPosition(position, dimension) {
        this.entity.teleport(position, {
            "dimension": dimension
        });
    }
    get rotation() {
        return super.rotation;
    }
    set rotation(ivec) {
        this.teleport(this.position, {
            "rotation": ivec
        });
    }
    constructor(player) {
        super(player);
        this.gamemodeMap = {
            "0": GameMode.survival,
            "1": GameMode.creative,
            "2": GameMode.adventure,
            "3": GameMode.spectator,
            [GameMode.survival]: 0,
            [GameMode.creative]: 1,
            [GameMode.adventure]: 2,
            [GameMode.spectator]: 3
        };
        this.bag = new ExPlayerBag(this);
        this.scoresManager = super.getScoresManager();
    }
    getBag() {
        return this.bag;
    }
    static getInstance(source) {
        let entity = source;
        if (this.propertyNameCache in entity) {
            // ExGameConfig.console.log("Property id " + (entity as Player).name + "//" + (ExSystem.getId((entity[this.propertyNameCache] as ExPlayer).entity) == ExSystem.getId(entity)))
            // ExGameConfig.console.log("Property == " + (entity[this.propertyNameCache] as ExPlayer).entity == entity)
            // if((entity[this.propertyNameCache] as ExPlayer).entity != entity) (entity[this.propertyNameCache] as ExPlayer).entity = entity;
            return entity[this.propertyNameCache];
        }
        return (entity[this.propertyNameCache] = new ExPlayer(entity));
    }
    static deleteInstance(source) {
        delete source[this.propertyNameCache];
    }
    getScoresManager() {
        return this.scoresManager;
    }
}
//# sourceMappingURL=ExPlayer.js.map