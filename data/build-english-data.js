// Injects the English data (Ministry vocabulary bands + approved literature texts) into the three app pages,
// between the /*EN_DATA_START*/ and /*EN_DATA_END*/ markers. Run from the project folder:
//   node data/build-english-data.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const bands = JSON.parse(fs.readFileSync(path.join(__dirname, 'en-bands.json'), 'utf8'));
const lit = require('./en-literature.js');
// keep "</script>" from ever appearing inside the inline data
const safe = (o) => JSON.stringify(o).replace(/<\//g, '<\\/');
const block = `/*EN_DATA_START*/\nconst EN_BANDS = ${safe(bands)};\nconst EN_LIT_RAW = ${safe(lit)};\n/*EN_DATA_END*/`;
for (const f of ['math-teacher.html', 'web/index.html', 'local/index.html']) {
  const p = path.join(root, f);
  const html = fs.readFileSync(p, 'utf8');
  const re = /\/\*EN_DATA_START\*\/[\s\S]*?\/\*EN_DATA_END\*\//;
  if (!re.test(html)) throw new Error('marker missing in ' + f);
  fs.writeFileSync(p, html.replace(re, () => block));
  console.log('updated', f);
}
