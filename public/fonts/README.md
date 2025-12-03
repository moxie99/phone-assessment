# Averta Font Setup

## Instructions

1. **Purchase Averta Font** (if not already owned):
   - Visit: https://www.fontfabric.com/fonts/averta/
   - Purchase the font family or individual weights needed

2. **Convert to Web Fonts**:
   - Convert your Averta font files (OTF/TTF) to WOFF2 format
   - Use tools like:
     - https://cloudconvert.com/
     - https://www.fontsquirrel.com/tools/webfont-generator
     - Or use command-line tools like `woff2_compress`

3. **Place Font Files**:
   - Place the converted WOFF2 files in this directory (`public/fonts/`)
   - Name them according to the weights:
     - `Averta-Regular.woff2` (400)
     - `Averta-RegularItalic.woff2` (400 italic)
     - `Averta-Semibold.woff2` (600)
     - `Averta-SemiboldItalic.woff2` (600 italic)
     - `Averta-Bold.woff2` (700)
     - `Averta-BoldItalic.woff2` (700 italic)
     - `Averta-ExtraBold.woff2` (800)

4. **Alternative: Use CDN** (if available):
   - If Fontfabric provides a CDN link, you can update `app/layout.tsx` to use `next/font/google` or a custom CSS import

## Font Weights Available in Averta:
- Regular (400)
- Regular Italic (400)
- Semibold (600)
- Semibold Italic (600)
- Bold (700)
- Bold Italic (700)
- ExtraBold (800)
- ExtraBold Italic (800)

## Note:
If you don't have the font files yet, the application will fall back to system fonts. The font will automatically load once you add the files to this directory.

