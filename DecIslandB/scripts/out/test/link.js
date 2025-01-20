"use strict";
/**
 * Represents a three-dimensional vector.
 */
class Vector3 {
    constructor(a, b, c) {
        if (typeof a === "number" && typeof b === "number" && typeof c === "number") {
            this.x = a;
            this.y = b;
            this.z = c;
        }
        else if (a === undefined && b === undefined && c === undefined) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        else {
            this.x = a.x;
            this.y = a.y;
            this.z = a.z;
        }
    }
    /**
    * Sets the components of the vector.
    * @param {number|IVector3} x - The x coordinate of the vector, or an IVector3 object.
    * @param {number} [y] - The y coordinate of the vector.
    * @param {number} [z] - The z coordinate of the vector.
    * @returns {Vector3} This vector, after the components have been set.
    */
    set(x, y, z) {
        if (typeof x === 'number') {
            if (typeof y === 'number' && typeof z === 'number') {
                this.x = x;
                this.y = y;
                this.z = z;
            }
            else {
                this.x = x;
                this.y = x;
                this.z = x;
            }
        }
        else {
            this.set(x.x, x.y, x.z);
        }
        return this;
    }
    /**
    * Sets the components of the vector to the minimum of the current components and the given values.
    * @param {IVector3|number} x - The x coordinate of the vector, or a number to compare to the current x component.
    * @param {number} [y] - The y coordinate of the vector, or a number to compare to the current y component.
    * @param {number} [z] - The z coordinate of the vector, or a number to compare to the current z component.
    * @returns {Vector3} This vector, after the components have been set.
    */
    min(x, y, z) {
        if (typeof x === 'number') {
            if (typeof y === 'number' && typeof z === 'number') {
                this.x = Math.min(this.x, x);
                this.y = Math.min(this.y, y);
                this.z = Math.min(this.z, z);
            }
            else {
                this.x = Math.min(this.x, x);
                this.y = Math.min(this.y, x);
                this.z = Math.min(this.z, x);
            }
        }
        else {
            this.min(x.x, x.y, x.z);
        }
        return this;
    }
    /**
     * Adds the given values to the components of the vector.
     * @param {IVector3|number} x - The x coordinate of the vector, or a number to add to the current x component.
     * @param {number} [y] - The y coordinate of the vector, or a number to add to the current y component.
     * @param {number} [z] - The z coordinate of the vector, or a number to add to the current z component.
     * @returns {Vector3} This vector, after the values have been added.
     */
    add(x, y, z) {
        if (typeof x === 'number') {
            if (typeof y === 'number' && typeof z === 'number') {
                this.x += x;
                this.y += y;
                this.z += z;
            }
            else {
                this.x += x;
                this.y += x;
                this.z += x;
            }
        }
        else {
            this.add(x.x, x.y, x.z);
        }
        return this;
    }
    /**
     * Subtracts the given values from the components of the vector.
     * @param {IVector3|number} x - The x coordinate of the vector, or a number to subtract from the current x component.
     * @param {number} [y] - The y coordinate of the vector, or a number to subtract from the current y component.
     * @param {number} [z] - The z coordinate of the vector, or a number to subtract from the current z component.
     * @returns {Vector3} This vector, after the values have been subtracted.
     */
    sub(x, y, z) {
        if (typeof x === 'number') {
            if (typeof y === 'number' && typeof z === 'number') {
                this.x -= x;
                this.y -= y;
                this.z -= z;
            }
            else {
                this.y -= x;
                this.z -= x;
                this.x -= x;
            }
        }
        else {
            this.sub(x.x, x.y, x.z);
        }
        return this;
    }
    /**
     * Multiplies the components of the vector by the given values.
     * @param {number|IVector3} x - The x coordinate of the vector, or a number to multiply the current x component by.
     * @param {number} [y] - The y coordinate of the vector, or a number to multiply the current y component by.
     * @param {number} [z] - The z coordinate of the vector, or a number to multiply the current z component by.
     * @returns {Vector3} This vector, after the components have been multiplied.
     */
    scl(x, y, z) {
        if (typeof x === 'number') {
            if (typeof y === 'number' && typeof z === 'number') {
                this.x *= x;
                this.y *= y;
                this.z *= z;
            }
            else {
                this.x *= x;
                this.y *= x;
                this.z *= x;
            }
        }
        else {
            this.scl(x.x, x.y, x.z);
        }
        return this;
    }
    /**
     * Divides the components of the vector by the given values.
     * @param {number|IVector3} x - The x coordinate of the vector, or a number to divide the current x component by.
     * @param {number} [y] - The y coordinate of the vector, or a number to divide the current y component by.
     * @param {number} [z] - The z coordinate of the vector, or a number to divide the current z component by.
     * @returns {Vector3} This vector, after the components have been divided.
     */
    div(x, y, z) {
        if (typeof x === 'number') {
            if (typeof y === 'number' && typeof z === 'number') {
                this.x /= x;
                this.y /= y;
                this.z /= z;
            }
            else {
                this.x /= x;
                this.y /= x;
                this.z /= x;
            }
        }
        else {
            this.div(x.x, x.y, x.z);
        }
        return this;
    }
    /**
     * Calculates the length of the vector.
     * @returns {number} The length of the vector.
     */
    len() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }
    /**
     * Calculates the squared length of the vector.
     * @returns {number} The squared length of the vector.
     */
    len2() {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
    }
    /**
     * Checks if this vector is equal to another vector.
     * @param {Vector3} other - The other vector to compare to.
     * @returns {boolean} Whether the two vectors are equal.
     */
    equals(other) {
        return this.x.toFixed(2) === other.x.toFixed(2) &&
            this.y.toFixed(2) === other.y.toFixed(2) &&
            this.z.toFixed(2) === other.z.toFixed(2);
    }
    /**
     * 计算两个向量的叉积。
     *
     * @param other 另一个向量，与当前向量进行叉积计算。
     * @returns 返回一个新的向量，表示两个向量的叉积。
     */
    crs(other) {
        return new Vector3(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
    }
    /**
     * Calculates the distance between this vector and another vector.
     * @param {Vector3} vec - The other vector to calculate the distance to.
     * @returns {number} The distance between the two vectors.
     */
    distance(vec) {
        return this.cpy().sub(vec).len();
    }
    /**
     * Converts the vector to a string.
     * @returns {string} The string representation of the vector.
     */
    toString() {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }
    /**
     * Returns the string tag of the vector, which is its string representation.
     * @returns {string} The string representation of the vector.
     */
    [Symbol.toStringTag]() {
        return this.toString();
    }
    /**
     * Floors the components of the vector.
     * @returns {Vector3} This vector, after the components have been floored.
     */
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    }
    /**
     * Rounds the components of the vector.
     * @returns {Vector3} This vector, after the components have been rounded.
     */
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    }
    /**
     * Ceils the components of the vector.
     * @returns {Vector3} This vector, after the components have been ceiled.
     */
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    }
    /**
     * Takes the absolute value of the components of the vector.
     * @returns {Vector3} This vector, after the components have been taken absolute.
     */
    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        this.z = Math.abs(this.z);
        return this;
    }
    /**
     * Normalizes the vector.
     * @returns {Vector3} This vector, after it has been normalized.
     */
    normalize() {
        this.div(this.len());
        return this;
    }
    /**
     * Clones the vector.
     * @returns {Vector3} A new vector with the same components as this vector.
     */
    cpy() {
        return new Vector3(this.x, this.y, this.z);
    }
    /**
     * Returns the components of the vector as an array.
     * @returns {number[]} An array containing the x, y, and z components of the vector.
     */
    toArray() {
        return [this.x, this.y, this.z];
    }
    /**
     * Calculates the vertical rotation angle of the vector relative to the x-z plane.
     * The angle ranges from -90 to 90 degrees, with the y-axis pointing vertically upwards, in the left-hand coordinate system.
     * @returns {number} The vertical rotation angle of the vector.
     */
    rotateAngleY() {
        let [x, y, z] = [this.x, this.y, this.z];
        let angle = Math.atan2(y, Math.sqrt(x * x + z * z));
        return angle * 180 / Math.PI;
    }
    /**
    * Calculates the horizontal rotation angle of the vector relative to the x-y vertical plane.
    * The angle ranges from 0 to 360 degrees, with the y-axis pointing vertically upwards, in the left-hand coordinate system.
    * @returns {number} The horizontal rotation angle of the vector.
    */
    rotateAngleX() {
        let [x, y, z] = [this.x, this.y, this.z];
        let angle = Math.atan2(x, z);
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        return angle * 180 / Math.PI;
    }
}
/**
 * The down vector, pointing straight down.
 */
