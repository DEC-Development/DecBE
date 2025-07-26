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
import { EntityDieAfterEvent } from '@minecraft/server';
import ExEntityEvents from "./ExEntityEvents.js";
import { eventDecoratorFactory, registerEvent } from "../events/eventDecoratorFactory.js";
import { ExEventNames } from "../events/events.js";
import ExEntityPool from "./ExEntityPool.js";
import ExContext from "../ExGameObject.js";
/**
 * 控制实体的控制器类。
 * @implements {DisposeAble}
 * @implements {SetTimeOutSupport}
 */
export default class ExEntityController extends ExContext {
    getTypeId() {
        return this._typeId;
    }
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
        this.isDestroyed = false;
        this.isKilled = false;
        this._entity = e;
        this.server = server;
        this._events = new ExEntityEvents(this);
        this._id = e.id;
        this._typeId = e.typeId;
        this._init(server);
        eventDecoratorFactory(this.getEvents(), this);
        this.onAppear(spawn);
    }
    _init(server) {
        this.exEntity = ExEntity.getInstance(this.entity);
    }
    get isLoaded() {
        return !this.interrupt;
    }
    onMemoryRemove() {
        if (this.isLoaded) {
            console.info(this._entity.typeId);
            this.stopContext();
            this.getEvents().stopContext();
        }
        else {
            return;
        }
    }
    onMemoryLoad() {
        if (!this.isLoaded) {
            console.info(this._entity.typeId);
            this.startContext();
            this.getEvents().startContext();
        }
        else {
            return;
        }
    }
    onAppear(spawn) {
    }
    destroyTrigger() {
        if (!this.isDestroyed) {
            this.isDestroyed = true;
            this.entity.remove();
            this.onDestroy();
        }
    }
    onDestroy() {
        this.dispose();
    }
    dispose() {
        super.dispose();
        this.isDestroyed = true;
        console.info(this._entity.typeId);
        this.getEvents().cancelAll();
        if (this.isLoaded)
            this.onMemoryRemove();
        ExEntityPool.pool.delete(this.entity);
    }
    onKilled(e) {
        if (this.isKilled)
            return;
        this.isKilled = true;
        console.info(this._entity.typeId);
        if (!this.isDestroyed) {
            this.isDestroyed = true;
            this.onDestroy();
        }
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
    __metadata("design:paramtypes", [EntityDieAfterEvent]),
    __metadata("design:returntype", void 0)
], ExEntityController.prototype, "onKilled", null);
//# sourceMappingURL=ExEntityController.js.map