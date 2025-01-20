import EventHandle from "../events/EventHandle.js";
import { ExEventNames, ExOtherEventNames } from "../events/events.js";
export default class ExEntityEvents {
    _subscribe(arg0, callback) {
        ExEntityEvents.eventHandlers.subscribe(this._ctrl.entity, arg0, callback);
    }
    _unsubscribe(arg0, callback) {
        ExEntityEvents.eventHandlers.unsubscribe(this._ctrl.entity, arg0, callback);
    }
    cancelAll() {
        ExEntityEvents.eventHandlers.unsubscribeAll(this._ctrl.entity);
    }
    static init(s) {
        this.eventHandlers.setEventLiseners(this.exEventSetting);
        this.eventHandlers.init(s);
    }
    constructor(ctrl) {
        this.monitorMapBackup = {};
        this.exEvents = {
            [ExEventNames.beforeItemUse]: new Listener(this, ExEventNames.beforeItemUse),
            [ExEventNames.afterItemUse]: new Listener(this, ExEventNames.afterItemUse),
            [ExOtherEventNames.tick]: new Listener(this, ExOtherEventNames.tick),
            [ExEventNames.afterEntityHitBlock]: new Listener(this, ExEventNames.afterEntityHitBlock),
            [ExEventNames.afterEntityHitEntity]: new Listener(this, ExEventNames.afterEntityHitEntity),
            [ExOtherEventNames.afterOnHurt]: new Listener(this, ExOtherEventNames.afterOnHurt),
            [ExOtherEventNames.onLongTick]: new Listener(this, ExOtherEventNames.onLongTick),
            [ExOtherEventNames.beforeTick]: new Listener(this, ExOtherEventNames.beforeTick),
            [ExEventNames.afterPlayerBreakBlock]: new Listener(this, ExEventNames.afterPlayerBreakBlock),
            [ExEventNames.afterEntityDie]: new Listener(this, ExEventNames.afterEntityDie),
            [ExEventNames.afterEntityRemove]: new Listener(this, ExEventNames.afterEntityRemove),
            [ExEventNames.beforeEntityRemove]: new Listener(this, ExEventNames.beforeEntityRemove),
            [ExEventNames.afterEntityLoad]: new Listener(this, ExEventNames.afterEntityLoad)
        };
        this._ctrl = ctrl;
        this.exEvents[ExOtherEventNames.tick] = ctrl.tickMonitor;
        this.exEvents[ExOtherEventNames.onLongTick] = ctrl.longTickMonitor;
        this.exEvents[ExOtherEventNames.beforeTick] = ctrl.beforeTickMonitor;
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
    stopContext() {
        if (ExEntityEvents.eventHandlers.monitorMap[ExOtherEventNames.onLongTick].has(this._ctrl.entity)) {
            this.monitorMapBackup[ExOtherEventNames.onLongTick] =
                ExEntityEvents.eventHandlers.monitorMap[ExOtherEventNames.onLongTick].get(this._ctrl.entity);
            ExEntityEvents.eventHandlers.monitorMap[ExOtherEventNames.onLongTick].delete(this._ctrl.entity);
        }
        if (ExEntityEvents.eventHandlers.monitorMap[ExOtherEventNames.tick].has(this._ctrl.entity)) {
            this.monitorMapBackup[ExOtherEventNames.tick] =
                ExEntityEvents.eventHandlers.monitorMap[ExOtherEventNames.tick].get(this._ctrl.entity);
            ExEntityEvents.eventHandlers.monitorMap[ExOtherEventNames.tick].delete(this._ctrl.entity);
        }
    }
    startContext() {
        if (ExOtherEventNames.tick in this.monitorMapBackup) {
            ExEntityEvents.eventHandlers.monitorMap[ExOtherEventNames.tick].set(this._ctrl.entity, this.monitorMapBackup[ExOtherEventNames.tick]);
        }
        if (ExOtherEventNames.onLongTick in this.monitorMapBackup) {
            ExEntityEvents.eventHandlers.monitorMap[ExOtherEventNames.onLongTick].set(this._ctrl.entity, this.monitorMapBackup[ExOtherEventNames.onLongTick]);
        }
        this.monitorMapBackup = {};
    }
}
ExEntityEvents.eventHandlers = new EventHandle();
ExEntityEvents.exEventSetting = {
    [ExEventNames.beforeItemUse]: {
        pattern: ExEntityEvents.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "source"
        }
    },
    [ExEventNames.afterItemUse]: {
        pattern: ExEntityEvents.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "source"
        }
    },
    [ExOtherEventNames.tick]: {
        pattern: (registerName, k) => { }
    },
    [ExOtherEventNames.beforeTick]: {
        pattern: (registerName, k) => { }
    },
    [ExEventNames.afterEntityHitBlock]: {
        pattern: ExEntityEvents.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "entity"
        }
    },
    [ExEventNames.afterEntityHitEntity]: {
        pattern: ExEntityEvents.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "damageSource.damagingEntity"
        },
        name: ExEventNames.afterEntityHurt
    },
    [ExOtherEventNames.afterOnHurt]: {
        pattern: ExEntityEvents.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "hurtEntity"
        },
        name: ExEventNames.afterEntityHurt
    },
    [ExOtherEventNames.onLongTick]: {
        pattern: (registerName, k) => { }
    },
    [ExEventNames.afterPlayerBreakBlock]: {
        pattern: ExEntityEvents.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "player"
        }
    },
    [ExEventNames.afterEntityDie]: {
        pattern: ExEntityEvents.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "deadEntity"
        }
    },
    [ExEventNames.afterEntityRemove]: {
        pattern: (registerName, k) => {
            ExEntityEvents.eventHandlers.server.getEvents().register(registerName, (e) => {
                for (let [key, value] of ExEntityEvents.eventHandlers.monitorMap[k]) {
                    if (key.id === e.removedEntityId) {
                        value.trigger(e);
                    }
                }
            });
        }
    },
    [ExEventNames.beforeEntityRemove]: {
        pattern: ExEntityEvents.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "removedEntity"
        }
    },
    [ExEventNames.afterEntityLoad]: {
        pattern: ExEntityEvents.eventHandlers.registerToServerByEntity,
        filter: {
            "name": "entity"
        }
    }
};
ExEntityEvents.onHandItemMap = new Map();
ExEntityEvents.onceItemUseOnMap = new Map();
class Listener {
    constructor(e, name) {
        this.subscribe = (callback) => {
            e._subscribe(name, callback);
        };
        this.unsubscribe = (callback) => {
            e._unsubscribe(name, callback);
        };
    }
}
class CallBackListener {
    constructor(e, name) {
        this.subscribe = (callback) => {
            e._subscribe(name, callback);
        };
        this.unsubscribe = (callback) => {
            e._unsubscribe(name, callback);
        };
    }
}
//# sourceMappingURL=ExEntityEvents.js.map