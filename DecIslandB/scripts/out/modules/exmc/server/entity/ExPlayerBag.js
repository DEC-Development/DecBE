import ExEntityBag from './ExEntityBag.js';
export default class ExPlayerBag extends ExEntityBag {
    constructor(player) {
        super(player);
        this._player = player;
    }
    getSelectedSlot() {
        return this._player.selectedSlotIndex;
    }
}
//# sourceMappingURL=ExPlayerBag.js.map