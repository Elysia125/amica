const fs = require('fs');
const fg = require('fast-glob');
const path = require('path');

const ROOT = 'public';

const bgImages = fg.globSync(`${ROOT}/bg/**/bg-*.jpg`, {dot: true}).map((p) => p.slice(ROOT.length));
const vrmList = fg.globSync(`${ROOT}/vrm/**/*.vrm`, {dot: true}).map((p) => p.slice(ROOT.length));
const speechT5SpeakerEmbeddingsList = fg.globSync(`${ROOT}/speecht5_speaker_embeddings/**/*.bin`, {dot: true}).map((p) => p.slice(ROOT.length));
const animationList = [].concat(
  fg.globSync(`${ROOT}/animations/**/*.vrma`, {dot: true}).map((p) => p.slice(ROOT.length)),
  fg.globSync(`${ROOT}/animations/**/*.fbx`, {dot: true}).map((p) => p.slice(ROOT.length))
);

let str = "";
str += `export const bgImages = ${JSON.stringify(bgImages)};\n`;
str += `export const vrmList = ${JSON.stringify(vrmList)};\n`;
str += `export const speechT5SpeakerEmbeddingsList = ${JSON.stringify(speechT5SpeakerEmbeddingsList)};\n`;
str += `export const animationList = ${JSON.stringify(animationList)};\n`;

const outPath = path.resolve(__dirname, '../src/paths.ts');
fs.writeFileSync(outPath, str);
