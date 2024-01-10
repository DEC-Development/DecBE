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
        if (search === -1) {
            return undefined;
        }
        return this.bagComponent.container.getItem(search);
    }
    searchItem(id) {
        let items = this.getAllItems();
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item === undefined) {
                continue;
            }
            if (item.typeId === id) {
                return i;
            }
        }
        return -1;
    }
    getAllItems() {
        let items = [];
        for (let i = 0; i < this.size(); i++) {
            items.push(this.bagComponent.container.getItem(i));
        }
        ;
        return items;
    }
    countAllItems() {
        var _a;
        let items = new Map();
        for (let i = 0; i < this.size(); i++) {
            let item = this.getItem(i);
            if (item)
                items.set(item.typeId, item.amount + ((_a = items.get(item.typeId)) !== null && _a !== void 0 ? _a : 0));
        }
        ;
        return items;
    }
    clearItem(msg, amount) {
        if (typeof msg === 'string') {
            let id = msg;
            let res = 0;
            for (let i = 0; i < this.size(); i++) {
                let item = this.getItem(i);
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
            let item = this.getItem(msg);
            if (item) {
                if (amount >= item.amount) {
                    this.setItem(msg, undefined);
                    return item.amount;
                }
                else {
                    item.amount -= amount;
                    this.setItem(msg, item);
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
    hasItem(itemId, containsEq = false) {
        if (containsEq) {
            //TTOD 懒得写了
        }
        return this.searchItem(itemId) !== -1;
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