var _a;
import { Player } from '@minecraft/server';
import ExPlayer from '../entity/ExPlayer.js';
import { ExEventNames, ExOtherEventNames, ItemOnHandChangeEvent, PlayerShootProjectileEvent } from "./events.js";
import EventHandle from './EventHandle.js';
import ExEntity from "../entity/ExEntity.js";
import Vector3 from "../../utils/math/Vector3.js";
import { MinecraftEntityTypes } from "../../../vanilla-data/lib/index.js";
import ExSystem from "../../utils/ExSystem.js";
class ExClientEvents {
    _subscribe(arg0, callback) {
        _a.eventHandlers.subscribe(this._client.player, arg0, callback);
    }
    _unsubscribe(arg0, callback) {
        _a.eventHandlers.unsubscribe(this._client.player, arg0, callback);
    }
    cancelAll() {
        _a.eventHandlers.unsubscribeAll(this._client.player);
    }
    static init(s) {
        this.eventHandlers.setEventLiseners(this.exEventSetting);
        this.eventHandlers.init(s);
    }
    constructor(client) {
        this.exEvents = {
            [ExEventNames.beforeItemUse]: new Listener(this, ExEventNames.beforeItemUse),
            [ExEventNames.afterItemUse]: new Listener(this, ExEventNames.afterItemUse),
            [ExEventNames.afterItemStopUse]: new Listener(this, ExEventNames.afterItemStopUse),
            [ExEventNames.afterItemReleaseUse]: new Listener(this, ExEventNames.afterItemReleaseUse),
            [ExEventNames.afterChatSend]: new Listener(this, ExEventNames.afterChatSend),
            [ExEventNames.beforeChatSend]: new Listener(this, ExEventNames.beforeChatSend),
            [ExOtherEventNames.tick]: new Listener(this, ExOtherEventNames.tick),
            [ExOtherEventNames.beforeTick]: new Listener(this, ExOtherEventNames.beforeTick),
            [ExOtherEventNames.onLongTick]: new Listener(this, ExOtherEventNames.onLongTick),
            [ExEventNames.beforePlayerInteractWithBlock]: new Listener(this, ExEventNames.beforePlayerInteractWithBlock),
            [ExOtherEventNames.beforeOncePlayerInteractWithBlock]: new Listener(this, ExOtherEventNames.beforeOncePlayerInteractWithBlock),
            [ExOtherEventNames.afterPlayerHitBlock]: new Listener(this, ExOtherEventNames.afterPlayerHitBlock),
            [ExOtherEventNames.afterPlayerHitEntity]: new Listener(this, ExOtherEventNames.afterPlayerHitEntity),
            [ExOtherEventNames.afterPlayerHurt]: new Listener(this, ExOtherEventNames.afterPlayerHurt),
            [ExOtherEventNames.afterItemOnHandChange]: new CallBackListener(this, ExOtherEventNames.afterItemOnHandChange),
            [ExOtherEventNames.afterPlayerShootProj]: new Listener(this, ExOtherEventNames.afterPlayerShootProj),
            [ExEventNames.afterPlayerBreakBlock]: new Listener(this, ExEventNames.afterPlayerBreakBlock),
            [ExEventNames.afterPlayerSpawn]: new Listener(this, ExEventNames.afterPlayerSpawn),
            [ExEventNames.afterEntityHealthChanged]: new Listener(this, ExEventNames.afterEntityHealthChanged),
            [ExEventNames.beforeEffectAdd]: new Listener(this, ExEventNames.beforeEffectAdd),
            [ExEventNames.afterEffectAdd]: new Listener(this, ExEventNames.afterEffectAdd),
            [ExEventNames.afterItemStartUse]: new Listener(this, ExEventNames.afterItemStartUse)
        };
        this._client = client;
        this.exEvents[ExOtherEventNames.tick] = client.tickMonitor;
        this.exEvents[ExOtherEventNames.onLongTick] = client.longTickMonitor;
        this.exEvents[ExOtherEventNames.beforeTick] = client.beforeTickMonitor;
    }
    register(name, fun) {
        let func = fun;
        if (name in this.exEvents) {
            return this.exEvents[name].subscribe(func);
        }
        console.warn("No event registered for name " + name);
    }
    cancel(name, fun) {
        if (name in this.exEvents) {
            return this.exEvents[name].unsubscribe(fun);
        }
    }
}
_a = ExClientEvents;
ExClientEvents.eventHandlers = new EventHandle();
ExClientEvents.exEventSetting = {
    [ExEventNames.beforeItemUse]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "source"
        }
    },
    [ExEventNames.afterItemUse]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "source"
        }
    },
    [ExEventNames.afterItemStopUse]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "source"
        }
    },
    [ExEventNames.afterItemReleaseUse]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "source"
        }
    },
    [ExEventNames.afterChatSend]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "sender"
        }
    },
    [ExEventNames.beforeChatSend]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "sender"
        }
    },
    [ExOtherEventNames.tick]: {
        pattern: _a.eventHandlers.registerToServerByServerEvent
    },
    [ExOtherEventNames.beforeTick]: {
        pattern: _a.eventHandlers.registerToServerByServerEvent
    },
    [ExOtherEventNames.onLongTick]: {
        pattern: _a.eventHandlers.registerToServerByServerEvent
    },
    [ExEventNames.beforePlayerInteractWithBlock]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "player"
        }
    },
    [ExOtherEventNames.beforeOncePlayerInteractWithBlock]: {
        pattern: (registerName, k) => {
            _a.onceInteractWithBlockMap = new Map();
            _a.eventHandlers.server.getEvents().register(registerName, (e) => {
                var _b;
                if (!(e.player instanceof Player))
                    return;
                let part = (_a.eventHandlers.monitorMap[k]);
                if (!_a.onceInteractWithBlockMap.has(e.player)) {
                    const player = e.player;
                    _a.onceInteractWithBlockMap.set(e.player, [ExSystem.tickTask(_a.eventHandlers.server, () => {
                            let res = _a.onceInteractWithBlockMap.get(player);
                            if (res === undefined)
                                return;
                            res[1] = true;
                        }).delay(3), true]);
                }
                let res = _a.onceInteractWithBlockMap.get(e.player);
                if (res === undefined)
                    return;
                if (res[1]) {
                    res[1] = false;
                    (_b = part.get(e.player)) === null || _b === void 0 ? void 0 : _b.forEach((v) => v(e));
                }
                res[0].stop();
                res[0].startOnce();
            });
        },
        filter: {
            "name": "player"
        },
        name: ExEventNames.beforePlayerInteractWithBlock
    },
    [ExOtherEventNames.afterPlayerHitBlock]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "damagingEntity"
        },
        name: ExEventNames.afterEntityHitBlock
    },
    [ExOtherEventNames.afterPlayerHitEntity]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "damageSource.damagingEntity"
        },
        name: ExEventNames.afterEntityHurt
    },
    [ExOtherEventNames.afterPlayerHurt]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "hurtEntity"
        },
        name: ExEventNames.afterEntityHurt
    },
    [ExOtherEventNames.afterItemOnHandChange]: {
        pattern: (registerName, k) => {
            _a.onHandItemMap = new Map();
            _a.eventHandlers.server.getEvents().register(registerName, (e) => {
                for (let i of (_a.eventHandlers.monitorMap[k])) {
                    let lastItemCache = _a.onHandItemMap.get(i[0]);
                    if (e.currentTick % 4 === 0 || (i[0].selectedSlotIndex !== (lastItemCache === null || lastItemCache === void 0 ? void 0 : lastItemCache[1]))) {
                        let lastItem = lastItemCache === null || lastItemCache === void 0 ? void 0 : lastItemCache[0];
                        let nowItem = ExPlayer.getInstance(i[0]).getBag().itemOnMainHand;
                        if ((lastItem === null || lastItem === void 0 ? void 0 : lastItem.typeId) !== (nowItem === null || nowItem === void 0 ? void 0 : nowItem.typeId) || i[0].selectedSlotIndex !== (lastItemCache === null || lastItemCache === void 0 ? void 0 : lastItemCache[1])) {
                            let res = nowItem;
                            i[1].forEach((f) => {
                                var _b, _c;
                                res = (_c = f(new ItemOnHandChangeEvent(lastItem, (_b = lastItemCache === null || lastItemCache === void 0 ? void 0 : lastItemCache[1]) !== null && _b !== void 0 ? _b : 0, res, i[0].selectedSlotIndex, i[0]))) !== null && _c !== void 0 ? _c : res;
                            });
                            if (res !== undefined) {
                                if (res.isWillBeRemoved) {
                                    ExPlayer.getInstance(i[0]).getBag().itemOnMainHand = undefined;
                                }
                                else {
                                    ExPlayer.getInstance(i[0]).getBag().itemOnMainHand = res;
                                }
                            }
                            _a.onHandItemMap.set(i[0], [res, i[0].selectedSlotIndex]);
                        }
                    }
                }
            });
        },
        name: ExOtherEventNames.tick
    },
    [ExOtherEventNames.afterPlayerShootProj]: {
        pattern: (registerName, k) => {
            const func = (p, e) => {
                let liss = _a.eventHandlers.monitorMap[k].get(p);
                if (!liss || liss.length === 0)
                    return;
                let arr = [];
                const viewDic = ExEntity.getInstance(p).viewDirection;
                const viewLen = viewDic.len();
                const tmpV = new Vector3();
                for (let e of p.dimension.getEntities({
                    "location": p.location,
                    "maxDistance": 16,
                    "families": ["arrow"]
                })) {
                    tmpV.set(e.getVelocity());
                    const len = tmpV.len();
                    if (len === 0)
                        continue;
                    if (tmpV.len() > 0.15
                        && Math.acos(tmpV.mul(viewDic) / viewLen / tmpV.len()) < 0.25) {
                        arr.push(e);
                    }
                }
                if (arr.length === 0) {
                    for (let e of p.dimension.getEntities({
                        "location": p.location,
                        "maxDistance": 6,
                        "excludeFamilies": [MinecraftEntityTypes.Player]
                    })) {
                        tmpV.set(e.getVelocity());
                        const len = tmpV.len();
                        if (len === 0)
                            continue;
                        if (tmpV.len() > 0.15
                            && Math.acos(tmpV.mul(viewDic) / viewLen / tmpV.len()) < 0.25) {
                            arr.push(e);
                        }
                    }
                }
                if (arr.length > 0) {
                    for (let i of liss) {
                        i(new PlayerShootProjectileEvent(p, arr[0]));
                    }
                }
            };
            _a.eventHandlers.server.getEvents().events.afterItemReleaseUse.subscribe((e) => {
                if (e.itemStack)
                    func(e.source, { "itemStack": e.itemStack });
            });
            _a.eventHandlers.server.getEvents().events.afterItemUse.subscribe((e) => {
                func(e.source, e);
            });
        }
    },
    [ExEventNames.afterPlayerBreakBlock]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "player"
        }
    },
    [ExEventNames.afterPlayerSpawn]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "player"
        }
    },
    [ExEventNames.afterEntityHealthChanged]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "entity"
        }
    },
    [ExEventNames.afterEffectAdd]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "entity"
        }
    },
    [ExEventNames.beforeEffectAdd]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "entity"
        }
    },
    [ExEventNames.afterItemStartUse]: {
        pattern: _a.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "source"
        }
    },
};
ExClientEvents.onHandItemMap = new Map();
ExClientEvents.onceItemUseOnMap = new Map();
ExClientEvents.onceInteractWithBlockMap = new Map();
export default ExClientEvents;
class Listener {
    constructor(e, name) {
        this.subscribe = (callback) => {
            e._subscribe(name, callback);
            return callback;
        };
        this.unsubscribe = (callback) => {
            e._unsubscribe(name, callback);
            return callback;
        };
    }
}
class CallBackListener {
    constructor(e, name) {
        this.subscribe = (callback) => {
            e._subscribe(name, callback);
            return callback;
        };
        this.unsubscribe = (callback) => {
            e._unsubscribe(name, callback);
            return callback;
        };
    }
}
//# sourceMappingURL=ExClientEvents.js.map