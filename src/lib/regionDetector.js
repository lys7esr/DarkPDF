// Lightweight image-region detection.
// Splits the page into a grid and flags blocks that look like photos /
// complex graphics (high local variance + decent saturation) so the
// pixel transform can leave them alone.
//
// Output: a Uint8Array mask (1 byte per block) of size cols*rows.
//   mask[i] === 1  → preserve original pixels in this block
//   mask[i] === 0  → transformable (text / background)
//
// We also smooth the mask so single-block holes inside an image
// region are filled in.

export function detectImageRegions(imageData, blockSize = 24) {
  const { data, width, height } = imageData;
  const cols = Math.ceil(width / blockSize);
  const rows = Math.ceil(height / blockSize);
  const mask = new Uint8Array(cols * rows);

  for (let by = 0; by < rows; by++) {
    for (let bx = 0; bx < cols; bx++) {
      const x0 = bx * blockSize;
      const y0 = by * blockSize;
      const x1 = Math.min(x0 + blockSize, width);
      const y1 = Math.min(y0 + blockSize, height);

      let sumL = 0, sumL2 = 0, sumSat = 0, n = 0;
      let nonGray = 0;

      for (let y = y0; y < y1; y += 2) {
        for (let x = x0; x < x1; x += 2) {
          const idx = (y * width + x) * 4;
          const r = data[idx], g = data[idx + 1], b = data[idx + 2];

          // Rec. 709 luminance
          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const sat = max === 0 ? 0 : (max - min) / max;

          sumL += lum;
          sumL2 += lum * lum;
          sumSat += sat;
          if (sat > 0.18) nonGray++;
          n++;
        }
      }

      if (n === 0) continue;
      const meanL = sumL / n;
      const varL = Math.max(0, sumL2 / n - meanL * meanL);
      const stdL = Math.sqrt(varL);
      const meanSat = sumSat / n;
      const colorRatio = nonGray / n;

      // Heuristic: a block is "image-like" if it has high luminance
      // variance OR is broadly colourful.  Text blocks have high
      // variance too, but they're almost grayscale, so saturation
      // helps disambiguate.
      const isPhotoLike = (stdL > 38 && meanSat > 0.12) || colorRatio > 0.35;
      const isVeryColorful = meanSat > 0.28;

      if (isPhotoLike || isVeryColorful) {
        mask[by * cols + bx] = 1;
      }
    }
  }

  return { mask, cols, rows, blockSize };
}

// Morphological dilation + closing: fills small gaps inside image
// regions so the converted page doesn't get speckled patches.
export function dilateMask(maskInfo, iterations = 1) {
  const { cols, rows } = maskInfo;
  let mask = maskInfo.mask;

  for (let it = 0; it < iterations; it++) {
    const next = new Uint8Array(mask.length);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let v = mask[y * cols + x];
        if (!v) {
          // Mark if any of 4 neighbours are set
          if (
            (x > 0 && mask[y * cols + x - 1]) ||
            (x < cols - 1 && mask[y * cols + x + 1]) ||
            (y > 0 && mask[(y - 1) * cols + x]) ||
            (y < rows - 1 && mask[(y + 1) * cols + x])
          ) {
            v = 1;
          }
        }
        next[y * cols + x] = v;
      }
    }
    mask = next;
  }
  return { ...maskInfo, mask };
}