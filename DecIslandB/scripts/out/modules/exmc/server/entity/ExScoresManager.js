import { world } from '@minecraft/server';
import ExNullEntity from "./ExNullEntity.js";
import ExGameConfig from '../ExGameConfig.js';
export default class ExScoresManager {
    constructor(e) {
        this.entity = e;
    }
    getIdentity(objective) {
        var _a, _b;
        if (this.entity instanceof ExNullEntity) {
            const e = this.entity;
            return (_b = (_a = world.scoreboard.getObjective(objective)) === null || _a === void 0 ? void 0 : _a.getScores().find(i => i.participant.displayName === e.nameTag)) === null || _b === void 0 ? void 0 : _b.participant;
        }
        else {
            return this.entity.scoreboardIdentity;
        }
    }
    getScore(objective) {
        var _a, _b;
        let name = typeof objective === "string" ? objective : objective.name;
        let id = this.getIdentity(name);
        if (!id)
            return 0;
        try {
            return (_b = (_a = world.scoreboard.getObjective(name)) === null || _a === void 0 ? void 0 : _a.getScore(id)) !== null && _b !== void 0 ? _b : 0;
        }
        catch (e) {
            return 0;
        }
        ;
    }
    hasScore(objective) {
        var _a;
        let name = typeof objective === "string" ? objective : objective.name;
        let id = this.getIdentity(name);
        if (!id)
            return false;
        try {
            return (_a = world.scoreboard.getObjective(name)) === null || _a === void 0 ? void 0 : _a.hasParticipant(id);
        }
        catch (e) {
            return false;
        }
        ;
    }
    setScore(objective, num) {
        var _a;
        let name = typeof objective === "string" ? objective : objective.name;
        let id = this.getIdentity(name);
        if (!id && this.entity instanceof ExNullEntity) {
            this.entity.runCommandAsync(`scoreboard players set ${'"' + this.entity.nameTag + '"'} ${name} ${num}`);
        }
        if (!id)
            return false;
        (_a = world.scoreboard.getObjective(name)) === null || _a === void 0 ? void 0 : _a.setScore(id, num);
        return true;
    }
    addScore(objective, num) {
        return this.setScore(objective, this.getScore(objective) + num);
    }
    removeScore(objective, num) {
        return this.setScore(objective, this.getScore(objective) - num);
    }
    deleteScore(objective) {
        var _a;
        const name = typeof objective === "string" ? objective : objective.name;
        const identity = this.getIdentity(name);
        if (!identity)
            return false;
        (_a = world.scoreboard.getObjective(name)) === null || _a === void 0 ? void 0 : _a.removeParticipant(identity);
        return true;
    }
    /**
     * @LiLeyi
     * 用来初始化计分板上某一项的值。若未初始化返回true，初始化了返回false
     * */
    initializeScore(name, value) {
        if (!this.hasScore(name)) {
            this.setScore(name, value);
            return true;
        }
        else {
            return false;
        }
    }
}
export class Objective {
    constructor(name) {
        this.name = name;
        this.scoreboardObjective = world.scoreboard.getObjective(name);
    }
    create(showName) {
        if (!world.scoreboard.getObjective(this.name))
            this.scoreboardObjective = world.scoreboard.addObjective(this.name, showName);
        return this;
    }
    delete() {
        if (world.scoreboard.getObjective(this.name))
            world.scoreboard.removeObjective(this.name);
    }
    setDisplay(mode = "sidebar", ascending = true) {
        if (mode == "sidebar") {
            ExGameConfig.runCommandAsync(`scoreboard objectives setdisplay ${mode} ${this.name} ${ascending ? "ascending" : "descending"}`);
        }
        else {
            ExGameConfig.runCommandAsync(`scoreboard objectives setdisplay ${mode} ${this.name}`);
        }
        return this;
    }
    addScore(participant, scoreToAdd) {
        var _a, _b;
        return (_b = (_a = this.scoreboardObjective) === null || _a === void 0 ? void 0 : _a.addScore(participant, scoreToAdd)) !== null && _b !== void 0 ? _b : 0;
    }
    getParticipants() {
        var _a, _b;
        return (_b = (_a = this.scoreboardObjective) === null || _a === void 0 ? void 0 : _a.getParticipants()) !== null && _b !== void 0 ? _b : [];
    }
    getScore(participant) {
        var _a, _b;
        return (_b = (_a = this.scoreboardObjective) === null || _a === void 0 ? void 0 : _a.getScore(participant)) !== null && _b !== void 0 ? _b : undefined;
    }
    getScores() {
        var _a, _b;
        return (_b = (_a = this.scoreboardObjective) === null || _a === void 0 ? void 0 : _a.getScores()) !== null && _b !== void 0 ? _b : [];
    }
    hasParticipant(participant) {
        var _a, _b;
        return (_b = (_a = this.scoreboardObjective) === null || _a === void 0 ? void 0 : _a.hasParticipant(participant)) !== null && _b !== void 0 ? _b : false;
    }
    isValid() {
        var _a, _b;
        return (_b = (_a = this.scoreboardObjective) === null || _a === void 0 ? void 0 : _a.isValid()) !== null && _b !== void 0 ? _b : false;
    }
    removeParticipant(participant) {
        var _a, _b;
        return (_b = (_a = this.scoreboardObjective) === null || _a === void 0 ? void 0 : _a.removeParticipant(participant)) !== null && _b !== void 0 ? _b : false;
    }
    setScore(participant, score) {
        var _a, _b;
        return (_b = (_a = this.scoreboardObjective) === null || _a === void 0 ? void 0 : _a.setScore(participant, score)) !== null && _b !== void 0 ? _b : undefined;
    }
    initScore(participant, score) {
        if (!this.hasParticipant(participant)) {
            this.setScore(participant, score);
        }
    }
}
//# sourceMappingURL=ExScoresManager.js.map