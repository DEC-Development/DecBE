import Vector3 from '../../../utils/math/Vector3.js';
import { StructureMirrorAxis } from '@minecraft/server';
import ExStructure from './ExStructure.js';
/**
 * 表示一个Jigsaw结构，用于管理多个结构块的拼接。
 */
export default class ExStructureJigsaw {
    /**
     * 构造一个新的ExStructureJigsaw实例。
     * @param gridSize 网格的大小。
     * @param gridWidthNum 宽度方向上的网格数量。
     * @param gridHeightNum 高度方向上的网格数量，默认为1。
     */
    constructor(girdSize, gridWidthNum, gridHeightNum = 1) {
        this.width = gridWidthNum;
        this.height = gridHeightNum;
        this.size = girdSize;
        this.jigsawData = Array.from(new Array(this.height), () => Array.from(new Array(this.width), () => new Array(this.width)));
    }
    isEmpty(a, b, c = 0) {
        return this.jigsawData[c][b][a] === undefined;
    }
    /**
     * 设置一个平面结构。
     * @param x X坐标。
     * @param z Z坐标。
     * @param offsetX 结构的X偏移量。
     * @param offsetY 结构的Y偏移量。
     * @param offsetZ 结构的Z偏移量。
     * @param structureName 结构的名称。
     * @param structureRot 结构的旋转角度，默认为0。
     * @param mirror 结构的镜像轴，默认为None。
     * @param coverGridLength 覆盖的网格长度，默认为1。
     * @param coverGridWidth 覆盖的网格宽度，默认为1。
     */
    setStructurePlane(x, z, offsetX, offsetY, offsetZ, structureName, structureRot = 0, mirror = StructureMirrorAxis.None, coverGridLength = 1, coverGridWidth = 1) {
        this.setStructure(x, z, 0, offsetX, offsetY, offsetZ, structureName, structureRot, mirror, coverGridLength, coverGridWidth, 1);
    }
    /**
     * 设置一个结构。
     * @param x X坐标。
     * @param z Z坐标。
     * @param y Y坐标。
     * @param offsetX 结构的X偏移量。
     * @param offsetY 结构的Y偏移量。
     * @param offsetZ 结构的Z偏移量。
     * @param structureName 结构的名称。
     * @param structureRot 结构的旋转角度，默认为0。
     * @param mirror 结构的镜像轴，默认为None。
     * @param coverGridLength 覆盖的网格长度，默认为1。
     * @param coverGridWidth 覆盖的网格宽度，默认为1。
     * @param coverGridHeight 覆盖的网格高度，默认为1。
     */
    setStructure(x, z, y, offsetX, offsetY, offsetZ, structureName, structureRot = 0, mirror = StructureMirrorAxis.None, coverGridLength = 1, coverGridWidth = 1, coverGridHeight = 1) {
        this.clearStructure(x, z, y);
        for (let ix = x; ix < coverGridLength + x; ix++) {
            for (let iz = z; iz < coverGridWidth + z; iz++) {
                for (let iy = y; iy < coverGridHeight + y; iy++) {
                    if (!this.isEmpty(ix, iz, iy)) {
                        throw new Error("Structure already contains " + ix + " , " + iy + " , " + iz);
                    }
                }
            }
        }
        for (let ix = x; ix < coverGridLength + x; ix++) {
            for (let iz = z; iz < coverGridWidth + z; iz++) {
                for (let iy = y; iy < coverGridHeight + y; iy++) {
                    this.jigsawData[iy][iz][ix] = ExStructureJigsaw.ContinueStructure;
                }
            }
        }
        this.jigsawData[y][z][x] = [offsetX, offsetY, offsetZ, structureName, structureRot, mirror, coverGridLength, coverGridWidth, coverGridHeight];
    }
    /**
     * 填充整个结构。
     * @param offsetX 结构的X偏移量。
     * @param offsetY 结构的Y偏移量。
     * @param offsetZ 结构的Z偏移量。
     * @param structureName 结构的名称。
     * @param structureRot 结构的旋转角度，默认为0。
     * @param mirror 结构的镜像轴，默认为None。
     * @param coverGridLength 覆盖的网格长度，默认为1。
     * @param coverGridWidth 覆盖的网格宽度，默认为1。
     * @param coverGridHeight 覆盖的网格高度，默认为1。
     */
    fillStructure(offsetX, offsetY, offsetZ, structureName, structureRot = 0, mirror = StructureMirrorAxis.None, coverGridLength = 1, coverGridWidth = 1, coverGridHeight = 1) {
        const i = [offsetX, offsetY, offsetZ, structureName, structureRot, mirror, coverGridLength, coverGridWidth, coverGridHeight];
        for (let ix = 0; ix < this.width; ix++) {
            for (let iz = 0; iz < this.width; iz++) {
                for (let iy = 0; iy < this.height; iy++) {
                    this.jigsawData[iy][iz][ix] = i;
                }
            }
        }
    }
    /**
     * 获取指定位置的结构。
     * @param x X坐标。
     * @param z Z坐标。
     * @param y Y坐标。
     * @returns 返回结构的数据，如果不存在则返回undefined。
     */
    getStructure(x, z, y) {
        const base = this.findBaseStructure(x, z, y);
        if (base === undefined) {
            return undefined;
        }
        const s = this.jigsawData[base[0]][base[1]][base[2]];
        if (s instanceof Array) {
            return new ExStructureExportData(...s);
        }
        else {
            return undefined;
        }
    }
    clearStructure(a, b, c = 0) {
        const pos = this.findBaseStructure(a, b, c);
        if (pos !== undefined) {
            const [x, z, y] = pos;
            const stc = this.jigsawData[y][z][x];
            if (stc !== undefined) {
                if (typeof (stc) === "number") {
                    throw new Error("Error clearing");
                }
                else {
                    for (let ix = 0; ix < stc[6]; ix++) {
                        for (let iz = 0; iz < stc[7]; iz++) {
                            for (let iy = 0; iy < stc[8]; iy++) {
                                this.jigsawData[iy + c][iz + b][ix + a] = undefined;
                            }
                        }
                    }
                }
            }
        }
    }
    findBaseStructure(a, b, c = 0) {
        let point = this.jigsawData[c][b][a];
        if (point !== undefined) {
            if (point === ExStructureJigsaw.ContinueStructure) {
                while (point === ExStructureJigsaw.ContinueStructure && c > 0) {
                    point = this.jigsawData[c--][b][a];
                }
                while (point === ExStructureJigsaw.ContinueStructure && b > 0) {
                    point = this.jigsawData[c][b--][a];
                }
                while (point === ExStructureJigsaw.ContinueStructure && a > 0) {
                    point = this.jigsawData[c][b][a--];
                }
                return [a, b, c];
            }
            else {
                return [a, b, c];
            }
        }
        else {
            return undefined;
        }
    }
    /**
     * 获取结构的总宽度。
     * @returns 返回结构的总宽度。
     */
    getWidth() {
        return this.size * this.width;
    }
    /**
     * 获取结构的总高度。
     * @returns 返回结构的总高度。
     */
    getHeight() {
        return this.size * this.height;
    }
    /**
     * 在指定的世界位置生成结构。
     * @param worldX 世界X坐标。
     * @param worldY 世界Y坐标。
     * @param worldZ 世界Z坐标。
     * @param dim 维度。
     */
    generate(worldX, worldY, worldZ, dim) {
        let structure = new ExStructure("", new Vector3(), 0);
        this.jigsawData.forEach((arr0, y) => {
            arr0.forEach((arr1, z) => {
                arr1.forEach((v, x) => {
                    if (typeof v !== "number" && v !== undefined) {
                        structure.position.set(worldX + x * this.size + v[0], worldY + y * this.size + v[1], worldZ + z * this.size + v[2]);
                        structure.structureId = v[3];
                        structure.rotation = v[4];
                        structure.mirror = v[5];
                        structure.generate(dim);
                    }
                });
            });
        });
    }
    /**
     * 返回对象的字符串表示形式。
     * @returns 返回对象的字符串表示形式。
     */
    [Symbol.toStringTag]() {
        return "symbol";
    }
    /**
     * 遍历所有结构并执行回调函数。
     * @param fun 回调函数，接受结构数据和坐标作为参数。
     */
    foreach(fun) {
        const data = new ExStructureExportData(0, 0, 0, "", 0, StructureMirrorAxis.None, 1, 1, 1);
        for (let y = 0; y < this.height; y++) {
            for (let z = 0; z < this.width; z++) {
                for (let x = 0; x < this.width; x++) {
                    let d = this.jigsawData[y][z][x];
                    if (d instanceof Array) {
                        data.set(...d);
                        fun(data, x, z, y);
                    }
                }
            }
        }
    }
}
/**
 * 表示继续结构的常量。
 */
