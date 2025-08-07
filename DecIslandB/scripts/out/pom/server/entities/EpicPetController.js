var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityDamageCause } from '@minecraft/server';
import ExEntityController from '../../../modules/exmc/server/entity/ExEntityController.js';
import Vector3 from '../../../modules/exmc/utils/math/Vector3.js';
import { registerEvent } from '../../../modules/exmc/server/events/eventDecoratorFactory.js';
import ExEntityQuery from '../../../modules/exmc/server/env/ExEntityQuery.js';
class EpicPetController extends ExEntityController {
    constructor(e, server, spawn) {
        super(e, server, spawn);
        this._owner = undefined;
        this.tameable = this.entity.getComponent("tameable");
        this.tickNum = 0;
        this.target = undefined;
        this.shoot_offset = new Vector3(0, 1.75, 0);
        this.target_list = {
            excludeTags: ["wbmsyh"],
            excludeTypes: ["item"],
            families: ["monster"],
            closest: 1
        };
    }
    setOwner(owner) {
        this._owner = owner;
    }
    getJsonTarget() {
        this.target = this.entity.target;
    }
    addTame(player) {
        var _a, _b;
        if (this.tameable)
            this.tameable.tame(player);
        if ((_a = this.tameable) === null || _a === void 0 ? void 0 : _a.tamedToPlayer)
            this.setOwner((_b = this.tameable) === null || _b === void 0 ? void 0 : _b.tamedToPlayer);
    }
    getOwner() {
        var _a;
        return (_a = this.tameable) === null || _a === void 0 ? void 0 : _a.tamedToPlayer;
    }
    onAppear(spawn) {
        this.entity.runCommand("/say 启动");
        super.onAppear(spawn);
    }
    onLongTick(e) {
        this.tickNum++;
        this.getJsonTarget();
        if (e.currentTick % 4 == 0 && this.target) {
            this.electric_shock(this.entity, this.target);
            this.chain_target(this.target, 3);
        }
    }
    lockTarget() {
        if (this.findTarget()) {
            this.target = this.findTarget()[0];
        }
        else
            this.target = undefined;
        this.findTarget();
    }
    electric_shock(attacker, target) {
        target.applyDamage(10, {
            "cause": EntityDamageCause.magic,
            "damagingEntity": attacker
        });
        let from = new Vector3(attacker.location);
        from.y += this.shoot_offset.y;
        let to = new Vector3(target.location);
        to.y += 1;
        this.entity.dimension.playSound("epic.tesla.attack", from);
        this.lightning_par(from, to);
    }
    chain_shock(attacker, from, to) {
        to.applyDamage(5, {
            "cause": EntityDamageCause.magic,
            "damagingEntity": attacker
        });
        let f = new Vector3(from.location);
        f.y += 1;
        let t = new Vector3(to.location);
        t.y += 1;
        this.entity.dimension.playSound("epic.lightning_chain.zap", t);
        this.lightning_par(f, t);
    }
    chain_target(mainTarget, maxCount) {
        if (!mainTarget) {
            return;
        }
        const hitEntities = [mainTarget];
        const tag = "Selected" + Math.floor(Math.random() * 10000).toString().padStart(4, '0'); //辨识码
        const select_data = {
            excludeTags: ["wbmsyh", tag],
            excludeTypes: ["item"],
            families: ["monster"],
            closest: 1
        };
        try {
            mainTarget.addTag(tag);
            // mainTarget.runCommand("/say "+ tag)
        }
        catch (error) {
        }
        let currentTarget = mainTarget;
        for (let i = 0; i < maxCount; i++) {
            let from = new Vector3(currentTarget.location);
            let q = this.rangeCircle(currentTarget, from, 3, 3, 0, select_data);
            if (q.length < 1)
                break;
            currentTarget = q[0];
            currentTarget.addTag(tag);
            hitEntities.push(currentTarget);
        }
        if (hitEntities.length < 2)
            return;
        for (let i = 0; i < hitEntities.length - 1; i++) {
            this.runTimeout(() => {
                this.chain_shock(this.entity, hitEntities[i], hitEntities[i + 1]);
            }, (i + 1) * 200);
        }
        for (const entity of hitEntities) {
            try {
                entity.removeTag(tag);
            }
            catch (error) { }
        }
    }
    lightning_par(from, to) {
        let points = this.lightning_par_point(from, to);
        for (const i of points) {
            this.entity.dimension.spawnParticle("epic:lightning_chain_particle", i);
        }
    }
    lightning_par_point(from, to, distance = 0.1, maxOffset = 2, points = []) {
        // 计算起点和终点之间的距离
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dz = to.z - from.z;
        const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
        // 如果距离小于最小分段距离，直接添加终点并返回
        if (dist <= distance) {
            points.push(to);
            return points;
        }
        // 计算中点
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const midZ = (from.z + to.z) / 2;
        // 生成随机偏移（方向和幅度）
        const offsetX = (Math.random() - 0.5) * maxOffset;
        const offsetY = (Math.random() - 0.5) * maxOffset;
        const offsetZ = (Math.random() - 0.5) * maxOffset;
        // 应用偏移后的中点
        const midXWithOffset = midX + offsetX;
        const midYWithOffset = midY + offsetY;
        const midZWithOffset = midZ + offsetZ;
        // 递归处理左右两段
        this.lightning_par_point(from, new Vector3(midXWithOffset, midYWithOffset, midZWithOffset), distance, maxOffset * 0.5, points);
        this.lightning_par_point(new Vector3(midXWithOffset, midYWithOffset, midZWithOffset), to, distance, maxOffset * 0.5, points);
        return points;
    }
    findTarget() {
        let e = this.entity;
        let loc = new Vector3(this.entity.location);
        let data = this.target_list;
        let t = this.rangeCircle(this.entity, loc, 16, 8, 0, data);
        return t !== null && t !== void 0 ? t : [];
    }
    rangeCircle(user, point, r, h, dis, data) {
        let view = new Vector3(user.getViewDirection());
        let q = new ExEntityQuery(user.dimension)
            .at(point)
            .facingByDirection(view, dis)
            .queryCircle(r, h, data)
            .except(user);
        return q.getEntities();
    }
}
EpicPetController.typeId = "epic:tesla_tower";
export default EpicPetController;
__decorate([
    registerEvent("onLongTick"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EpicPetController.prototype, "onLongTick", null);
//# sourceMappingURL=EpicPetController.js.map