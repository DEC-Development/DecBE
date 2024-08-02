import Matrix4 from "../../utils/math/Matrix4.js";
import Vector3 from "../../utils/math/Vector3.js";
import { falseIfError } from "../../utils/tool.js";
import MathUtil from "../../utils/math/MathUtil.js";
export default class ExEntityQuery {
    constructor(getter) {
        this.getter = getter;
        this.entities = new Set();
        //选区进行变换
        this.matrix = new Matrix4().idt();
        this.position = new Vector3();
        this.tmpV = new Vector3();
    }
    at(pos) {
        this.position.set(pos);
        return this;
    }
    facingByDirection(dic, dis) {
        this.position.add(this.tmpV.set(dic).normalize().scl(dis));
        return this;
    }
    facingByLTF(ltf, dic) {
        let mat = ExEntityQuery.getFacingMatrix(dic);
        this.position.add(mat.rmulVector(this.tmpV.set(ltf)));
        return this;
    }
    static getFacingMatrix(dic) {
        let forz = new Vector3(dic).normalize();
        if (forz.y === 1 || forz.y === -1) {
            throw new SyntaxError("can find the matrix");
        }
        let x = Vector3.up.crs(dic).normalize();
        let z = forz;
        let y = z.crs(x).normalize();
        let mat = new Matrix4(x.x, y.x, z.x, 0, x.y, y.y, z.y, 0, x.z, y.z, z.z, 0, 0, 0, 0, 1);
        return mat;
    }
    setMatrix(mat) {
        this.matrix = mat;
        return this;
    }
    editMatrix(func) {
        func(this.matrix);
        return this;
    }
    editPosition(func) {
        func(this.position);
        return this;
    }
    query(entityQueryOptions = {}) {
        entityQueryOptions.location = this.position;
        for (let e of this.getter.getEntities(entityQueryOptions)) {
            this.add(e);
        }
        return this;
    }
    queryBox(xyz, entityQueryOptions = {}) {
        return this.queryBall(Math.sqrt(Math.pow(xyz.x, 2) + Math.pow(xyz.y, 2) + Math.pow(xyz.z, 2)) / 2, entityQueryOptions).filterBox(xyz);
    }
    queryBall(r, entityQueryOptions = {}) {
        entityQueryOptions.maxDistance = r;
        return this.query(entityQueryOptions);
    }
    queryCircle(r, h, entityQueryOptions = {}) {
        return this.queryBall(Math.sqrt(Math.pow(r, 2) + Math.pow((h / 2), 2)), entityQueryOptions).filterCircle(r, h);
    }
    querySector(r, h, dic, angleMax, angleMin = 0, entityQueryOptions = {}) {
        return this.queryBall(Math.sqrt(Math.pow(r, 2) + Math.pow((h / 2), 2)), entityQueryOptions).filterSector(r, h, dic, angleMax, angleMin);
    }
    queryPolygon(points, h, entityQueryOptions = {}) {
        return this.queryCircle(points.reduce((max, cur) => Math.max(max, Math.sqrt(Math.pow((cur.x - this.position.x), 2) + Math.pow((cur.z - this.position.z), 2))), 0), h, entityQueryOptions).filterPolygon(points, h);
    }
    clear() {
        this.entities.clear();
    }
    forEach(callbackfn, thisArg) {
        this.entities.forEach(callbackfn);
        return this;
    }
    *[Symbol.iterator]() {
        for (let e of this.entities) {
            yield e;
        }
    }
    getEntities() {
        return Array.from(this.entities.values());
    }
    static isPointInsidePolygon(x, z, points) {
        let inside = false;
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            const xi = points[i].x;
            const zi = points[i].z;
            const xj = points[j].x;
            const zj = points[j].z;
            const intersect = ((zi > z) !== (zj > z)) && (x < ((xj - xi) * (z - zi)) / (zj - zi) + xi);
            if (intersect)
                inside = !inside;
        }
        return inside;
    }
    filter(func) {
        let remains = new Set(this.entities);
        let fmat = this.matrix.cpy().invert();
        remains.forEach(e => {
            let v = new Vector3(e.location).sub(this.position);
            fmat.rmulVector(v);
            if (!falseIfError(() => e.isValid()) || !func(e, v))
                this.except(e);
        });
        return this;
    }
    filterBox(xyz, relCenter = new Vector3(0, 0, 0)) {
        return this.filter((e, relativePos) => Math.abs(relativePos.x - relCenter.x) <= xyz.x &&
            Math.abs(relativePos.y - relCenter.y) <= xyz.y &&
            Math.abs(relativePos.z - relCenter.z) <= xyz.z);
    }
    filterPolygon(points, h) {
        return this.filter((e, relativePos) => ExEntityQuery.isPointInsidePolygon(relativePos.x, relativePos.z, points)
            && Math.abs(relativePos.y) <= h);
    }
    filterCircle(r, h) {
        return this.filter((e, relativePos) => relativePos.len() < r
            && Math.abs(relativePos.y) <= h);
    }
    filterBall(r) {
        return this.filter((e, relativePos) => (relativePos.len()) <= r);
    }
    filterSector(r, h, dic, angleMax, angleMin = 0) {
        return this.filter((e, relativePos) => {
            let angle = Math.abs(MathUtil.IEEEremainder(this.tmpV.set(dic).rotateAngleX() - this.tmpV.set(relativePos).rotateAngleX(), 360));
            return relativePos.len() <= r
                && Math.abs(relativePos.y) <= h
                && angle >= angleMin
                && angle <= angleMax;
        });
    }
    diffrence(other) {
        other.entities.forEach(e => {
            this.except(e);
        });
        return this;
    }
    except(entity) {
        this.entities.delete(entity);
        return this;
    }
    add(entity) {
        this.entities.add(entity);
        return this;
    }
    merge(other) {
        other.entities.forEach(e => {
            this.entities.add(e);
        });
        return this;
    }
}
//# sourceMappingURL=ExEntityQuery.js.map