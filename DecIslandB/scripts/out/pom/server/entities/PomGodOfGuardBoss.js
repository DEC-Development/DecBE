var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EntityHurtAfterEvent, MolangVariableMap, EntityDamageCause, Player, GameMode } from '@minecraft/server';
import { registerEvent } from '../../../modules/exmc/server/events/eventDecoratorFactory.js';
import { ExOtherEventNames } from '../../../modules/exmc/server/events/events.js';
import { ignorn } from '../../../modules/exmc/server/ExErrorQueue.js';
import Vector3 from '../../../modules/exmc/utils/math/Vector3.js';
import KDTree, { KDPoint } from '../../../modules/exmc/utils/tree/KDTree.js';
import PomBossController from './PomBossController.js';
import UUID from '../../../modules/exmc/utils/UUID.js';
import ExSystem from '../../../modules/exmc/utils/ExSystem.js';
import Random from '../../../modules/exmc/utils/Random.js';
import MathUtil from '../../../modules/exmc/utils/math/MathUtil.js';
import { undefIfError } from '../../../modules/exmc/utils/tool.js';
import ExEntityController from '../../../modules/exmc/server/entity/ExEntityController.js';
import ExEntityQuery from '../../../modules/exmc/server/env/ExEntityQuery.js';
import Vector2 from '../../../modules/exmc/utils/math/Vector2.js';
import Matrix4 from '../../../modules/exmc/utils/math/Matrix4.js';
import { ExBlockArea } from '../../../modules/exmc/server/block/ExBlockArea.js';
export class PomGodOfGuardBossState {
    constructor(centers, ctrl, defDamage, arg) {
        this.centers = centers;
        this.ctrl = ctrl;
        this.defDamage = defDamage;
    }
    onEnter() {
    }
    onTick(e) {
        return false;
    }
    onExit() {
    }
}
export class PomGodOfGuardBossStateWarn extends PomGodOfGuardBossState {
    constructor(centers, ctrl, defDamage, target) {
        super(centers, ctrl, defDamage);
        this.target = target;
        this.tickNum = 0;
        this.tmpV = new Vector3();
    }
    onEnter() {
        this.pos = this.ctrl.entity.location;
        this.center1 = this.centers.addCenter(this.pos);
    }
    onTick(e) {
        if (this.tickNum++ > 100) {
            return true;
        }
        if (this.tickNum % 10 === 0) {
            let p = new Vector3(this.target.location).sub(this.pos);
            for (let i = -4; i <= 4; i += 2) {
                for (let j = -4; j <= 4; j += 2) {
                    for (let k = -4; k <= 4; k += 2) {
                        this.center1.add(40, this.tmpV.set(p).add(i, j, k), 2 * 1000, this.defDamage, "5", EntityDamageCause.void);
                    }
                }
            }
        }
        return false;
    }
    onExit() {
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
        }).delay(2 * 20).startOnce();
    }
}
//单中心攻击
//星图
export class PomGodOfGuardBossState1 extends PomGodOfGuardBossState {
    constructor() {
        super(...arguments);
        this.tickNum = 0;
    }
    onEnter() {
        this.center1 = this.centers.addCenter(this.ctrl.entity.location);
    }
    onTick(e) {
        if (this.tickNum++ > 100) {
            return true;
        }
        let x = Math.PI * this.tickNum / 10;
        let y = Math.PI * this.tickNum / 100 + Math.random() * Math.PI * 2;
        this.center1.add(8, {
            x: Math.cos(x),
            z: Math.sin(x),
            y: 0
        }, 6 * 1000, this.defDamage);
        this.center1.add(8, {
            x: Math.cos(y),
            z: Math.sin(y),
            y: 0
        }, 6 * 1000, this.defDamage);
        this.center1.add(4, {
            x: Math.cos(x),
            z: Math.sin(x),
            y: 0
        }, 10 * 1000, this.defDamage);
        return false;
    }
    onExit() {
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
        }).delay(10 * 20).startOnce();
    }
}
//球
export class PomGodOfGuardBossState2 extends PomGodOfGuardBossState {
    constructor() {
        super(...arguments);
        this.tickNum = 0;
    }
    onEnter() {
        this.center1 = this.centers.addCenter(this.ctrl.entity.location);
    }
    onTick(e) {
        if (this.tickNum++ > 20) {
            return true;
        }
        if (this.tickNum === 10) {
            // let x = Math.PI * this.tickNum / 10;
            for (let i = 0; i < 360; i += 10) {
                for (let j = 2.5; j < 360; j += 10) {
                    this.center1.add(7, {
                        x: Math.cos(i * Math.PI / 180) * Math.sin(j * Math.PI / 180),
                        z: Math.sin(i * Math.PI / 180) * Math.sin(j * Math.PI / 180),
                        y: Math.cos(j * Math.PI / 180)
                    }, 4 * 1000, this.defDamage);
                }
            }
        }
        return false;
    }
    onExit() {
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
        }).delay(4 * 20).startOnce();
    }
}
//飘散
export class PomGodOfGuardBossState3 extends PomGodOfGuardBossState {
    constructor() {
        super(...arguments);
        this.tickNum = 0;
    }
    onEnter() {
        this.center1 = this.centers.addCenter(this.ctrl.entity.location);
    }
    onTick(e) {
        if (this.tickNum++ > 40) {
            return true;
        }
        let x = Math.PI * this.tickNum / 10;
        let y = Math.PI * this.tickNum / 100 + Math.random() * Math.PI * 2;
        this.center1.add(8, {
            x: Math.cos(x),
            z: Math.sin(x),
            y: Math.sin(5 * x)
        }, 6 * 1000, this.defDamage);
        this.center1.add(8, {
            x: Math.cos(y),
            z: Math.sin(y),
            y: 0
        }, 6 * 1000, this.defDamage);
        this.center1.add(8, {
            x: Math.sin(y),
            z: Math.cos(y),
            y: 0
        }, 6 * 1000, this.defDamage);
        return false;
    }
    onExit() {
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
        }).delay(6 * 20).startOnce();
    }
}
//方块狙击
export class PomGodOfGuardBossState4 extends PomGodOfGuardBossState {
    constructor() {
        super(...arguments);
        this.tickNum = 0;
    }
    onEnter() {
        this.center1 = this.centers.addCenter(this.ctrl.entity.location);
    }
    onTick(e) {
        if (this.tickNum++ > 20) {
            return true;
        }
        if (this.tickNum % 6 === 0) {
            let p = new Vector3(Random.choice(Array.from(this.ctrl.barrier.getPlayers())).location).sub(this.ctrl.entity.location);
            let tmpV = new Vector3();
            for (let i = -12; i <= 12; i += 4) {
                for (let j = -12; j <= 12; j += 4) {
                    for (let k = -12; k <= 12; k += 4) {
                        this.center1.add(10, tmpV.set(p).add(i, j, k), 5 * 1000, this.defDamage);
                    }
                }
            }
        }
        return false;
    }
    onExit() {
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
        }).delay(5 * 20).startOnce();
    }
}
//飘带
export class PomGodOfGuardBossState5 extends PomGodOfGuardBossState {
    constructor() {
        super(...arguments);
        this.tickNum = 0;
    }
    onEnter() {
        this.center1 = this.centers.addCenter(this.ctrl.entity.location);
    }
    onTick(e) {
        if (this.tickNum++ > 60) {
            return true;
        }
        let x = (Math.PI * 1 / 15) * (2 * e.currentTick);
        this.center1.add(2, {
            "x": Math.cos(x),
            "z": Math.sin(x),
            "y": 0
        }, 10000, this.defDamage);
        this.center1.add(5, {
            "x": Math.cos(x),
            "z": Math.sin(x),
            "y": Math.sin(x / 4 + Math.PI / 4)
        }, 8000, this.defDamage);
        this.center1.add(15, {
            "x": Math.cos(x),
            "z": Math.sin(x),
            "y": Math.sin(x / 4 + Math.PI * 2 / 4)
        }, 8000, this.defDamage);
        this.center1.add(8, {
            "x": Math.cos(x),
            "z": Math.sin(x),
            "y": Math.sin(x / 4 + Math.PI * 3 / 4)
        }, 8000, this.defDamage);
        this.center1.add(20, {
            "x": Math.cos(x),
            "z": Math.sin(x),
            "y": Math.cos(x / 2)
        }, 8000, this.defDamage);
        x = (Math.PI * 1 / 15) * (2 * e.currentTick + 1);
        this.center1.add(2, {
            "x": Math.cos(x),
            "z": Math.sin(x),
            "y": 0
        }, 10000, this.defDamage);
        this.center1.add(5, {
            "x": Math.cos(x),
            "z": Math.sin(x),
            "y": Math.sin(x / 4 + Math.PI / 4)
        }, 8000, this.defDamage);
        this.center1.add(15, {
            "x": Math.cos(x),
            "z": Math.sin(x),
            "y": Math.sin(x / 4 + Math.PI * 2 / 4)
        }, 8000, this.defDamage);
        this.center1.add(8, {
            "x": Math.cos(x),
            "z": Math.sin(x),
            "y": Math.sin(x / 4 + Math.PI * 3 / 4)
        }, 8000, this.defDamage);
        this.center1.add(20, {
            "x": Math.cos(x),
            "z": Math.sin(x),
            "y": Math.cos(x / 2)
        }, 8000, this.defDamage);
        return false;
    }
    onExit() {
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
        }).delay(10 * 20).startOnce();
    }
}
//加速旋风
export class PomGodOfGuardBossState6 extends PomGodOfGuardBossState {
    constructor() {
        super(...arguments);
        this.tickNum = 0;
    }
    onEnter() {
        this.center1 = this.centers.addCenter(this.ctrl.entity.location);
    }
    onTick(e) {
        if (this.tickNum++ > 30)
            return true;
        for (let i = 0; i < 4; i++) {
            const angle = i * Math.PI / 2 + 0.4 * this.tickNum * this.tickNum * Math.PI / 180;
            this.center1.add(20, {
                x: Math.cos(angle),
                z: Math.sin(angle),
                y: 0
            }, (3) * 1000, this.defDamage);
        }
        return false;
    }
    onExit() {
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
        }).delay(3 * 20).startOnce();
    }
}
//快速甩击
export class PomGodOfGuardBossState7 extends PomGodOfGuardBossState {
    constructor() {
        super(...arguments);
        this.tickNum = 0;
    }
    onEnter() {
        this.center1 = this.centers.addCenter(this.ctrl.entity.location);
    }
    onTick(e) {
        if (this.tickNum++ > 30)
            return true;
        for (let i = 0; i < 4; i++) {
            const angle = i * Math.PI / 2 + 0.4 * this.tickNum * this.tickNum * Math.PI / 180;
            this.center1.add(20, {
                x: Math.cos(angle),
                z: Math.sin(angle),
                y: 0
            }, (3) * 1000, this.defDamage);
        }
        return false;
    }
    onExit() {
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
        }).delay(3 * 20).startOnce();
    }
}
//浪潮
export class PomGodOfGuardBossState8 extends PomGodOfGuardBossState {
    constructor() {
        super(...arguments);
        this.tickNum = 0;
    }
    onEnter() {
        this.center1 = this.centers.addCenter(this.ctrl.entity.location);
    }
    onTick(e) {
        if (this.tickNum++ > 60)
            return true;
        const timeFactor = e.currentTick;
        for (let i = 0; i < 24; i++) {
            const angle = i * Math.PI * 2 / 24 + timeFactor;
            const radius = 10 + Math.sin(timeFactor * 0.3 + i / 3) * 5;
            this.center1.add(10, {
                x: radius * Math.cos(angle),
                z: radius * Math.sin(angle),
                y: Math.abs(Math.sin(timeFactor * 0.1 + i / 18) * 2)
            }, (i % 2 === 0 ? 3 : 6) * 1000, this.defDamage);
        }
        return false;
    }
    onExit() {
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
        }).delay(6 * 20).startOnce();
    }
}
//六爪
export class PomGodOfGuardBossState9 extends PomGodOfGuardBossState {
    constructor() {
        super(...arguments);
        this.tickNum = 0;
    }
    onEnter() {
        this.center1 = this.centers.addCenter(this.ctrl.entity.location);
    }
    onTick(e) {
        if (this.tickNum++ > 60)
            return true;
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3 + this.tickNum * Math.PI / 180;
            const hexOffset = Math.sin(this.tickNum / 30) * 2;
            const direction = {
                x: Math.cos(angle) * (1 + hexOffset),
                z: Math.sin(angle) * (1 + hexOffset),
                y: 0.4 * Math.abs(Math.sin(this.tickNum / 8))
            };
            this.center1.add(8, direction, 4000, this.defDamage);
        }
        return false;
    }
    onExit() {
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
        }).delay(10 * 20).startOnce();
    }
}
//瞬狙
export class PomGodOfGuardBossState10 extends PomGodOfGuardBossState {
    constructor() {
        super(...arguments);
        this.tickNum = 0;
        this.tmpV = new Vector3();
        this.tmpF = new Vector3();
    }
    onEnter() {
        this.center1 = this.centers.addCenter(this.ctrl.entity.location);
    }
    onTick(e) {
        if (this.tickNum++ > 10)
            return true;
        let c = this.ctrl.entity.location;
        const randomDir = () => new Vector3({ x: Math.random() * 2 - 1, z: Math.random() * 2 - 1, y: 0 }).normalize();
        const directions = [randomDir(), randomDir()];
        directions[1].y = Math.random() * 5;
        let p = new Vector3(Random.choice(Array.from(this.ctrl.barrier.getPlayers())).location);
        if (this.tickNum === 1) {
            this.tmpV.set(c).sub(p).normalize().scl(2);
            this.tmpF.set(p).add(this.tmpV).add(0, 1, 0);
            this.ctrl.entity.dimension.spawnParticle("wb:ruin_desert_boss_target_par", this.tmpF);
        }
        p.sub(c);
        this.center1.add(20, p, 3 * 1000, this.defDamage, "4");
        directions.forEach((dir, index) => {
            this.center1.add(5 + index, dir, 10000 + index * 1000, this.defDamage, "3");
        });
        return false;
    }
    onExit() {
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
        }).delay(15 * 20).startOnce();
    }
}
//双中心攻击
//干涉
export class PomGodOfGuardBossState11 extends PomGodOfGuardBossState {
    constructor() {
        super(...arguments);
        this.tickNum = 0;
        this.tmpV = new Vector3();
    }
    onEnter() {
        this.pos = new Vector3(this.ctrl.entity.location);
        this.center1 = this.centers.addCenter(this.pos);
        let c = this.ctrl.barrier.center.cpy();
        this.pos2 = this.tmpV.set(this.pos).sub(c).scl(-1).add(c).cpy();
        this.pos2.y = this.pos.y;
        this.center2 = this.centers.addCenter(this.pos2);
        this.entity2 = this.ctrl.entity.dimension.spawnEntity("wb:god_of_guard_settle", this.pos);
    }
    onTick(e) {
        if (this.tickNum++ > 80)
            return true;
        if (this.tickNum > 20) {
            for (let i = 0; i < 24; i++) {
                const angle = i * Math.PI * 2 / 24 + this.tickNum * Math.PI / 60;
                this.center1.add(10, {
                    x: Math.cos(angle),
                    z: Math.sin(angle),
                    y: Math.abs(Math.sin(angle * 3)) / 10
                }, (5) * 1000, this.defDamage);
                this.center2.add(10, {
                    x: Math.cos(angle),
                    z: Math.sin(angle),
                    y: Math.abs(Math.sin(angle * 3)) / 10
                }, (5) * 1000, this.defDamage);
            }
        }
        else {
            this.entity2.teleport(this.tmpV.set(this.pos2).sub(this.pos).scl(this.tickNum / 20).add(this.pos), {
                "keepVelocity": true
            });
        }
        return false;
    }
    onExit() {
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
            this.centers.remove(this.center2);
            this.entity2.remove();
        }).delay(5 * 20).startOnce();
    }
}
//双星狙击
export class PomGodOfGuardBossState12 extends PomGodOfGuardBossState {
    constructor() {
        super(...arguments);
        this.tickNum = 0;
        this.tmpV = new Vector3();
    }
    onEnter() {
        this.pos = new Vector3(this.ctrl.entity.location);
        this.center1 = this.centers.addCenter(this.pos);
        let c = this.ctrl.barrier.center.cpy();
        this.pos2 = new Vector3(MathUtil.randomInteger(c.x - 30, c.x + 30), this.pos.y, MathUtil.randomInteger(c.z - 30, c.z + 30));
        this.center2 = this.centers.addCenter(this.pos2);
        this.entity2 = this.ctrl.entity.dimension.spawnEntity("wb:god_of_guard_settle", this.pos);
    }
    onTick(e) {
        if (this.tickNum++ > 60)
            return true;
        if (this.tickNum > 20) {
            let p = Random.choice(Array.from(this.ctrl.barrier.getPlayers()));
            let targetV = new Vector3(p.getVelocity());
            let targetPos = new Vector3(p.location);
            targetPos.add(targetV.scl(40));
            this.tmpV.set(targetPos);
            targetPos.sub(this.pos2);
            if (this.tickNum % 10 === 0) {
                this.center2.add(targetPos.len() / 2, targetPos, 4 * 1000, this.defDamage, "4");
                try {
                    this.ctrl.entity.dimension.spawnParticle("wb:ruin_desert_boss_target_par", this.tmpV.add(0, 1, 0));
                }
                catch (e) { }
                ;
                if (this.tickNum % 15 === 0) {
                    let x = Math.PI * 2 * Math.random();
                    for (let i = 0; i < 360; i += 10) {
                        this.center1.add(15, {
                            x: Math.cos(i * Math.PI / 180),
                            z: Math.sin(i * Math.PI / 180),
                            y: 0
                        }, 4 * 1000, this.defDamage, "4");
                    }
                }
            }
        }
        else {
            this.entity2.teleport(this.tmpV.set(this.pos2).sub(this.pos).scl(this.tickNum / 20).add(this.pos), {
                "keepVelocity": true
            });
        }
        return false;
    }
    onExit() {
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
            this.centers.remove(this.center2);
            ignorn(() => this.entity2.remove());
        }).delay(4 * 20).startOnce();
    }
}
//空袭
export class PomGodOfGuardBossState13 extends PomGodOfGuardBossState {
    constructor() {
        super(...arguments);
        this.tickNum = 0;
        this.tmpV = new Vector3();
    }
    onEnter() {
        this.pos = new Vector3(this.ctrl.entity.location);
        this.center1 = this.centers.addCenter(this.pos);
        let c = this.ctrl.barrier.center.cpy();
        this.pos2 = this.tmpV.set(this.pos).sub(c).scl(-1).add(c).cpy();
        this.pos2.y = this.pos.y + 30;
        this.center2 = this.centers.addCenter(this.pos2);
        this.entity2 = this.ctrl.entity.dimension.spawnEntity("wb:god_of_guard_settle", this.pos);
    }
    onTick(e) {
        if (this.tickNum++ > 80)
            return true;
        if (this.tickNum > 20) {
            for (let i = 0; i < 18; i++) {
                const angle = i * Math.PI * 2 / 18 + this.tickNum * Math.PI / 30;
                this.center1.add(10, {
                    x: Math.cos(angle),
                    z: Math.sin(angle),
                    y: 0.02
                }, (5) * 1000, this.defDamage);
            }
            for (let i = 0; i < 4; i++) {
                const angle = i * Math.PI / 2 + this.tickNum * Math.PI / 18;
                this.center2.add(15, {
                    x: Math.cos(angle),
                    z: Math.sin(angle),
                    y: Math.random() * -2
                }, (5) * 1000, this.defDamage, "3");
            }
        }
        else {
            this.entity2.teleport(this.tmpV.set(this.pos2).sub(this.pos).scl(this.tickNum / 20).add(this.pos), {
                "keepVelocity": true
            });
        }
        return false;
    }
    onExit() {
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
            this.centers.remove(this.center2);
            ignorn(() => this.entity2.remove());
        }).delay(5 * 20).startOnce();
    }
}
// 交换浪潮
export class PomGodOfGuardBossState14 extends PomGodOfGuardBossState {
    constructor() {
        super(...arguments);
        this.tickNum = 0;
        this.tmpV = new Vector3();
    }
    onEnter() {
        this.pos = new Vector3(this.ctrl.entity.location);
        this.center1 = this.centers.addCenter(this.pos);
        let c = this.ctrl.barrier.center.cpy();
        this.pos2 = this.tmpV.set(this.pos).sub(c).scl(-1).add(c).cpy();
        this.pos2.y = this.pos.y;
        this.center2 = this.centers.addCenter(this.pos2);
        this.entity2 = this.ctrl.entity.dimension.spawnEntity("wb:god_of_guard_settle", this.pos);
    }
    onTick(e) {
        if (this.tickNum++ > 120)
            return true;
        if (this.tickNum > 20) {
            if (this.tickNum % 20 < 10) { // center1 发射弹幕
                for (let i = 0; i < 36; i++) {
                    const angle = i * Math.PI * 2 / 36 + this.tickNum * Math.PI / 60;
                    this.center1.add(10, {
                        x: Math.cos(angle),
                        z: Math.sin(angle),
                        y: Math.abs(Math.sin(angle * 3)) / 10
                    }, (3.2) * 1000, this.defDamage);
                }
            }
            else { // center2 发射弹幕
                for (let i = 0; i < 26; i++) {
                    const angle = i * Math.PI * 2 / 26 + this.tickNum * Math.PI / 60;
                    this.center2.add(15, {
                        x: Math.cos(angle),
                        z: Math.sin(angle),
                        y: Math.abs(Math.sin(angle * 3)) / 20
                    }, (2.5) * 1000, this.defDamage);
                }
            }
            if (this.tickNum % 60 === 0) { // 每隔一段时间进行联合攻击
                for (let i = 0; i < 360; i += 10) {
                    this.center1.add(10, {
                        x: Math.cos(i * Math.PI / 180),
                        z: Math.sin(i * Math.PI / 180),
                        y: 0
                    }, 3.2 * 1000, this.defDamage);
                    this.center2.add(15, {
                        x: Math.cos(i * Math.PI / 180),
                        z: Math.sin(i * Math.PI / 180),
                        y: 0
                    }, 2.5 * 1000, this.defDamage);
                }
            }
        }
        else {
            this.entity2.teleport(this.tmpV.set(this.pos2).sub(this.pos).scl(this.tickNum / 20).add(this.pos), {
                "keepVelocity": true
            });
        }
        return false;
    }
    onExit() {
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
            this.centers.remove(this.center2);
            ignorn(() => this.entity2.remove());
        }).delay(5 * 20).startOnce();
    }
}
// 多中心
//链锁屏蔽
export class PomGodOfGuardBossState15 extends PomGodOfGuardBossState {
    constructor() {
        super(...arguments);
        this.tickNum = 0;
        this.tmpV = new Vector3();
    }
    onEnter() {
        this.pos = new Vector3(this.ctrl.entity.location);
        this.center1 = this.centers.addCenter(this.pos);
        this.center2 = [];
        this.entity2 = [];
        this.dic = [];
        this.dic2 = [];
        this.pos.y += 1;
        this.pos2 = new Array(10).fill(0).map(e => {
            let c = ExBlockArea.randomPoint([this.ctrl.barrier.area]);
            c.y = this.pos.y;
            this.center2.push(this.centers.addCenter(c));
            this.entity2.push(this.ctrl.entity.dimension.spawnEntity("wb:god_of_guard_settle", this.pos));
            this.dic.push(c.cpy().sub(this.pos));
            this.dic2.push(c.cpy().sub(this.pos).scl(-1));
            return c;
        });
    }
    onTick(e) {
        if (this.tickNum++ > 100)
            return true;
        if (this.tickNum > 60) {
            for (let [i, c] of this.center2.entries()) {
                for (let i = 0; i < 4; i++) {
                    const angle = i * Math.PI / 2 + 6 * this.tickNum * Math.PI / 180;
                    c.add(4, {
                        x: Math.cos(angle),
                        z: Math.sin(angle),
                        y: 0
                    }, (3) * 1000, this.defDamage);
                }
            }
        }
        else if (this.tickNum > 20) {
            if (this.tickNum % 4 === 0) {
                for (let [i, c] of this.center2.entries()) {
                    this.center1.add(30, this.dic[i], (2) * 1000, this.defDamage, "3", EntityDamageCause.magic);
                    this.center2[i].add(30, this.dic2[i], (2) * 1000, this.defDamage, "3", EntityDamageCause.magic);
                }
            }
        }
        else {
            for (let [i, e] of this.entity2.entries()) {
                e.teleport(this.tmpV.set(this.pos2[i]).sub(this.pos).scl(this.tickNum / 20).add(this.pos), {
                    "keepVelocity": true
                });
            }
        }
        return false;
    }
    onExit() {
        ignorn(() => this.entity2.map((e) => e.remove()));
        ExSystem.tickTask(() => {
            this.centers.remove(this.center1);
            this.center2.map((e) => this.centers.remove(e));
        }).delay(3 * 20).startOnce();
    }
}
export class PomGodOfGuardBossStates {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.state = {};
        this.centers = new PomGodOfGuardShootCenters(ctrl.entity.dimension);
    }
    onTick(e) {
        var _a, _b;
        this.centers.tick(e.deltaTime, Array.from(this.ctrl.barrier.getPlayers()), this.ctrl.entity);
        for (let i in this.state) {
            if (this.state[i].onTick(e)) {
                this.state[i].onExit();
                (_b = (_a = this.state[i]).listenner) === null || _b === void 0 ? void 0 : _b.call(_a);
                delete this.state[i];
            }
        }
    }
    set(istate, damege, index = 0, arg) {
        if (this.state[index]) {
            return;
        }
        this.state[index] = (new (istate)(this.centers, this.ctrl, damege, arg));
        this.state[index].onEnter();
    }
    isAvailable(index = 0) {
        return this.state[index] ? false : true;
    }
    listenOnExit(func, index = 0) {
        this.state[index].listenner = func;
    }
}
export class PomGodOfGuardBoss0 extends PomBossController {
    constructor(e, server) {
        super(e, server);
        this.tick = 1;
        this.spawnTimer = ExSystem.tickTask(() => {
            this.entity.triggerEvent("change");
        }).delay(7.0 * 20).startOnce();
        this.health = this.entity.getComponent("minecraft:health");
        this.entity.dimension.spawnParticle("wb:god_of_guard_first_par", this.entity.location);
    }
    initBossEntity() {
        super.initBossEntity();
        if (this.isFisrtCall)
            this.server.say({ rawtext: [{ translate: "text.wb:summon_god_of_guard.name" }] });
    }
    onSpawn() {
        super.onSpawn();
    }
    onKilled(e) {
        console.warn("onWin");
        this.stopBarrier();
        super.onKilled(e);
    }
    onFail() {
        super.onFail();
    }
    onTick(e) {
        var _a;
        this.tick++;
        (_a = this.health) === null || _a === void 0 ? void 0 : _a.setCurrentValue(1000 * ((this.tick) / 120));
    }
}
PomGodOfGuardBoss0.typeId = "wb:god_of_guard_zero";
__decorate([
    registerEvent("tick"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PomGodOfGuardBoss0.prototype, "onTick", null);
export class PomGodOfGuardBoss1 extends PomBossController {
    constructor(e, server) {
        super(e, server);
        this.times = 0;
        this.states = new PomGodOfGuardBossStates(this);
        this.passive = new PomGodOfGuardBossPassive(this);
        this.timer = ExSystem.tickTask(() => {
            let normal = [
                PomGodOfGuardBossState1,
                PomGodOfGuardBossState2,
                PomGodOfGuardBossState3,
                PomGodOfGuardBossState5,
                PomGodOfGuardBossState6,
                PomGodOfGuardBossState7,
                PomGodOfGuardBossState9,
                PomGodOfGuardBossState10
                // PomGodOfGuardBossState11,
            ];
            let hard = [
                PomGodOfGuardBossState4,
                PomGodOfGuardBossState8,
                PomGodOfGuardBossState12
            ];
            if (this.states.isAvailable()) {
                let d = this.passive.getDamageWithoutConsume();
                let choice = Random.choice(normal);
                let maxTimes = 0;
                if (d < 20) {
                    maxTimes = MathUtil.randomInteger(3, 4);
                }
                else if (20 <= d && d <= 40) {
                    maxTimes = MathUtil.randomInteger(2, 3);
                }
                else if (40 <= d && d <= 60) {
                    maxTimes = MathUtil.randomInteger(1, 2);
                }
                else {
                    maxTimes = MathUtil.randomInteger(0, 1);
                }
                if (this.times >= maxTimes) {
                    choice = Random.choice(hard);
                    this.times = 0;
                }
                else {
                    this.times += 1;
                }
                this.states.set(choice, this.passive.getDamage());
                this.states.listenOnExit(() => {
                    this.entity.playAnimation("animation.god_of_guard.staff_effect", {
                        "blendOutTime": 0.2
                    });
                });
            }
            ;
            let p = this.passive.getSkipper();
            if (p) {
                if (this.states.isAvailable(-1)) {
                    this.states.set(PomGodOfGuardBossStateWarn, 15, -1, p);
                }
            }
        });
        this.spawnTimer = ExSystem.tickTask(() => {
            this.entity.dimension.createExplosion(this.entity.location, 10, {
                "breaksBlocks": false,
                "causesFire": false,
                "source": this.entity
            });
            this.entity.dimension.spawnParticle("wb:blast_par_small", new Vector3(this.entity.location).add(0, 1, 0));
            this.timer.delay(1.0 * 20);
            this.timer.start();
        }).delay(1.0 * 20).startOnce();
    }
    initBossEntity() {
        super.initBossEntity();
        if (this.isFisrtCall)
            this.server.say({ rawtext: [{ translate: "text.wb:summon_god_of_guard.name" }] });
    }
    onSpawn() {
        super.onSpawn();
    }
    onKilled(e) {
        this.passive.dispose();
        super.onKilled(e);
    }
    onFail() {
        this.passive.dispose();
        super.onFail();
    }
    onLongTick(e) {
    }
    onTick(e) {
        this.states.onTick(e);
    }
}
PomGodOfGuardBoss1.typeId = "wb:god_of_guard_first";
__decorate([
    registerEvent("onLongTick"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PomGodOfGuardBoss1.prototype, "onLongTick", null);
__decorate([
    registerEvent("tick"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PomGodOfGuardBoss1.prototype, "onTick", null);
export var PomGodOfGuard2State;
(function (PomGodOfGuard2State) {
    PomGodOfGuard2State[PomGodOfGuard2State["Melee"] = 0] = "Melee";
    PomGodOfGuard2State[PomGodOfGuard2State["Range"] = 1] = "Range";
})(PomGodOfGuard2State || (PomGodOfGuard2State = {}));
export class PomGodOfGuardShadow extends ExEntityController {
    isMeleeState() {
        return this.state === PomGodOfGuard2State.Melee;
    }
    setMeleeState() {
        this.state = PomGodOfGuard2State.Melee;
        this.entity.triggerEvent("variant" + this.state);
    }
    setRangeState() {
        this.state = PomGodOfGuard2State.Range;
        this.entity.triggerEvent("variant" + this.state);
    }
    tryStateSprint() {
        var _a, _b, _c;
        this.entity.playAnimation("animation.god_of_guard.shadow_melee_skill");
        let getSmooth = (time, timeAll, a, b) => {
            return MathUtil.clamp(a + (b - a) * (-Math.pow(((time / timeAll) - 1), 2) + 1), a, b);
        };
        let startPos = new Vector3(this.entity.location);
        let tmpV = new Vector3();
        let target = new Vector3((_b = (_a = this.entity.target) === null || _a === void 0 ? void 0 : _a.location) !== null && _b !== void 0 ? _b : Random.choice(Array.from(this.bossOri.barrier.getPlayers())).location);
        target = target.cpy().sub(startPos).normalize().scl(7).add(target).add((Math.random() - 1) * 2, 0, (Math.random() - 1) * 2);
        target.y = startPos.y;
        tmpV.set(target).sub(startPos);
        let rot = new Vector2(tmpV.rotateAngleY(), tmpV.rotateAngleX());
        let dic = new Vector3(target).sub(startPos).normalize();
        (_c = this.attackLiner) === null || _c === void 0 ? void 0 : _c.stop();
        this.attackLiner = ExSystem.timeLine({
            "0.0": (time) => {
                time.registerTick("fly", (time, pastTime) => {
                    this.entity.teleport(startPos.add(dic.scl(0.1)), {
                        facingLocation: target
                    });
                });
            },
            "1.05": (time) => {
                time.cancelTick("fly");
                time.registerTick("fly", (time, pastTime) => {
                    tmpV.set(getSmooth(pastTime, 1.75 - 1.05, startPos.x, target.x), getSmooth(pastTime, 1.75 - 1.05, startPos.y, target.y), getSmooth(pastTime, 1.75 - 1.05, startPos.z, target.z));
                    this.entity.teleport(tmpV, {
                        "facingLocation": target
                    });
                    new ExEntityQuery(this.entity.dimension).at(this.entity.location)
                        .queryBall(2)
                        .except(this.entity)
                        .except(this.bossOri.entity)
                        .forEach(e => {
                        e.applyDamage(this.damageAmount);
                    });
                });
            },
            "1.75": (time) => {
                time.cancelTick("fly");
            }
        }).start();
    }
    changeState() {
        if (this.state == PomGodOfGuard2State.Melee) {
            let num = 3;
            this.tryStateSprint();
            this.attackTimer = ExSystem.tickTask(() => {
                var _a;
                this.tryStateSprint();
                num--;
                if (num <= 0) {
                    (_a = this.attackTimer) === null || _a === void 0 ? void 0 : _a.stop();
                    this.tryMeleeAttack();
                }
            }).delay(2.5 * 20).start();
        }
        else {
            this.entity.playAnimation("animation.god_of_guard.staff_effect_only", {
                "blendOutTime": 0.2
            });
            this.setTimeout(() => {
                var _a;
                let p = (_a = this.entity.target) !== null && _a !== void 0 ? _a : Random.choice(Array.from(this.bossOri.barrier.getPlayers()));
                for (let i = 1; i < 4; i++) {
                    let targetPos = new Vector3(p.location);
                    let targetV = new Vector3(p.getVelocity());
                    targetV.y = 0;
                    targetPos.add(targetV.scl(i * 20));
                    let pos = new Vector3(this.entity.getHeadLocation()).add(0, -1, 0);
                    targetPos.y = pos.y;
                    let dis = targetPos.distance(pos);
                    this.exEntity.shootProj("wb:god_of_guard_sword_s", {
                        "speed": dis / i / 20
                    }, targetPos.sub(pos).normalize(), pos);
                }
            }, 200);
            this.tryRangeAttack();
        }
    }
    tryRangeAttack() {
        var _a;
        this.addMove();
        (_a = this.attackTimer) === null || _a === void 0 ? void 0 : _a.stop();
        this.attackTimer = ExSystem.tickTask(() => {
            var _a, _b;
            if (this.entity.target && this.exEntity.position.distance((_a = this.entity.target) === null || _a === void 0 ? void 0 : _a.location) < 32) {
                this.entity.playAnimation("animation.god_of_guard.staff_effect_only", {
                    "blendOutTime": 0.2
                });
                (_b = this.attackTimer) === null || _b === void 0 ? void 0 : _b.stop();
                this.attackTimer = ExSystem.tickTask(() => {
                    var _a;
                    this.addRange();
                    this.removeMove();
                    if (this.entity.target) {
                        let startPos = new Vector3(this.entity.getHeadLocation()).add(0, -1, 0).add(this.exEntity.viewDirection.scl(1));
                        let dic = new Vector3(this.entity.target.location).sub(startPos).normalize();
                        dic.y = 0;
                        // let mat1 = new Matrix4().idt().rotateY( 10/ 180 * Math.PI);
                        // let mat2 = new Matrix4().idt().rotateY(-10 / 180 * Math.PI);
                        // mat2.rmulVector(dic);
                        // for (let p = -1; p <= 1; p += 1) {
                        this.exEntity.shootProj("wb:god_of_guard_sword_s", {
                            "speed": 0.9
                        }, dic, startPos);
                        //     mat1.rmulVector(dic);
                        // }
                    }
                    (_a = this.attackTimer) === null || _a === void 0 ? void 0 : _a.stop();
                    this.attackTimer = ExSystem.tickTask(() => {
                        this.removeRange();
                        this.tryRangeAttack();
                    }).delay(20 * 1).startOnce();
                }).delay(20 * 1).startOnce();
            }
        }).delay(2).start();
    }
    get damageAmount() {
        return (30 + this.passive.getDamageWithoutConsume()) * (1 + this.passive.defense[0] / 10);
    }
    attack(r, angle) {
        let view = new Vector3(this.entity.getViewDirection());
        let q = new ExEntityQuery(this.entity.dimension).at(this.entity.location)
            .querySector(r, 4, view, 135)
            .except(this.entity)
            .except(this.bossOri.entity)
            .forEach(e => {
            e.applyDamage(this.damageAmount);
        });
        let arg = new MolangVariableMap();
        arg.setFloat("angle", angle);
        arg.setFloat("cent_angle", view.rotateAngleX());
        arg.setFloat("r", r);
        this.entity.dimension.spawnParticle("wb:god_of_guard_att", this.entity.location, arg);
        return q.getEntities();
    }
    tryMeleeAttack() {
        var _a;
        this.addMelee();
        this.addMove();
        (_a = this.attackTimer) === null || _a === void 0 ? void 0 : _a.stop();
        this.attackTimer = ExSystem.tickTask(() => {
            var _a, _b;
            if (this.entity.target && this.exEntity.position.distance((_a = this.entity.target) === null || _a === void 0 ? void 0 : _a.location) < 3) {
                this.removeMove();
                this.removeMelee();
                this.entity.playAnimation("animation.god_of_guard.melee_attack", {
                    "blendOutTime": 0.2
                });
                (_b = this.attackTimer) === null || _b === void 0 ? void 0 : _b.stop();
                this.attackTimer = ExSystem.tickTask(() => {
                    var _a;
                    this.attack(3, 45);
                    this.forwords();
                    this.exEntity.shootProj("wb:god_of_guard_sword_s", {
                        "speed": 1.0
                    }, undefined, new Vector3(this.entity.getHeadLocation()).add(0, -1, 0));
                    (_a = this.attackTimer) === null || _a === void 0 ? void 0 : _a.stop();
                    this.attackTimer = ExSystem.tickTask(() => {
                        this.tryMeleeAttack();
                    }).delay(20 * 0.55).startOnce();
                }).delay(20 * 0.9).startOnce();
            }
        }).delay(2).start();
    }
    get passive() { return this.bossOri.passive; }
    constructor(bossOri, e, server) {
        super(e, server);
        this.bossOri = bossOri;
        this.state = PomGodOfGuard2State.Range;
        //弹射加伤害
        this.getEvents().exEvents.afterEntityHitEntity.subscribe((e) => {
            if (e.damageSource.cause == EntityDamageCause.projectile) {
                e.hurtEntity.applyDamage((30 + this.passive.getDamageWithoutConsume()) * (1 + this.passive.defense[0] / 10) - 30, {
                    "cause": EntityDamageCause.entityAttack,
                    "damagingEntity": this.entity
                });
            }
        });
    }
    addMove() {
        this.entity.triggerEvent("add_move");
    }
    removeMove() {
        this.entity.triggerEvent("remove_move");
    }
    addMelee() {
        this.entity.triggerEvent("add_melee");
    }
    removeMelee() {
        this.entity.triggerEvent("remove_melee");
    }
    addRange() {
        this.entity.triggerEvent("add_range");
    }
    removeRange() {
        this.entity.triggerEvent("remove_range");
    }
    dispose() {
        super.dispose();
    }
    onKilled(e) {
        super.onKilled(e);
    }
    forwords(time = 0.25) {
        const nstate = this.state;
        this.setTimeout(() => {
            if (nstate !== this.state)
                return;
            let pos = this.exEntity.position;
            let view = this.exEntity.viewDirection;
            view.y = 0;
            view.normalize();
            pos.add(view.scl(1.3));
            this.entity.teleport(pos);
        }, time * 1000);
    }
    onHurt(e) {
        let damage = e.damage;
        if (e.damageSource.cause === EntityDamageCause.projectile)
            damage *= 0.2;
        if (e.damageSource.cause !== EntityDamageCause.selfDestruct && e.damageSource.cause !== EntityDamageCause.suicide)
            this.bossOri.entity.applyDamage(damage, {
                "cause": EntityDamageCause.charging,
                "damagingEntity": e.damageSource.damagingEntity
            });
    }
}
__decorate([
    registerEvent("afterOnHurt"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EntityHurtAfterEvent]),
    __metadata("design:returntype", void 0)
], PomGodOfGuardShadow.prototype, "onHurt", null);
export class PomGodOfGuardBoss2 extends PomBossController {
    constructor(e, server) {
        super(e, server);
        this.state = PomGodOfGuard2State.Melee;
        this.lazerState = false;
        this.passive = new PomGodOfGuardBossPassive(this, 2);
    }
    isMeleeState() {
        return this.state === PomGodOfGuard2State.Melee;
    }
    setMeleeState() {
        this.state = PomGodOfGuard2State.Melee;
        this.entity.triggerEvent("variant" + this.state);
    }
    setRangeState() {
        this.state = PomGodOfGuard2State.Range;
        this.entity.triggerEvent("variant" + this.state);
    }
    addMove() {
        this.entity.triggerEvent("add_move");
    }
    removeMove() {
        this.entity.triggerEvent("remove_move");
    }
    addMelee() {
        this.entity.triggerEvent("add_melee");
    }
    removeMelee() {
        this.entity.triggerEvent("remove_melee");
    }
    addRange() {
        this.entity.triggerEvent("add_range");
    }
    removeRange() {
        this.entity.triggerEvent("remove_range");
    }
    initBossEntity() {
        var _a, _b;
        super.initBossEntity();
        let arr = new ExEntityQuery(this.entity.dimension).at(this.barrier.center).queryBox(this.barrier.area.calculateWidth(), {
            "type": "wb:god_of_guard_shadow"
        }).getEntities();
        if (arr.length == 0) {
            this.shadow = new PomGodOfGuardShadow(this, this.entity.dimension.spawnEntity("wb:god_of_guard_shadow", this.barrier.center), this.server);
        }
        if (!this.shadow) {
            this.shadow = new PomGodOfGuardShadow(this, arr[0], this.server);
        }
        //弹射加伤害
        this.getEvents().exEvents.afterEntityHitEntity.subscribe((e) => {
            if (e.damageSource.cause == EntityDamageCause.projectile) {
                e.hurtEntity.applyDamage(this.passive.getDamage(), {
                    "cause": EntityDamageCause.entityAttack,
                    "damagingEntity": this.entity
                });
            }
        });
        this.changePos();
        (_a = this.timer) === null || _a === void 0 ? void 0 : _a.stop();
        (_b = this.timer) === null || _b === void 0 ? void 0 : _b.delay(20).startOnce();
    }
    changePos() {
        var _a;
        (_a = this.timer) === null || _a === void 0 ? void 0 : _a.stop();
        this.timer = ExSystem.tickTask(() => {
            var _a;
            this.entity.dimension.spawnParticle("epic:sunlight_sword_particle2", this.entity.location);
            this.shadow.entity.dimension.spawnParticle("epic:sunlight_sword_particle2", this.shadow.entity.location);
            (_a = this.timer) === null || _a === void 0 ? void 0 : _a.stop();
            this.timer = ExSystem.tickTask(() => {
                var _a, _b, _c, _d;
                let pos1 = this.entity.location, pos2 = this.shadow.entity.location;
                this.shadow.entity.teleport(pos1);
                this.entity.teleport(pos2);
                if (this.isMeleeState()) {
                    this.setRangeState();
                    this.shadow.setMeleeState();
                }
                else {
                    this.setMeleeState();
                    this.shadow.setRangeState();
                }
                this.removeMelee();
                this.removeMove();
                this.removeRange();
                this.shadow.removeMelee();
                this.shadow.removeMove();
                this.shadow.removeRange();
                (_a = this.attackTimer) === null || _a === void 0 ? void 0 : _a.stop();
                (_b = this.attackLiner) === null || _b === void 0 ? void 0 : _b.stop();
                (_c = this.shadow.attackTimer) === null || _c === void 0 ? void 0 : _c.stop();
                (_d = this.shadow.attackLiner) === null || _d === void 0 ? void 0 : _d.stop();
                if (this.state == PomGodOfGuard2State.Melee) {
                    this.entity.playAnimation("animation.god_of_guard.melee_skill_all", {
                        "blendOutTime": 0.2
                    });
                    let getSmooth = (time, timeAll, a, b) => {
                        return MathUtil.clamp(a + (b - a) * (-Math.pow(((time / timeAll) - 1), 2) + 1), a, b);
                    };
                    let startPos = new Vector3(this.entity.location);
                    let tmpV = new Vector3();
                    let targetFacing = new Vector3();
                    let target = new Vector3();
                    this.attackLiner = ExSystem.timeLine({
                        "1.3": (time) => {
                            //起飞
                            time.registerTick("fly", (time, pastTime) => {
                                this.entity.teleport(tmpV.set(startPos).add(0, getSmooth(pastTime, 2.4 - 1.3, 0, 6), 0), {
                                // "facingLocation": targetFacing
                                });
                            });
                        },
                        "2.4": (time) => {
                            var _a;
                            targetFacing = new Vector3((_a = undefIfError(() => { var _a; return ((_a = this.entity.target) === null || _a === void 0 ? void 0 : _a.location); })) !== null && _a !== void 0 ? _a : Random.choice(Array.from(this.barrier.getPlayers())).location);
                            tmpV.set(startPos).sub(target).normalize().scl(2);
                            tmpV.y = 0.1;
                            target.set(tmpV.add(targetFacing));
                            //冲
                            time.cancelTick("fly");
                            time.registerTick("fly", (time, pastTime) => {
                                tmpV.set(startPos).add(0, 6, 0);
                                tmpV.set(getSmooth(pastTime, 3.04 - 2.4, tmpV.x, target.x), getSmooth(pastTime, 3.04 - 2.4, tmpV.y, target.y), getSmooth(pastTime, 3.04 - 2.4, tmpV.z, target.z));
                                this.entity.teleport(tmpV, {
                                    "facingLocation": targetFacing
                                });
                                new ExEntityQuery(this.entity.dimension).at(this.entity.location)
                                    .queryBall(2)
                                    .except(this.entity)
                                    .except(this.shadow.entity)
                                    .forEach(e => {
                                    e.applyDamage(30);
                                });
                            });
                        },
                        "3.04": () => {
                            //攻击
                            this.attack(6, 90);
                        },
                        "3.21": (time) => {
                            //落地
                            time.cancelTick("fly");
                        },
                        "4.13": () => {
                            this.attack(8, 120);
                            this.forwords();
                        },
                        "4.7": () => {
                            this.tryMeleeAttack();
                        }
                    }).start();
                }
                else {
                    this.entity.playAnimation("animation.god_of_guard.staff_effect_only", {
                        "blendOutTime": 0.2
                    });
                    let tar = new Vector3(Random.choice(Array.from(this.barrier.getPlayers())).location).sub(this.entity.location);
                    tar.y = 0;
                    tar.normalize();
                    let mat1 = new Matrix4().idt().rotateY(15 / 180 * Math.PI);
                    let mat2 = new Matrix4().idt().rotateY(-60 / 180 * Math.PI);
                    mat2.rmulVector(tar);
                    for (let p = -4; p <= 4; p += 1) {
                        const n = p * 15;
                        this.setTimeout(() => {
                            this.exEntity.shootProj("wb:god_of_guard_sword_p", {
                                "speed": 0.9,
                                "delay": 0.8
                            }, tar);
                            mat1.rmulVector(tar);
                        }, p * 250);
                    }
                    this.tryRangeAttack();
                }
                this.shadow.changeState();
                this.changePos();
            }).delay(2 * 20).startOnce();
        }).delay(20 * MathUtil.randomInteger(8, 13)).startOnce();
    }
    forwords(time = 0.25) {
        const nstate = this.state;
        this.setTimeout(() => {
            if (nstate !== this.state)
                return;
            let pos = this.exEntity.position;
            let view = this.exEntity.viewDirection;
            view.y = 0;
            view.normalize();
            pos.add(view.scl(1.3));
            this.entity.teleport(pos);
        }, time * 1000);
    }
    attack(r, angle) {
        let view = new Vector3(this.entity.getViewDirection());
        let q = new ExEntityQuery(this.entity.dimension).at(this.entity.location)
            .querySector(r, 4, view, 135)
            .except(this.entity)
            .except(this.shadow.entity)
            .forEach(e => {
            e.applyDamage(30 + this.passive.getDamage());
        });
        let arg = new MolangVariableMap();
        arg.setFloat("angle", angle);
        arg.setFloat("cent_angle", view.rotateAngleX());
        arg.setFloat("r", r);
        this.entity.dimension.spawnParticle("wb:god_of_guard_att", this.entity.location, arg);
        return q.getEntities();
    }
    tryMeleeAttack() {
        var _a;
        this.addMelee();
        this.addMove();
        (_a = this.attackTimer) === null || _a === void 0 ? void 0 : _a.stop();
        this.attackTimer = ExSystem.tickTask(() => {
            var _a, _b;
            if (this.entity.target && this.exEntity.position.distance((_a = this.entity.target) === null || _a === void 0 ? void 0 : _a.location) < 3) {
                this.removeMove();
                this.removeMelee();
                this.entity.playAnimation("animation.god_of_guard.melee_attack", {
                    "blendOutTime": 0.2
                });
                (_b = this.attackTimer) === null || _b === void 0 ? void 0 : _b.stop();
                this.attackTimer = ExSystem.tickTask(() => {
                    var _a;
                    const target = this.entity.target;
                    let listener = (e) => {
                        if (e.damageSource.damagingEntity instanceof Player &&
                            this.exEntity.position.distance(e.damageSource.damagingEntity.location) < 5 &&
                            target == e.damageSource.damagingEntity) {
                            this.getEvents().exEvents.afterOnHurt.unsubscribe(listener);
                            for (let i = 0; i < 5; i++)
                                this.passive.getDamage();
                            this.entity.dimension.spawnParticle("wb:god_of_guard_attack_breakdef_par", this.entity.location);
                        }
                    };
                    if (this.attack(5, 90).findIndex(e => e instanceof Player) === -1) {
                        this.getEvents().exEvents.afterOnHurt.subscribe(listener);
                        this.setTimeout(() => {
                            this.getEvents().exEvents.afterOnHurt.unsubscribe(listener);
                        }, 2000);
                    }
                    ;
                    this.exEntity.shootProj("wb:god_of_guard_sword_p", {
                        "speed": 0.6,
                        "rotOffset": new Vector2(0, -30),
                        "delay": 0.8
                    });
                    this.exEntity.shootProj("wb:god_of_guard_sword_p", {
                        "speed": 0.6,
                        "delay": 0.8
                    });
                    this.exEntity.shootProj("wb:god_of_guard_sword_p", {
                        "speed": 0.6,
                        "rotOffset": new Vector2(0, 30),
                        "delay": 0.8
                    });
                    this.forwords();
                    (_a = this.attackTimer) === null || _a === void 0 ? void 0 : _a.stop();
                    this.attackTimer = ExSystem.tickTask(() => {
                        this.tryMeleeAttack();
                    }).delay(20 * 0.55).startOnce();
                }).delay(20 * 0.9).startOnce();
            }
        }).delay(2).start();
    }
    keeper(e) {
        var _a, _b;
        if (e.currentTick % 4 === 0) {
            if (!this.lazerState && !((_a = this.timer) === null || _a === void 0 ? void 0 : _a.isStarted())) {
                console.warn("Warn: undef state");
                (_b = this.timer) === null || _b === void 0 ? void 0 : _b.startOnce();
            }
        }
        if (ignorn(() => this.shadow.entity.location) && !this.barrier.area.contains(this.shadow.entity.location)) {
            this.shadow.exEntity.setPosition(this.barrier.area.center());
        }
    }
    lazerTrigger() {
        if (this.passive.getTotalHealthReduce() > 300) {
            this.tryLazerAttack();
            this.passive.resetHealthReduce();
        }
    }
    flyerBurn() {
        var _a;
        (_a = this.passive.getSkipper()) === null || _a === void 0 ? void 0 : _a.applyDamage(10, {
            "cause": EntityDamageCause.void,
            "damagingEntity": this.entity
        });
    }
    tryRangeAttack() {
        var _a;
        this.addMove();
        (_a = this.attackTimer) === null || _a === void 0 ? void 0 : _a.stop();
        this.attackTimer = ExSystem.tickTask(() => {
            var _a, _b;
            if (this.entity.target && this.exEntity.position.distance((_a = this.entity.target) === null || _a === void 0 ? void 0 : _a.location) < 32) {
                this.entity.playAnimation("animation.god_of_guard.staff_effect_only", {
                    "blendOutTime": 0.2
                });
                (_b = this.attackTimer) === null || _b === void 0 ? void 0 : _b.stop();
                this.attackTimer = ExSystem.tickTask(() => {
                    var _a;
                    this.addRange();
                    this.removeMove();
                    if (this.entity.target) {
                        let startPos = new Vector3(this.entity.getHeadLocation()).add(0, 0, -1).add(this.exEntity.viewDirection.scl(1));
                        this.exEntity.shootProj("wb:god_of_guard_sword_p", {
                            "speed": 0.9,
                            "delay": 0.8
                        }, new Vector3(this.entity.target.location).add(0, 1, 0).sub(startPos).normalize(), startPos);
                        this.exEntity.shootProj("wb:god_of_guard_sword_p", {
                            "speed": 0.9,
                            "rotOffset": new Vector2(0, 40),
                            "delay": 0.8
                        }, new Vector3(this.entity.target.location).add(0, 1, 0).sub(startPos).normalize(), startPos);
                        this.exEntity.shootProj("wb:god_of_guard_sword_p", {
                            "speed": 0.9,
                            "rotOffset": new Vector2(0, -40),
                            "delay": 0.8
                        }, new Vector3(this.entity.target.location).add(0, 1, 0).sub(startPos).normalize(), startPos);
                    }
                    (_a = this.attackTimer) === null || _a === void 0 ? void 0 : _a.stop();
                    this.attackTimer = ExSystem.tickTask(() => {
                        this.removeRange();
                        this.tryRangeAttack();
                    }).delay(20 * 1).startOnce();
                }).delay(20 * 1).startOnce();
            }
        }).delay(2).start();
    }
    summonLazer(i) {
        let map = new MolangVariableMap();
        map.setFloat("dic_x", Math.sin(i / 180 * Math.PI));
        map.setFloat("dic_z", Math.cos(i / 180 * Math.PI));
        new ExEntityQuery(this.entity.dimension)
            .at(this.entity.location)
            .queryBall(64)
            .except(this.entity)
            .except(this.shadow.entity)
            .setMatrix(new Matrix4().setRotationY(i / 180 * Math.PI))
            .filterBox(new Vector3(1.2, 1.2, 32), new Vector3(0, 0, 32)).forEach((e) => {
            e.applyDamage(100, {
                "cause": EntityDamageCause.magic,
                "damagingEntity": this.entity
            });
        });
        this.entity.dimension.spawnParticle("wb:god_of_guard_lazer_par", new Vector3(this.entity.location).add(0, 2, 0), map);
        this.entity.dimension.spawnParticle("wb:ruin_desert_boss_lazer", new Vector3(this.entity.location).add(0, 2, 0), map);
    }
    summonLazerPre(i) {
        let map = new MolangVariableMap();
        map.setFloat("dic_x", Math.sin(i / 180 * Math.PI));
        map.setFloat("dic_z", Math.cos(i / 180 * Math.PI));
        this.entity.dimension.spawnParticle("wb:god_of_guard_lazer_notice", new Vector3(this.entity.location).add(0, 2, 0), map);
    }
    tryLazerAttack() {
        var _a, _b, _c, _d, _e;
        (_a = this.timer) === null || _a === void 0 ? void 0 : _a.stop();
        (_b = this.attackLiner) === null || _b === void 0 ? void 0 : _b.stop();
        this.entity.teleport(this.barrier.center);
        this.removeMove();
        this.removeRange();
        this.addMelee();
        (_c = this.shadow.attackLiner) === null || _c === void 0 ? void 0 : _c.stop();
        (_d = this.shadow.attackTimer) === null || _d === void 0 ? void 0 : _d.stop();
        this.lazerState = true;
        (_e = this.attackTimer) === null || _e === void 0 ? void 0 : _e.stop();
        this.attackTimer = ExSystem.tickTask(() => {
            this.entity.dimension.spawnParticle("wb:god_of_guard_lazer_pre_par", this.entity.location);
            this.entity.playAnimation("animation.god_of_guard.staff_effect_only", {
                "blendOutTime": 0.2
            });
            let angle = Math.floor(Math.random() * 120) * 3;
            let numTotal = 360;
            let num = numTotal;
            this.attackTimer = ExSystem.tickTask(() => {
                for (let i = angle; i < 360 + angle; i += 72) {
                    this.summonLazerPre(i);
                }
            }).delay(4).start();
            this.shadow.setMeleeState();
            this.shadow.attackTimer = ExSystem.tickTask(() => {
                this.shadow.tryStateSprint();
            }).delay(2.5 * 20).start();
            this.setTimeout(() => {
                var _a;
                this.passive.defense[0] = 20;
                this.entity.playAnimation("animation.god_of_guard.staff_effect_only", {
                    "blendOutTime": 0.2
                });
                (_a = this.attackTimer) === null || _a === void 0 ? void 0 : _a.stop();
                this.attackTimer = ExSystem.tickTask(() => {
                    var _a, _b, _c, _d;
                    if (num > numTotal / 2) {
                        for (let i = angle; i < 360 + angle; i += 72) {
                            this.summonLazer(i);
                        }
                    }
                    else if (num > numTotal / 4) {
                        for (let i = angle; i < 360 + angle; i += 60) {
                            this.summonLazer(i);
                        }
                        for (let i = angle + 45; i < 360 + angle + 45; i += 90) {
                            this.summonLazerPre(i);
                        }
                    }
                    else if (num > numTotal / 4 / 3 * 2) {
                        for (let i = angle + 45; i < 360 + angle + 45; i += 90) {
                            this.summonLazer(i);
                        }
                        for (let i = angle; i < 360 + angle; i += 180) {
                            this.summonLazerPre(i);
                        }
                    }
                    else if (num > numTotal / 4 / 3) {
                        for (let i = angle; i < 360 + angle; i += 180) {
                            this.summonLazer(i);
                        }
                        for (let i = angle + 45; i < 360 + angle + 45; i += 120) {
                            this.summonLazerPre(i);
                        }
                    }
                    else {
                        for (let i = angle + 45; i < 360 + angle + 45; i += 120) {
                            this.summonLazer(i);
                        }
                    }
                    // this.summonLazer(angle);
                    angle += 1;
                    num -= 1;
                    if (num <= 0) {
                        (_a = this.attackTimer) === null || _a === void 0 ? void 0 : _a.stop();
                        (_b = this.shadow.attackTimer) === null || _b === void 0 ? void 0 : _b.stop();
                        (_c = this.timer) === null || _c === void 0 ? void 0 : _c.stop();
                        (_d = this.timer) === null || _d === void 0 ? void 0 : _d.delay(20).startOnce();
                        this.lazerState = false;
                    }
                }).delay(1).start();
            }, 2 * 1000);
        }).delay(2 * 20).startOnce();
    }
    onSpawn() {
        super.onSpawn();
    }
    onKilled(e) {
        super.onKilled(e);
    }
    onFail() {
        super.onFail();
    }
    dispose() {
        var _a, _b, _c, _d, _e;
        (_a = this.attackTimer) === null || _a === void 0 ? void 0 : _a.stop();
        (_b = this.timer) === null || _b === void 0 ? void 0 : _b.stop();
        (_c = this.shadow.attackTimer) === null || _c === void 0 ? void 0 : _c.stop();
        (_d = this.shadow.attackLiner) === null || _d === void 0 ? void 0 : _d.stop();
        (_e = this.attackLiner) === null || _e === void 0 ? void 0 : _e.stop();
        this.passive.dispose();
        super.dispose();
    }
    despawn() {
        new ExEntityQuery(this.entity.dimension).at(this.barrier.center).queryBox(this.barrier.area.calculateWidth(), {
            "type": "wb:god_of_guard_shadow"
        }).getEntities().forEach(e => e.remove());
        super.despawn();
    }
}
PomGodOfGuardBoss2.typeId = "wb:god_of_guard_second";
__decorate([
    registerEvent(ExOtherEventNames.onLongTick),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PomGodOfGuardBoss2.prototype, "keeper", null);
__decorate([
    registerEvent(ExOtherEventNames.onLongTick),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PomGodOfGuardBoss2.prototype, "lazerTrigger", null);
__decorate([
    registerEvent(ExOtherEventNames.onLongTick),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PomGodOfGuardBoss2.prototype, "flyerBurn", null);
export class PomGodOfGuardBoss3 extends PomBossController {
    constructor(e, server) {
        super(e, server);
        this.times = 0;
        this.states = new PomGodOfGuardBossStates(this);
        this.passive = new PomGodOfGuardBossPassive(this);
        this.timer = ExSystem.tickTask(() => {
            let normal = [
                // PomGodOfGuardBossState1,
                // PomGodOfGuardBossState2,
                // PomGodOfGuardBossState3,
                // PomGodOfGuardBossState5,
                // PomGodOfGuardBossState6,
                // PomGodOfGuardBossState7,
                // PomGodOfGuardBossState9,
                // PomGodOfGuardBossState10
                PomGodOfGuardBossState11,
                PomGodOfGuardBossState12,
                PomGodOfGuardBossState13,
                PomGodOfGuardBossState14,
                PomGodOfGuardBossState15
            ];
            let hard = [
            // PomGodOfGuardBossState4,
            // PomGodOfGuardBossState8,
            // PomGodOfGuardBossState12
            ];
            if (this.states.isAvailable()) {
                // let d = this.passive.getDamageWithoutConsume();
                let choice = Random.choice(normal);
                // let maxTimes = 0;
                // if (d < 20) {
                //     maxTimes = MathUtil.randomInteger(3, 4);
                // } else if (20 <= d && d <= 40) {
                //     maxTimes = MathUtil.randomInteger(2, 3);
                // } else if (40 <= d && d <= 60) {
                //     maxTimes = MathUtil.randomInteger(1, 2);
                // } else {
                //     maxTimes = MathUtil.randomInteger(0, 1);
                // }
                // if (this.times >= maxTimes) {
                //     choice = Random.choice(hard);
                //     this.times = 0;
                // } else {
                //     this.times += 1;
                // }
                this.states.set(choice, this.passive.getDamage());
                this.states.listenOnExit(() => {
                    this.entity.playAnimation("animation.god_of_guard.staff_effect", {
                        "blendOutTime": 0.2
                    });
                });
            }
            ;
            let p = this.passive.getSkipper();
            if (p) {
                if (this.states.isAvailable(-1)) {
                    this.states.set(PomGodOfGuardBossStateWarn, 15, -1, p);
                }
            }
        });
        this.timer.delay(1.0 * 20);
        this.timer.start();
    }
    initBossEntity() {
        super.initBossEntity();
        let loc;
        new ExEntityQuery(this.entity.dimension).at(this.barrier.center).queryBox(this.barrier.area.calculateWidth(), {
            "type": "wb:god_of_guard_shadow"
        }).forEach((e) => { loc = e.location; e.remove(); });
        this.entity.dimension.createExplosion(this.entity.location, 10, {
            "breaksBlocks": false,
            "causesFire": false,
            "source": this.entity
        });
        this.entity.dimension.spawnParticle("wb:blast_par_small", new Vector3(this.entity.location).add(0, 1, 0));
        if (loc) {
            this.entity.dimension.createExplosion(loc, 10, {
                "breaksBlocks": false,
                "causesFire": false,
                "source": this.entity
            });
            this.entity.dimension.spawnParticle("wb:blast_par_small", new Vector3(loc).add(0, 1, 0));
        }
    }
    onSpawn() {
        super.onSpawn();
    }
    onKilled(e) {
        this.passive.dispose();
        super.onWin();
        this.server.say({ rawtext: [{ translate: "text.wb:defeat_intentions.name" }] });
        super.onKilled(e);
    }
    onFail() {
        this.passive.dispose();
        super.onFail();
    }
    onLongTick(e) {
    }
    onTick(e) {
        this.states.onTick(e);
    }
}
PomGodOfGuardBoss3.typeId = "wb:god_of_guard_third";
__decorate([
    registerEvent("onLongTick"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PomGodOfGuardBoss3.prototype, "onLongTick", null);
__decorate([
    registerEvent("tick"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PomGodOfGuardBoss3.prototype, "onTick", null);
export class PomGodOfGuardBossPassive {
    constructor(ctrl, state = 1) {
        this.ctrl = ctrl;
        this.state = state;
        this.defense = [0, 0];
        this.playerSkipperData = new Map();
        this.healthReduce = 0;
        this.listener = (e) => {
            var _a, _b;
            if (e.hurtEntity instanceof Player && e.damageSource.damagingEntity == ctrl.entity) {
                if (e.damage > 100000)
                    return;
                if (this.ctrl.barrier.players.has(e.hurtEntity)) {
                    ctrl.exEntity.addHealth(ctrl, e.damage);
                }
            }
            if (ctrl.entity == e.hurtEntity) {
                if (e.damageSource.cause !== EntityDamageCause.charging) {
                    ctrl.exEntity.addHealth(ctrl, e.damage * (this.defense[0] / 20));
                    if (state == 1) {
                        this.defense[1] += (e.damage);
                    }
                    else {
                        this.defense[1] += e.damage - ((_a = ctrl.exEntity.getPreRemoveHealth()) !== null && _a !== void 0 ? _a : 0);
                    }
                    this.defense[0] = Math.min(20, this.defense[0] + 1);
                    this.healthReduce += e.damage + ((_b = ctrl.exEntity.getPreRemoveHealth()) !== null && _b !== void 0 ? _b : 0);
                    this.upDateInf();
                }
                else {
                    this.defense[1] += e.damage;
                    this.defense[0] = Math.min(20, this.defense[0] + 1);
                    this.healthReduce += e.damage;
                    this.upDateInf();
                }
            }
        };
        this.nextText = ["", ""];
        this.ctrl.server.getEvents().events.afterEntityHurt.subscribe(this.listener);
        for (let p of ctrl.barrier.clientsByPlayer()) {
            p.magicSystem.setActionbarByPass("godofguard", this.nextText);
        }
        for (let p of ctrl.barrier.getPlayers()) {
            this.playerSkipperData.set(p, [new Array(15).fill(0), 0]);
        }
        this.skipper = (e) => {
            var _a, _b, _c;
            if (e.currentTick % 4 === 0) {
                for (let p of ctrl.barrier.getPlayers()) {
                    let loc = new Vector3(p.location);
                    let under = undefIfError(() => ctrl.entity.dimension.getBlock(loc.sub(0, 1, 0)));
                    let getter = this.playerSkipperData.get(p);
                    if (p.getGameMode() === GameMode.creative)
                        continue;
                    getter[1] -= getter[0].shift();
                    getter[0].push(((under === null || under === void 0 ? void 0 : under.typeId) === "minecraft:air" ? 1 : 0) +
                        (((_a = (under = undefIfError(() => under === null || under === void 0 ? void 0 : under.below(1)))) === null || _a === void 0 ? void 0 : _a.typeId) === "minecraft:air" ? 1 : 0) +
                        (((_b = (under = undefIfError(() => under === null || under === void 0 ? void 0 : under.below(1)))) === null || _b === void 0 ? void 0 : _b.typeId) === "minecraft:air" ? 1 : 0) +
                        (((_c = (under = undefIfError(() => under === null || under === void 0 ? void 0 : under.below(1)))) === null || _c === void 0 ? void 0 : _c.typeId) === "minecraft:air" ? 1 : 0));
                    getter[1] += getter[0][14];
                }
            }
        };
        ctrl.getEvents().exEvents.onLongTick.subscribe(this.skipper);
    }
    getSkipper() {
        for (let i of this.playerSkipperData) {
            let s = i[1][1];
            if (s > 20) {
                return i[0];
            }
        }
    }
    dispose() {
        this.ctrl.server.getEvents().events.afterEntityHurt.unsubscribe(this.listener);
        this.ctrl.getEvents().exEvents.onLongTick.unsubscribe(this.skipper);
        for (let p of this.ctrl.barrier.clientsByPlayer()) {
            p.magicSystem.deleteActionbarPass("godofguard");
        }
    }
    upDateInf() {
        let d = this.defense[1] / this.defense[0];
        this.nextText[0] = "反击额外伤害: " + d;
        this.nextText[1] = "防御层数: " + this.defense[0];
    }
    getDamage() {
        if (this.defense[0] > 0) {
            this.upDateInf();
            let d = this.defense[1] / this.defense[0];
            this.defense[0] = Math.max(0, this.defense[0] - 1);
            this.defense[1] -= d;
            return 20 + (d !== null && d !== void 0 ? d : 0);
        }
        else {
            this.nextText[0] = "反击额外伤害: " + 0;
            this.nextText[1] = "防御层数: " + 0;
            return 20;
        }
    }
    getDamageWithoutConsume() {
        if (this.defense[0] > 0) {
            let d = this.defense[1] / this.defense[0];
            return (d !== null && d !== void 0 ? d : 0);
        }
        else {
            return 0;
        }
    }
    getTotalHealthReduce() {
        return this.healthReduce;
    }
    resetHealthReduce() {
        this.healthReduce = 0;
    }
}
export class PomGodOfGuardShootCenter {
    constructor(dimension, center) {
        this.dimension = dimension;
        this.pointJudge = new WeakMap();
        this.tmpV = new Vector3();
        this.tmpA = new Vector3();
        this.tmpB = new Vector3();
        this.center = new Vector3(center);
        this.trajectory = new KDTree(3);
    }
    optmize() {
        let now = new Date().getTime();
        let points = this.trajectory.getPoints();
        this.trajectory.root = undefined;
        let npoints = [];
        for (let p of points) {
            if (!this.pointJudge.has(p))
                continue;
            let { spawnTime, lifeTime, damage } = this.pointJudge.get(p);
            if (now - spawnTime > lifeTime) {
                this.pointJudge.delete(p);
            }
            else {
                npoints.push(p);
            }
        }
        this.trajectory.build(npoints);
    }
    add(speed, dic, lifeTime, damage, parStyle = "", damageType = EntityDamageCause.entityAttack) {
        this.tmpV.set(dic).normalize();
        let point = new KDPoint(this.tmpV.x, this.tmpV.y, this.tmpV.z);
        this.trajectory.insert(point);
        let map = new MolangVariableMap();
        // map.setColorRGBA("color",{
        //     "alpha":1,
        //     "blue":0,
        //     "green":0,
        //     "red":1
        // })
        map.setSpeedAndDirection("def", speed, this.tmpV);
        map.setFloat("lifetime", lifeTime / 1000);
        this.pointJudge.set(point, { speed: speed, direction: this.tmpV.cpy(), spawnTime: new Date().getTime(), lifeTime: lifeTime, damage: damage, damageType: damageType });
        this.dimension.spawnParticle("wb:ruin_desert_boss_shoot" + parStyle + "_par", this.center, map);
    }
    judgeHurt(pos, pastTime) {
        var _a, _b, _c, _d;
        let boxR = 0.7;
        let boxR2 = boxR / this.tmpV.set(pos).sub(this.center).len() * 1.42;
        let dic = this.trajectory.rangeSearch(new KDPoint(...this.tmpV.set(pos).sub(this.center).normalize().toArray()), boxR2);
        for (let i of dic) {
            if (this.pointJudge.has(i)) {
                let { spawnTime, speed, direction, lifeTime, damageType } = this.pointJudge.get(i);
                let newTime = new Date().getTime();
                if (newTime - spawnTime <= lifeTime) {
                    let beforePos = this.tmpA.set(this.center).add(this.tmpV.set(direction).scl(speed * (newTime - pastTime - spawnTime) / 1000));
                    let afterPos = this.tmpB.set(this.center).add(this.tmpV.set(direction).scl(speed * (newTime - spawnTime) / 1000));
                    let dis1 = beforePos.distance(pos), dis2 = afterPos.distance(pos);
                    if (dis1 < boxR || dis2 < boxR) {
                        return [(_b = (_a = this.pointJudge.get(i)) === null || _a === void 0 ? void 0 : _a.damage) !== null && _b !== void 0 ? _b : 0, damageType];
                    }
                    let midLen = this.tmpV.set(afterPos).sub(beforePos).scl(0.5).add(beforePos).distance(pos);
                    let d = this.tmpV.set(afterPos).sub(beforePos);
                    if (midLen < dis1 && midLen < dis2 && d.crs(beforePos.sub(pos)).len() / d.len() <= boxR) {
                        return [(_d = (_c = this.pointJudge.get(i)) === null || _c === void 0 ? void 0 : _c.damage) !== null && _d !== void 0 ? _d : 0, damageType];
                    }
                }
                else {
                    this.trajectory.delete(i);
                    this.pointJudge.delete(i);
                }
            }
            else {
                this.trajectory.delete(i);
            }
        }
        return undefined;
    }
}
export class PomGodOfGuardShootCenters {
    constructor(dimension) {
        this.dimension = dimension;
        this.centers = new Set();
        this.tickNum = 0;
        this.tmpV = new Vector3();
    }
    addCenter(pos) {
        let center = new PomGodOfGuardShootCenter(this.dimension, pos);
        let id = UUID.randomUUID();
        this.centers.add(center);
        return center;
    }
    remove(center) {
        return this.centers.delete(center);
    }
    tick(tickDelay, targets, from) {
        for (let c of this.centers) {
            for (let p of targets) {
                let d = c.judgeHurt(this.tmpV.set(p.location).add(0, 0.5, 0), tickDelay);
                if (d) {
                    p.applyDamage(d[0], {
                        "cause": d[1],
                        "damagingEntity": from
                    });
                    p.applyKnockback(0, 0, 0.5, 0.2);
                }
            }
        }
        this.tickNum++;
        if (this.tickNum % (15 * 20) === 0) {
            this.centers.forEach(c => {
                c.optmize();
            });
            this.tickNum = 0;
        }
    }
}
//# sourceMappingURL=PomGodOfGuardBoss.js.map