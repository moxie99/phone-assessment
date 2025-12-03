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
   - Place the converted WOFF2 files in the `public/fonts/` directory
   - Name them according to the weights:
     - `Averta-Regular.woff2` (400)
     - `Averta-RegularItalic.woff2` (400 italic)
     - `Averta-Semibold.woff2` (600)
     - `Averta-SemiboldItalic.woff2` (600 italic)
     - `Averta-Bold.woff2` (700)
     - `Averta-BoldItalic.woff2` (700 italic)
     - `Averta-ExtraBold.woff2` (800)

4. **Enable Font Loading**:
   - Open `app/globals.css`
   - Uncomment the `@font-face` declarations (remove the `/*` and `*/`)
   - The font declarations are already set up, just need to be uncommented

## Font Weights Available in Averta:
- Regular (400)
- Regular Italic (400)
- Semibold (600)
- Semibold Italic (600)
- Bold (700)
- Bold Italic (700)
- ExtraBold (800)
- ExtraBold Italic (800)

## Current Status:
✅ **Font is configured and ready to use**
- The application is set up to use Averta font
- Currently using system font fallbacks until font files are added
- Once you add the font files to `public/fonts/` and uncomment the @font-face rules, Averta will be applied automatically

## Quick Setup (if you have the font files):
1. Convert your Averta font files to WOFF2 format
2. Place them in the `public/fonts/` directory
3. Open `app/globals.css` and uncomment the `@font-face` declarations
4. Restart your development server
5. The font will be automatically applied throughout the application

