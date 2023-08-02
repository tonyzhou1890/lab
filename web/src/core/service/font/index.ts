import type * as OpenType from 'opentype.js';

// package font
const local: {
  fontBuffer: null | ArrayBuffer;
  fontParsed: OpenType.Font | null;
  openType: typeof OpenType | null;
  handleError: unknown;
} = {
  fontBuffer: null,
  fontParsed: null,
  openType: null,
  handleError: null,
};

async function checkScript() {
  if (local.openType === null) {
    try {
      const t = await import('opentype.js');
      local.openType = t;
    } catch (e) {
      if (typeof local.handleError === 'function') {
        local.handleError(e);
      } else {
        throw new Error(((e as Error)?.message ?? '') as string);
      }
    }
  }
}

async function parse(
  buffer: ArrayBuffer,
  force = false
): Promise<OpenType.Font | undefined> {
  await checkScript();
  // 这里加 if 是为了解决 ts local.openType 类型可能为 null 的问题。虽然实际上走到这一步已经不会是 null 了。
  if (local.openType) {
    if (!force && buffer === local.fontBuffer && local.fontParsed) {
      return local.fontParsed;
    }
    local.fontParsed = local.openType.parse(buffer);
    local.fontBuffer = buffer;
    return local.fontParsed;
  }
}

async function render(
  buffer: ArrayBuffer,
  text: string,
  ctx: CanvasRenderingContext2D
) {
  await checkScript();
  // 这里加 if 是为了解决 ts local.openType 类型可能为 null 的问题。虽然实际上走到这一步已经不会是 null 了。
  if (local.openType) {
    const font =
      (buffer === local.fontBuffer ? local.fontParsed : null) ||
      local.openType.parse(buffer);
    local.fontBuffer = buffer;
    local.fontParsed = font;
    font.draw(ctx, text);
  }
}

export default {
  parse,
  render,
};
