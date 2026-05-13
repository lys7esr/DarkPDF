// Web Worker — performs the actual dark-mode transformation on
// raw pixel buffers without blocking the UI.
//
// Algorithm (per pixel):
//   1.  Compute luminance L (0..255) and saturation S (0..1).
//   2.  If pixel is inside a "preserve" block (image region), keep it.
//   3.  If pixel is highly saturated (colourful), keep it (charts).
//   4.  Otherwise it's text-or-background.  Map L through an
//       inversion curve onto [bg, fg] using the theme:
//          newL = lerp(bg_lum, fg_lum, 1 - L/255)
//       and tint subtly toward theme.accent for mid-tones.
//
// Inputs (via postMessage):
//   { buffer, width, height, mask, cols, rows, blockSize, theme,
//     brightness, contrast }
//
// Output:
//   { buffer }   (transferred back)

self.onmessage = (e) => {
  const {
    buffer, width, height,
    mask, cols, rows, blockSize,
    theme, brightness, contrast
  } = e.data;

  const data = new Uint8ClampedArray(buffer);
  const [bgR, bgG, bgB] = theme.bg;
  const [fgR, fgG, fgB] = theme.fg;
  const [acR, acG, acB] = theme.accent;
  const bgPow = theme.bgPower;
  const fgPow = theme.fgPower;
  const preserveSat = theme.preserveSat;

  const bgLum = 0.2126 * bgR + 0.7152 * bgG + 0.0722 * bgB;
  const fgLum = 0.2126 * fgR + 0.7152 * fgG + 0.0722 * fgB;

  const brightnessAdj = (brightness - 1) * 40; // -40..+40
  const contrastFactor = contrast;             // 0.7..1.4

  for (let y = 0; y < height; y++) {
    const by = (y / blockSize) | 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];

      // Block lookup — preserve image regions verbatim
      const bx = (x / blockSize) | 0;
      if (mask[by * cols + bx] === 1) continue;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;

      // Preserve highly saturated pixels (coloured text, chart fills,
      // logos, syntax highlighting...) but darken them a touch so they
      // don't glow against a black page.
      if (sat >= preserveSat) {
        // Slight luminance pull-down for saturated pixels on dark bg
        data[idx]     = r * 0.92;
        data[idx + 1] = g * 0.92;
        data[idx + 2] = b * 0.92;
        continue;
      }

      // Grayscale-ish pixel → text or background
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const norm = lum / 255;          // 0..1, 1 = white
      const inv = 1 - norm;            // 1 = was white background flipped to fg-side

      // Decide whether this pixel leans toward background or text.
      // Anything brighter than 0.78 → background.  Darker than 0.35 → text.
      // In-between is anti-aliased edges → blend smoothly.
      let newLum;
      if (norm > 0.78) {
        // background side — pull toward bg
        const t = (norm - 0.78) / 0.22; // 0..1
        newLum = mix(bgLum, bgLum * (1 - 0.05 * t), bgPow);
      } else if (norm < 0.35) {
        // text side — pull toward fg
        const t = 1 - norm / 0.35;       // 0..1, 1 = pure black
        newLum = mix(fgLum * 0.85, fgLum, t * fgPow);
      } else {
        // anti-alias edge / mid grey — interpolate between bg and fg
        const t = (0.78 - norm) / 0.43;  // 0..1 from bg side to text side
        newLum = mix(bgLum, fgLum, t);
      }

      // Apply contrast around mid-grey, then brightness offset
      newLum = (newLum - 128) * contrastFactor + 128 + brightnessAdj;
      newLum = clamp(newLum, 0, 255);

      // Recolour: choose hue from bg or fg or accent based on where
      // we ended up on the luminance ramp.
      const ramp = (newLum - bgLum) / Math.max(1, fgLum - bgLum); // 0..1
      const tR = mix3(bgR, acR, fgR, ramp);
      const tG = mix3(bgG, acG, fgG, ramp);
      const tB = mix3(bgB, acB, fgB, ramp);

      // Scale by how this pixel's intended luminance compares to the
      // ramp's natural luminance, so we never get washed out.
      const tLum = 0.2126 * tR + 0.7152 * tG + 0.0722 * tB || 1;
      const k = newLum / tLum;
      data[idx]     = clamp(tR * k, 0, 255);
      data[idx + 1] = clamp(tG * k, 0, 255);
      data[idx + 2] = clamp(tB * k, 0, 255);
    }
  }

  self.postMessage({ buffer: data.buffer }, [data.buffer]);
};

function mix(a, b, t) { return a + (b - a) * t; }
function mix3(a, b, c, t) {
  // Piecewise linear: t in [0, 0.5] -> a..b ; [0.5, 1] -> b..c
  if (t <= 0.5) return mix(a, b, t * 2);
  return mix(b, c, (t - 0.5) * 2);
}
function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }