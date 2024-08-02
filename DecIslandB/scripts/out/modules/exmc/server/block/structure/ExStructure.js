import { StructureMirrorAxis, StructureRotation, world } from '@minecraft/server';
export default class ExStructure {
    constructor(id, pos, rotation = 0) {
        this.mirror = StructureMirrorAxis.None;
        this.structureId = id;
        this.position = pos;
        this.rotation = rotation;
    }
    generate(dim) {
        let opi = {
            rotation: ({
                "0": StructureRotation.None,
                "90": StructureRotation.Rotate90,
                "180": StructureRotation.Rotate180,
                "270": StructureRotation.Rotate270
            })[this.rotation + ""],
            mirror: this.mirror
        };
        world.structureManager.place(this.structureId, dim, this.position, opi);
    }
}
//# sourceMappingURL=ExStructure.js.map