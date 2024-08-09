import format from '../../../modules/exmc/utils/format.js';
export default class TalentData {
    constructor() {
        this.pointUsed = 0;
        this.occupation = Occupation.EMPTY;
        this.talents = [];
    }
    static getDescription(lang, occupation, id, level) {
        let s = TalentData.calculateTalent(occupation, id, level);
        switch (id) {
            case Talent.VIENTIANE: return format(lang.talentWanxiangDesc, `§o§e${s}§r`);
            case Talent.CLOAD_PIERCING: return format(lang.talentChuanyunDesc, `§o§b${s}％§r`);
            case Talent.ARMOR_BREAKING: return format(lang.talentChuanjiaDesc, `§o§b${s}％§r`, `§o§e20§r`);
            case Talent.SANCTION: return format(lang.talentZhicaiDesc, `§o§b${s}％§r`);
            case Talent.DEFENSE: return format(lang.talentFangyuDesc, `§o§b${s}％§r`);
            case Talent.CHARGING: return format(lang.talentChongnengDesc, `§o§b${s}％§r`);
            case Talent.RELOAD: return format(lang.talentChongzhuangDesc, `§o§b${s}％§r`);
            case Talent.CONVERGE: return format(lang.talentHuiliuDesc, `§o§b${s}％§r`);
            case Talent.SOURCE: return format(lang.talentYuanquanDesc, `§o§e${s}§r`);
            case Talent.SUDDEN_STRIKE: return format(lang.talentTuxiDesc, `§o§b${s}％§r`);
            case Talent.REGENERATE: return format(lang.talentZaishengDesc, `§o§e${s}§r`);
            default: return "";
        }
    }
    static getLevel(data, id) {
        for (let i of data.talents) {
            if (i.id === id)
                return i.level;
        }
        return 0;
    }
    static hasOccupation(data) {
        return data.occupation.id !== Occupation.EMPTY.id;
    }
    static chooseOccupation(data, occupation) {
        data.occupation = occupation;
        let set = new Set([
            Talent.VIENTIANE,
            Talent.CLOAD_PIERCING,
            Talent.ARMOR_BREAKING,
            Talent.SANCTION,
            Talent.DEFENSE,
            Talent.CONVERGE,
            Talent.SOURCE
        ]);
        for (let i of occupation.talentId) {
            set.add(i);
        }
        set.forEach((i) => {
            data.talents.push(new Talent(i, 0));
        });
    }
    static calculateTalent(occupation, talentId, level) {
        switch (talentId) {
            case Talent.VIENTIANE:
                return level * (TalentData.isOccupationTalent(occupation, talentId) ? 30 : 15) / 40;
            case Talent.CLOAD_PIERCING:
                return level * (TalentData.isOccupationTalent(occupation, talentId) ? 100 : 50) / 40;
            case Talent.ARMOR_BREAKING:
                return level * (TalentData.isOccupationTalent(occupation, talentId) ? 25 : 10) / 40;
            case Talent.SANCTION:
                return level * (TalentData.isOccupationTalent(occupation, talentId) ? 50 : 25) / 40;
            case Talent.DEFENSE:
                return level * (TalentData.isOccupationTalent(occupation, talentId) ? 30 : 15) / 40;
            case Talent.CHARGING:
                return level * (TalentData.isOccupationTalent(occupation, talentId) ? 35 : 15) / 40;
            case Talent.RELOAD:
                return level * (TalentData.isOccupationTalent(occupation, talentId) ? 35 : 15) / 40;
            case Talent.CONVERGE:
                return level * (TalentData.isOccupationTalent(occupation, talentId) ? 100 : 40) / 40;
            case Talent.SUDDEN_STRIKE:
                return level * (TalentData.isOccupationTalent(occupation, talentId) ? 80 : 0) / 40;
            case Talent.REGENERATE:
                return level * (TalentData.isOccupationTalent(occupation, talentId) ? 20 : 0) / 40;
            case Talent.SOURCE:
                return level * (TalentData.isOccupationTalent(occupation, talentId) ? 80 : 40) / 40;
            default:
                return 0;
        }
    }
    static isOccupationTalent(occupation, id) {
        return occupation.talentId.indexOf(id) !== -1;
    }
}
export class Talent {
    constructor(id, level) {
        this.id = id;
        this.level = level;
    }
    static getCharacter(lang, id) {
        switch (id) {
            case Talent.VIENTIANE:
                return lang.talentWanxiang;
            case Talent.CLOAD_PIERCING:
                return lang.talentChuanyun;
            case Talent.ARMOR_BREAKING:
                return lang.talentChuanjia;
            case Talent.SANCTION:
                return lang.talentZhicai;
            case Talent.DEFENSE:
                return lang.talentFangyu;
            case Talent.CHARGING:
                return lang.talentChongneng;
            case Talent.RELOAD:
                return lang.talentChongzhuang;
            case Talent.CONVERGE:
                return lang.talentHuiliu;
            case Talent.SUDDEN_STRIKE:
                return lang.talentTuxi;
            case Talent.REGENERATE:
                return lang.talentZaisheng;
            case Talent.SOURCE:
                return lang.talentYuanquan;
            default:
                return lang.talentWeizhi;
        }
    }
}
Talent.VIENTIANE = 1;
Talent.CLOAD_PIERCING = 2;
Talent.ARMOR_BREAKING = 3;
Talent.SANCTION = 4;
Talent.DEFENSE = 5;
/** @deprecated */
Talent.CHARGING = 6;
/** @deprecated */
Talent.RELOAD = 7;
Talent.CONVERGE = 8;
Talent.SUDDEN_STRIKE = 9;
Talent.REGENERATE = 10;
Talent.SOURCE = 11;
export class Occupation {
    getCharacter(lang) {
        switch (this.id) {
            case 0:
                return lang.occupationEmpty;
            case 1:
                return lang.occupationGuard;
            case 2:
                return lang.occupationWarrior;
            case 3:
                return lang.occupationAssassin;
            case 4:
                return lang.occupationArcher;
            case 5:
                return lang.occupationWarlock;
            case 6:
                return lang.occupationPriest;
        }
        return "";
    }
    constructor(occupation, talentId) {
        this.id = occupation;
        this.talentId = talentId;
    }
}
Occupation.EMPTY = new Occupation(0, []);
Occupation.GUARD = new Occupation(1, [Talent.VIENTIANE, Talent.ARMOR_BREAKING]);
Occupation.WARRIOR = new Occupation(2, [Talent.SANCTION, Talent.DEFENSE]);
Occupation.ASSASSIN = new Occupation(3, [Talent.SANCTION, Talent.SUDDEN_STRIKE]);
Occupation.ARCHER = new Occupation(4, [Talent.CLOAD_PIERCING, Talent.ARMOR_BREAKING]);
Occupation.WARLOCK = new Occupation(5, [Talent.CONVERGE, Talent.SOURCE]);
Occupation.PRIEST = new Occupation(6, [Talent.CONVERGE, Talent.REGENERATE]);
Occupation.keys = [Occupation.GUARD, Occupation.WARRIOR, Occupation.ASSASSIN, Occupation.ARCHER, Occupation.WARLOCK, Occupation.PRIEST];
//# sourceMappingURL=TalentData.js.map