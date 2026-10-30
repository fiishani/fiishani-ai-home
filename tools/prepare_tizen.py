"""Prepare explicit unsigned WGT + clean directory for Tizen Studio signing."""
from pathlib import Path
import shutil
import xml.etree.ElementTree as ET
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parents[1]
out = root / 'dist'
stage = out / 'tizen'
stage.mkdir(parents=True, exist_ok=True)
for name in ('index.html', 'config.xml', 'icon.png'):
    shutil.copy2(root / name, stage / name)
shutil.copytree(root / 'js', stage / 'js', dirs_exist_ok=True)
config = ET.parse(stage / 'config.xml')
ns = {'w': 'http://www.w3.org/ns/widgets', 't': 'http://tizen.org/ns/widgets'}
assert config.find('t:profile', ns).get('name') == 'tv-samsung'
assert len(config.find('t:application', ns).get('package')) == 10
assert (stage / config.find('w:content', ns).get('src')).is_file()
files = ['index.html', 'config.xml', 'icon.png', 'js/home.js', 'js/tizen.js']
package = out / 'FiishaniAIHome3D-unsigned.wgt'
with ZipFile(package, 'w', ZIP_DEFLATED) as z:
    for name in files:
        z.write(stage / name, name)
with ZipFile(package) as z:
    assert z.testzip() is None
    assert 'author-signature.xml' not in z.namelist()
print(f'Prepared: {package}\nUNSIGNED: cannot install until signed with Samsung TV certificate profile.')