ExStructureJigsaw.ContinueStructure = 1;
/**
 * 表示导出的结构数据。
 */
export class ExStructureExportData {
    /**
     * 构造一个新的ExStructureExportData实例。
     * @param offsetX X偏移量。
     * @param offsetY Y偏移量。
     * @param offsetZ Z偏移量。
     * @param structureName 结构名称。
     * @param structureRot 结构旋转角度。
     * @param mirror 结构镜像轴。
     * @param coverGridLength 覆盖的网格长度。
     * @param coverGridWidth 覆盖的网格宽度。
     * @param coverGridHeight 覆盖的网格高度。
     */
    constructor(offsetX, offsetY, offsetZ, structureName, structureRot, mirror, coverGridLength, coverGridWidth, coverGridHeight) {
        this.set(offsetX, offsetY, offsetZ, structureName, structureRot, mirror, coverGridHeight, coverGridWidth, coverGridLength);
    }
    /**
     * 设置结构数据。
     * @param offsetX X偏移量。
     * @param offsetY Y偏移量。
     * @param offsetZ Z偏移量。
     * @param structureName 结构名称。
     * @param structureRot 结构旋转角度。
     * @param mirror 结构镜像轴。
     * @param coverGridHeight 覆盖的网格高度。
     * @param coverGridWidth 覆盖的网格宽度。
     * @param coverGridLength 覆盖的网格长度。
     */
    set(offsetX, offsetY, offsetZ, structureName, structureRot, mirror, coverGridHeight, coverGridWidth, coverGridLength) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.offsetZ = offsetZ;
        this.structureName = structureName;
        this.structureRot = structureRot;
        this.mirror = mirror;
        this.coverGridHeight = coverGridHeight;
        this.coverGridWidth = coverGridWidth;
        this.coverGridLength = coverGridLength;
    }
}
//# sourceMappingURL=ExStructureJigsaw.js.map