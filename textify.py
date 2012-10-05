import glob
from unidecode import unidecode
from sh import catdoc

for f in glob.glob('docs/*.doc'):
    e = catdoc(f)
    s = unicode(e.stdout, 'utf-8', errors='ignore')
    cd = unidecode(s)
    open(f.replace('docs/', 'text/').replace('.doc', '.txt'), 'w+').write(cd)
