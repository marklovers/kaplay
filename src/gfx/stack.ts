import { gfx } from "../kaboom";
import { type Mat4, vec2, type Vec2Args } from "../math";

export function pushTranslate(...args: Vec2Args | [undefined]) {
    if (args[0] === undefined) return;

    const p = vec2(...args);
    if (p.x === 0 && p.y === 0) return;
    gfx.transform.translate(p);
}

export function pushTransform() {
    gfx.transformStack.push(gfx.transform.clone());
}

export function pushMatrix(m: Mat4) {
    gfx.transform = m.clone();
}

export function pushScale(
    ...args: Vec2Args | [undefined] | [undefined, undefined]
) {
    if (args[0] === undefined) return;

    const p = vec2(...args);
    if (p.x === 1 && p.y === 1) return;
    gfx.transform.scale(p);
}

export function pushRotate(a: number | undefined) {
    if (!a) return;

    gfx.transform.rotate(a);
}

export function popTransform() {
    if (gfx.transformStack.length > 0) {
        // if there's more than 1 element, it will return obviously a Mat4
        gfx.transform = gfx.transformStack.pop()!;
    }
}

export function flush() {
    gfx.renderer.flush();
}

// get game width
export function width(): number {
    return gfx.width;
}

// get game height
export function height(): number {
    return gfx.height;
}

export function getViewportScale() {
    return (gfx.viewport.width + gfx.viewport.height)
        / (gfx.width + gfx.height);
}
