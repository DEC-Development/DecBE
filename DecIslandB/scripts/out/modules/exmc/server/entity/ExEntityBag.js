import { EquipmentSlot } from "@minecraft/server";
export default class ExEntityBag {
    constructor(entity) {
        this._entity = entity;
        this.bagComponent = entity.getComponent("minecraft:inventory");
        this.equipmentComponent = entity.getComponent("minecraft:equippable");
    }
    getItem(arg) {
        if (typeof (arg) === "number") {
            return this.bagComponent.container.getItem(arg);
        }
        if (arg in EquipmentSlot) {
            return this.getEquipment(arg);
        }
        let search = this.searchItem(arg);
        if (!search) {
            return undefined;
        }
        return search.getItem();
    }
    searchItem(id) {
        let slots = this.getAllSlots();
        for (let i of slots) {
            if (i.getItem() === undefined) {
                continue;
            }
            if (i.typeId === id) {
                return i;
            }
        }
        return undefined;
    }
    searchItems(items) {
        let slots = this.getAllSlots();
        let result;
        result = {};
        for (let i of items) {
            result[i] = undefined;
        }
        for (let i of slots) {
            if (i.getItem() !== undefined && items.indexOf(i.typeId) !== -1 && result[i.typeId] === undefined) {
                result[i.typeId] = i;
            }
        }
        return result;
    }
    searchProjectile(arg) {
        if (typeof (arg) === 'string') {
            let slots = this.getAllSlots();
            for (let i of slots) {
                if (i.getItem() !== undefined && i.typeId === arg) {
                    return true;
                }
            }
            return false;
        }
        else {
            let slots = this.getAllSlots();
            for (let i of slots) {
                if (i.getItem() !== undefined && arg.indexOf(i.typeId) !== -1) {
                    return i.typeId;
                }
            }
            return undefined;
        }
    }
    indexOf(id) {
        var _a;
        for (let i = 0; i < this.size(); i++) {
            if (((_a = this.bagComponent.container.getItem(i)) === null || _a === void 0 ? void 0 : _a.typeId) === id) {
                return i;
            }
        }
        return -1;
    }
    getAllItems() {
        let items = [];
        items.push(this.itemOnOffHand);
        if (this.bagComponent.container) {
            for (let i = 0; i < this.size(); i++) {
                items.push(this.bagComponent.container.getItem(i));
            }
            ;
        }
        items.push(this.equipmentOnHead);
        items.push(this.equipmentOnChest);
        items.push(this.equipmentOnLegs);
        items.push(this.equipmentOnFeet);
        return items;
    }
    getAllSlots() {
        let items = [];
        items.push(this.getSlot(EquipmentSlot.Offhand));
        if (this.bagComponent.container) {
            for (let i = 0; i < this.size(); i++) {
                items.push(this.bagComponent.container.getSlot(i));
            }
            ;
        }
        items.push(this.getSlot(EquipmentSlot.Head));
        items.push(this.getSlot(EquipmentSlot.Chest));
        items.push(this.getSlot(EquipmentSlot.Legs));
        items.push(this.getSlot(EquipmentSlot.Feet));
        return items;
    }
    countAllItems() {
        var _a;
        let items = new Map();
        for (let i of this.getAllItems()) {
            if (i) {
                items.set(i.typeId, i.amount + ((_a = items.get(i.typeId)) !== null && _a !== void 0 ? _a : 0));
            }
        }
        ;
        return items;
    }
    clearItem(msg, amount) {
        //lly写完后发现，好像不用把副手弄成-1，不然每次都会检测是不是-1，似乎刚开始检测一下就好（但不知道怎么改qwq
        if (typeof msg === 'string') {
            let id = msg;
            let res = 0;
            for (let i = -1; i < this.size(); i++) {
                let item;
                if (i === -1) {
                    item = this.itemOnOffHand;
                }
                else {
                    item = this.getItem(i);
                }
                if ((item === null || item === void 0 ? void 0 : item.typeId) === id) {
                    let suc = this.clearItem(i, amount);
                    res += suc;
                    amount -= suc;
                    if (amount <= 0) {
                        break;
                    }
                }
            }
            return res;
        }
        else {
            let item;
            if (msg === -1) {
                item = this.itemOnOffHand;
            }
            else {
                item = this.getItem(msg);
            }
            if (item) {
                if (amount >= item.amount) {
                    this.setItem(msg === -1 ? EquipmentSlot.Offhand : msg, undefined);
                    return item.amount;
                }
                else {
                    item.amount -= amount;
                    this.setItem(msg === -1 ? EquipmentSlot.Offhand : msg, item);
                    return amount;
                }
            }
            return 0;
        }
    }
    size() {
        return this.bagComponent.inventorySize;
    }
    type() {
        return this.bagComponent.containerType;
    }
    isPrivate() {
        return this.bagComponent.private;
    }
    isRestrictToOwner() {
        return this.bagComponent.restrictToOwner;
    }
    setItem(slot, item) {
        if (typeof slot === 'string') {
            return this.setEquipment(slot, item);
        }
        return this.bagComponent.container.setItem(slot, item);
    }
    hasItem(itemId) {
        return this.searchItem(itemId) !== undefined;
    }
    addItem(item) {
        this.bagComponent.container.addItem(item);
    }
    getSlot(pos) {
        if (typeof pos === 'string') {
            return this.getEquipmentSlot(pos);
        }
        return this.bagComponent.container.getSlot(pos);
    }
    getEquipment(slot) {
        return this.equipmentComponent.getEquipment(slot);
    }
    setEquipment(slot, equip) {
        return this.equipmentComponent.setEquipment(slot, equip);
    }
    getEquipmentSlot(slot) {
        return this.equipmentComponent.getEquipmentSlot(slot);
    }
    get itemOnMainHand() {
        return this.getItem(EquipmentSlot.Mainhand);
    }
    set itemOnMainHand(item) {
        this.setItem(EquipmentSlot.Mainhand, item);
    }
    get itemOnOffHand() {
        return this.getItem(EquipmentSlot.Offhand);
    }
    set itemOnOffHand(item) {
        this.setItem(EquipmentSlot.Offhand, item);
    }
    get equipmentOnHead() {
        return this.getItem(EquipmentSlot.Head);
    }
    set equipmentOnHead(item) {
        this.setItem(EquipmentSlot.Head, item);
    }
    get equipmentOnChest() {
        return this.getItem(EquipmentSlot.Chest);
    }
    set equipmentOnChest(item) {
        this.setItem(EquipmentSlot.Chest, item);
    }
    get equipmentOnFeet() {
        return this.getItem(EquipmentSlot.Feet);
    }
    set equipmentOnFeet(item) {
        this.setItem(EquipmentSlot.Feet, item);
    }
    get equipmentOnLegs() {
        return this.getItem(EquipmentSlot.Legs);
    }
    set equipmentOnLegs(item) {
        this.setItem(EquipmentSlot.Legs, item);
    }
}
//# sourceMappingURL=ExEntityBag.js.map