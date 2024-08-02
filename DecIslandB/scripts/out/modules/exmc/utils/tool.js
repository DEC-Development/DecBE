export function zeroIfNaN(i) {
    const s = (typeof i === "string" ? parseFloat(i) : i);
    return isNaN(s) ? s : 0;
}
export function falseIfError(func) {
    try {
        return func();
    }
    catch (err) {
        return false;
    }
}
export function undefIfError(func) {
    try {
        return func();
    }
    catch (err) {
        return undefined;
    }
}
//# sourceMappingURL=tool.js.map