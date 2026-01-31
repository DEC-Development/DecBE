var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { world, Block, Direction, GameMode, ScriptEventSource, system, EntityDamageCause, DisplaySlotId, CommandPermissionLevel } from '@minecraft/server';
import DecClient from "./DecClient.js";
import ExPlayer from '../../modules/exmc/server/entity/ExPlayer.js';
import { Objective } from '../../modules/exmc/server/entity/ExScoresManager.js';
import ExEntity from '../../modules/exmc/server/entity/ExEntity.js';
import commandAnalysis from '../../modules/exmc/utils/commandAnalysis.js';
import ExGameServer from '../../modules/exmc/server/ExGameServer.js';
import DecGlobal from './DecGlobal.js';
import Vector3 from '../../modules/exmc/utils/math/Vector3.js';
import { DecEverlastingWinterGhastBoss1, DecEverlastingWinterGhastBoss2 } from './entities/DecEverlastingWinterGhastBoss.js';
import { DecCommonBossLastStage } from './entities/DecCommonBossLastStage.js';
import VarOnChangeListener from '../../modules/exmc/utils/VarOnChangeListener.js';
import ExEnvironment from '../../modules/exmc/server/env/ExEnvironment.js';
import { DecHostOfDeepBoss1, DecHostOfDeepBoss2, DecHostOfDeepBoss3 } from './entities/DecHostOfDeepBoss.js';
import GZIPUtil from '../../modules/exmc/utils/GZIPUtil.js';
import IStructureSettle from './data/structure/IStructureSettle.js';
import IStructureDriver from './data/structure/IStructureDriver.js';
import ExTaskRunner from '../../modules/exmc/server/ExTaskRunner.js';
import DecNukeController from './entities/DecNukeController.js';
import GlobalScoreBoardCache from '../../modules/exmc/server/storage/cache/GlobalScoreBoardCache.js';
import MathUtil from '../../modules/exmc/utils/math/MathUtil.js';
import ExGame, { receiveMessage } from '../../modules/exmc/server/ExGame.js';
import { MinecraftDimensionTypes, MinecraftEffectTypes } from '../../modules/vanilla-data/lib/index.js';
import { DecLeavesGolemBoss } from './entities/DecLeavesGolemBoss.js';
import { DecEscapeSoulBoss3, DecEscapeSoulBoss4, DecEscapeSoulBoss5 } from './entities/DecEscapeSoulBoss.js';
import DecBossController from './entities/DecBossController.js';
import DecBossBarrier from './entities/DecBossBarrier.js';
import { ignorn } from '../../modules/exmc/server/ExErrorQueue.js';
import ExEntityQuery from '../../modules/exmc/server/env/ExEntityQuery.js';
export default class DecServer extends ExGameServer {
    constructor(config) {
        super(config);
        this.tmpV = new Vector3();
        this.globalscores = new GlobalScoreBoardCache(new Objective("global"), false);
        //test
        this.compress = [""];
        this.state_set_keep = (block, stateMatchMap) => {
            let states = block.permutation.getAllStates();
            for (let k in stateMatchMap) {
                states[k] = stateMatchMap[k];
            }
            let states_string = '[';
            Object.keys(states).forEach(k => {
                let new_st = '"' + k + '"=';
                if (typeof (states[k]) == 'boolean' || typeof (states[k]) == 'number') {
                    new_st += (states[k]) + ',';
                }
                else if (typeof (states[k]) == 'string') {
                    new_st += '"' + (states[k]) + '",';
                }
                states_string += new_st;
            });
            states_string = states_string.slice(0, states_string.length - 1);
            states_string += ']';
            this.getExDimension(block.dimension).command.runAsync('setblock ' + (block.location.x) + ' ' + (block.location.y) + ' ' + (block.location.z) + ' ' + block.typeId + ' ' + states_string);
        };
        this.i_inviolable = new Objective("i_inviolable").create("i_inviolable");
        this.i_damp = new Objective("i_damp").create("i_damp");
        this.i_soft = new Objective("i_soft").create("i_soft");
        this.i_softx = new Objective("i_softx").create("i_softx");
        this.i_heavy = new Objective("i_heavy").create("i_heavy");
        this.skill_count = new Objective("skill_count").create("skill_count");
        this.gametime = new Objective("gametime").create("gametime");
        this.magicpoint = new Objective("magicpoint").create("magicpoint");
        this.maxmagic = new Objective("maxmagic").create("maxmagic");
        this.magicgain = new Objective("magicgain").create("magicgain");
        this.story_random = new Objective("story_random").create("story_random");
        this.magicreckon = new Objective("magicreckon").create("magicreckon");
        this.random = new Objective("random").create("random");
        this.pre_gamemode = new Objective("pre_gamemode").create("pre_gamemode");
        this.global = new Objective("global").create("global");
        let place_block_wait_tick = 0;
        this.globalscores.setNumber('zero', 0);
        this.globalscores.setNumber('one', 1);
        this.globalscores.setNumber('two', 2);
        this.globalscores.setNumber('four', 4);
        this.globalscores.initNumber('FirstEnter', 0);
        this.globalscores.initNumber('MagicDisplay', 0);
        //new Objective("harmless").create("harmless");
        this.nightEventListener = new VarOnChangeListener(e => {
            if (e) {
                // is night
                if (this.globalscores.getNumber("NightRandom") === 0) {
                    this.globalscores.setNumber("NightRandom", MathUtil.randomInteger(1, 100));
                    this.globalscores.setNumber("IsDay", 0);
                    this.globalscores.setNumber("IsNight", 1);
                }
            }
            else {
                this.globalscores.setNumber("NightRandom", 0);
                this.globalscores.setNumber("IsDay", 1);
                this.globalscores.setNumber("IsNight", 0);
                this.getExDimension(MinecraftDimensionTypes.Overworld).command.runAsync([
                    "fog @a remove \"night_event\""
                ]);
            }
        }, false);
        // this.getEvents().events.beforePistonActivate.subscribe(e => {
        //     e.piston
        // });
        let die_mode_test = (p, open) => {
            if (open) {
                if (world.getDynamicProperty('DieMode')) {
                    if (world.getDynamicProperty('AlreadyDie')) {
                        p.sendMessage({ "rawtext": [{ "translate": "text.dec:diemode_cannot_close_already_die.name" }] });
                    }
                    else {
                        p.sendMessage({ "rawtext": [{ "translate": "text.dec:diemode_cannot_close.name" }] });
                    }
                }
                else {
                    if (p.hasTag('owner')) {
                        if (world.getDynamicProperty('AlreadyDie')) {
                            p.sendMessage({ "rawtext": [{ "translate": "text.dec:diemode_already_die.name" }] });
                        }
                        else {
                            if (world.getDynamicProperty('GmCheat')) {
                                p.sendMessage({ "rawtext": [{ "translate": "text.dec:diemode_gmcheat.name" }] });
                            }
                            else {
                                p.sendMessage({ "rawtext": [{ "translate": "text.dec:diemode_open.name" }] });
                                world.setDynamicProperty('DieMode', true);
                            }
                        }
                    }
                    else {
                        p.sendMessage({ "rawtext": [{ "translate": "text.dec:diemode_not_owner.name" }] });
                    }
                }
            }
            else {
                if (world.getDynamicProperty('DieMode')) {
                    p.sendMessage({ "rawtext": [{ "translate": "text.dec:diemode_test_open.name" }] });
                    p.runCommand('tellraw @s ');
                }
                else {
                    if (world.getDynamicProperty('AlreadyDie')) {
                        p.sendMessage({ "rawtext": [{ "translate": "text.dec:diemode_test_close_cannot_open_die.name" }] });
                    }
                    else {
                        if (world.getDynamicProperty('GmCheat')) {
                            p.sendMessage({ "rawtext": [{ "translate": "text.dec:diemode_test_close_cannot_open_gmc.name" }] });
                        }
                        else {
                            p.sendMessage({ "rawtext": [{ "translate": "text.dec:diemode_test_close.name" }] });
                        }
                    }
                }
            }
        };
        this.getEvents().events.beforeChatSend.subscribe(e => {
            var _a;
            let cmdRunner = this.getExDimension(MinecraftDimensionTypes.Overworld);
            let sender = ExPlayer.getInstance(e.sender);
            if (e.message.startsWith(">/")) {
                let cmds = commandAnalysis(e.message.substring(2));
                let errMsg = "";
                switch (cmds[0]) {
                    case "help": {
                        sender.command.runAsync("function help");
                        break;
                    }
                    case "creators": {
                        if (DecGlobal.isDec()) {
                            sender.command.runAsync("function test/creator_list");
                        }
                        break;
                    }
                    case "diemode": {
                        if (cmds[1] === "open") {
                            die_mode_test(sender.entity, true);
                        }
                        else if (cmds[1] === "test") {
                            die_mode_test(sender.entity, false);
                        }
                        else {
                            errMsg = "Invalid command " + cmds[1];
                        }
                        break;
                    }
                    case "magic": {
                        if (DecGlobal.isDec()) {
                            if (cmds[1] === "display") {
                                if (e.sender.commandPermissionLevel >= CommandPermissionLevel.Admin) {
                                    if (cmds[2] === "true") {
                                        cmdRunner.command.runAsync("function magic/display_on");
                                    }
                                    else if (cmds[2] === "false") {
                                        cmdRunner.command.runAsync("function magic/display_off");
                                    }
                                    else {
                                        errMsg = "Invalid command " + cmds[2];
                                    }
                                }
                                else {
                                    sender.command.runAsync("tellraw @s { \"rawtext\" : [ { \"translate\" : \"text.dec:command_fail.name\" } ] }");
                                }
                            }
                            else {
                                errMsg = "Invalid command " + cmds[1];
                            }
                        }
                        break;
                    }
                    case "_save": {
                        if (cmds.length < 7)
                            return;
                        let start = new Vector3(Math.floor(parseFloat(cmds[1])), Math.floor(parseFloat(cmds[2])), Math.floor(parseFloat(cmds[3])));
                        let end = new Vector3(Math.floor(parseFloat(cmds[4])), Math.floor(parseFloat(cmds[5])), Math.floor(parseFloat(cmds[6]))).add(1);
                        let data = [];
                        let task = new ExTaskRunner(this);
                        const mthis = this;
                        task.setTasks((function* () {
                            var _a;
                            for (let i of new IStructureDriver().save(mthis.getExDimension(MinecraftDimensionTypes.Overworld), start, end)) {
                                let res = i.toData();
                                i.dispose();
                                let com = (_a = GZIPUtil.zipString(JSON.stringify(res))) !== null && _a !== void 0 ? _a : "";
                                data.push(com);
                                yield true;
                            }
                        }).bind(this));
                        task.start(2, 1).then(() => {
                            this.compress = data;
                        });
                        break;
                    }
                    case "_load": {
                        let start = new Vector3(Math.floor(parseFloat(cmds[1])), Math.floor(parseFloat(cmds[2])), Math.floor(parseFloat(cmds[3])));
                        let data = new IStructureSettle();
                        let task = [];
                        for (let comp of this.compress) {
                            task.push(() => {
                                data.load(JSON.parse(GZIPUtil.unzipString(comp)));
                                data.run(this, this.getExDimension(MinecraftDimensionTypes.Overworld), start)
                                    .then(() => {
                                    var _a;
                                    (_a = task.shift()) === null || _a === void 0 ? void 0 : _a();
                                });
                            });
                        }
                        (_a = task.shift()) === null || _a === void 0 ? void 0 : _a();
                        break;
                    }
                    case "_test": {
                        // let start = new Vector3(Math.floor(parseFloat(cmds[1])), Math.floor(parseFloat(cmds[2])), Math.floor(parseFloat(cmds[3])));
                        // let data = new IStructureSettle();
                        // let task: (() => void)[] = [];
                        // for (let comp of decTreeStructure) {
                        //     task.push(() => {
                        //         data.load(JSON.parse(GZIPUtil.unzipString(comp)));
                        //         data.run(this.getExDimension(MinecraftDimensionTypes.overworld), start)
                        //             .then(() => {
                        //                 task.shift()?.();
                        //             });
                        //     });
                        // }
                        // task.shift()?.();
                        break;
                    }
                }
                if (errMsg.length !== 0) {
                    sender.command.runAsync(`tellraw @s { "rawtext" : [ { "text" : "Command Error: ${errMsg}" } ] }`);
                }
                e.cancel = true;
            }
        });
        let multiple_blocks_items;
        multiple_blocks_items = {
            'dec:patterned_vase_red': 'dec:patterned_vase_red_block',
            'dec:golden_fence': 'dec:golden_fence_block'
        };
        let multiple_blocks;
        multiple_blocks = {
            'dec:patterned_vase_red_block': {
                'height': 2,
                'sound': 'stone',
                'facing': false
            },
            'dec:golden_fence_block': {
                'height': 2,
                'sound': 'stone',
                'facing': true
            }
        };
        this.getEvents().events.afterPlayerBreakBlock.subscribe(e => {
            const block_before_id = e.brokenBlockPermutation.type.id;
            //种植架
            const block = e.block;
            function print(s) {
                s = String(s);
                world.getDimension('overworld').runCommandAsync('say ' + s);
            }
            if (block_before_id == 'dec:trellis') {
                const bottom_block = block.dimension.getBlock(new Vector3(block.location.x, block.location.y - 1, block.location.z));
                if (bottom_block.typeId == 'dec:trellis') {
                    this.state_set_keep(bottom_block, { 'dec:is_top': true });
                }
            }
            else if (block_before_id in multiple_blocks) {
                let block_test_below = e.block.location.y - e.brokenBlockPermutation.getAllStates()['dec:location'];
                let loc = 0;
                let block_test = e.block.dimension.getBlock(new Vector3(e.block.location.x, block_test_below, e.block.location.z));
                let repeat_times = multiple_blocks[block_before_id]['height'] + 1;
                while (repeat_times > 0) {
                    if (block_test.typeId == block_before_id && block_test.permutation.getAllStates()['dec:location'] == loc) {
                        block_test.transTo('minecraft:air');
                    }
                    block_test = e.block.dimension.getBlock(new Vector3(e.block.location.x, block_test.location.y + 1, e.block.location.z));
                    loc += 1;
                    repeat_times -= 1;
                }
            }
        });
        this.getEvents().events.beforePlayerBreakBlock.subscribe(e => {
            const entity = ExPlayer.getInstance(e.player);
            //防破坏方块 i_inviolable计分板控制
            if (entity.getScoresManager().getScore(this.i_inviolable) > 1) {
                let ep = ExPlayer.getInstance(e.player);
                this.run(() => {
                    // ep.addEffect(MinecraftEffectTypes.Blindness, 200, 0, true);
                    // ep.addEffect(MinecraftEffectTypes.Darkness, 400, 0, true);
                    // ep.addEffect(MinecraftEffectTypes.Wither, 100, 0, true);
                    ep.addEffect(MinecraftEffectTypes.MiningFatigue, 600, 2, true);
                    // ep.addEffect(MinecraftEffectTypes.Hunger, 600, 1, true);
                    // ep.addEffect(MinecraftEffectTypes.Nausea, 200, 0, true);
                    // entity.command.runAsync("tellraw @s { \"rawtext\" : [ { \"translate\" : \"text.dec:i_inviolable.name\" } ] }");
                });
                e.cancel = true;
            }
            ;
        });
        this.getEvents().events.beforeExplosion.subscribe(e => {
            if (e.source) {
                //防爆 i_inviolable计分板控制 和 boss领地默认保护
                const entity = ExEntity.getInstance(e.source);
                //防爆 i_inviolable计分板控制
                if (entity.getScoresManager().getScore(this.i_damp) > 0 || DecBossBarrier.find(e.source.location)) {
                    const s = e.source.location;
                    const dim = entity.dimension;
                    this.run(() => dim.spawnParticle("dec:damp_explosion_particle", s));
                    ;
                    e.cancel = true;
                }
            }
        });
        const block_exceptx = new Set(['minecraft:enchanting_table', 'minecraft:barrel', 'minecraft:grindstone', 'minecraft:brewing_stand',
            'minecraft:crafting_table', 'minecraft:smithing_table', 'minecraft:cartography_table', 'minecraft:lectern', 'minecraft:cauldron', 'minecraft:composter',
            'minecraft:acacia_door', 'minecraft:acacia_trapdoor', 'minecraft:bamboo_door', 'minecraft:bamboo_trapdoor', 'minecraft:birch_door', 'minecraft:birch_trapdoor',
            'minecraft:cherry_door', 'minecraft:cherry_trapdoor', 'minecraft:crimson_door', 'minecraft:crimson_trapdoor', 'minecraft:dark_oak_door', 'minecraft:dark_oak_trapdoor',
            'minecraft:jungle_door', 'minecraft:jungle_trapdoor', 'minecraft:mangrove_door', 'minecraft:mangrove_trapdoor', 'minecraft:spruce_door', 'minecraft:spruce_trapdoor',
            'minecraft:warped_door', 'minecraft:warped_trapdoor', 'minecraft:trapdoor', 'minecraft:wooden_door', 'minecraft:smoker', 'minecraft:blast_furnace', 'minecraft:furnace']);
        let item_except = new Set(['dec:iron_key', 'dec:frozen_power', 'dec:ash_key', 'dec:challenge_of_ash', 'dec:ice_ingot']);
        const block_except = new Set(['minecraft:chest', 'minecraft:anvil', 'minecraft:black_shulker_box', 'minecraft:blue_shulker_box',
            'minecraft:brown_shulker_box', 'minecraft:cyan_shulker_box', 'minecraft:gray_shulker_box', 'minecraft:green_shulker_box', 'minecraft:light_blue_shulker_box',
            'minecraft:light_gray_shulker_box', 'minecraft:lime_shulker_box', 'minecraft:magenta_shulker_box', 'minecraft:orange_shulker_box', 'minecraft:pink_shulker_box',
            'minecraft:purple_shulker_box', 'minecraft:red_shulker_box', 'minecraft:undyed_shulker_box', 'minecraft:white_shulker_box', 'minecraft:yellow_shulker_box',
            'minecraft:ender_chest', 'minecraft:trapped_chest'].concat(Array.from(block_exceptx.values())));
        this.getEvents().events.beforePlayerInteractWithBlock.subscribe(e => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            const entity = ExEntity.getInstance(e.player);
            //防放方块
            if (entity.getScoresManager().getScore(this.i_soft) > 0) {
                if (e.player.isSneaking) {
                    e.cancel = true;
                }
                else {
                    if ((block_except.has(e.block.typeId) || item_except.has((_b = (_a = e.itemStack) === null || _a === void 0 ? void 0 : _a.typeId) !== null && _b !== void 0 ? _b : "")) == false) {
                        e.cancel = true;
                    }
                }
            }
            else if (entity.getScoresManager().getScore(this.i_softx) > 0) {
                if (e.player.isSneaking) {
                    e.cancel = true;
                }
                else {
                    if ((block_exceptx.has(e.block.typeId) || item_except.has((_d = (_c = e.itemStack) === null || _c === void 0 ? void 0 : _c.typeId) !== null && _d !== void 0 ? _d : "")) == false) {
                        e.cancel = true;
                    }
                }
            }
            else if (((_f = (_e = e.itemStack) === null || _e === void 0 ? void 0 : _e.typeId) !== null && _f !== void 0 ? _f : "") in multiple_blocks_items && place_block_wait_tick <= 0) {
                let b = e.block;
                place_block_wait_tick = 2;
                //e.source.playAnimation('')
                b.dimension.runCommandAsync('playsound use.stone @a ' + String(e.block.location.x) + ' ' + String(e.block.location.y) + ' ' + String(e.block.location.z));
                if (e.blockFace == Direction.East) {
                    b = e.block.dimension.getBlock(new Vector3(b.location.x + 1, b.location.y, b.location.z));
                }
                else if (e.blockFace == Direction.West) {
                    b = e.block.dimension.getBlock(new Vector3(b.location.x - 1, b.location.y, b.location.z));
                }
                else if (e.blockFace == Direction.North) {
                    b = e.block.dimension.getBlock(new Vector3(b.location.x, b.location.y, b.location.z - 1));
                }
                else if (e.blockFace == Direction.South) {
                    b = e.block.dimension.getBlock(new Vector3(b.location.x, b.location.y, b.location.z + 1));
                }
                else if (e.blockFace == Direction.Up) {
                    b = e.block.dimension.getBlock(new Vector3(b.location.x, b.location.y + 1, b.location.z));
                }
                if (e.blockFace != Direction.Down) {
                    let repeat_times = multiple_blocks[multiple_blocks_items[(_h = (_g = e.itemStack) === null || _g === void 0 ? void 0 : _g.typeId) !== null && _h !== void 0 ? _h : ""]]['height'] + 1;
                    let repeat_times_jud = repeat_times;
                    let place_admit = true;
                    let test_block = b;
                    while (repeat_times_jud > 0) {
                        if (!test_block.isAir) {
                            place_admit = false;
                            break;
                        }
                        else {
                            test_block = test_block.dimension.getBlock(new Vector3(test_block.location.x, test_block.location.y + 1, test_block.location.z));
                            repeat_times_jud -= 1;
                        }
                    }
                    test_block = b;
                    let loc = 0;
                    if (place_admit) {
                        while (repeat_times > 0) {
                            let states_str = '';
                            if ((_l = multiple_blocks[multiple_blocks_items[(_k = (_j = e.itemStack) === null || _j === void 0 ? void 0 : _j.typeId) !== null && _k !== void 0 ? _k : ""]]) === null || _l === void 0 ? void 0 : _l['facing']) {
                                states_str = ' ["dec:location"=' + String(loc) + ',"dec:facing"="' + get_direction_str(e.player) + '"]';
                            }
                            else {
                                states_str = ' ["dec:location"=' + String(loc) + ']';
                            }
                            test_block.dimension.runCommandAsync('setblock ' + String(test_block.location.x) + ' ' + String(test_block.location.y) + ' ' + String(test_block.location.z) + ' ' + multiple_blocks_items[(_o = (_m = e.itemStack) === null || _m === void 0 ? void 0 : _m.typeId) !== null && _o !== void 0 ? _o : ""] + states_str);
                            test_block = test_block.dimension.getBlock(new Vector3(test_block.location.x, test_block.location.y + 1, test_block.location.z));
                            loc += 1;
                            repeat_times -= 1;
                        }
                        let p = ExPlayer.getInstance(e.player);
                        if (p.gamemode == GameMode.Survival || p.gamemode == GameMode.Adventure) {
                            p.getBag().clearItem((_q = (_p = e.itemStack) === null || _p === void 0 ? void 0 : _p.typeId) !== null && _q !== void 0 ? _q : "", 1);
                        }
                    }
                }
            }
        });
        const get_direction_str = (p) => {
            let r = p.getRotation().y;
            if (-45 < r && r <= 45) {
                return 'south';
            }
            else if (45 < r && r <= 135) {
                return 'west';
            }
            else if (-135 < r && r <= -45) {
                return 'east';
            }
            else {
                return 'north';
            }
        };
        this.getEvents().events.afterPlayerPlaceBlock.subscribe(e => {
            const block = e.block;
            //种植架
            if (e.block.typeId == 'dec:trellis') {
                this.state_set_keep(block, { 'dec:is_top': true });
                const bottom_block = block.dimension.getBlock(new Vector3(block.location.x, block.location.y - 1, block.location.z));
                if (bottom_block.typeId == 'minecraft:farmland') {
                    this.state_set_keep(block, { 'dec:is_bottom': true });
                }
                else if (bottom_block.typeId == 'dec:trellis') {
                    this.state_set_keep(block, { 'dec:is_bottom': false });
                    this.state_set_keep(bottom_block, { 'dec:is_top': false });
                }
            }
        });
        this.getEvents().events.afterProjectileHitEntity.subscribe(e => {
            if (e.projectile.isValid && ignorn(() => { var _a; return (_a = e.projectile.getComponent('type_family')) === null || _a === void 0 ? void 0 : _a.hasTypeFamily('remove_on_hit'); })) {
                e.projectile.remove();
            }
        });
        this.getEvents().events.afterProjectileHitBlock.subscribe(e => {
            if (e.projectile.isValid && ignorn(() => { var _a, _b; return ((_a = e.projectile.getComponent('type_family')) === null || _a === void 0 ? void 0 : _a.hasTypeFamily('remove_on_hit')) || ((_b = e.projectile.getComponent('type_family')) === null || _b === void 0 ? void 0 : _b.hasTypeFamily('remove_on_hit_ground')); })) {
                e.projectile.remove();
            }
        });
        this.getEvents().exEvents.tick.subscribe(e => {
            //诅咒时间减少
            this.getExDimension(MinecraftDimensionTypes.Overworld).command.runAsync([
                "scoreboard players remove @e[scores={i_inviolable=1..}] i_inviolable 1",
                "scoreboard players remove @e[scores={i_damp=1..}] i_damp 1",
                "scoreboard players remove @e[scores={i_soft=1..}] i_soft 1",
                "scoreboard players remove @e[scores={i_heavy=1..}] i_heavy 1",
                //由于隔壁太耗时间，所以迁移过来了
                "execute as @e[scores={i_heavy=1..}] at @s run tag @e[r=10,type=ender_pearl] add no_ender_pearl",
                "scoreboard players remove @e[scores={harmless=1..}] harmless 1"
            ]);
        });
        this.getEvents().exEvents.onLongTick.subscribe(e => {
            //死亡模式
            if (world.getDynamicProperty('DieMode')) {
                world.gameRules.sendCommandFeedback = false;
                world.gameRules.keepInventory = false;
                world.getDimension('overworld').runCommandAsync('difficulty hard');
                world.getAllPlayers().forEach(p => {
                    if (p.getDynamicProperty('AlreadyDie')) {
                        p.setGameMode(GameMode.Spectator);
                        ExPlayer.getInstance(p).titleActionBar('{ "rawtext" : [ { "translate" : "text.dec:diemode_spectator.name" } ] }');
                    }
                    else if (p.getDynamicProperty('GmCheat')) {
                        p.setGameMode(GameMode.Spectator);
                        ExPlayer.getInstance(p).titleActionBar('{ "rawtext" : [ { "translate" : "text.dec:diemode_spectator_gmcheat.name" } ] }');
                    }
                });
            }
            //Dec魔法显示
            if (DecGlobal.isDec() && this.globalscores.getNumber('MagicDisplay') === 1) {
                try {
                    world.scoreboard.removeObjective('magicdisplay');
                    let magic_display = world.scoreboard.addObjective('magicdisplay', '§bMagicPoint§r');
                    world.getAllPlayers().forEach(p => {
                        magic_display.setScore(p, world.scoreboard.getObjective('magicpoint').getScore(p));
                    });
                    let dec_magic_display = {
                        objective: magic_display
                    };
                    world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, dec_magic_display);
                }
                catch (error) {
                }
            }
            if (place_block_wait_tick > 0) {
                place_block_wait_tick -= 1;
            }
            let night_event = this.globalscores.getNumber("NightRandom");
            const nightEvent = (fog, eventEntity, maxSpawn) => {
                this.getExDimension(MinecraftDimensionTypes.Overworld).command.runAsync(['fog @a[tag=dOverworld] push ' + fog + ' "night_event"']);
                let i = 0;
                for (let p of this.getExDimension(MinecraftDimensionTypes.Overworld).getPlayers()) {
                    if (i >= maxSpawn)
                        break;
                    this.getExDimension(MinecraftDimensionTypes.Overworld).spawnEntity(eventEntity, p.location);
                    i += 1;
                }
            };
            if (e.currentTick % 80 === 0) {
                switch (night_event) {
                    case 1:
                        //尸潮
                        nightEvent('dec:event_zombie_wave', 'dec:event_zombie_wave', 6);
                        break;
                    case 2:
                        //骷髅夜
                        nightEvent('dec:event_skeleton_wave', 'dec:event_skeleton_wave', 6);
                        break;
                    case 3:
                        //暗影之夜
                        nightEvent('dec:event_shadow_night', 'dec:event_shadow_night', 3);
                        break;
                    case 5:
                        //万圣夜
                        nightEvent('dec:event_halloween', 'dec:event_halloween', 7);
                        break;
                    case 6:
                        //寂静之夜
                        nightEvent('dec:event_silent_night', 'dec:event_silent_night', 2);
                        break;
                }
            }
            if (e.currentTick % 40 === 0) {
                switch (night_event) {
                    case 4:
                        //寒潮
                        nightEvent('dec:event_cold_wave', 'dec:event_cold_wave', 7);
                        break;
                }
            }
            if (e.currentTick % 20 === 0) {
                //夜晚事件
                this.nightEventListener.upDate(new ExEnvironment().isNight());
            }
        });
        //实体监听器，用于播放bgm、完成任务判断
        this.addEntityController("dec:leaves_golem", DecLeavesGolemBoss);
        this.addEntityController("dec:king_of_pillager", DecCommonBossLastStage);
        this.addEntityController("dec:abyssal_controller", DecCommonBossLastStage);
        this.addEntityController("dec:predators", DecCommonBossLastStage);
        this.addEntityController("dec:enchant_illager", DecBossController);
        this.addEntityController("dec:enchant_illager_1", DecBossController);
        this.addEntityController("dec:enchant_illager_2", DecCommonBossLastStage);
        this.addEntityController("dec:escaped_soul", DecBossController);
        this.addEntityController("dec:escaped_soul_1", DecEscapeSoulBoss3);
        this.addEntityController("dec:escaped_soul_2", DecEscapeSoulBoss4);
        this.addEntityController("dec:escaped_soul_entity", DecEscapeSoulBoss5);
        this.addEntityController("dec:host_of_deep", DecHostOfDeepBoss1);
        this.addEntityController("dec:host_of_deep_1", DecHostOfDeepBoss2);
        this.addEntityController("dec:host_of_deep_2", DecHostOfDeepBoss3);
        this.addEntityController("dec:ash_knight", DecCommonBossLastStage);
        this.addEntityController("dec:everlasting_winter_ghast", DecEverlastingWinterGhastBoss1);
        this.addEntityController("dec:everlasting_winter_ghast_1", DecEverlastingWinterGhastBoss2);
        this.addEntityController("dec:nuke", DecNukeController);
        //植物
        ExGame.scriptEventReceive.addMonitor(e => {
            var _a;
            if (e.id == 'dec:trellis') {
            }
            else if (e.id == 'dec:sprint') {
                let power = Number(e.message);
                let p = e.sourceEntity;
                let r = p.getViewDirection();
                let rl = Math.pow((Math.pow(r.x, 2) + Math.pow(r.z, 2)), 0.5) + 0.000001;
                let rx = r.x / rl;
                let rz = r.z / rl;
                // world.getDimension('overworld').runCommand(`say ${r.x} ${r.z} ${rx} ${rz} ${rl}`)
                if (p.typeId == "minecraft:player") {
                    p.applyKnockback({ x: rx * power, z: rz * power }, 0);
                }
                else {
                    p.applyImpulse({ x: rx * power, y: 0, z: rz * power });
                }
            }
            else if (e.id == 'dec:sustain_particle') {
                //格式：粒子id;重复生成次数;生成间隔刻
                let para_arr = message_split(e.message);
                let dim = script_event_location(e)[0];
                let i = 0;
                while (i < Number(para_arr[1])) {
                    system.runTimeout(() => {
                        try {
                            let loc = script_event_location(e)[1];
                            dim.spawnParticle(para_arr[0].toString(), loc);
                        }
                        catch (_a) {
                            return;
                        }
                    }, i * Number(para_arr[2]));
                    i++;
                }
            }
            else if (e.id == 'dec:sustain_damage') {
                //格式：伤害类型;伤害大小;重复判断次数;判断间隔刻;排除tag
                let para_arr = message_split(e.message);
                let dim = script_event_location(e)[0];
                let damage_type = EntityDamageCause[para_arr[0].toString()];
                const damage_option = {
                    cause: damage_type,
                    damagingEntity: e.sourceEntity
                };
                let i = 0;
                (_a = e.sourceEntity) === null || _a === void 0 ? void 0 : _a.addTag(para_arr[4].toString());
                while (i < Number(para_arr[2])) {
                    system.runTimeout(() => {
                        try {
                            let loc = script_event_location(e)[1];
                            const attackable_entity_option = {
                                location: loc,
                                maxDistance: 2,
                                excludeTypes: ['minecraft:item', 'minecraft:painting', 'minecraft:armor_stand'],
                                excludeTags: [para_arr[4].toString()]
                            };
                            dim.getEntities(attackable_entity_option).forEach(ent => {
                                ent.applyDamage(Number(para_arr[1]), damage_option);
                            });
                        }
                        catch (e) {
                            return;
                        }
                    }, i * Number(para_arr[3]));
                    i++;
                }
                system.runTimeout(() => {
                    var _a;
                    (_a = e.sourceEntity) === null || _a === void 0 ? void 0 : _a.removeTag(para_arr[4].toString());
                }, Number(para_arr[2]) * Number(para_arr[3]));
            }
            else if (e.id == 'dec:everlasting_winter_ghast') {
                let entity = e.sourceEntity;
                if (e.message == 'blizzard') {
                    this.everlastingWinterGhastBlizzard(entity);
                }
            }
        });
        const script_event_location = (source) => {
            var _a, _b, _c, _d;
            let loc;
            let dim = world.getDimension('overworld');
            if (source.sourceType == ScriptEventSource.Block) {
                loc = (_a = source.sourceBlock) === null || _a === void 0 ? void 0 : _a.location;
                dim = (_b = source.sourceBlock) === null || _b === void 0 ? void 0 : _b.dimension;
            }
            else {
                loc = (_c = source.sourceEntity) === null || _c === void 0 ? void 0 : _c.location;
                dim = (_d = source.sourceEntity) === null || _d === void 0 ? void 0 : _d.dimension;
            }
            return [dim, loc];
        };
        const message_split = (message) => {
            let arr = new Array();
            let cache = '';
            for (let m of message) {
                if (m == ';') {
                    arr.push(cache);
                    cache = '';
                }
                else {
                    cache += m;
                }
            }
            arr.push(cache);
            return arr;
        };
    }
    trellis(eblock, emessage) {
        const trellis_cover_wither_spread = (block) => {
            if (block.typeId == 'dec:trellis_cover' && block.permutation.getAllStates()['dec:crop_type'] != 'empty') {
                this.state_set_keep(block, { 'dec:may_wither': true });
            }
        };
        const block_around_judge = (arr, block, targetId, stateMatchMap) => {
            if (block.typeId == targetId) {
                if (stateMatchMap) {
                    let states = block.permutation.getAllStates();
                    for (let k in stateMatchMap) {
                        if (states[k] !== stateMatchMap[k])
                            return;
                    }
                }
                arr.push(block);
            }
        };
        //种植架
        const block = eblock;
        const tmpV = new Vector3();
        const block_above = block.dimension.getBlock(tmpV.set(block.location.x, block.location.y + 1, block.location.z));
        const block_xp = block.dimension.getBlock(tmpV.set(block.location.x + 1, block.location.y, block.location.z));
        const block_xn = block.dimension.getBlock(tmpV.set(block.location.x - 1, block.location.y, block.location.z));
        const block_zp = block.dimension.getBlock(tmpV.set(block.location.x, block.location.y, block.location.z + 1));
        const block_zn = block.dimension.getBlock(tmpV.set(block.location.x, block.location.y, block.location.z - 1));
        if ((block_above === null || block_above === void 0 ? void 0 : block_above.typeId) == 'dec:trellis' && emessage == 'wither') {
            let block_above_n = block_above;
            while (block_above_n.typeId == 'dec:trellis') {
                this.state_set_keep(block_above_n, { 'dec:may_wither': true });
                block_above_n = block.dimension.getBlock(tmpV.set(block_above_n.location.x, block_above_n.location.y + 1, block_above_n.location.z));
            }
        }
        if (emessage == 'grow_spread') {
            let may_grow_block = [];
            block_around_judge(may_grow_block, block_xp, 'dec:trellis_cover', { 'dec:crop_type': 'empty' });
            block_around_judge(may_grow_block, block_xn, 'dec:trellis_cover', { 'dec:crop_type': 'empty' });
            block_around_judge(may_grow_block, block_zp, 'dec:trellis_cover', { 'dec:crop_type': 'empty' });
            block_around_judge(may_grow_block, block_zn, 'dec:trellis_cover', { 'dec:crop_type': 'empty' });
            block_around_judge(may_grow_block, block_above, 'dec:trellis', { 'dec:crop_type': 'empty' });
            if (may_grow_block.length > 0) {
                this.state_set_keep(may_grow_block[MathUtil.randomInteger(0, may_grow_block.length - 1)], { 'dec:may_wither': false, 'dec:growth_stage': 0, 'dec:crop_type': block.permutation.getState('dec:crop_type') });
            }
        }
        if (emessage == 'wither_spread') {
            trellis_cover_wither_spread(block_xp);
            trellis_cover_wither_spread(block_xn);
            trellis_cover_wither_spread(block_zp);
            trellis_cover_wither_spread(block_zn);
        }
    }
    fleshBlockSpread(block) {
        const dim = block.dimension;
        const loc = new Vector3(block.location);
        let blocks = [
            dim.getBlock(loc.cpy().add(1, 0, 0)),
            dim.getBlock(loc.cpy().add(-1, 0, 0)),
            dim.getBlock(loc.cpy().add(0, 1, 0)),
            dim.getBlock(loc.cpy().add(0, -1, 0)),
            dim.getBlock(loc.cpy().add(0, 0, 1)),
            dim.getBlock(loc.cpy().add(0, 0, -1))
        ];
        let age_ori = block.permutation.getState('dec:age');
        if (age_ori == 15) {
            //这里写死亡
            block.setType('minecraft:air'); //后面改成死亡的方块
        }
        let can_grow_on = [
            'minecraft:air',
            'minecraft:water',
            'minecraft:flowing_water',
            'minecraft:grass',
            'minecraft:tall_grass'
        ];
        blocks = blocks.filter(b => { var _a; return can_grow_on.includes((_a = b === null || b === void 0 ? void 0 : b.typeId) !== null && _a !== void 0 ? _a : ''); });
        if (blocks) {
            let b = blocks[Math.floor(Math.random() * blocks.length)];
            // 以后这可以写长其他东西
            if (!b || b.typeId != 'minecraft:air')
                return;
            b.setType('dec:flesh_block');
            this.state_set_keep(b, { 'dec:age': age_ori + 1 });
        }
    }
    everlastingWinterGhastBlizzardExe(entity, skill_num) {
        return __awaiter(this, void 0, void 0, function* () {
            // entity.runCommand('say skill_num: ' + skill_num)
            // 使用 try-catch 包装整个函数
            try {
                // 检查实体是否仍然有效
                if (!entity || !entity.isValid) {
                    return false;
                }
                const ex_ent = ExEntity.getInstance(entity);
                const blizzardEq = {
                    maxDistance: 64,
                    location: entity.location,
                    type: 'dec:everlasting_winter_shadow'
                };
                if (skill_num > 0) {
                    let ents = entity.dimension.getEntities(blizzardEq);
                    if (ents.length > 0) {
                        let ent = ents[MathUtil.randomInteger(0, ents.length - 1)];
                        // 检查实体是否有效后再触发事件
                        if (ent && ent.isValid) {
                            try {
                                // entity.runCommand('say teleport')
                                ent.triggerEvent('minecraft:teleport_boss');
                            }
                            catch (e) {
                                // entity.runCommand('say teleport fail: error')
                                // 忽略触发事件时的错误
                            }
                        }
                        else {
                            // entity.runCommand('say teleport fail: ent is not valid')
                        }
                    }
                    else {
                        // entity.runCommand('say teleport fail: no ent')
                        return false;
                    }
                }
                // 获取附近玩家的函数
                let getNearbyPlayers = (max_dis) => {
                    try {
                        if (!entity || !entity.isValid)
                            return [];
                        return entity.dimension.getEntities({
                            excludeGameModes: [GameMode.Creative, GameMode.Spectator],
                            type: 'minecraft:player',
                            maxDistance: max_dis,
                            location: entity.location
                        }) || [];
                    }
                    catch (error) {
                        return [];
                    }
                };
                // 检查实体是否仍然有效
                if (!entity.isValid) {
                    // entity.runCommand('say entity no valid')
                    return false;
                }
                ;
                let ps = getNearbyPlayers(64);
                if (!ps || !ps[0] || !ps[0].isValid) {
                    // entity.runCommand('say no player, num:' + ps.length)
                    return false;
                }
                ;
                const max_tick = 110;
                const sleep_tick = Math.max(5 - skill_num, 1); // 确保至少为1
                const rad_1 = Math.min(3 + skill_num * 0.5, 6);
                const rad_2 = Math.min(5 + skill_num * 1, 8);
                try {
                    ex_ent.faceLocation(new Vector3(ps[0].location));
                    entity.playAnimation('animation.everlasting_winter_ghast.float');
                    entity.addEffect(MinecraftEffectTypes.Levitation, max_tick + 20, { showParticles: false });
                }
                catch (e) {
                    // 忽略设置动画和效果时的错误
                    // entity.runCommand('say error')
                    return false;
                }
                let view = entity.getViewDirection();
                let mat = ExEntityQuery.getFacingMatrix(view);
                let horizon_base = new Vector3(1, 0, 0);
                mat.cpy().rmulVector(horizon_base).normalize();
                let vertical_base = new Vector3(0, 1, 0);
                mat.cpy().rmulVector(vertical_base).normalize();
                for (let i = 0; i < max_tick; i += sleep_tick) {
                    // 在每次循环开始时检查实体是否仍然有效
                    if (!entity.isValid) {
                        break;
                    }
                    let near_ps = getNearbyPlayers(64);
                    if (!near_ps || !near_ps[0]) {
                        break;
                    }
                    // 检查玩家实体是否有效
                    let validPlayers = near_ps.filter(p => p && p.isValid);
                    if (!validPlayers || !validPlayers[0]) {
                        break;
                    }
                    // 确保不会访问无效索引
                    let selectedIndex = MathUtil.randomInteger(0, validPlayers.length - 1);
                    if (selectedIndex >= validPlayers.length) {
                        break;
                    }
                    let end_loc = new Vector3(validPlayers[selectedIndex].location).add(0, 1, 0);
                    // 内圈
                    let start_loc_1 = new Vector3(entity.location);
                    start_loc_1.add(horizon_base.cpy().scl(rad_1 * Math.cos(i * 13 / 180 * Math.PI)));
                    start_loc_1.add(vertical_base.cpy().scl(rad_1 * Math.sin(i * 13 / 180 * Math.PI)));
                    start_loc_1.add(0, 1, 0);
                    let shoot_v_1 = end_loc.cpy().sub(start_loc_1).normalize();
                    // 检查实体是否仍然有效后再发射弹射物
                    if (!entity.isValid)
                        break;
                    try {
                        ex_ent.shootProj('dec:blizzard_energy', {
                            speed: Math.min(0.05 + skill_num * 0.01, 0.08),
                            airInertia: Math.min(1.1 + skill_num * 0.05, 1.5),
                        }, shoot_v_1, start_loc_1);
                    }
                    catch (e) {
                        // 忽略发射弹射物时的错误
                    }
                    // 外圈
                    let start_loc_2 = new Vector3(entity.location);
                    start_loc_2.add(horizon_base.cpy().scl(rad_2 * Math.cos(-i * 30 / 180 * Math.PI)));
                    start_loc_2.add(vertical_base.cpy().scl(rad_2 * Math.sin(-i * 30 / 180 * Math.PI)));
                    start_loc_2.add(0, 1, 0);
                    let shoot_v_2 = end_loc.cpy().sub(start_loc_2).normalize();
                    // 检查实体是否仍然有效后再发射弹射物
                    if (!entity.isValid)
                        break;
                    try {
                        ex_ent.shootProj('dec:blizzard_energy', {
                            speed: Math.min(0.04 + skill_num * 0.01, 0.07),
                            airInertia: Math.min(1.1 + skill_num * 0.05, 1.4),
                            uncertainty: 20
                        }, shoot_v_2, start_loc_2);
                    }
                    catch (e) {
                        // 忽略发射弹射物时的错误
                    }
                    // 在等待前检查实体是否仍然有效
                    if (!entity.isValid)
                        break;
                    // 使用 try-catch 包装 sleep 操作
                    try {
                        yield this.sleepByTick(sleep_tick);
                    }
                    catch (e) {
                        // 如果 sleep 被中断，直接退出循环
                        break;
                    }
                }
            }
            catch (error) {
                // 捕获并静默处理所有错误，避免 Promise rejection
                // 这样可以防止 "Unhandled promise rejection" 错误
            }
            return true;
        });
    }
    everlastingWinterGhastBlizzard(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let skill_num = 0;
            let blizzardEq = {
                maxDistance: 64,
                location: entity.location,
                type: 'dec:everlasting_winter_shadow'
            };
            // 使用 try-catch 包装整个函数
            try {
                while (entity && entity.isValid && entity.dimension.getEntities(blizzardEq).length > 0) {
                    try {
                        let if_coutinue = yield this.everlastingWinterGhastBlizzardExe(entity, skill_num);
                        if (!if_coutinue)
                            break;
                        skill_num += 1;
                        blizzardEq.location = entity.location;
                        // 在循环中检查实体是否仍然有效
                        if (!entity.isValid) {
                            break;
                        }
                    }
                    catch (e) {
                        // 如果单次执行出错，继续下一次循环
                        // entity.runCommand('say while内出错：' + e)
                        continue;
                    }
                }
                // 只有在实体仍然有效时才触发结束事件
                if (entity && entity.isValid) {
                    try {
                        entity.triggerEvent('minecraft:blizzard_mode_end');
                    }
                    catch (e) {
                        // 忽略触发事件时的错误
                    }
                }
            }
            catch (error) {
                // 静默处理顶层错误
            }
        });
    }
    newClient(id, player) {
        return new DecClient(this, id, player);
    }
}
__decorate([
    receiveMessage('dec:trellis'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Block, String]),
    __metadata("design:returntype", void 0)
], DecServer.prototype, "trellis", null);
__decorate([
    receiveMessage('dec:flesh_block_spread'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Block]),
    __metadata("design:returntype", void 0)
], DecServer.prototype, "fleshBlockSpread", null);
//# sourceMappingURL=DecServer.js.map