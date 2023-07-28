import type * as OpenType from 'opentype.js';

// package font
const config: {
  fontBuffer: null | ArrayBuffer;
  openType: typeof OpenType | null;
  handleError: unknown;
} = {
  fontBuffer: null,
  openType: null,
  handleError: null,
};

async function render(
  buffer: ArrayBuffer,
  text: string,
  ctx: CanvasRenderingContext2D
) {
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

  // 这里加 if 是为了解决 ts config.openType 类型可能为 null 的问题。虽然实际上走到这一步已经不会是 null 了。
  if (config.openType) {
    const font = config.openType.parse(buffer);
    font.draw(ctx, text);
  }
}

export default {
  render,
};
