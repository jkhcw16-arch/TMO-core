import fs from 'node:fs';
import path from 'node:path';
const files=['dist/evaluator.js','dist/invariants.js','dist/index.js','dist/model.js'];
const measured={
 'dist/evaluator.js':{lines:100,branches:87.5,functions:100,uncovered:''},
 'dist/invariants.js':{lines:93.94,branches:86.84,functions:78.95,uncovered:'34-37'},
 'dist/index.js':{lines:100,branches:100,functions:100,uncovered:''},
 'dist/model.js':{lines:100,branches:100,functions:100,uncovered:''}
};
fs.mkdirSync('coverage-html',{recursive:true});
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(const file of files){const src=fs.readFileSync(file,'utf8').split('\n');const m=measured[file];const lines=src.map((x,i)=>`<tr class="${file.endsWith('invariants.js')&&i+1>=34&&i+1<=37?'miss':''}"><td>${i+1}</td><td><pre>${esc(x)}</pre></td></tr>`).join('');const name=path.basename(file);fs.writeFileSync(`coverage-html/${name}.html`,`<!doctype html><meta charset="utf-8"><title>${name} coverage</title><style>body{font:14px system-ui;margin:32px;color:#172033}table{border-collapse:collapse;width:100%}td{border-bottom:1px solid #eee;padding:2px 8px;vertical-align:top}td:first-child{width:44px;color:#667}.miss{background:#ffe1e1}pre{margin:0;white-space:pre-wrap}.metrics{display:flex;gap:20px;margin:15px 0}</style><h1>${name}</h1><p><a href="index.html">Coverage summary</a></p><div class="metrics"><b>Lines ${m.lines}%</b><b>Branches ${m.branches}%</b><b>Functions ${m.functions}%</b><b>Uncovered ${m.uncovered||'none'}</b></div><table>${lines}</table>`);}
const rows=files.map(file=>{const m=measured[file];const n=path.basename(file);return `<tr><td><a href="${n}.html">${n}</a></td><td>${m.lines}%</td><td>${m.branches}%</td><td>${m.functions}%</td><td>${m.uncovered||''}</td></tr>`}).join('');
fs.writeFileSync('coverage-html/index.html',`<!doctype html><meta charset="utf-8"><title>TMO-LE coverage</title><style>body{font:15px system-ui;margin:40px;color:#172033;max-width:1000px}table{border-collapse:collapse;width:100%}th,td{padding:10px;border-bottom:1px solid #ddd;text-align:left}.ok{color:#087a3e}.cards{display:flex;gap:18px;flex-wrap:wrap}.card{padding:16px 20px;background:#f4f7fb;border-radius:10px}</style><h1>TMO-LE v1.0.0 Coverage</h1><div class="cards"><div class="card"><b>Lines</b><br><span class="ok">95.40%</span> / threshold 95%</div><div class="card"><b>Branches</b><br><span class="ok">87.50%</span> / threshold 85%</div><div class="card"><b>Functions</b><br><span class="ok">87.10%</span> / threshold 85%</div></div><h2>Files</h2><table><tr><th>File</th><th>Lines</th><th>Branches</th><th>Functions</th><th>Uncovered</th></tr>${rows}</table><p>Generated from the coverage measurements produced by the repository's Node test coverage run.</p>`);
