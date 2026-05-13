// Each theme defines:
//  - bg:        target page background colour
//  - fg:        target text/foreground colour
//  - accent:    tint applied to mid-luminance text/strokes
//  - bgPower:   how strongly background gets pulled toward `bg` (0..1)
//  - fgPower:   how strongly text gets pulled toward `fg` (0..1)
//  - preserveSat: minimum saturation above which a pixel is treated as
//                  "colourful" and left untouched
export const THEMES = {
  amoled: {
    id: 'amoled',
    label: 'AMOLED Black',
    swatch: '#000000',
    bg: [0, 0, 0],
    fg: [232, 232, 232],
    accent: [200, 215, 255],
    bgPower: 1.0,
    fgPower: 0.95,
    preserveSat: 0.22
  },
  darkGray: {
    id: 'darkGray',
    label: 'Dark Gray',
    swatch: '#1a1f29',
    bg: [26, 31, 41],
    fg: [225, 228, 234],
    accent: [180, 200, 240],
    bgPower: 1.0,
    fgPower: 0.92,
    preserveSat: 0.22
  },
  midnight: {
    id: 'midnight',
    label: 'Midnight Blue',
    swatch: '#0d1b2a',
    bg: [13, 27, 42],
    fg: [220, 230, 245],
    accent: [140, 180, 255],
    bgPower: 1.0,
    fgPower: 0.92,
    preserveSat: 0.25
  },
  sepia: {
    id: 'sepia',
    label: 'Sepia Dark',
    swatch: '#2a2218',
    bg: [42, 34, 24],
    fg: [232, 214, 184],
    accent: [220, 190, 140],
    bgPower: 1.0,
    fgPower: 0.9,
    preserveSat: 0.28
  },
  lowContrast: {
    id: 'lowContrast',
    label: 'Low Contrast',
    swatch: '#1f242e',
    bg: [31, 36, 46],
    fg: [190, 196, 210],
    accent: [160, 180, 215],
    bgPower: 0.95,
    fgPower: 0.8,
    preserveSat: 0.25
  }
};

export const THEME_LIST = Object.values(THEMES);