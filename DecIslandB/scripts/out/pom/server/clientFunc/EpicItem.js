import { EntityDamageCause, EntityComponentTypes } from '@minecraft/server';
import Vector3 from '../../../modules/exmc/utils/math/Vector3.js';
import GameController from "./GameController.js";
import ExEntity from '../../../modules/exmc/server/entity/ExEntity.js';
import ExSystem from '../../../modules/exmc/utils/ExSystem.js';
import ExEntityQuery from '../../../modules/exmc/server/env/ExEntityQuery.js';
import ItemTagComponent from '../data/ItemTagComponent.js';
export default class EpicItemUse extends GameController {
    getItem() {
        return this.exPlayer.getBag().itemOnMainHand;
    }
    isHoldingItem(id) {
        const item = this.getItem();
        return (item === null || item === void 0 ? void 0 : item.typeId) === id;
    }
    getEnchantLevel(id) {
        var _a, _b, _c;
        const item = this.getItem();
        if (item && (item === null || item === void 0 ? void 0 : item.hasComponentById("minecraft:enchantable")))
            return (_c = (_b = (_a = item === null || item === void 0 ? void 0 : item.getComponentById("minecraft:enchantable")) === null || _a === void 0 ? void 0 : _a.getEnchantment(id)) === null || _b === void 0 ? void 0 : _b.level) !== null && _c !== void 0 ? _c : 0;
        else
            return 0;
    }
    getAttack(item) {
        if (item != undefined) {
            const comp = new ItemTagComponent(item);
            return (comp === null || comp === void 0 ? void 0 : comp.getComponentWithGroup("base_attack")) + 1;
        }
        else
            return 1;
    }
    hasItemTag(item, key) {
        const comp = new ItemTagComponent(item);
        return comp === null || comp === void 0 ? void 0 : comp.hasComponent(key);
    }
    getCd(item) {
        return this.player.getItemCooldown(item.getComponent('minecraft:cooldown').cooldownCategory);
    }
    getHealthComp(entity) {
        return entity.getComponent(EntityComponentTypes.Health);
    }
    rangeSector(user, point, r, h, angle, dis) {
        let view = new Vector3(user.getViewDirection());
        let q = new ExEntityQuery(user.dimension)
            .at(point)
            .facingByDirection(view, dis)
            .querySector(r, h, view, angle, 0, {
            excludeTags: ["wbmsyh"],
            excludeTypes: ["item"]
        })
            .except(user);
        return q.getEntities();
    }
    rangeCircle(user, point, r, h, dis) {
        let view = new Vector3(user.getViewDirection());
        let q = new ExEntityQuery(user.dimension)
            .at(point)
            .facingByDirection(view, dis)
            .queryCircle(r, h, {
            excludeTags: ["wbmsyh"],
            excludeTypes: ["item"]
        })
            .except(user);
        return q.getEntities();
    }
    rangeBall(user, point, r, dis) {
        let view = new Vector3(user.getViewDirection());
        let q = new ExEntityQuery(user.dimension).at(point)
            .at(point)
            .facingByDirection(view, dis)
            .queryBall(r, {
            excludeTags: ["wbmsyh"],
            excludeTypes: ["item"]
        })
            .except(user);
        return q.getEntities();
    }
    applyDam(user, target, delay) {
    }
    spawnPar(id, loc, offset) {
        let finloc = loc;
        if (offset) {
            finloc = loc.add(offset);
        }
        this.getDimension().spawnParticle(id, finloc);
    }
    witherCount(target, MaxTime) {
        var _a, _b;
        let lv = (((_a = target.getEffect("wither")) === null || _a === void 0 ? void 0 : _a.amplifier) || -1) + 1;
        let dur = (((_b = target.getEffect("wither")) === null || _b === void 0 ? void 0 : _b.duration) || 0) / 20;
        let trans = 0;
        if (dur > MaxTime) {
            dur = MaxTime;
        }
        if (lv > 0 && lv <= 3) {
            trans = (lv == 3) ? 2 * dur : 0.5 * lv * dur;
        }
        else if (lv >= 4) {
            trans = (2 + 0.25 * (lv - 3)) * dur;
        }
        return trans;
    }
    witherBurst(target, Power, MaxTime) {
        var _a, _b;
        let lv = (((_a = target.getEffect("wither")) === null || _a === void 0 ? void 0 : _a.amplifier) || -1) + 1;
        let dur = (((_b = target.getEffect("wither")) === null || _b === void 0 ? void 0 : _b.duration) || 0) / 20;
        const loc = new Vector3(target.location);
        let Dam = Power * this.witherCount(target, MaxTime);
        target.applyDamage(Dam, {
            "cause": EntityDamageCause.wither
        });
        target.removeEffect("wither");
        if (dur > MaxTime && lv > 0) {
            dur -= MaxTime;
            target.addEffect("wither", dur * 20, { "amplifier": lv - 1, "showParticles": true });
        }
        this.spawnPar("minecraft:sonic_explosion", loc, new Vector3(0, 0, 0));
        this.getDimension().playSound("mob.warden.sonic_boom", loc, { "volume": 50 });
    }
    onJoin() {
        this.getEvents().exEvents.afterPlayerHitEntity.subscribe(event => {
            var _a, _b;
            const item = this.getItem();
            const name = item === null || item === void 0 ? void 0 : item.typeId;
            const target = event.hurtEntity;
            const exTarget = ExEntity.getInstance(target);
            const wbfl = this.exPlayer.getScoresManager().getScore("wbfl");
            if (event.damageSource.cause === EntityDamageCause.entityAttack) {
                const base_atk = this.getAttack(item);
                let sharpness = this.getEnchantLevel("sharpness");
                let atk = base_atk + sharpness * 1.25;
                switch (name) {
                    case "epic:echoing_scream_saber":
                        {
                            //主目标倍率zzbcasd
                            const dam1 = 1.25 * atk;
                            //副目标倍率
                            const dam2 = 0.5 * atk;
                            this.runTimeout(() => {
                                const loc = new Vector3(target.location);
                                const face = new Vector3(target.getViewDirection());
                                for (let entity of this.rangeBall(this.player, loc, 1.25, 0)) {
                                    try {
                                        let targetLoc = new Vector3(entity.location);
                                        let echoRecord = Number(entity.getDynamicProperty('echo_record')) || 0;
                                        let Dam = (entity === target) ? dam1 : dam2;
                                        //回声印记增伤
                                        Dam *= (1 + 0.1 * echoRecord);
                                        entity.applyDamage(Dam, {
                                            "cause": EntityDamageCause.contact,
                                            "damagingEntity": this.player
                                        });
                                        if (entity === target && echoRecord < 10) {
                                            echoRecord += 1;
                                            entity.setDynamicProperty('echo_record', echoRecord);
                                        }
                                        if (entity === target && echoRecord > 0) {
                                            this.spawnPar("epic:echo_record_" + echoRecord, targetLoc, new Vector3(0, 0, 0));
                                        }
                                    }
                                    catch (entity) { }
                                }
                            }, 0);
                        }
                        break;
                    case "epic:wither_sword":
                        {
                            //倍率
                            const dam1 = 1.0 * atk;
                            const loc = new Vector3(target.location);
                            const face = new Vector3(target.getViewDirection());
                            const lv = (((_a = target.getEffect("wither")) === null || _a === void 0 ? void 0 : _a.amplifier) || -1) + 1;
                            const dur = (((_b = target.getEffect("wither")) === null || _b === void 0 ? void 0 : _b.duration) || 0) / 20;
                            this.runTimeout(() => {
                                if (dur > 0) {
                                    let s = dur + 6;
                                    target.addEffect("wither", s * 20, { "amplifier": 1, "showParticles": true });
                                }
                                else {
                                    target.addEffect("wither", 6 * 20, { "amplifier": 1, "showParticles": true });
                                }
                                exTarget.applyStatus("Poision", 5);
                            }, 0);
                            this.runTimeout(() => {
                                if (dur > 20) {
                                    this.witherBurst(target, 1.0, 120);
                                }
                            }, 500);
                        }
                        break;
                }
            }
        });
        this.getEvents().exEvents.beforeItemUse.subscribe(event => {
            const item = event.itemStack;
            const wbfl = this.exPlayer.getScoresManager().getScore("wbfl");
            if (this.isHoldingItem("epic:echoing_scream_saber")) {
                let cd = this.getCd(item);
                const tmpV = new Vector3();
                const base_atk = this.getAttack(item);
                const sharpness = this.getEnchantLevel("sharpness");
                const atk = base_atk + sharpness * 1.25;
                //let eff_atk = base_atk*(1.25^strength)/(1.25^weakness)
                //重击
                if (cd == 0 && this.player.isSneaking == false) {
                    //切割倍率200%+5
                    const dam1 = 1.5 * atk + 4;
                    //回声爆破伤害35（法术）
                    const dam2 = 35;
                    const loc = new Vector3(this.player.location);
                    const face = new Vector3(this.player.getViewDirection());
                    let shock_entity = [];
                    //第一段切割
                    this.runTimeout(() => {
                        //this.exPlayer.getScoresManager().removeScore("wbfl", 25);
                        this.player.startItemCooldown("saber", 2 * 20);
                        for (let entity of this.rangeSector(this.player, loc, 4, 2.5, 30, -0.5)) {
                            try {
                                let Dam = dam1;
                                let echoRecord = Number(entity.getDynamicProperty('echo_record')) || 0;
                                //回声印记增伤
                                Dam *= (1 + 0.1 * echoRecord);
                                entity.applyDamage(Dam, {
                                    "cause": EntityDamageCause.contact,
                                    "damagingEntity": this.player
                                });
                                let direction = tmpV.set(entity.location).sub(this.player.location).normalize();
                                entity.applyKnockback({ x: direction.x, z: direction.z }, 1);
                                if (echoRecord >= 3) {
                                    entity.setDynamicProperty('echo_record', echoRecord - 3);
                                    shock_entity.push(entity);
                                    entity.addEffect("slowness", 2 * 20, {
                                        "amplifier": 3,
                                        "showParticles": false
                                    });
                                }
                            }
                            catch (e) { }
                        }
                    }, 0);
                    //二段引爆
                    this.runTimeout(() => {
                        for (let target of shock_entity) {
                            let targetloc = new Vector3(target.location);
                            this.spawnPar("minecraft:sonic_explosion", targetloc, new Vector3(0.1, 0.6, 0.1));
                            this.spawnPar("minecraft:sonic_explosion", targetloc, new Vector3(0, 0.4, 0));
                            this.spawnPar("minecraft:sonic_explosion", targetloc, new Vector3(-0.1, 0.2, -0.1));
                            //this.getDimension().playSound("mob.warden.sonic_charge",targetloc,{"volume":50});
                            this.runTimeout(() => {
                                for (let entity of this.rangeBall(this.player, targetloc, 3.5, 0)) {
                                    try {
                                        let targetloc = new Vector3(target.location);
                                        let echoRecord = Number(entity.getDynamicProperty('echo_record')) || 0;
                                        if (entity === target) {
                                            this.spawnPar("minecraft:critical_hit_emitter", targetloc, new Vector3(0, 1.8, 0));
                                            this.getDimension().playSound("mob.warden.sonic_boom", targetloc, { "volume": 50 });
                                        }
                                        let Dam = (entity === target) ? dam2 : (0.5 * dam2);
                                        entity.applyDamage(Dam, {
                                            "cause": EntityDamageCause.magic,
                                            "damagingEntity": this.player
                                        });
                                        let direction = tmpV.set(entity.location).sub(this.player.location).normalize();
                                        entity.applyKnockback({ x: direction.x, z: direction.z }, 1.0);
                                    }
                                    catch (e) { }
                                }
                            }, 400);
                        }
                    }, 800);
                }
                if (cd == 0 && this.player.isSneaking) {
                    const dam1 = 2.25 * atk + 4;
                    let dam2 = 10;
                    const loc = new Vector3(this.player.location);
                    const face = new Vector3(this.player.getViewDirection());
                    let locFin = new Vector3(loc.x + face.x * 2, loc.y + face.y * 2, loc.z + face.z * 2);
                    let shock_entity = [];
                    //第一段切割
                    this.runTimeout(() => {
                        //this.exPlayer.getScoresManager().removeScore("wbfl", 25);
                        this.player.startItemCooldown("saber", 5 * 20);
                        for (let entity of this.rangeBall(this.player, loc, 2.5, 2)) {
                            try {
                                let Dam = dam1;
                                let echoRecord = Number(entity.getDynamicProperty('echo_record')) || 0;
                                //回声印记增伤
                                Dam *= (1 + 0.1 * echoRecord);
                                entity.applyDamage(Dam, {
                                    "cause": EntityDamageCause.contact,
                                    "damagingEntity": this.player
                                });
                                let direction = tmpV.set(entity.location).sub(this.player.location).normalize();
                                entity.applyKnockback({ x: direction.x, z: direction.z }, 0.5);
                                if (echoRecord >= 5) {
                                    shock_entity.push(entity);
                                    entity.addEffect("slowness", 4 * 20, {
                                        "amplifier": 5,
                                        "showParticles": false
                                    });
                                }
                            }
                            catch (e) { }
                        }
                    }, 0);
                    this.runTimeout(() => {
                        for (let target of shock_entity) {
                            let tloc = new Vector3(target.location);
                            const targetloc = tloc;
                            let echoRecord = Number(target.getDynamicProperty('echo_record')) || 0;
                            const TimeLine = ExSystem.timeLine(this, {
                                "0.1": (time) => {
                                    this.getDimension().playSound("mob.warden.sonic_charge", targetloc, { "volume": 1, "pitch": 2.5 });
                                },
                                "0.5": (time) => {
                                    this.spawnPar("epic:echoing_scream_saber_particle3", targetloc, new Vector3(0, 0, 0));
                                },
                                "0.65": (time) => {
                                    this.getDimension().playSound("mob.warden.dig", targetloc, { "volume": 0.8, "pitch": 2.0 });
                                },
                                "1.0": (time) => {
                                    this.spawnPar("minecraft:critical_hit_emitter", targetloc, new Vector3(0, 1.8, 0));
                                    this.getDimension().playSound("item.trident.thunder", targetloc, { "volume": 2.0, "pitch": 1.5 });
                                    this.getDimension().playSound("item.trident.thunder", loc, { "volume": 1.0, "pitch": 3 });
                                },
                                "1.1": (time) => {
                                    this.player.runCommand("/camerashake add @s 0.4 0.08 rotational");
                                    this.player.runCommand("/camerashake add @s 1.5 0.15 positional");
                                },
                                "1.2": (time) => {
                                    try {
                                        let Dam = ((echoRecord > 5) ? dam2 + 2 * (echoRecord - 5) : dam2) * echoRecord;
                                        target.applyDamage(Dam, {
                                            "cause": EntityDamageCause.magic,
                                            "damagingEntity": this.player
                                        });
                                        target.setDynamicProperty('echo_record', 0);
                                    }
                                    catch (e) { }
                                },
                                "1.3": (time) => {
                                    this.getDimension().playSound("item.trident.thunder", targetloc, { "volume": 1.0, "pitch": 2.0 });
                                },
                            });
                            TimeLine.start();
                        }
                    }, 400);
                }
            }
            //End 
        });
    }
    onLoad() {
    }
    onLeave() {
    }
}
//# sourceMappingURL=EpicItem.js.map