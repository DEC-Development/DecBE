import { DynamicPropertiesDefinition, MinecraftEntityTypes, world } from '@minecraft/server';
import { Serialize } from '../../../utils/Serialize.js';
import GZIPUtil from '../../../utils/GZIPUtil.js';
import ExGameConfig from '../../ExGameConfig.js';
world.afterEvents.worldInitialize.subscribe((e) => {
    let def = new DynamicPropertiesDefinition().defineString("__cache:", 980);
    e.propertyRegistry.registerEntityTypeDynamicProperties(def, MinecraftEntityTypes.player);
});
export default class EntityPropCache {
    constructor(entity) {
        this.entity = entity;
    }
    load() {
        let tag;
        let msg = this.entity.getDynamicProperty("__cache:");
        if (typeof msg === "string" && (tag = msg) !== undefined) {
            try {
                tag = GZIPUtil.unzipString(tag);
            }
            catch (e) {
                return undefined;
            }
            this.tagFrom = tag;
            return tag;
        }
        return undefined;
    }
    get(def) {
        if (this.cache) {
            return this.cache;
        }
        else {
            let res = this.load();
            if (!res) {
                this.cache = def;
                this.tagFrom = JSON.stringify(this.cache);
                this.entity.setDynamicProperty("__cache:", this.tagFrom);
                return def;
            }
            else {
                this.cache = Serialize.from(res, def);
                return this.cache;
            }
        }
    }
    save() {
        let nfrom = Serialize.to(this.cache);
        if (nfrom !== this.tagFrom) {
            let m = GZIPUtil.zipString(nfrom);
            this.entity.setDynamicProperty("__cache:", m);
            ExGameConfig.console.info("setDynamicProperty len " + m.length);
            this.tagFrom = nfrom;
        }
    }
}
//# sourceMappingURL=EntityPropCache.js.map