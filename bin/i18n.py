# -*- coding: utf-8 -*-

import fcntl
import sys, os, re, json
if len(sys.argv) < 2:
    print('''HELP:
python3 i18n.py <DIR>
python3 i18n.py <DIR> > out.js
python3 i18n.py <DIR> < in.js >> out.js ''')
    sys.exit(0)

fd = sys.stdin.fileno()
fl = fcntl.fcntl(fd, fcntl.F_GETFL)
fcntl.fcntl(fd, fcntl.F_SETFL, fl | os.O_NONBLOCK)

try:
    data_in = '\n'.join(line.strip() for line in sys.stdin)
    data_in = json.loads(data_in)
except:
    EXISTS = set()
else:
    EXISTS = set(data_in.keys())

DIR = os.path.abspath(os.path.join(os.curdir, sys.argv[1]))

pattern = re.compile('''_\(\s*(?P<q>['"])(.*?)(?P=q)\s*\)''')
all_word = set()

def process(file_path):
    with open(file_path, 'rb') as f:
        data = f.read().decode('utf8')
        word_list = pattern.findall(data)
        for q, w in word_list:
            if w:
                all_word.add(w.strip())

if os.path.isfile(DIR):
    process(DIR)
else:
    for root, dirs, files in os.walk(DIR):
        todo = filter(lambda f: f.endswith('.js') or f.endswith('ts') or f.endswith('tsx') or f.endswith('jsx'),
                      files)
        for fname in todo:
            fpath = os.path.join(root, fname)
            process(fpath)

all_word -= EXISTS
result = dict(zip(all_word, all_word))
s = json.dumps(result, indent=4)
print(s)