Vector3.down = new Vector3(0, -1, 0);
/**
 * The forward vector, pointing straight ahead.
 */
Vector3.forward = new Vector3(0, 0, 1);
/**
 * The back vector, pointing straight back.
 */
Vector3.back = new Vector3(0, 0, -1);
/**
 * The left vector, pointing straight left.
 */
Vector3.left = new Vector3(-1, 0, 0);
/**
 * The one vector, with all components set to 1.
 */
Vector3.one = new Vector3(1, 1, 1);
/**
 * The right vector, pointing straight right.
 */
Vector3.right = new Vector3(1, 0, 0);
/**
 * The up vector, pointing straight up.
 */
Vector3.up = new Vector3(0, 1, 0);
/**
 * The zero vector, with all components set to 0.
 */
Vector3.zero = new Vector3(0, 0, 0);
class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}
class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    // 在链表末尾添加一个元素
    append(value) {
        const newNode = new ListNode(value);
        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        }
        else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.size++;
    }
    // 在链表头部添加一个元素
    prepend(value) {
        const newNode = new ListNode(value);
        newNode.next = this.head;
        this.head = newNode;
        if (this.tail === null) {
            this.tail = newNode;
        }
        this.size++;
    }
    // 删除第一个匹配的元素
    delete(value) {
        if (this.head === null)
            return false;
        if (this.head.value === value) {
            this.head = this.head.next;
            if (this.head === null) {
                this.tail = null;
            }
            this.size--;
            return true;
        }
        let current = this.head;
        while (current.next !== null) {
            if (current.next.value === value) {
                current.next = current.next.next;
                if (current.next === null) {
                    this.tail = current;
                }
                this.size--;
                return true;
            }
            current = current.next;
        }
        return false;
    }
    // 删除头部元素
    deleteHead() {
        if (this.head === null)
            return null;
        const value = this.head.value;
        this.head = this.head.next;
        if (this.head === null) {
            this.tail = null;
        }
        this.size--;
        return value;
    }
    // 删除尾部元素
    deleteTail() {
        if (this.head === null)
            return null;
        if (this.head === this.tail) {
            const value = this.head.value;
            this.head = null;
            this.tail = null;
            this.size--;
            return value;
        }
        let current = this.head;
        while (current.next !== this.tail && current.next !== null) {
            current = current.next;
        }
        const value = this.tail.value;
        this.tail = current;
        this.tail.next = null;
        this.size--;
        return value;
    }
    // 查找元素
    find(value) {
        let current = this.head;
        while (current !== null) {
            if (current.value === value) {
                return current;
            }
            current = current.next;
        }
        return null;
    }
    // 获取链表大小
    getSize() {
        return this.size;
    }
    // 清空链表
    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    // 转换为数组
    toArray() {
        const array = [];
        let current = this.head;
        while (current !== null) {
            array.push(current.value);
            current = current.next;
        }
        return array;
    }
    // 打印链表
    print() {
        console.log(this.toArray().join(' -> '));
    }
    // 插入元素并实时排序
    insertSorted(value, compareFn) {
        const newNode = new ListNode(value);
        if (this.head === null || compareFn(this.head.value, value) >= 0) {
            newNode.next = this.head;
            this.head = newNode;
            if (this.tail === null) {
                this.tail = newNode;
            }
        }
        else {
            let current = this.head;
            while (current.next !== null && compareFn(current.next.value, value) < 0) {
                current = current.next;
            }
            newNode.next = current.next;
            current.next = newNode;
            if (newNode.next === null) {
                this.tail = newNode;
            }
        }
        this.size++;
    }
    // 对链表进行排序
    sort(compareFn) {
        const sortedArray = this.toArray().sort(compareFn);
        this.clear();
        for (const value of sortedArray) {
            this.append(value);
        }
    }
    // 获取链表的最后一个节点
    getTail() {
        return this.tail;
    }
}
// 示例用法
const list = new LinkedList();
list.print(); // 输出: 3 -> 1 -> 2
// 使用插入排序
const compareNumbers = (a, b) => a - b;
list.insertSorted(4, compareNumbers);
list.insertSorted(2, compareNumbers);
list.insertSorted(3, compareNumbers);
list.deleteHead();
list.insertSorted(1, compareNumbers);
list.print(); // 输出: 1 -> 2 -> 3 -> 4
// 使用链表排序
list.sort(compareNumbers);
list.print(); // 输出: 1 -> 2 -> 3 -> 4
console.log(list.deleteHead()); // 输出: 1
list.print(); // 输出: 2 -> 3 -> 4
console.log(list.find(2)); // 输出: ListNode { value: 2, next: ListNode { value: 3, next: ListNode { value: 4, next: null } } }
console.log(list.delete(2)); // 输出: true
list.print(); // 输出: 3 -> 4
console.log(list.getSize()); // 输出: 2
list.clear();
console.log(list.getSize()); // 输出: 0
// // 使用字符串的示例
// const stringList = new LinkedList<string>();
// stringList.append("banana");
// stringList.append("apple");
// stringList.append("cherry");
// const compareStrings = (a: string, b: string) => a.localeCompare(b);
// stringList.sort(compareStrings);
// stringList.print(); // 输出: apple -> banana -> cherry
// let queue: LinkedList<[Vector3, number]> = new LinkedList();
// let nextQueue: LinkedList<[Vector3, number]> = new LinkedList();
// // 初始化队列，从中心点开始
// nextQueue.append([new Vector3().cpy().set(0, 0, 0), 0]);
// let currentLen = 0;
// let num = 0;
// while (currentLen < 10) {
//     console.warn(currentLen)
//     while (queue.size > 0) {
//         const current = queue.deleteHead()!;
//         let len = current[1];
//         if (len > currentLen) {
//             currentLen = len;
//         }
//         // 处理当前点
//         // 获取当前点的所有邻居
//         const neighbors = [
//             current[0].cpy().add(1, 0, 0),
//             current[0].cpy().add(-1, 0, 0),
//             current[0].cpy().add(0, 1, 0),
//             current[0].cpy().add(0, -1, 0),
//             current[0].cpy().add(0, 0, 1),
//             current[0].cpy().add(0, 0, -1)
//         ];
//         // 将未访问过的邻居加入队列
//         for (const neighbor of neighbors) {
//             let len = neighbor.len();
//             if (currentLen < len && len <= 50) {
//                 nextQueue.insertSorted([neighbor, len], (a, b) => a[1] - b[1]);
//             }
//         }
//     }
//     if (currentLen == null) break;
//     queue = nextQueue;
//     nextQueue = new LinkedList();
//     currentLen = queue.getTail()!.value[1];
//     console.log(currentLen)
// }
//# sourceMappingURL=link.js.map