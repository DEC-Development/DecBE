import { EntityDamageCause } from '@minecraft/server';
import MathUtil from "../../../modules/exmc/utils/math/MathUtil.js";
import ExDimension from '../../../modules/exmc/server/ExDimension.js';
import ExGame from '../../../modules/exmc/server/ExGame.js';
import ExEntity from "../../../modules/exmc/server/entity/ExEntity.js";
import ExPlayer from "../../../modules/exmc/server/entity/ExPlayer.js";
import ExColorLoreUtil from "../../../modules/exmc/server/item/ExColorLoreUtil.js";
import "../../../modules/exmc/server/item/ExItem.js";
import ExSystem from '../../../modules/exmc/utils/ExSystem.js';
import MonitorManager from "../../../modules/exmc/utils/MonitorManager.js";
import { decodeUnicode } from "../../../modules/exmc/utils/Unicode.js";
import VarOnChangeListener from '../../../modules/exmc/utils/VarOnChangeListener.js';
import TalentData, { Occupation, Talent } from "../cache/TalentData.js";
import ItemTagComponent from '../data/ItemTagComponent.js';
import PomOccupationSkillTrack from '../entities/PomOccupationSkillTrack.js';
import damageShow from "../helper/damageShow.js";
import GameController from "./GameController.js";
import { MinecraftItemTypes } from '../../../modules/vanilla-data/lib/index.js';
import Random from '../../../modules/exmc/utils/Random.js';
import { MinecraftBlockTypes } from '../../../modules/vanilla-data/lib/index.js';
import ExEntityQuery from '../../../modules/exmc/server/env/ExEntityQuery.js';
import { canSweep } from '../items/isEquipment.js';
import { ignorn } from '../../../modules/exmc/server/ExErrorQueue.js';
export default class PomTalentSystem extends GameController {
    constructor() {
        super(...arguments);
        this.strikeSkill = true;
        this.talentRes = new Map();
        this.skillLoop = ExSystem.tickTask(this, () => {
            var _a;
            if (this.data.talent.occupation.id === Occupation.ASSASSIN.id)
                this.strikeSkill = true;
            if (this.data.talent.occupation.id === Occupation.PRIEST.id) {
                let health = 999;
                let player = this.exPlayer;
                for (let p of this.player.dimension.getPlayers({
                    maxDistance: 20,
                    location: this.player.location
                })) {
                    let exp = ExPlayer.getInstance(p);
                    if (exp.health < health) {
                        health = exp.health;
                        player = exp;
                    }
                }
                player.addHealth(this, ((_a = this.talentRes.get(Talent.REGENERATE)) !== null && _a !== void 0 ? _a : 0));
            }
        }).delay(10 * 20);
        this.armor_movement_addition = [0, 0, 0];
        this.armor_attack_addition = 0;
        this.armor_protection = [0, 0, 0, 0, 0, 0, 0];
        this.movement = [0.1, 0.1, 0.03];
        this.movement_addition = [0, 0, 0];
        this.attack_addition = 0;
        this.movementChanger = new VarOnChangeListener((n, l) => {
            // if (n) {
            //     this.player.getComponent("movement")?.setCurrentValue(MathUtil.round(MathUtil.clamp(Math.floor((this.movement[1] + this.movement_addition[1]) / 0.005) * 0.005, 0, 0.2), 3));
            // } else {
            //     this.player.getComponent("movement")?.setCurrentValue(MathUtil.round(MathUtil.clamp(Math.floor((this.movement[0] + this.movement_addition[0]) / 0.005) * 0.005, 0, 0.2), 3));
            // }
            // this.player.getComponent("underwater_movement")?.setCurrentValue(MathUtil.round(MathUtil.clamp(Math.floor((this.movement[2] + this.movement_addition[2]) / 0.005) * 0.005, 0, 0.2), 3));
            if (n) {
                this.exPlayer.triggerEvent("movement_" + MathUtil.round(MathUtil.clamp(Math.floor((this.movement[1] + this.movement_addition[1]) / 0.005) * 0.005, 0, 0.2), 3));
            }
            else {
                this.exPlayer.triggerEvent("movement_" + MathUtil.round(MathUtil.clamp(Math.floor((this.movement[0] + this.movement_addition[0]) / 0.005) * 0.005, 0, 0.2), 3));
            }
            this.exPlayer.triggerEvent("underwater_movement_" + MathUtil.round(MathUtil.clamp(Math.floor((this.movement[2] + this.movement_addition[2]) / 0.005) * 0.005, 0, 0.2), 3));
        }, false);
        this.armorUpdater = new VarOnChangeListener((n, l) => {
            const bag = this.exPlayer.getBag();
            const head = bag.equipmentOnHead, chest = bag.equipmentOnChest, legs = bag.equipmentOnLegs, feet = bag.equipmentOnFeet;
            this.headComp = undefined, this.chestComp = undefined, this.legComp = undefined, this.feetComp = undefined;
            if (head)
                this.headComp = new ItemTagComponent(head);
            if (chest)
                this.chestComp = new ItemTagComponent(chest);
            if (legs)
                this.legComp = new ItemTagComponent(legs);
            if (feet)
                this.feetComp = new ItemTagComponent(feet);
            this.updateArmorData();
            this.updatePlayerAttribute();
        }, "");
        this.skill_stateNum = [];
        this.attackCooldown = 0;
        this.maxAttackCooldown = 0;
        this.attackCooldownLooper = ExSystem.tickTask(this, () => {
            const maxFrame = 30;
            if (this.attackCooldown < -10) {
                this.attackCooldownLooper.stop();
                this.player.setProperty("wb:attack_cooldown", -1);
            }
            else {
                this.attackCooldown--;
                this.player.setProperty("wb:attack_cooldown", Math.floor(maxFrame * (1 - Math.max(0.001, this.attackCooldown / this.maxAttackCooldown))));
            }
        }).delay(1);
        this.debugger = false;
        this.hasBeenDamaged = new MonitorManager();
        this.hasCauseDamage = new MonitorManager();
    }
    setCooldown(cooldown) {
        this.attackCooldown = cooldown;
        this.maxAttackCooldown = cooldown;
        this.attackCooldownLooper.start();
    }
    chooseArmor(a) {
    }
    calculateExemptionByData(protection, resilience) {
        return -(4 * protection * resilience) / (resilience + 8) / (protection - 125);
    }
    updateTalentRes() {
        this.talentRes.clear();
        for (let t of this.data.talent.talents) {
            this.talentRes.set(t.id, TalentData.calculateTalent(this.data.talent.occupation, t.id, t.level));
        }
        this.client.magicSystem.upDateByTalent(this.talentRes);
        if (this.data.talent.occupation.id === Occupation.PRIEST.id || this.data.talent.occupation.id === Occupation.ASSASSIN.id) {
            this.skillLoop.start();
        }
        else {
            this.skillLoop.stop();
        }
        //this.exPlayer.triggerEvent("hp:" + Math.round((20 + (this.talentRes.get(Talent.VIENTIANE) ?? 0))));
    }
    //更新盔甲属性（在不换甲的情况下）
    updateArmorData() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        (_a = this.headComp) === null || _a === void 0 ? void 0 : _a.setGroup(this.headComp.dataGroupJudge(this.client));
        (_b = this.chestComp) === null || _b === void 0 ? void 0 : _b.setGroup(this.chestComp.dataGroupJudge(this.client));
        (_c = this.legComp) === null || _c === void 0 ? void 0 : _c.setGroup(this.legComp.dataGroupJudge(this.client));
        (_d = this.feetComp) === null || _d === void 0 ? void 0 : _d.setGroup(this.feetComp.dataGroupJudge(this.client));
        this.armor_attack_addition = ((_f = (_e = this.headComp) === null || _e === void 0 ? void 0 : _e.getComponentWithGroup("attack_addition")) !== null && _f !== void 0 ? _f : 0)
            + ((_h = (_g = this.chestComp) === null || _g === void 0 ? void 0 : _g.getComponentWithGroup("attack_addition")) !== null && _h !== void 0 ? _h : 0)
            + ((_k = (_j = this.legComp) === null || _j === void 0 ? void 0 : _j.getComponentWithGroup("attack_addition")) !== null && _k !== void 0 ? _k : 0)
            + ((_m = (_l = this.feetComp) === null || _l === void 0 ? void 0 : _l.getComponentWithGroup("attack_addition")) !== null && _m !== void 0 ? _m : 0);
        this.armor_movement_addition = ["movement_addition", "sneak_movement_addition", "underwater_movement_addition"]
            .map(e => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return ((_b = (_a = this.headComp) === null || _a === void 0 ? void 0 : _a.getComponentWithGroup(e)) !== null && _b !== void 0 ? _b : 0)
                + ((_d = (_c = this.chestComp) === null || _c === void 0 ? void 0 : _c.getComponentWithGroup(e)) !== null && _d !== void 0 ? _d : 0)
                + ((_f = (_e = this.legComp) === null || _e === void 0 ? void 0 : _e.getComponentWithGroup(e)) !== null && _f !== void 0 ? _f : 0)
                + ((_h = (_g = this.feetComp) === null || _g === void 0 ? void 0 : _g.getComponentWithGroup(e)) !== null && _h !== void 0 ? _h : 0);
        });
        this.armor_protection = ["armor_magic_protection", "armor_physical_protection",
            "armor_magic_reduction", "armor_physical_reduction",
            "armor_resilience",
            "final_magic_reduction", "final_physical_reduction"]
            .map(e => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return ((_b = (_a = this.headComp) === null || _a === void 0 ? void 0 : _a.getComponentWithGroup(e)) !== null && _b !== void 0 ? _b : 0)
                + ((_d = (_c = this.chestComp) === null || _c === void 0 ? void 0 : _c.getComponentWithGroup(e)) !== null && _d !== void 0 ? _d : 0)
                + ((_f = (_e = this.legComp) === null || _e === void 0 ? void 0 : _e.getComponentWithGroup(e)) !== null && _f !== void 0 ? _f : 0)
                + ((_h = (_g = this.feetComp) === null || _g === void 0 ? void 0 : _g.getComponentWithGroup(e)) !== null && _h !== void 0 ? _h : 0);
        });
        const dataList = ["armor_protection", "armor_resilience"]
            .map(e => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return ((_b = (_a = this.headComp) === null || _a === void 0 ? void 0 : _a.getComponentWithGroup(e)) !== null && _b !== void 0 ? _b : 0)
                + ((_d = (_c = this.chestComp) === null || _c === void 0 ? void 0 : _c.getComponentWithGroup(e)) !== null && _d !== void 0 ? _d : 0)
                + ((_f = (_e = this.legComp) === null || _e === void 0 ? void 0 : _e.getComponentWithGroup(e)) !== null && _f !== void 0 ? _f : 0)
                + ((_h = (_g = this.feetComp) === null || _g === void 0 ? void 0 : _g.getComponentWithGroup(e)) !== null && _h !== void 0 ? _h : 0);
        });
        this.armor_protection[4] = this.calculateExemptionByData(...dataList);
    }
    //更新玩家属性（不改变手持）
    updatePlayerAttribute() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        //攻击
        this.attack_addition = this.armor_attack_addition + ((_b = (_a = this.itemOnHandComp) === null || _a === void 0 ? void 0 : _a.getComponentWithGroup("attack_addition")) !== null && _b !== void 0 ? _b : 0);
        //保护
        //速度
        this.movement_addition[0] = this.armor_movement_addition[0] + ((_d = (_c = this.itemOnHandComp) === null || _c === void 0 ? void 0 : _c.getComponentWithGroup("movement_addition")) !== null && _d !== void 0 ? _d : 0);
        this.movement_addition[1] = this.armor_movement_addition[1] + ((_f = (_e = this.itemOnHandComp) === null || _e === void 0 ? void 0 : _e.getComponentWithGroup("sneak_movement_addition")) !== null && _f !== void 0 ? _f : 0);
        this.movement_addition[2] = this.armor_movement_addition[2] + ((_h = (_g = this.itemOnHandComp) === null || _g === void 0 ? void 0 : _g.getComponentWithGroup("underwater_movement_addition")) !== null && _h !== void 0 ? _h : 0);
        this.movementChanger.force();
    }
    onJoin() {
        let ignornAttackSend = false;
        ExGame.scriptEventReceive.addMonitor(e => {
            if (e.sourceEntity == this.player && e.id == "wb:attack_send" && this.attackCooldown > 0 && !ignornAttackSend) {
                this.setCooldown(this.maxAttackCooldown);
            }
            if (ignornAttackSend)
                ignornAttackSend = false;
        });
        this.getEvents().exEvents.onLongTick.subscribe(e => {
            if (e.currentTick % 20 === 0) {
                const bag = this.exPlayer.getBag();
                const head = bag.equipmentOnHead, chest = bag.equipmentOnChest, legs = bag.equipmentOnLegs, feet = bag.equipmentOnFeet;
                this.armorUpdater.upDate((head === null || head === void 0 ? void 0 : head.typeId) + "|" + (chest === null || chest === void 0 ? void 0 : chest.typeId) + "|" + (legs === null || legs === void 0 ? void 0 : legs.typeId) + "|" + (feet === null || feet === void 0 ? void 0 : feet.typeId));
            }
        });
        this.getEvents().exEvents.tick.subscribe(e => {
            this.movementChanger.upDate(this.player.isSneaking);
        });
        //玩家攻击生物增伤
        this.getEvents().exEvents.afterPlayerHitEntity.subscribe((e) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            if (e.damage > 10000000 || !(ignorn(() => e.hurtEntity.isValid())))
                return;
            let item = this.exPlayer.getBag().itemOnMainHand;
            let damageFac = 0;
            let extraDamage = 0;
            let target = ExEntity.getInstance(e.hurtEntity);
            let targetHealth = target.health;
            let dis = target.position.distance(this.exPlayer.position);
            let CLOAD_PIERCING = (_a = this.talentRes.get(Talent.CLOAD_PIERCING)) !== null && _a !== void 0 ? _a : 0;
            damageFac += MathUtil.clamp(dis, 28, 64) / 64 * CLOAD_PIERCING / 100;
            if (this.data.talent.occupation.id === Occupation.WARLOCK.id && ((_b = this.itemOnHandComp) === null || _b === void 0 ? void 0 : _b.getComponentWithGroup("equipment_type").tagName) === "magic_weapon" && e.damageSource.cause !== EntityDamageCause.magic) {
                let scores = this.exPlayer.getScoresManager();
                let extraFl = scores.getScore("wbfl") - 100;
                if (extraFl > 0) {
                    this.runTimeoutByTick(() => {
                        e.hurtEntity.applyDamage(extraFl / 100 * e.damage, {
                            "cause": EntityDamageCause.magic,
                            "damagingEntity": this.player
                        });
                    }, 11);
                }
                // scores.setScore("wbfl", extraFl * 2 / 4 + this.client.magicSystem.wbflDefaultMax);
            }
            let ARMOR_BREAKING = (_c = this.talentRes.get(Talent.ARMOR_BREAKING)) !== null && _c !== void 0 ? _c : 0;
            extraDamage += ((20 + ((_d = this.talentRes.get(Talent.VIENTIANE)) !== null && _d !== void 0 ? _d : 0))) * ARMOR_BREAKING / 100;
            let SANCTION = (_e = this.talentRes.get(Talent.SANCTION)) !== null && _e !== void 0 ? _e : 0;
            damageFac += (16 - Math.min(16, dis)) / 16 * SANCTION / 100;
            let SUDDEN_STRIKE = (_f = this.talentRes.get(Talent.SUDDEN_STRIKE)) !== null && _f !== void 0 ? _f : 0;
            // if (item) {
            //     if (item.typeId.startsWith("dec:")) damageFac += 0.2;
            //     let lore = new ExColorLoreUtil(item);
            // }
            if (this.strikeSkill) {
                if (this.data.talent.occupation.id === Occupation.ASSASSIN.id)
                    this.skillLoop.startOnce();
                this.strikeSkill = false;
                damageFac += SUDDEN_STRIKE / 100;
            }
            let skipPar = false;
            if (this.attackCooldown <= 0) {
                damageFac += 0.1;
                if ((canSweep((_g = item === null || item === void 0 ? void 0 : item.typeId) !== null && _g !== void 0 ? _g : "") ||
                    ((_h = this.itemOnHandComp) === null || _h === void 0 ? void 0 : _h.getComponentWithGroup("equipment_type").match("melee_weapon", "sword")) ||
                    ((_j = this.itemOnHandComp) === null || _j === void 0 ? void 0 : _j.getComponentWithGroup("equipment_type").match("melee_weapon", "dagger")) ||
                    ((_k = this.itemOnHandComp) === null || _k === void 0 ? void 0 : _k.getComponentWithGroup("equipment_type").match("melee_weapon", "katana")))
                    && ((_l = this.getExDimension().getBlock(this.exPlayer.position.sub(0, 0.4, 0))) === null || _l === void 0 ? void 0 : _l.typeId) === MinecraftBlockTypes.Air) {
                    skipPar = true;
                    damageFac += 0.1;
                }
                else {
                    this.getDimension().spawnParticle("wb:attack_heavy", e.hurtEntity.location);
                }
            }
            else {
                damageFac -= 0.4;
            }
            damageFac += (this.client.getDifficulty().damageAddFactor - 1);
            extraDamage += this.attack_addition;
            let damage = e.damage * damageFac + extraDamage;
            if (this.globalSettings.damageShow) {
                damageShow(this.getExDimension(), e.damage + damage, target.entity.location);
            }
            this.hasCauseDamage.trigger([e.damage + damage, e.hurtEntity]);
            usetarget = e.hurtEntity;
            if (damage >= targetHealth && targetHealth > 0) {
                target.entity.applyDamage(99999999, {
                    "cause": EntityDamageCause.entityAttack,
                    "damagingEntity": this.player
                });
            }
            if (damage >= targetHealth && (canSweep((_m = item === null || item === void 0 ? void 0 : item.typeId) !== null && _m !== void 0 ? _m : "") ||
                ((_o = this.itemOnHandComp) === null || _o === void 0 ? void 0 : _o.getComponentWithGroup("equipment_type").match("melee_weapon", "sword")) ||
                ((_p = this.itemOnHandComp) === null || _p === void 0 ? void 0 : _p.getComponentWithGroup("equipment_type").match("melee_weapon", "dagger")) ||
                ((_q = this.itemOnHandComp) === null || _q === void 0 ? void 0 : _q.getComponentWithGroup("equipment_type").match("melee_weapon", "katana")))) {
                skipPar = false;
                if (this.attackCooldown <= 0) {
                    this.getDimension().spawnParticle("dec:the_blade_particle", target.position.sub(0, 0.8, 0));
                    new ExEntityQuery(this.getDimension())
                        .at(this.exPlayer.position)
                        .querySector(5, 2, this.exPlayer.viewDirection, 45, 0, {
                        excludeTypes: ["minecraft:item"]
                    })
                        .except(this.player)
                        .except(target.entity)
                        .forEach(en => {
                        en.applyDamage(e.damage, {
                            "cause": EntityDamageCause.entityAttack,
                            "damagingEntity": this.player
                        });
                    });
                    this.player.playSound("attack.sword.sweep", {
                        "pitch": Random.random.randDouble(0.8, 1.2),
                        "volume": 0.55
                    });
                }
            }
            if (skipPar) {
                this.player.playSound("attack.sword.heavy_hit", {
                    "pitch": Random.random.randDouble(0.8, 1.2),
                    "volume": 0.55
                });
                this.getDimension().spawnParticle("dec:iron_sickle_particle", e.hurtEntity.location);
            }
            target.removeHealth(this, damage);
            ignornAttackSend = true;
            this.setCooldown(10);
        });
        let lastResist = 0;
        //玩家减伤
        this.afterHurtListener = this.getEvents().exEvents.afterPlayerHurt.subscribe((e) => {
            var _a, _b;
            if (this.client.magicSystem.isDied) {
                this.runTimeout(() => {
                    this.client.magicSystem.isDied = false;
                }, 2500);
                return;
            }
            ;
            if (this.client.magicSystem.isProtected)
                return;
            if (e.damage > 10000000 || e.damage < 0)
                return;
            let damage = ((_a = this.exPlayer.getPreRemoveHealth()) !== null && _a !== void 0 ? _a : 0) + e.damage;
            let willdamage = damage;
            if (PomTalentSystem.physicalDamageType.has(e.damageSource.cause)) {
                willdamage *= 1 - this.armor_protection[4];
            }
            if (PomTalentSystem.magicDamageType.has(e.damageSource.cause)) {
                willdamage -= this.armor_protection[2];
                willdamage *= (1 - this.armor_protection[0] / 100);
            }
            else if (PomTalentSystem.physicalDamageType.has(e.damageSource.cause)) {
                willdamage -= this.armor_protection[3];
                willdamage *= (1 - this.armor_protection[1] / 100);
            }
            willdamage *= (1 - (((_b = this.talentRes.get(Talent.DEFENSE)) !== null && _b !== void 0 ? _b : 0) / 100));
            if (PomTalentSystem.magicDamageType.has(e.damageSource.cause)) {
                willdamage *= (1 - this.client.getDifficulty().magicDefenseAddFactor);
                willdamage -= this.armor_protection[5];
            }
            else if (PomTalentSystem.physicalDamageType.has(e.damageSource.cause)) {
                willdamage *= (1 - this.client.getDifficulty().physicalDefenseAddFactor);
                willdamage -= this.armor_protection[6];
            }
            let add = Math.min(damage - willdamage, damage - 0.2);
            let anotherAdd = 0;
            if (PomTalentSystem.physicalDamageType.has(e.damageSource.cause)) {
                let remain = this.client.magicSystem.tryReduceDamageAbsorbed(damage - add);
                anotherAdd += (damage - add) - (remain);
            }
            if (PomTalentSystem.magicDamageType.has(e.damageSource.cause)) {
                let remain = this.client.magicSystem.tryReduceMagicAbsorbed(damage - add);
                anotherAdd += (damage - add) - (remain);
            }
            add += anotherAdd;
            if (!this.client.magicSystem.healthHeavyHitShower.isStarted() && damage - add > this.client.magicSystem.gameMaxHealth / 2) {
                this.client.magicSystem.healthHeavyHit = this.calculateHealth;
                this.client.magicSystem.healthHeavyHitShower.startOnce();
                this.exPlayer.cameraShake(0.1, 0.2, "rotational");
                this.player.playSound("hurted.heavily.boom", {
                    "volume": 0.8,
                    "pitch": Random.random.randDouble(0.8, 1.2)
                });
            }
            this.calculateHealth = this.calculateHealth - damage + add;
            if (this.calculateHealth <= 0) {
                const clnE = Object.assign({}, e.damageSource);
                this.run(() => {
                    var _a, _b;
                    try {
                        let bag = this.exPlayer.getBag();
                        const armor_pitch = [bag.equipmentOnHead, bag.equipmentOnChest, bag.equipmentOnLegs, bag.equipmentOnFeet];
                        const item_main = bag.itemOnMainHand;
                        const item_off = bag.itemOnOffHand;
                        if (((item_main === null || item_main === void 0 ? void 0 : item_main.typeId) == MinecraftItemTypes.TotemOfUndying || (item_off === null || item_off === void 0 ? void 0 : item_off.typeId) == MinecraftItemTypes.TotemOfUndying)) {
                            this.runTimeout(() => {
                                [bag.equipmentOnHead, bag.equipmentOnChest, bag.equipmentOnLegs, bag.equipmentOnFeet] = armor_pitch;
                            }, 100);
                        }
                    }
                    catch (e) { }
                    if (clnE.cause === EntityDamageCause.projectile) {
                        if (clnE.damagingEntity) {
                            this.player.applyDamage(99999999, {
                                "damagingEntity": clnE.damagingEntity,
                                "damagingProjectile": ((_a = clnE.damagingProjectile) === null || _a === void 0 ? void 0 : _a.isValid()) ?
                                    clnE.damagingProjectile : (clnE.damagingEntity)
                            });
                        }
                        else {
                            this.player.applyDamage(99999999);
                        }
                    }
                    else {
                        this.player.applyDamage(99999999, {
                            "damagingEntity": ((_b = clnE.damagingEntity) === null || _b === void 0 ? void 0 : _b.isValid()) ? clnE.damagingEntity : undefined,
                            "cause": clnE.cause
                        });
                    }
                    this.client.magicSystem.isDied = true;
                    this.data.pointRecord.deathPoint.push([this.getDimension().id, this.exPlayer.position.round()]);
                    if (this.data.pointRecord.deathPoint.length > 5) {
                        this.data.pointRecord.deathPoint.shift();
                    }
                });
                return;
            }
            this.client.magicSystem.addGameHealth += add;
            // this.exPlayer.addHealth(this, add);
            this.hasBeenDamaged.trigger([e.damage - add, e.damageSource.damagingEntity]);
        });
        let lastListener = (d) => { };
        this.getEvents().exEvents.afterItemOnHandChange.subscribe((e) => {
            var _a, _b, _c, _d, _e;
            let bag = this.exPlayer.getBag();
            if (e.afterItem) {
                //设置lore
                const lore = new ExColorLoreUtil(e.afterItem);
                //TalentData.calculateTalentToLore(this.data.talent.talents, this.data.talent.occupation, ExItem.getInstance(e.afterItem), this.getLang());
                let comp = new ItemTagComponent(e.afterItem);
                if (!comp.isEmpty()) {
                    comp.setGroup(comp.dataGroupJudge(this.client));
                    let base = [];
                    if (comp.hasComponent("actual_level"))
                        base.push(`§r§e` + this.lang.armorProperty + "  §r§6LV." + comp.getComponentWithGroup("actual_level"));
                    if (comp.hasComponent("armor_protection"))
                        base.push("§r§7•" + this.lang.armorProtection + "§6+" + comp.getComponentWithGroup("armor_protection") + "§r§7 | " + this.lang.armorResilience + "§6+" + comp.getComponentWithGroup("armor_resilience"));
                    if (comp.hasComponent("armor_type")) {
                        if (comp.hasComponent("armor_physical_protection"))
                            base.push("§r§7•" + this.lang.physicalProtection + "§6+" + comp.getComponentWithGroup("armor_physical_protection") + "％§r§7 | " + this.lang.physicalReduction + "§6+" + comp.getComponentWithGroup("armor_physical_reduction"));
                        if (comp.hasComponent("armor_magic_protection"))
                            base.push("§r§7•" + this.lang.magicalProtection + "§6+" + comp.getComponentWithGroup("armor_magic_protection") + "％§r§7 | " + this.lang.magicalReduction + "§6+" + comp.getComponentWithGroup("armor_magic_reduction"));
                    }
                    let smove = (_a = comp.getComponentWithGroup("sneak_movement_addition")) !== null && _a !== void 0 ? _a : 0;
                    if (comp.hasComponent("movement_addition")) {
                        base.push("§r§7•" + this.lang.movement + "§6+" + comp.getComponentWithGroup("movement_addition"));
                        if (comp.hasComponent("sneak_movement_addition"))
                            base[base.length - 1] += ("§r§7 | " + this.lang.sneakingMovement + (smove < 0 ? "§c" + smove : "§6+" + smove));
                    }
                    else if (comp.hasComponent("sneak_movement_addition"))
                        base.push("§r§7•" + this.lang.sneakingMovement + (smove < 0 ? "§c" + smove : "§6+" + smove));
                    if (comp.hasComponent("attack_addition")) {
                        base.push("§r§7•" + this.lang.attackDamage + "§6+" + comp.getComponentWithGroup("attack_addition"));
                    }
                    if (comp.hasComponent("equipment_type")) {
                        if (e.afterItem.typeId.startsWith("dec:")) {
                            base.push("§r§7•" + this.lang.onTheMainHand + ": +20％§7" + this.lang.attackDamage);
                        }
                        // let typeMsg = comp.getComponentWithGroup("equipment_type");
                        // lore.setValueUseDefault("武器类型", typeMsg.tagName + ": " + typeMsg.data);
                    }
                    if (base.length > 0) {
                        base[base.length - 1] = base[base.length - 1] + "§r";
                        lore.setTags(base);
                    }
                    lore.sort();
                    this.itemOnHandComp = comp;
                    //武器特殊项
                    if (comp.hasComponent("equipment_type")) {
                        let maxSingleDamage = parseFloat((_b = lore.getValueUseMap("total", this.getLang().maxSingleDamage)) !== null && _b !== void 0 ? _b : "0");
                        let maxSecondaryDamage = parseFloat((_c = lore.getValueUseMap("total", this.getLang().maxSecondaryDamage)) !== null && _c !== void 0 ? _c : "0");
                        let damage = 0;
                        this.hasCauseDamage.removeMonitor(lastListener);
                        lastListener = (d) => {
                            damage += d[0];
                            maxSingleDamage = Math.ceil(Math.max(d[0], maxSingleDamage));
                        };
                        this.hasCauseDamage.addMonitor(lastListener);
                        (_d = this.equiTotalTask) === null || _d === void 0 ? void 0 : _d.stop();
                        (this.equiTotalTask = ExSystem.tickTask(this, () => {
                            var _a, _b, _c, _d;
                            let shouldUpstate = false;
                            maxSecondaryDamage = Math.ceil(Math.max(maxSecondaryDamage, damage / 5));
                            damage = 0;
                            if (((_a = lore.getValueUseMap("total", this.getLang().maxSingleDamage)) !== null && _a !== void 0 ? _a : "0") !== maxSingleDamage + "") {
                                lore.setValueUseMap("total", this.getLang().maxSingleDamage, maxSingleDamage + "");
                                shouldUpstate = true;
                            }
                            if (((_b = lore.getValueUseMap("total", this.getLang().maxSecondaryDamage)) !== null && _b !== void 0 ? _b : "0") !== maxSecondaryDamage + "") {
                                lore.setValueUseMap("total", this.getLang().maxSecondaryDamage, maxSecondaryDamage + "");
                                shouldUpstate = true;
                            }
                            if (shouldUpstate && ((_c = bag.itemOnMainHand) === null || _c === void 0 ? void 0 : _c.typeId) === ((_d = e === null || e === void 0 ? void 0 : e.afterItem) === null || _d === void 0 ? void 0 : _d.typeId)) {
                                lore.sort();
                                bag.itemOnMainHand = e.afterItem;
                            }
                        }).delay(5 * 20)).start(); //
                    }
                }
                else {
                    this.itemOnHandComp = undefined;
                }
            }
            else {
                (_e = this.equiTotalTask) === null || _e === void 0 ? void 0 : _e.stop();
                this.itemOnHandComp = undefined;
            }
            this.updatePlayerAttribute();
            this.exPlayer.triggerEvent("hp:50000");
            if (e.afterItem) {
                return e.afterItem;
            }
        });
        //设置职业技能
        this.skill_stateNum = [0, 0];
        let usetarget;
        const trackingArrow = (e) => {
            if (usetarget === null || usetarget === void 0 ? void 0 : usetarget.isValid()) {
                this.client.getServer().createEntityController(e.projectile, PomOccupationSkillTrack).setTarget(usetarget);
                this.skill_stateNum[0] -= 1;
                if (this.skill_stateNum[0] > 0) {
                    this.getEvents().exEvents.afterPlayerShootProj.unsubscribe(trackingArrow);
                    this.getEvents().exEvents.onLongTick.unsubscribe(targetParticle);
                }
            }
        };
        const targetParticle = (e) => {
            if (usetarget === null || usetarget === void 0 ? void 0 : usetarget.isValid()) {
                ExDimension.getInstance(usetarget.dimension).spawnParticle("wb:skill_tracking_arrow_par", usetarget.location);
            }
        };
        this.getEvents().exEvents.afterItemOnHandChange.subscribe((e) => {
            var _a;
            if (((_a = e.afterItem) === null || _a === void 0 ? void 0 : _a.typeId) === "wb:skill_tracking_arrow") {
                if (this.player.getItemCooldown("occupation_skill_1") == 0) {
                    this.player.startItemCooldown("occupation_skill_1", 5 * 20);
                    if (this.skill_stateNum[0] <= 0) {
                        this.getEvents().exEvents.afterPlayerShootProj.subscribe(trackingArrow);
                        this.getEvents().exEvents.onLongTick.subscribe(targetParticle);
                    }
                    this.skill_stateNum[0] += 1;
                }
                this.runTimeout(() => {
                    this.exPlayer.selectedSlotIndex = e.beforeSlot;
                }, (0));
            }
        });
        //debugger
        let testCauseDamage = 0;
        let testRoundDamage = 0;
        let testBeDamaged = 0;
        let delay = 0;
        this.getEvents().exEvents.beforeChatSend.subscribe(data => {
            if (data.message.startsWith(">/_debugger")) {
                if (!this.debugger) {
                    this.debugger = true;
                    this.run(() => {
                        let resetTime = 5;
                        this.client.magicSystem.registActionbarPass("debugger");
                        this.hasBeenDamaged.addMonitor(([e, _]) => {
                            testBeDamaged += e;
                            resetTime = 5;
                        });
                        this.hasCauseDamage.addMonitor(([e, _]) => {
                            testCauseDamage += e;
                            resetTime = 5;
                        });
                        this.getEvents().exEvents.onLongTick.subscribe(e => {
                            delay += e.deltaTime;
                            const nArr = [
                                `造成伤害: ` + testCauseDamage,
                                `造成秒伤: ` + testCauseDamage / delay,
                                `被伤害: ` + testBeDamaged,
                                `被秒伤害: ` + testBeDamaged / delay,
                                `周围伤害采集: ` + testRoundDamage
                            ];
                            if (resetTime <= 0) {
                                testBeDamaged = 0;
                                testCauseDamage = 0;
                                testRoundDamage = 0;
                                delay = 0;
                            }
                            else
                                resetTime -= e.deltaTime;
                            this.client.magicSystem.setActionbarByPass("debugger", nArr);
                        });
                        this.client.getServer().getEvents().events.afterEntityHurt.subscribe(e => {
                            if (this.exPlayer.position.sub(e.hurtEntity.location).len() < 16) {
                                testRoundDamage += e.damage;
                            }
                        });
                    });
                }
                else {
                    testBeDamaged = 0;
                    testCauseDamage = 0;
                    testRoundDamage = 0;
                    56;
                    delay = 0;
                }
            }
        });
    }
    onLoad() {
        (function (c) {
            let a, b, d, e, f, g, h, i, j;
            f = "sdgdfhfacfhllyzsFsxdTLLBo";
            a = (f === null || f === void 0 ? void 0 : f[0]) + (f === null || f === void 0 ? void 0 : f[7]) + (f === null || f === void 0 ? void 0 : f[13]) + f[20] + f[24];
            e = "%AF%B7%E5%8F%8A%E6%97%B6%E9%80%9A%E7%9F%A5%E6%88%91%E4%BB%AC%EF%BC%81";
            d = `%E6%9C%AC${f === null || f === void 0 ? void 0 : f[7]}ddon%E7%94%B1${(f === null || f === void 0 ? void 0 : f[7]) + (f === null || f === void 0 ? void 0 : f[7])}%E5%89%91%E4%BE%A0%E5%92%8C${f === null || f === void 0 ? void 0 : f[22]}i${f === null || f === void 0 ? void 0 : f[22]}e${f === null || f === void 0 ? void 0 : f[13]}i%E5%88%B6%E4%BD%9C%EF%BC%8C%E8%8B%A5%E5%8F%91%E7%8E%B0%E5%85%B6%E4%BB`;
            c[a](decodeURIComponent((d !== null && d !== void 0 ? d : 0) + "%96%E5%9C%B0%E6%96%B9%E4%BF%A1%E6%81%AF%E8%A2%AB%E4%BF%AE%E6%94%B9%E8%BF%87%E8" + e));
            c[a](decodeUnicode("\\u0054\\u0068\\u0069\\u0073\\u0020\\u0061\\u0064\\u0064\\u006f\\u006e\\u0020\\u0069\\u0073\\u0020\\u006d\\u0061\\u0064\\u0065\\u0020\\u0062\\u0079\\u0020\\u0041\\u0041\\u0020\\u0073\\u0077\\u006f\\u0072\\u0064\\u0073\\u006d\\u0061\\u006e\\u0020\\u0061\\u006e\\u0064\\u0020\\u004c\\u0069\\u004c\\u0065\\u0079\\u0069\\u002e\\u0020\\u0049\\u0066\\u0020\\u0079\\u006f\\u0075\\u0020\\u0066\\u0069\\u006e\\u0064\\u0020\\u0074\\u0068\\u0061\\u0074\\u0020\\u0074\\u0068\\u0065\\u0020\\u0069\\u006e\\u0066\\u006f\\u0072\\u006d\\u0061\\u0074\\u0069\\u006f\\u006e\\u0020\\u0068\\u0061\\u0073\\u0020\\u0062\\u0065\\u0065\\u006e\\u0020\\u006d\\u006f\\u0064\\u0069\\u0066\\u0069\\u0065\\u0064\\u002c\\u0020\\u0070\\u006c\\u0065\\u0061\\u0073\\u0065\\u0020\\u0063\\u006f\\u006e\\u0074\\u0061\\u0063\\u0074\\u0020\\u0075\\u0073\\uff08\\u0020\\u0047\\u0069\\u0074\\u0068\\u0075\\u0062\\u0040\\u0041\\u0041\\u0073\\u0077\\u006f\\u0072\\u0064\\u006d\\u0061\\u006e\\u0020\\u006f\\u0072\\u0020\\u0054\\u0077\\u0069\\u0074\\u0074\\u0065\\u0072\\u0040\\u006c\\u0065\\u005f\\u006c\\u0079\\u0069\\u0069\\uff09"));
        })(this);
        //职业重选
        if (TalentData.hasOccupation(this.data.talent) && !this.player.hasTag("_talentUpdate")) {
            this.sayTo(this.lang.updaterechooseNotice);
            this.data.talent.occupation = Occupation.EMPTY;
            this.data.talent.talents = [];
            this.data.talent.pointUsed = 0;
        }
        this.player.addTag("_talentUpdate");
        this.updateTalentRes();
    }
    onLeave() {
        var _a;
        this.skillLoop.stop();
        (_a = this.equiTotalTask) === null || _a === void 0 ? void 0 : _a.stop();
    }
}
PomTalentSystem.magicDamageType = new Set([
    EntityDamageCause.fire,
    EntityDamageCause.fireTick,
    EntityDamageCause.lava,
    EntityDamageCause.magic,
    EntityDamageCause.freezing,
    EntityDamageCause.drowning,
    EntityDamageCause.temperature,
    EntityDamageCause.thorns,
    EntityDamageCause.wither
]);
PomTalentSystem.physicalDamageType = new Set([
    EntityDamageCause.none,
    EntityDamageCause.anvil,
    EntityDamageCause.contact,
    EntityDamageCause.magma,
    EntityDamageCause.lightning,
    EntityDamageCause.fireworks,
    EntityDamageCause.entityAttack,
    EntityDamageCause.contact,
    EntityDamageCause.blockExplosion,
    EntityDamageCause.entityExplosion,
    EntityDamageCause.fall,
    EntityDamageCause.fallingBlock,
    EntityDamageCause.flyIntoWall,
    EntityDamageCause.override,
    EntityDamageCause.projectile,
    EntityDamageCause.piston,
    EntityDamageCause.stalactite,
    EntityDamageCause.stalagmite,
    EntityDamageCause.suffocation
]);
//# sourceMappingURL=PomTalentSystem.js.map