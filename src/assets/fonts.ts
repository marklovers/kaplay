import {
    DEF_FONT,
    DEF_FONT_FILTER,
    DEF_TEXT_CACHE_SIZE,
    MAX_TEXT_CACHE_SIZE,
} from "../constants";
import { Asset, loadProgress } from "../gfx/assets";
import type { DrawTextOpt } from "../gfx/draw/drawText";
import { assets, globalOpt } from "../kaboom";
import { rgb } from "../math/color";
import type { BitmapFontData, LoadFontOpt, Outline, TexFilter } from "../types";
import { getBitmapFont } from "./bitmapFont";

export class FontData {
    fontface: FontFace;
    filter: TexFilter = DEF_FONT_FILTER;
    outline: Outline | null = null;
    size: number = DEF_TEXT_CACHE_SIZE;
    constructor(face: FontFace, opt: LoadFontOpt = {}) {
        this.fontface = face;
        this.filter = opt.filter ?? DEF_FONT_FILTER;
        this.size = opt.size ?? DEF_TEXT_CACHE_SIZE;
        if (this.size > MAX_TEXT_CACHE_SIZE) {
            throw new Error(`Max font size: ${MAX_TEXT_CACHE_SIZE}`);
        }
        if (opt.outline) {
            this.outline = {
                width: 1,
                color: rgb(0, 0, 0),
            };
            if (typeof opt.outline === "number") {
                this.outline.width = opt.outline;
            } else if (typeof opt.outline === "object") {
                if (opt.outline.width) {
                    this.outline.width = opt.outline.width;
                }
                if (opt.outline.color) {
                    this.outline.color = opt.outline.color;
                }
            }
        }
    }
}

export function resolveFont(
    src: DrawTextOpt["font"],
):
    | FontData
    | Asset<FontData>
    | BitmapFontData
    | Asset<BitmapFontData>
    | string
    | null
    | void
{
    if (!src) {
        return resolveFont(globalOpt.font ?? DEF_FONT);
    }
    if (typeof src === "string") {
        const bfont = getBitmapFont(src);
        const font = getFont(src);
        if (bfont) {
            return bfont.data ?? bfont;
        } else if (font) {
            return font.data ?? font;
        } else if (
            document.fonts.check(`${DEF_TEXT_CACHE_SIZE}px ${src}`)
        ) {
            return src;
        } else if (loadProgress() < 1) {
            return null;
        } else {
            throw new Error(`Font not found: ${src}`);
        }
    } else if (src instanceof Asset) {
        return src.data ? src.data : src;
    }

    return src;
}

export function getFont(name: string): Asset<FontData> | null {
    return assets.fonts.get(name) ?? null;
}
