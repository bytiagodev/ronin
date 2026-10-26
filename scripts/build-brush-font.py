"""Rebuild public/fonts/yuji-syuku-subset.woff2 after adding Japanese text to the data.

The brush face is subset to the characters the site uses, so the page loads about 40 KB
instead of several megabytes. Needs Python with fonttools and brotli, and the
@fontsource/yuji-syuku package unpacked somewhere:

    pip install fonttools brotli
    npm pack @fontsource/yuji-syuku && tar xzf fontsource-yuji-syuku-*.tgz
    python scripts/build-brush-font.py package
"""

import glob
import os
import re
import sys

from fontTools import subset
from fontTools.merge import Merger
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES = [
    ('src/data/quotes.js', 'japanese'),
    ('src/data/rings.js', 'kanji'),
    ('src/data/people.js', 'kanji'),
    ('src/data/reading.js', 'kanji'),
]


def site_characters():
    text = ''
    for path, field in SOURCES:
        with open(os.path.join(ROOT, path), encoding='utf-8') as source:
            text += ''.join(re.findall(rf"\b{field}: '([^']*)'", source.read()))
    return sorted(set(text))


def main(package_dir):
    characters = site_characters()
    needed = {ord(character) for character in characters}
    parts = []
    for path in sorted(glob.glob(os.path.join(package_dir, 'files', 'yuji-syuku-*-400-normal.woff2'))):
        font = TTFont(path)
        available = needed & set(font.getBestCmap())
        if not available:
            continue
        options = subset.Options()
        options.flavor = None
        options.layout_features = ['*']
        options.name_IDs = ['*']
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=available)
        subsetter.subset(font)
        part = f'{path}.part.ttf'
        font.save(part)
        parts.append(part)
        needed -= available
    if needed:
        sys.exit('Missing from Yuji Syuku: ' + ''.join(chr(code) for code in needed))
    merged = Merger().merge(parts)
    merged.flavor = 'woff2'
    output = os.path.join(ROOT, 'public', 'fonts', 'yuji-syuku-subset')
    merged.save(output + '.woff2')
    with open(output + '.txt', 'w', encoding='utf-8') as listing:
        listing.write(''.join(characters) + '\n')
    for part in parts:
        os.remove(part)
    print(f'{len(characters)} characters, {os.path.getsize(output + ".woff2")} bytes')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'package')
