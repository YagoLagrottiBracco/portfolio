// Generated from src/lib/resource-tools.ts by sync-engines.mjs. Do not edit.
const MAX_INPUT = 200_000;
const MAX_CHANGES = 500;
function tooDeep(value) {
    const stack = [[value, 0]];
    while (stack.length) {
        const [item, depth] = stack.pop();
        if (depth > 100)
            return true;
        if (item && typeof item === "object")
            for (const child of Object.values(item))
                stack.push([child, depth + 1]);
    }
    return false;
}
// Normalize decimal lexemes without rounding. Strings are skipped by the tokenizer.
function decimalKey(token) {
    const [mantissa, exponent = "0"] = token.toLowerCase().split("e");
    const negative = mantissa.startsWith("-");
    const [whole, fraction = ""] = (negative ? mantissa.slice(1) : mantissa).split(".");
    const digits = (whole + fraction).replace(/^0+/, "");
    if (!digits)
        return "0";
    const compact = digits.replace(/0+$/, "");
    return `${negative ? "-" : ""}${compact}e${Number(exponent) - fraction.length + digits.length - compact.length}`;
}
function losesNumericPrecision(source) {
    const tokens = /"(?:[^"\\]|\\.)*"|(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
    for (const match of source.matchAll(tokens)) {
        const token = match[1];
        if (!token)
            continue;
        const value = Number(token);
        if (!Number.isFinite(value) ||
            (Number.isInteger(value) && !Number.isSafeInteger(value)) ||
            decimalKey(token) !== decimalKey(String(value)))
            return true;
    }
    return false;
}
export function compareJson(left, right) {
    const result = { changes: [], truncated: false };
    if (left.length > MAX_INPUT || right.length > MAX_INPUT)
        return { ...result, error: "too-large" };
    let a, b;
    try {
        a = JSON.parse(left);
        b = JSON.parse(right);
    }
    catch {
        return { ...result, error: "invalid-json" };
    }
    if (losesNumericPrecision(left) || losesNumericPrecision(right))
        return { ...result, error: "unsafe-number" };
    if (tooDeep(a) || tooDeep(b))
        return { ...result, error: "too-deep" };
    function add(change) {
        if (result.changes.length < MAX_CHANGES)
            result.changes.push(change);
        else
            result.truncated = true;
    }
    function visit(before, after, path) {
        if (result.truncated || before === after)
            return;
        if (before === null ||
            after === null ||
            typeof before !== "object" ||
            typeof after !== "object" ||
            Array.isArray(before) !== Array.isArray(after)) {
            add({ path, kind: "changed", before, after });
            return;
        }
        const keys = [
            ...new Set([...Object.keys(before), ...Object.keys(after)]),
        ].sort((x, y) => Array.isArray(before) ? Number(x) - Number(y) : x.localeCompare(y));
        for (const key of keys) {
            const p = `${path}/${key.replace(/~/g, "~0").replace(/\//g, "~1")}`;
            const x = before[key], y = after[key];
            if (!Object.hasOwn(before, key))
                add({ path: p, kind: "added", after: y });
            else if (!Object.hasOwn(after, key))
                add({ path: p, kind: "removed", before: x });
            else
                visit(x, y, p);
            if (result.truncated)
                break;
        }
    }
    visit(a, b, "");
    return result;
}
export function inspectEnvKeys(reference, candidate) {
    function keys(text) {
        const found = new Set(), duplicates = new Set(), invalid = [];
        text.split(/\r?\n/).forEach((line, i) => {
            if (!line.trim() || line.trimStart().startsWith("#"))
                return;
            const match = /^\s*(?:export\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\s*=/.exec(line);
            if (!match) {
                invalid.push(i + 1);
                return;
            }
            if (found.has(match[1]))
                duplicates.add(match[1]);
            found.add(match[1]);
        });
        return { found, duplicates: [...duplicates].sort(), invalid };
    }
    if (reference.length > MAX_INPUT || candidate.length > MAX_INPUT)
        return {
            missing: [],
            extra: [],
            duplicates: [],
            referenceDuplicates: [],
            invalidLines: [],
            referenceInvalidLines: [],
            error: "too-large",
        };
    const a = keys(reference), b = keys(candidate);
    return {
        missing: [...a.found].filter((k) => !b.found.has(k)).sort(),
        extra: [...b.found].filter((k) => !a.found.has(k)).sort(),
        duplicates: b.duplicates,
        referenceDuplicates: a.duplicates,
        invalidLines: b.invalid,
        referenceInvalidLines: a.invalid,
    };
}
