import { StructureRotation, world } from '@minecraft/server';
export default class ExStructure {
    constructor(id, pos, rotation = 0) {
        this.mirror = "none";
        this.structureId = id;
        this.position = pos;
        this.rotation = rotation;
    }
    generate(dim) {
        world.structureManager.place(this.structureId, dim, this.position, {
            rotation: ({
                "0": StructureRotation.None,
                "90": StructureRotation.Rotate90,
                "180": StructureRotation.Rotate180,
                "270": StructureRotation.Rotate270
            })[this.rotation + ""]
        });
    }
}
//# sourceMappingURL=ExStructure.js.map