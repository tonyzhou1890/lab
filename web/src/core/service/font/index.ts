import type * as OpenType from 'opentype.js';

// package font
const config: {
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
  if (config.openType === null) {
    try {
      const t = await import('opentype.js');
      config.openType = t;
    } catch (e) {
      if (typeof config.handleError === 'function') {
        config.handleError(e);
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
  checkScript();
  // 这里加 if 是为了解决 ts config.openType 类型可能为 null 的问题。虽然实际上走到这一步已经不会是 null 了。
  if (config.openType) {
    if (!force && buffer === config.fontBuffer && config.fontParsed) {
      return config.fontParsed;
    }
    config.fontParsed = config.openType.parse(buffer);
    config.fontBuffer = buffer;
    return config.fontParsed;
  }
}

async function render(
  buffer: ArrayBuffer,
  text: string,
  ctx: CanvasRenderingContext2D
) {
  checkScript();
  // 这里加 if 是为了解决 ts config.openType 类型可能为 null 的问题。虽然实际上走到这一步已经不会是 null 了。
  if (config.openType) {
    const font =
      (buffer === config.fontBuffer ? config.fontParsed : null) ||
      config.openType.parse(buffer);
    config.fontBuffer = buffer;
    config.fontParsed = font;
    font.draw(ctx, text);
  }
}

export default {
  parse,
  render,
};
