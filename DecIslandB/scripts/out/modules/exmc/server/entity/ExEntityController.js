var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import ExEntity from "./ExEntity.js";
import { EntityHurtAfterEvent } from '@minecraft/server';
import ExEntityEvents from "./ExEntityEvents.js";
import { eventDecoratorFactory, registerEvent } from "../events/eventDecoratorFactory.js";
import { ExEventNames, ExOtherEventNames } from "../events/events.js";
import ExEntityPool from "./ExEntityPool.js";
import ExContext from "../ExGameObject.js";
/**
 * 控制实体的控制器类。
 * @implements {DisposeAble}
 * @implements {SetTimeOutSupport}
 */
export default class ExEntityController extends ExContext {
    getId() {
        return this._id;
    }
    get entity() {
        return this._entity;
    }
    set entity(value) {
        this._entity = value;
    }
    get exEntity() {
        return this._exEntity;
    }
    set exEntity(value) {
        this._exEntity = value;
    }
    getEvents() {
        return this._events;
    }
    constructor(e, server, spawn) {
        super(server);
        this._isDestroyed = false;
        this._isKilled = false;
        this._entity = e;
        this.server = server;
        this._events = new ExEntityEvents(this);
        this._id = e.id;
        this._init(server);
        this.onAppear(spawn);
        this.onMemoryLoad();
        eventDecoratorFactory(this.getEvents(), this);
    }
    _init(server) {
        this.exEntity = ExEntity.getInstance(this.entity);
    }
    get isLoaded() {
        return !this.interrupt;
    }
    onMemoryRemove() {
        if (this.isLoaded) {
            this.stopContext();
            this.getEvents().stopContext();
        }
    }
    onMemoryLoad() {
        if (!this.isLoaded) {
            this.startContext();
            this.getEvents().startContext();
        }
    }
    onAppear(spawn) {
    }
    destroyTrigger() {
        if (!this._isDestroyed) {
            this._isDestroyed = true;
            this.onDestroy();
        }
    }
    onDestroy() {
        this.dispose();
    }
    dispose() {
        super.dispose();
        console.warn("dispose " + this._entity.typeId);
        this.getEvents().cancelAll();
        if (this.isLoaded)
            this.onMemoryRemove();
        ExEntityPool.pool.delete(this.entity);
    }
    onKilled(e) {
        this._isKilled = true;
        console.warn("onKilled " + this._entity.typeId);
    }
}
__decorate([
    registerEvent(ExEventNames.beforeEntityRemove),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExEntityController.prototype, "onMemoryRemove", null);
__decorate([
    registerEvent(ExEventNames.afterEntityLoad),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExEntityController.prototype, "onMemoryLoad", null);
__decorate([
    registerEvent(ExEventNames.afterEntityDie),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExEntityController.prototype, "destroyTrigger", null);
__decorate([
    registerEvent(ExOtherEventNames.afterOnHurt, (ctrl, e) => ctrl.exEntity.health <= 0 && !ctrl._isKilled),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EntityHurtAfterEvent]),
    __metadata("design:returntype", void 0)
], ExEntityController.prototype, "onKilled", null);
//# sourceMappingURL=ExEntityController.js.map