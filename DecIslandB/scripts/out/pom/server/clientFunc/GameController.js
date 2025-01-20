import ExGameConfig from "../../../modules/exmc/server/ExGameConfig.js";
import ExContext from "../../../modules/exmc/server/ExGameObject.js";
export default class GameController extends ExContext {
    constructor(client) {
        super(client);
        this._client = client;
    }
    get exPlayer() {
        return this._client.exPlayer;
    }
    get player() {
        return this._client.player;
    }
    get client() {
        return this._client;
    }
    get globalSettings() {
        return this._client.globalSettings;
    }
    get data() {
        return this._client.data;
    }
    get globalData() {
        return this._client.getServer().data;
    }
    get gameId() {
        return this._client.gameId;
    }
    runCommandAsync(str) {
        return ExGameConfig.runCommandAsync(str);
    }
    runCommand(str) {
        return ExGameConfig.runCommand(str);
    }
    getDimension(type = undefined) {
        return this._client.getDimension(type);
    }
    getExDimension(type = undefined) {
        return this._client.getExDimension(type);
    }
    getPlayers() {
        return this._client.getPlayers();
    }
    getEvents() {
        return this._client.getEvents();
    }
    sayTo(str, p = this.player) {
        this._client.sayTo(str, p);
    }
    getLang() {
        return this._client.getLang();
    }
    get lang() {
        return this._client.getLang();
    }
}
//# sourceMappingURL=GameController.js.map