var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Dimension, MolangVariableMap, BlockTypes, system } from '@minecraft/server';
import ExCommand from './env/ExCommand.js';
import { ignorn } from './ExErrorQueue.js';
class ExDimension {
    spawnParticle(p, v, varMap = new MolangVariableMap()) {
        try {
            (this._dimension.spawnParticle(p, v, varMap));
            return true;
        }
        catch (e) {
            return false;
        }
    }
    createExplosion(location, radius, explosionOptions) {
        this._dimension.createExplosion(location, radius, explosionOptions);
    }
    get dimension() {
        return this._dimension;
    }
    constructor(dimension) {
        this.command = new ExCommand(this);
        this._dimension = dimension;
    }
    chunkIsLoaded(vec) {
        return this.spawnParticle("minecraft:conduit_particle", vec);
    }
    getPlayers(entityQueryOptions) {
        return this._dimension.getPlayers(entityQueryOptions);
    }
    getEntities(entityQueryOptions) {
        let entities = this._dimension.getEntities(entityQueryOptions);
        let res = [];
        for (let entity of entities) {
            if (entity && entity.dimension == this._dimension)
                res.push(entity);
        }
        return res;
    }
    getBlock(vec) {
        return ignorn(() => this._dimension.getBlock(vec));
    }
    // fillBlocks(start: IVector3, end: IVector3, blockId: string | BlockType, option?: BlockFillOptions) {
    //     // console.warn("fillBlocks", start, end, blockId);
    //     if (typeof blockId === "string") blockId = <BlockType>BlockTypes.get(blockId);
    //     this.dimension.fillBlocks(start, end, blockId, option);
    //     //b?.permutation;
    // }
    setBlock(vec, blockId) {
        if (typeof blockId === "string")
            blockId = BlockTypes.get(blockId);
        let b = this.dimension.setBlockType(vec, blockId);
    }
    setBlockAsync(vec, blockId) {
        this.runCommandAsync(`setBlock ${vec.x} ${vec.y} ${vec.z} ${blockId}`);
    }
    digBlock(vec) {
        try {
            this.command.runAsync(`setBlock ${vec.x} ${vec.y} ${vec.z} air [] destroy`);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    spawnItem(item, v) {
        try {
            return this._dimension.spawnItem(item, v);
        }
        catch (error) {
            console.warn(error);
            return undefined;
        }
        ;
    }
    spawnEntity(id, v, options) {
        try {
            return this._dimension.spawnEntity(id, v, options);
        }
        catch (error) {
            console.warn(error);
            return undefined;
        }
    }
    runCommandAsync(str) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._dimension.runCommand(str);
        });
    }
    runCommand(str) {
        return this._dimension.runCommand(str);
    }
    static getInstance(source) {
        let dimension = source;
        if (this.propertyNameCache in dimension) {
            return dimension[this.propertyNameCache];
        }
        return (dimension[this.propertyNameCache] = new ExDimension(dimension));
    }
}
ExDimension.propertyNameCache = "exCache";
export default ExDimension;
const oldMethod = Dimension.prototype.spawnEntity;
Dimension.prototype.spawnEntity = function (p, v, options) {
    let entity = oldMethod.call(this, p, v, options);
    return entity;
};
Dimension.prototype.runCommandAsync = function (str) {
    return new Promise((resolve, reject) => {
        system.run(() => {
            try {
                let res = this.runCommand(str);
                resolve(res);
            }
            catch (e) {
                reject(e);
            }
        });
    });
};
//# sourceMappingURL=ExDimension.js.map