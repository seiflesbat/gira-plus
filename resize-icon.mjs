// Resize icon script - run with: node resize-icon.mjs
import fs from 'fs';
import path from 'path';

const sizes = {
    'mipmap-ldpi': 36,
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
};

const sourceImage = path.join(process.cwd(), '..', '..', '..', '..', '.gemini', 'antigravity', 'brain', 'bfdaa218-afa9-4ed4-8f8b-69744c95fad3', 'giraplus_icon_large_1766566245537.png');
const resDir = path.join(process.cwd(), 'android', 'app', 'src', 'main', 'res');

console.log('Source:', sourceImage);
console.log('Res dir:', resDir);
console.log('\nTo resize icons, you can use online tools like:');
console.log('- https://icon.kitchen/ (recommended - Android Icon Generator)');
console.log('- https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html');
console.log('\nOr install ImageMagick and run:');
console.log('magick source.png -resize 36x36 mipmap-ldpi/ic_launcher.png');
console.log('magick source.png -resize 48x48 mipmap-mdpi/ic_launcher.png');
console.log('... etc');
