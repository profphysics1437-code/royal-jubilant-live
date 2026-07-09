// Audit all visible text elements for contrast issues
(() => {
  const issues = [];
  const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, li, div, td, th, select, option, input');
  
  elements.forEach(el => {
    const cs = getComputedStyle(el);
    const text = el.textContent?.trim();
    if (!text || text.length < 2) return;
    if (el.children.length > 2) return; // skip container elements
    
    const color = cs.color;
    const bg = cs.backgroundColor;
    const bgImage = cs.backgroundImage;
    
    // Parse rgb/rgba values
    const parseColor = (str) => {
      if (!str || str === 'transparent' || str === 'rgba(0, 0, 0, 0)') return null;
      const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!m) return null;
      return { r: +m[1], g: +m[2], b: +m[3], a: m[4] ? +m[4] : 1 };
    };
    
    const textColor = parseColor(color);
    if (!textColor) return;
    
    // Skip if text is very dark (navy on white = fine)
    if (textColor.r < 60 && textColor.g < 60 && textColor.b < 80) return;
    
    // Skip if text has good opacity
    if (textColor.a < 0.3) return;
    
    // Check for common problem patterns:
    // 1. White/light text on transparent bg (might be on white card)
    // 2. Gold text on white bg (low contrast)
    // 3. Silver/gray text on white bg (might be too light)
    
    const isLight = textColor.r > 200 && textColor.g > 200 && textColor.b > 200;
    const isGold = textColor.r > 180 && textColor.g > 140 && textColor.b < 130;
    const isLightGray = textColor.r > 140 && textColor.g > 140 && textColor.b > 140 && textColor.r < 200;
    
    // Check parent background
    let parentBg = null;
    let parent = el.parentElement;
    while (parent && !parentBg) {
      const pbg = parseColor(getComputedStyle(parent).backgroundColor);
      if (pbg && pbg.a > 0.5) parentBg = pbg;
      parent = parent.parentElement;
    }
    
    // Gold text on white/light background = low contrast
    if (isGold && (!parentBg || (parentBg.r > 200 && parentBg.g > 200 && parentBg.b > 200))) {
      issues.push({
        text: text.substring(0, 50),
        color: color,
        bg: bg,
        parentBg: parentBg ? `rgb(${parentBg.r},${parentBg.g},${parentBg.b})` : 'transparent/white',
        issue: 'Gold text on light background',
        tag: el.tagName,
        classes: el.className?.substring(0, 60),
      });
    }
    
    // Light gray text on white background
    if (isLightGray && (!parentBg || (parentBg.r > 240 && parentBg.g > 240 && parentBg.b > 240))) {
      if (textColor.r > 170) { // very light gray
        issues.push({
          text: text.substring(0, 50),
          color: color,
          parentBg: parentBg ? `rgb(${parentBg.r},${parentBg.g},${parentBg.b})` : 'white',
          issue: 'Very light gray text on white',
          tag: el.tagName,
          classes: el.className?.substring(0, 60),
        });
      }
    }
  });
  
  // Deduplicate
  const seen = new Set();
  const unique = issues.filter(i => {
    const key = i.text + i.issue + (i.classes || '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  return unique.slice(0, 30);
})()
