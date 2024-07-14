import { k } from "../../kaboom";
import type { Comp, GameObj, KaboomCtx } from "../../types";
import type { OpacityComp } from "./opacity";

export function fadeIn(
    this: KaboomCtx,
    time: number = 1,
): Comp {
    let finalOpacity: number;
    let t = 0;
    let done = false;

    return {
        require: ["opacity"],
        add(this: GameObj<OpacityComp>) {
            finalOpacity = this.opacity;
            this.opacity = 0;
        },
        update(this: GameObj<OpacityComp>) {
            if (done) return;
            t += k.dt();
            this.opacity = k.map(t, 0, time, 0, finalOpacity);

            if (t >= time) {
                this.opacity = finalOpacity;
                done = true;
            }
        },
    };
}
