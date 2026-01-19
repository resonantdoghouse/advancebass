const fs = require("fs");
const path = require("path");

// Helper to parse HSL string "h s% l%"
function parseHsl(hslString) {
  // Remove comments if any
  hslString = hslString.split("/*")[0].trim();
  const parts = hslString.match(/([\d\.]+)\s+([\d\.]+)%\s+([\d\.]+)%/);
  if (!parts) return null;
  return {
    h: parseFloat(parts[1]),
    s: parseFloat(parts[2]),
    l: parseFloat(parts[3]),
  };
}

// Convert HSL to RGB
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
}

// Calculate relative luminance
function luminance(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate contrast ratio
function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Main audit function
function auditContrast() {
  const cssPath = path.join(__dirname, "../src/app/globals.css");
  const cssContent = fs.readFileSync(cssPath, "utf8");

  // Regex to find themes
  const themeRegex =
    /((?:\[data-theme="[^"]+"\](?:\.dark)?)|(?:\.dark)|(?::root))\s*{([^}]+)}/g;

  let match;
  console.log("Auditing Contrast Ratios...\n");

  while ((match = themeRegex.exec(cssContent)) !== null) {
    const selector = match[1].trim();
    const body = match[2];

    console.log(`Theme: ${selector}`);

    // Extract variables
    const vars = {};
    const varRegex = /--([a-zA-Z0-9-]+):\s*([^;]+);/g;
    let varMatch;
    while ((varMatch = varRegex.exec(body)) !== null) {
      vars[varMatch[1]] = varMatch[2].trim();
    }

    // Pairs to check
    const pairs = [
      ["background", "foreground"],
      ["primary", "primary-foreground"],
      ["secondary", "secondary-foreground"],
      ["muted", "muted-foreground"],
      ["accent", "accent-foreground"],
      ["destructive", "destructive-foreground"],
      ["card", "card-foreground"],
      ["popover", "popover-foreground"],
    ];

    pairs.forEach(([bg, fg]) => {
      const bgVal = vars[bg];
      const fgVal = vars[fg];

      if (!bgVal || !fgVal) {
        // console.log(`  Skipping ${bg} vs ${fg} (missing variables)`);
        return;
      }

      const bgHsl = parseHsl(bgVal);
      const fgHsl = parseHsl(fgVal);

      if (!bgHsl || !fgHsl) {
        console.log(`  Error parsing colors for ${bg} vs ${fg}`);
        return;
      }

      const bgRgb = hslToRgb(bgHsl.h, bgHsl.s, bgHsl.l);
      const fgRgb = hslToRgb(fgHsl.h, fgHsl.s, fgHsl.l);

      const bgLum = luminance(...bgRgb);
      const fgLum = luminance(...fgRgb);

      const ratio = contrastRatio(bgLum, fgLum);
      const pass = ratio >= 4.5;

      const status = pass ? "PASS" : "FAIL";
      console.log(`  ${status} [${ratio.toFixed(2)}:1] ${bg} vs ${fg}`);
    });
    console.log("");
  }
}

auditContrast();
