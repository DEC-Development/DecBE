var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ExGameConfig from "./ExGameConfig.js";
import ExClientEvents from "./events/ExClientEvents.js";
import { world } from '@minecraft/server';
import ExPlayer from "./entity/ExPlayer.js";
import ExDimension from "./ExDimension.js";
import ExErrorQueue from "./ExErrorQueue.js";
import ExActionAlert from "./ui/ExActionAlert.js";
import "../../reflect-metadata/Reflect.js";
import { eventDecoratorFactory } from "./events/eventDecoratorFactory.js";
import notUtillTask from "../utils/notUtillTask.js";
import '../utils/Console.js';
import { MinecraftDimensionTypes } from "../../vanilla-data/lib/index.js";
import ExContext from "./ExGameObject.js";
export default class ExGameClient extends ExContext {
    debug_removeAllTag() {
        for (let i of this.exPlayer.getTags()) {
            this.exPlayer.removeTag(i);
        }
    }
    debug_alert() {
        new ExActionAlert().title("aaa").body("bbbb").button("alert", () => { })
            .button("alert", () => { })
            .show(this.player);
    }
    debug_remove() {
        return this.getDimension(MinecraftDimensionTypes.Nether).getEntities().forEach(e => e.remove());
    }
    debug_error() {
        return ExErrorQueue.getError();
    }
    constructor(server, id, player) {
        super(server);
        this.debuggerChatTest = (e) => {
            this.run(() => {
                if (e.message.startsWith("*/"))
                    console.info(eval(e.message.substring(2, e.message.length)));
            });
        };
        this.isLoaded = false;
        this._server = server;
        this.clientId = id;
        this.player = player;
        this.exPlayer = ExPlayer.getInstance(player);
        this.playerName = player.name;
        this._events = new ExClientEvents(this);
        if (ExGameConfig.config.debug) {
            this.asDebugger();
        }
        else {
            this.notDebugger();
        }
        notUtillTask(this, () => __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.exPlayer.command.runAsync(`testfor @s`);
                return true;
            }
            catch (e) {
                return false;
            }
        }), () => { this.onLoad(); this.isLoaded = true; });
        this.onJoin();
        eventDecoratorFactory(this.getEvents(), this);
    }
    getDimension(type) {
        if (type !== undefined) {
            return world.getDimension(type);
        }
        else {
            return this.exPlayer.dimension;
        }
    }
    getExDimension(type = undefined) {
        return ExDimension.getInstance(this.getDimension(...arguments));
    }
    getPlayers() {
        return world.getPlayers();
    }
    getServer() {
        return this._server;
    }
    getClient(name) {
        if (typeof name === "string") {
            return this.getServer().findClientByName(name);
        }
        else {
            return this.getServer().findClientByPlayer(name);
        }
    }
    getScreen() {
        return this.player.onScreenDisplay;
    }
    setInterworkingPool(pool) {
        this._pool = pool;
        this._poolCache = {};
        for (const name in this._pool) {
            this._poolCache[name] = this._pool[name];
            Object.defineProperty(this._pool, name, {
                set: (v) => {
                    this._poolCache[name] = v;
                    // TODO: send to client
                },
                get: () => {
                    const value = this._poolCache[name];
                    if (typeof value === "function") {
                        return function () {
                            const msg = {
                                "type": "pool",
                                "name": name,
                                "args": [...arguments]
                            };
                            // TODO: send to client
                            return new Promise((v, e) => {
                                const res = value(...msg.args);
                                v(res);
                            });
                        };
                    }
                    else {
                        return value;
                    }
                },
                enumerable: true
            });
        }
    }
    getInterworkingPool() {
        return this._pool;
    }
    onJoin() {
    }
    onLoad() {
    }
    onLeave() {
        this._events.cancelAll();
        ExPlayer.deleteInstance(this.player);
        this.dispose();
    }
    getEvents() {
        return this._events;
    }
    asDebugger() {
        this.player.addTag("debugger");
        this._events.exEvents.beforeChatSend.subscribe(this.debuggerChatTest);
    }
    notDebugger() {
        this.player.removeTag("debugger");
    }
    getDefaultSpawnLocation() {
        return this.getServer().getDefaultSpawnLocation();
    }
    getDynamicPropertyManager() {
        return this.player;
    }
    runMethodOnEveryClient(fun) {
        for (let c of this.getServer().getClients()) {
            fun(c);
        }
    }
}
//# sourceMappingURL=ExGameClient.js.map