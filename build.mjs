// src/app.jsx を圧縮して src/template.html に埋め込み、index.html を作る
import { readFileSync, writeFileSync } from "node:fs";
import { transformSync } from "esbuild";

const jsx = readFileSync(new URL("./src/app.jsx", import.meta.url), "utf8");
const template = readFileSync(new URL("./src/template.html", import.meta.url), "utf8");

const { code } = transformSync(jsx, {
  loader: "jsx",
  target: "es2017",
  minify: true,
  format: "iife",
});
if (/<\/script/i.test(code)) throw new Error("ビルド結果に </script が含まれています");

const html = template.replace("<!-- APP_SCRIPT -->", () => `<script>\n${code}\n</script>`);
writeFileSync(new URL("./index.html", import.meta.url), html);
console.log(`index.html を作成しました（${(html.length / 1024).toFixed(1)} KB）`);
