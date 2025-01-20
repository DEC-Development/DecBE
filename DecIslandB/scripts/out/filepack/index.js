import _keys from "./keys.js";
const keys = _keys;
String.prototype.hashCode = function () {
    let hash = 0;
    for (let i = 0; i < this.length; i++) {
        const char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash & 2147483647;
};
import db0 from "./db0.js";
import db1 from "./db1.js";
import db2 from "./db2.js";
import db3 from "./db3.js";
import db4 from "./db4.js";
import db5 from "./db5.js";
import db6 from "./db6.js";
import db7 from "./db7.js";
import db8 from "./db8.js";
import db9 from "./db9.js";
import db10 from "./db10.js";
import db11 from "./db11.js";
import db12 from "./db12.js";
import db13 from "./db13.js";
import db14 from "./db14.js";
import db15 from "./db15.js";
import db16 from "./db16.js";
import db17 from "./db17.js";
import db18 from "./db18.js";
import db19 from "./db19.js";
import db20 from "./db20.js";
import db21 from "./db21.js";
import db22 from "./db22.js";
import db23 from "./db23.js";
import db24 from "./db24.js";
import db25 from "./db25.js";
import db26 from "./db26.js";
import db27 from "./db27.js";
import db28 from "./db28.js";
import db29 from "./db29.js";
import db30 from "./db30.js";
import db31 from "./db31.js";
import db32 from "./db32.js";
import db33 from "./db33.js";
import db34 from "./db34.js";
import db35 from "./db35.js";
import db36 from "./db36.js";
import db37 from "./db37.js";
import db38 from "./db38.js";
import db39 from "./db39.js";
import db40 from "./db40.js";
import db41 from "./db41.js";
import db42 from "./db42.js";
import db43 from "./db43.js";
import db44 from "./db44.js";
import db45 from "./db45.js";
import db46 from "./db46.js";
import db47 from "./db47.js";
import db48 from "./db48.js";
import db49 from "./db49.js";
import db50 from "./db50.js";
import db51 from "./db51.js";
import db52 from "./db52.js";
import db53 from "./db53.js";
import db54 from "./db54.js";
import db55 from "./db55.js";
import db56 from "./db56.js";
import db57 from "./db57.js";
import db58 from "./db58.js";
import db59 from "./db59.js";
import db60 from "./db60.js";
import db61 from "./db61.js";
import db62 from "./db62.js";
import db63 from "./db63.js";
const dbMap = new Map();
dbMap.set(0, db0);
dbMap.set(1, db1);
dbMap.set(2, db2);
dbMap.set(3, db3);
dbMap.set(4, db4);
dbMap.set(5, db5);
dbMap.set(6, db6);
dbMap.set(7, db7);
dbMap.set(8, db8);
dbMap.set(9, db9);
dbMap.set(10, db10);
dbMap.set(11, db11);
dbMap.set(12, db12);
dbMap.set(13, db13);
dbMap.set(14, db14);
dbMap.set(15, db15);
dbMap.set(16, db16);
dbMap.set(17, db17);
dbMap.set(18, db18);
dbMap.set(19, db19);
dbMap.set(20, db20);
dbMap.set(21, db21);
dbMap.set(22, db22);
dbMap.set(23, db23);
dbMap.set(24, db24);
dbMap.set(25, db25);
dbMap.set(26, db26);
dbMap.set(27, db27);
dbMap.set(28, db28);
dbMap.set(29, db29);
dbMap.set(30, db30);
dbMap.set(31, db31);
dbMap.set(32, db32);
dbMap.set(33, db33);
dbMap.set(34, db34);
dbMap.set(35, db35);
dbMap.set(36, db36);
dbMap.set(37, db37);
dbMap.set(38, db38);
dbMap.set(39, db39);
dbMap.set(40, db40);
dbMap.set(41, db41);
dbMap.set(42, db42);
dbMap.set(43, db43);
dbMap.set(44, db44);
dbMap.set(45, db45);
dbMap.set(46, db46);
dbMap.set(47, db47);
dbMap.set(48, db48);
dbMap.set(49, db49);
dbMap.set(50, db50);
dbMap.set(51, db51);
dbMap.set(52, db52);
dbMap.set(53, db53);
dbMap.set(54, db54);
dbMap.set(55, db55);
dbMap.set(56, db56);
dbMap.set(57, db57);
dbMap.set(58, db58);
dbMap.set(59, db59);
dbMap.set(60, db60);
dbMap.set(61, db61);
dbMap.set(62, db62);
dbMap.set(63, db63);
//type FilePathType<T extends JSONObject> = { [K in keyof T as (K extends string ? `${K}${T[K] extends JSONObject ? `/${Exclude<keyof FilePathType<T[K]>, symbol|``>}` : ``}` : ``)]: never };
//type KeysType = keyof PathType<typeof _keys>
class ExFileProvider {
    constructor() {
    }
    get(path) {
        return dbMap.get(path.hashCode() % 64)[path];
    }
    list(path) {
        return Object.keys(this.find(path));
    }
    find(path) {
        let dir = keys;
        for (const name of path.split('/')) {
            if (!(name in dir)) {
                throw new Error("File not found");
            }
            let d = dir[name];
            if (typeof d === "string") {
                throw new Error("Not a directory");
            }
            dir = d;
        }
        return dir;
    }
    *listAll(path) {
        let dir = this.find(path);
        if (typeof dir !== "object") {
            throw new Error("Not a directory");
        }
        for (let k of Object.keys(dir)) {
            if (typeof dir[k] === "string") {
                yield path + "/" + k;
            }
            else {
                yield* this.listAll(path + "/" + k);
            }
        }
    }
}
export const fileProvider = new ExFileProvider();
//# sourceMappingURL=index.js.map