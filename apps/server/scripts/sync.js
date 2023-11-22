const fs = require('fs');
const path = require('path');

const dst = path.resolve(__dirname, '../../client/assets/scripts/common');
const src = path.resolve(__dirname, '../src/common');

const files = fs.readdirSync(src, { encoding: 'utf-8' });

for (const filename of files) {
  if (!/\.ts$/.test(filename)) {
    continue;
  }
  const dstFilePath = path.resolve(dst, filename);
  const srcFilePath = path.resolve(src, filename);

  const dstFileContent = fs.readFileSync(dstFilePath).toString();
  const srcFileContent = fs.readFileSync(srcFilePath).toString();

  if (dstFileContent != srcFileContent) {
    const dstFileStat = fs.statSync(dstFilePath);
    const srcFileStat = fs.statSync(srcFilePath);
    if (dstFileStat.ctimeMs > srcFileStat.ctimeMs) {
      syncFileContent(dstFilePath, srcFilePath);
    } else {
      syncFileContent(srcFilePath, dstFilePath);
    }
    console.log(`${filename} 同步成功！`);
  }
}

/**
 *  把 a 文件里面的内容 复制到 b 里面
 */
function syncFileContent(a, b) {
  const aFileContent = fs.readFileSync(a).toString();
  fs.writeFileSync(b, aFileContent);
}
