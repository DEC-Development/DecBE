import { world, Player, ItemStack, GameMode, system } from '@minecraft/server';
import { fileProvider } from '../../filepack/index.js';
import ExPlayer from '../../modules/exmc/server/entity/ExPlayer.js';
import Vector3 from '../../modules/exmc/utils/math/Vector3.js';
import ExEntity from '../../modules/exmc/server/entity/ExEntity.js';
import { idBlockMap, idItemMap, idEntityMap } from '../common/idMap.js';
import ExGame from '../../modules/exmc/server/ExGame.js';
import ExSystem from '../../modules/exmc/utils/ExSystem.js';
import { Objective } from '../../modules/exmc/server/entity/ExScoresManager.js';
import PomServer from '../server/PomServer.js';
import DecGlobal from '../../dec/server/DecGlobal.js';
const ex = (name) => "ex:" + name;
const minecraft = (name) => "minecraft:" + name;
const fnamespace = (name) => name.split(":").slice(1).join(":");
const onUseCompName = "on_use";
const weaponCompName = "weapon";
const chargeableCompName = "chargeable";
const diggerCompName = "digger";
const foodCompName = "food";
const onStepOnCompName = "on_step_on";
const onInteractCompName = "on_interact";
const tickingCompName = "ticking";
const randomTickingCompName = "random_ticking";
const onPlayerPlacingCompName = "on_player_placing";
const onPlayerDestroyedCompName = "on_player_destroyed";
const tmpV = new Vector3();
function molangCalculate(molang, option) {
    molang = (molang + "").replace(/q\./g, "query.");
    const sapi = {
        get position() {
            var _a, _b, _c;
            return new Vector3((_c = (_b = (_a = option.triggerEntity) === null || _a === void 0 ? void 0 : _a.location) !== null && _b !== void 0 ? _b : option.triggerBlock) !== null && _c !== void 0 ? _c : new Vector3());
        },
        get dimension() {
            var _a, _b, _c;
            return (_b = (_a = option.triggerEntity) === null || _a === void 0 ? void 0 : _a.dimension) !== null && _b !== void 0 ? _b : (_c = option.triggerBlock) === null || _c === void 0 ? void 0 : _c.dimension;
        },
        get block() {
            return option.triggerBlock;
        },
        get isDec() {
            return DecGlobal.isDec();
        },
        get triggerEntity() {
            return option.triggerEntity;
        },
        get player() {
            return option.triggerEntity;
        }
    };
    const query = {
        "block_state": (name) => {
            var _a;
            return (_a = option.triggerBlock) === null || _a === void 0 ? void 0 : _a.permutation.getState(name);
        },
        "get_equipped_item_name": (pos) => {
            var _a, _b, _c, _d;
            if (option.triggerEntity && option.triggerEntity instanceof Player) {
                switch (pos) {
                    case "main_hand":
                        return fnamespace((_b = (_a = ExPlayer.getInstance(option.triggerEntity).getBag().itemOnMainHand) === null || _a === void 0 ? void 0 : _a.typeId) !== null && _b !== void 0 ? _b : ":");
                    case "off_hand":
                        return fnamespace((_d = (_c = ExPlayer.getInstance(option.triggerEntity).getBag().itemOnOffHand) === null || _c === void 0 ? void 0 : _c.typeId) !== null && _d !== void 0 ? _d : ":");
                    default:
                        return "";
                }
            }
            else {
                return "";
            }
        },
        "scoreboard": (name) => {
            if (!option.triggerEntity)
                return "";
            return ExEntity.getInstance(option.triggerEntity).getScoresManager().getScore(name);
        },
        "position": (index) => {
            if (option.triggerBlock) {
                return tmpV.set(option.triggerBlock).toArray()[index];
            }
            else if (option.triggerEntity) {
                return tmpV.set(option.triggerEntity.location).toArray()[index];
            }
            else {
                return 0;
            }
        },
        get time_of_day() {
            return world.getTimeOfDay() / 24000;
        },
        //custom
        "consume_scoreboard": (name, num) => {
            var _a;
            if (option.triggerEntity) {
                let obj = new Objective(name);
                if (((_a = obj.getScore(option.triggerEntity)) !== null && _a !== void 0 ? _a : 0) >= num) {
                    obj.addScore(option.triggerEntity, -num);
                    return true;
                }
            }
            return false;
        },
        get cardinal_facing_2d() {
            if (!option.triggerEntity || !option.triggerBlock)
                return 6;
            let dis = ExEntity.getInstance(option.triggerEntity).position.sub(option.triggerBlock.location);
            let angle = dis.rotateAngleX() + 45;
            switch (Math.floor(angle / 90) % 4) {
                case 0:
                    return 2;
                case 1:
                    return 4;
                case 2:
                    return 3;
                case 3:
                    return 5;
                default:
                    return 6;
            }
        }
    };
    let res = eval("(" + molang + ")");
    //console.warn(molang + " -> "+  res);
    return res;
}
function findTriggerComp(option) {
    var _a;
    if (option.triggerBlock) {
        if (idBlockMap.has(option.triggerBlock.typeId)) {
            const block = idBlockMap.get(option.triggerBlock.typeId)["minecraft:block"];
            const comp = Object.assign({}, ((_a = block.components) !== null && _a !== void 0 ? _a : {}));
            if ("permutations" in block) {
                for (let part of block.permutations) {
                    if (molangCalculate(part.condition, option)) {
                        const partComp = part.components;
                        for (let key in partComp) {
                            comp[key] = partComp[key];
                        }
                    }
                }
            }
            if (!option.triggerType)
                return undefined;
            const result = comp[minecraft(option.triggerType)];
            return result;
        }
    }
    else if (option.triggerItem && option.triggerEntity) {
        if (idItemMap.has(option.triggerItem.typeId)) {
            const block = idItemMap.get(option.triggerItem.typeId)["minecraft:item"];
            const comp = block["components"];
            if (!option.triggerType)
                return undefined;
            const result = comp[minecraft(option.triggerType)];
            return result;
        }
    }
    return undefined;
}
let lastSelectItemSlot = new WeakMap();
function emitEvent(eventName, option) {
    var _a, _b, _c, _d;
    if (option.triggerBlock) {
        if (idBlockMap.has(option.triggerBlock.typeId)) {
            const block = idBlockMap.get(option.triggerBlock.typeId)["minecraft:block"];
            const events = ((_a = block.events) !== null && _a !== void 0 ? _a : {});
            const event = events[eventName];
            if (event) {
                handleEventUser(event, option);
            }
        }
    }
    else if (option.triggerItem && option.triggerEntity) {
        if (option.triggerEntity instanceof Player) {
            if (((_b = lastSelectItemSlot.get(option.triggerEntity)) === null || _b === void 0 ? void 0 : _b[0]) !== option.triggerEntity.selectedSlotIndex
                || ((_c = lastSelectItemSlot.get(option.triggerEntity)) === null || _c === void 0 ? void 0 : _c[1]) !== option.triggerItem.typeId) {
                return true;
            }
        }
        if (idItemMap.has(option.triggerItem.typeId)) {
            const item = idItemMap.get(option.triggerItem.typeId)["minecraft:item"];
            const events = ((_d = item.events) !== null && _d !== void 0 ? _d : {});
            const event = events[eventName];
            if (event) {
                handleEventUser(event, option);
            }
        }
    }
    return undefined;
}
function handleEventUser(eventUser, option) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (option.triggerBlock) {
        if (eventUser.condition) {
            if (!molangCalculate(eventUser.condition, option)) {
                return;
            }
        }
        if (eventUser.trigger) {
            emitEvent(eventUser.trigger.event, option);
        }
        let pos = new Vector3(option.triggerBlock.location);
        let posStr = pos.toArray().join(" ");
        if (eventUser.run_command) {
            for (let cmd of eventUser.run_command.command) {
                if (eventUser.run_command.target == "other" && option.triggerEntity) {
                    option.triggerEntity.runCommand(`${cmd}`);
                }
                else {
                    option.triggerBlock.dimension.runCommand(`execute positioned ${posStr} run ${cmd}`);
                }
            }
        }
        if (eventUser.play_sound) {
            option.triggerBlock.dimension.playSound(eventUser.play_sound.sound, pos);
        }
        if (eventUser.set_block_state) {
            let per = option.triggerBlock.permutation;
            for (let i in eventUser.set_block_state) {
                per = per.withState(i, molangCalculate((eventUser.set_block_state[i]), option));
            }
            option.triggerBlock.setPermutation(per);
        }
        if (eventUser.set_block) {
            option.triggerBlock.transTo(eventUser.set_block.block_type);
        }
        if (eventUser.spawn_loot) {
            option.triggerBlock.dimension.runCommand(`loot spawn ${new Vector3(option.triggerBlock).add(0.5).toArray().join(' ')} loot "${eventUser.spawn_loot.table.split('/')
                .slice(1).join('/').slice(0, -5)}"`);
        }
        if (eventUser.add_mob_effect && option.triggerEntity) {
            option.triggerEntity.addEffect(eventUser.add_mob_effect.effect, eventUser.add_mob_effect.duration * 20, {
                "amplifier": eventUser.add_mob_effect.amplifier
            });
        }
        if (eventUser.decrement_stack && option.triggerEntity instanceof Player) {
            let bag = ExPlayer.getInstance(option.triggerEntity).getBag();
            let item = bag.itemOnMainHand;
            if (item) {
                let damageComp = item.getComponent("durability");
                if (damageComp) {
                    let damage = damageComp.damage;
                    damage += 1;
                    if (damage >= damageComp.maxDurability) {
                        bag.clearItem(item.typeId, 1);
                    }
                    else {
                        damageComp.damage = damage;
                        if (((_a = bag.itemOnMainHand) === null || _a === void 0 ? void 0 : _a.typeId) === item.typeId) {
                            bag.itemOnMainHand = item;
                        }
                    }
                }
                else {
                    bag.clearItem(item.typeId, 1);
                }
            }
        }
        if (eventUser.post_message) {
            const post = ExSystem.deepClone(eventUser.post_message);
            for (let [i, e] of post.message.entries()) {
                post.message[i] = typeof e === "string" ? molangCalculate(e, option) : e;
            }
            if (post.sign)
                ExGame.postMessageToServer(post.sign, post.message);
        }
    }
    else if (option.triggerItem && option.triggerEntity) {
        if (eventUser.condition) {
            if (!molangCalculate(eventUser.condition, option)) {
                return;
            }
        }
        if (eventUser.trigger) {
            emitEvent(eventUser.trigger.event, option);
        }
        let pos = new Vector3(option.triggerEntity.location);
        // let posStr = pos.toArray().join(" ")
        if (eventUser.run_command) {
            for (let cmd of eventUser.run_command.command) {
                if (eventUser.run_command.target == "other" && option.hurtedEntity) {
                    option.hurtedEntity.runCommand(`${cmd}`);
                }
                else {
                    option.triggerEntity.runCommand(`${cmd}`);
                }
            }
        }
        if (eventUser.play_sound) {
            option.triggerEntity.dimension.playSound(eventUser.play_sound.sound, pos);
        }
        if (eventUser.shoot) {
            const shootConfig = eventUser.shoot;
            let proj = (_d = (_c = (_b = idEntityMap.get(shootConfig.projectile)) === null || _b === void 0 ? void 0 : _b["minecraft:entity"]) === null || _c === void 0 ? void 0 : _c["components"]) === null || _d === void 0 ? void 0 : _d['minecraft:projectile'];
            let power = proj === null || proj === void 0 ? void 0 : proj['power'];
            let uncertaintyBase = proj === null || proj === void 0 ? void 0 : proj['uncertaintyBase'];
            system.runTimeout(() => {
                var _a;
                ExEntity.getInstance(option.triggerEntity).shootProj(shootConfig.projectile, {
                    "speed": ((_a = shootConfig.launch_power) !== null && _a !== void 0 ? _a : 1) * (power !== null && power !== void 0 ? power : 1),
                    "uncertainty": uncertaintyBase !== null && uncertaintyBase !== void 0 ? uncertaintyBase : 0
                });
            }, (_e = shootConfig.delay_ticks) !== null && _e !== void 0 ? _e : 0);
        }
        if (eventUser.damage) {
            let damageComp = option.triggerItem.getComponent("durability");
            if (damageComp && !(option.triggerEntity instanceof Player && option.triggerEntity.getGameMode() == GameMode.Creative)) {
                let bag = ExEntity.getInstance(option.triggerEntity).getBag();
                let damage = damageComp.damage;
                damage += eventUser.damage.amount;
                if (damage >= damageComp.maxDurability) {
                    bag.clearItem(option.triggerItem.typeId, 1);
                }
                else {
                    damageComp.damage = damage;
                    if (((_f = bag.itemOnMainHand) === null || _f === void 0 ? void 0 : _f.typeId) === option.triggerItem.typeId) {
                        bag.itemOnMainHand = option.triggerItem;
                    }
                }
            }
        }
        if (eventUser.add_mob_effect) {
            if (eventUser.add_mob_effect.target == "other" && option.hurtedEntity) {
                option.hurtedEntity.addEffect(eventUser.add_mob_effect.effect, eventUser.add_mob_effect.duration * 20, {
                    "amplifier": eventUser.add_mob_effect.amplifier
                });
            }
            else {
                option.triggerEntity.addEffect(eventUser.add_mob_effect.effect, eventUser.add_mob_effect.duration * 20, {
                    "amplifier": eventUser.add_mob_effect.amplifier
                });
            }
        }
        if (eventUser.script && option.triggerEntity instanceof Player) {
            ExGame.postMessageBetweenClient(option.triggerEntity, PomServer, eventUser.script.output, (_g = eventUser.script.args) !== null && _g !== void 0 ? _g : []);
        }
    }
    if (eventUser.sequence) {
        handleSequenceEventUser(eventUser.sequence, option);
    }
    if (eventUser.randomize) {
        handleRandomizeEventUser(eventUser.randomize, option);
    }
}
function handleSequenceEventUser(eventUser, option) {
    for (let i of eventUser) {
        handleEventUser(i, option);
    }
}
function handleRandomizeEventUser(eventUser, option) {
    let pool = [];
    let base = 0;
    let sum = eventUser.reduce((a, b) => a + b.weight, 0);
    let rand = Math.random();
    for (let i of eventUser) {
        pool.push(base + i.weight / sum);
        base += i.weight / sum;
    }
    let index = 0;
    while (rand > pool[index] && index < pool.length - 1) {
        index++;
    }
    handleEventUser(eventUser[index], option);
}
export default (context) => {
    for (let fpath of fileProvider.listAll("ex_items")) {
        let f = fileProvider.get(fpath);
        idItemMap.set(f["minecraft:item"].description.identifier, f);
    }
    for (let fpath of fileProvider.listAll("ex_blocks")) {
        let f = fileProvider.get(fpath);
        idBlockMap.set(f["minecraft:block"].description.identifier, f);
    }
    for (let fpath of fileProvider.listAll("entities")) {
        let f = fileProvider.get(fpath);
        if (f) {
            idEntityMap.set(f["minecraft:entity"].description.identifier, f);
        }
        else {
            console.warn(fpath);
        }
    }
    system.beforeEvents.startup.subscribe(initEvent => {
        initEvent.blockComponentRegistry.registerCustomComponent(ex(onStepOnCompName), {
            onStepOn: e => {
                if (e.entity) {
                    let option = { triggerBlock: e.block, triggerEntity: e.entity, triggerType: onStepOnCompName };
                    const triggerComp = findTriggerComp(option);
                    if (triggerComp) {
                        emitEvent(triggerComp.event, option);
                    }
                }
            }
        });
        initEvent.blockComponentRegistry.registerCustomComponent(ex(onInteractCompName), {
            onPlayerInteract: e => {
                if (e.player) {
                    let option = { triggerBlock: e.block, triggerEntity: e.player, triggerType: onInteractCompName };
                    const triggerComp = findTriggerComp(option);
                    if (triggerComp &&
                        (triggerComp.condition ? molangCalculate(triggerComp.condition, option) : true)) {
                        emitEvent(triggerComp.event, option);
                    }
                }
            }
        });
        initEvent.blockComponentRegistry.registerCustomComponent(ex(onPlayerPlacingCompName), {
            onPlace: e => {
                if (e) {
                    let players = e.block.dimension.getPlayers({
                        "maxDistance": 5,
                        "closest": 1,
                        "location": e.block.location
                    });
                    let option = { triggerBlock: e.block, triggerType: onPlayerPlacingCompName, triggerEntity: players.length > 0 ? players[0] : undefined };
                    const triggerComp = findTriggerComp(option);
                    if (triggerComp) {
                        emitEvent(triggerComp.event, option);
                    }
                }
            }
        });
        initEvent.blockComponentRegistry.registerCustomComponent(ex(onPlayerDestroyedCompName), {
            onPlayerBreak: e => {
                if (e) {
                    let option = { triggerBlock: e.block, triggerEntity: e.player, triggerType: onPlayerDestroyedCompName };
                    const triggerComp = findTriggerComp(option);
                    if (triggerComp) {
                        emitEvent(triggerComp.event, option);
                    }
                }
            }
        });
        initEvent.blockComponentRegistry.registerCustomComponent(ex(tickingCompName), {
            onTick: e => {
                if (e) {
                    let option = { triggerBlock: e.block, triggerType: tickingCompName };
                    const triggerComp = findTriggerComp(option);
                    if (triggerComp) {
                        emitEvent(triggerComp.on_tick.event, option);
                    }
                }
            }
        });
        initEvent.blockComponentRegistry.registerCustomComponent(ex(randomTickingCompName), {
            onRandomTick: e => {
                if (e) {
                    let option = { triggerBlock: e.block, triggerType: randomTickingCompName };
                    const triggerComp = findTriggerComp(option);
                    if (triggerComp) {
                        emitEvent(triggerComp.on_tick.event, option);
                    }
                }
            }
        });
    });
    let useMap = new WeakMap();
    world.afterEvents.itemStopUse.subscribe(e => {
        if (useMap.has(e.source)) {
            useMap.get(e.source).stop();
            useMap.delete(e.source);
        }
    });
    world.afterEvents.entityDie.subscribe(e => {
        var _a;
        if (e.deadEntity instanceof Player) {
            (_a = useMap.get(e.deadEntity)) === null || _a === void 0 ? void 0 : _a.stop();
            useMap.delete(e.deadEntity);
        }
    });
    world.afterEvents.itemStartUse.subscribe(e => {
        const player = e.source;
        const item = e.itemStack;
        lastSelectItemSlot.set(player, [player.selectedSlotIndex, item.typeId]);
        if (e) {
            let tryUse = (category, cooldown) => {
                let option = { triggerItem: item, triggerEntity: player, triggerType: onUseCompName };
                const triggerComp = findTriggerComp(option);
                if (category && cooldown) {
                    player.startItemCooldown(category, cooldown);
                }
                if (triggerComp) {
                    return emitEvent(triggerComp.on_use.event, option);
                }
            };
            let cooling = findTriggerComp({ triggerItem: e.itemStack, triggerEntity: e.source, triggerType: "cooldown" });
            if (cooling) {
                let cate = cooling.category;
                let duration = cooling.duration;
                if (duration * 20 - 1 == player.getItemCooldown(cate)) {
                    tryUse();
                    useMap.set(player, ExSystem.tickTask(context, () => {
                        var _a;
                        if (!tryUse(cate, Math.floor(duration * 20))) {
                            (_a = useMap.get(player)) === null || _a === void 0 ? void 0 : _a.startOnce();
                        }
                        else {
                            useMap.delete(player);
                        }
                    }).delay(Math.ceil(duration * 20)).startOnce());
                }
            }
            else {
                tryUse();
                useMap.set(player, ExSystem.tickTask(context, () => {
                    tryUse();
                }).delay(5).start());
            }
        }
    });
    world.afterEvents.entityHitEntity.subscribe(e => {
        var _a;
        if (!(e.damagingEntity instanceof Player))
            return;
        let item = ExPlayer.getInstance(e.damagingEntity).getBag().itemOnMainHand;
        lastSelectItemSlot.set(e.damagingEntity, [e.damagingEntity.selectedSlotIndex, (_a = item === null || item === void 0 ? void 0 : item.typeId) !== null && _a !== void 0 ? _a : '']);
        if (e) {
            let option = { triggerItem: item, triggerEntity: e.damagingEntity, triggerType: weaponCompName, hurtedEntity: e.hitEntity };
            const triggerComp = findTriggerComp(option);
            if (triggerComp && triggerComp.on_hurt_entity) {
                emitEvent(triggerComp.on_hurt_entity.event, option);
            }
        }
    });
    world.afterEvents.entityHitBlock.subscribe(e => {
        var _a;
        if (!(e.damagingEntity instanceof Player))
            return;
        let item = ExPlayer.getInstance(e.damagingEntity).getBag().itemOnMainHand;
        lastSelectItemSlot.set(e.damagingEntity, [e.damagingEntity.selectedSlotIndex, (_a = item === null || item === void 0 ? void 0 : item.typeId) !== null && _a !== void 0 ? _a : '']);
        if (item) {
            let option = { triggerItem: item, triggerEntity: e.damagingEntity, triggerType: weaponCompName };
            const triggerComp = findTriggerComp(option);
            if (triggerComp && triggerComp.on_hit_block) {
                emitEvent(triggerComp.on_hit_block.event, option);
            }
        }
    });
    world.afterEvents.itemCompleteUse.subscribe(e => {
        lastSelectItemSlot.set(e.source, [e.source.selectedSlotIndex, e.itemStack.typeId]);
        if (e) {
            let option = { triggerItem: e.itemStack, triggerEntity: e.source, triggerType: chargeableCompName };
            const triggerComp = findTriggerComp(option);
            if (triggerComp) {
                emitEvent(triggerComp.on_complete.event, option);
            }
        }
    });
    world.afterEvents.playerBreakBlock.subscribe(e => {
        var _a, _b;
        lastSelectItemSlot.set(e.player, [e.player.selectedSlotIndex, (_b = (_a = e.itemStackBeforeBreak) === null || _a === void 0 ? void 0 : _a.typeId) !== null && _b !== void 0 ? _b : ""]);
        if (e.itemStackBeforeBreak) {
            let option = { triggerItem: e.itemStackBeforeBreak, triggerEntity: e.player, triggerType: diggerCompName };
            const triggerComp = findTriggerComp(option);
            if (triggerComp) {
                if (triggerComp.on_dig) {
                    emitEvent(triggerComp.on_dig.event, option);
                }
            }
        }
    });
    world.afterEvents.itemStopUse.subscribe(e => {
        if (e.useDuration > 0)
            return;
        if (e.itemStack) {
            lastSelectItemSlot.set(e.source, [e.source.selectedSlotIndex, e.itemStack.typeId]);
            let option = { triggerItem: e.itemStack, triggerEntity: e.source, triggerType: foodCompName };
            const triggerComp = findTriggerComp(option);
            if (triggerComp && triggerComp.on_consume) {
                emitEvent(triggerComp.on_consume.event, option);
            }
            if (triggerComp === null || triggerComp === void 0 ? void 0 : triggerComp.using_converts_to) {
                ExPlayer.getInstance(e.source).getBag().addItem(new ItemStack(triggerComp.using_converts_to));
            }
        }
    });
};
//# sourceMappingURL=eventNew.js.map