import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Run with: node scripts/build-slide-export.mjs
// The browser uses the generated asset directly and does not need a build step.
const dist = new URL("../dist/", import.meta.url);
const sampleFiles = ["slide-tide.svg", "slide-orbit.svg", "slide-fold.svg"];
const [slidesCSS, keyframes, ...samples] = await Promise.all([
  readFile(new URL("slides.css", dist), "utf8"),
  readFile(new URL("slide-keyframes.css", dist), "utf8"),
  ...sampleFiles.map(file => readFile(new URL(file, dist)))
]);

const standaloneCSS = [
  ".lm-slide-mount { display: block; width: 100%; margin: 0; padding: 0; border: 0; }",
  ".lm-slide-mount, .lm-slide-mount * { box-sizing: border-box; }",
  '.lm-slide-mount > .lm-slider { display: block; width: 100%; margin: 0; padding: 0; border: 0; border-radius: 0; background: transparent; font-family: system-ui, sans-serif; }'
].join("\n");

// Keep the actual preview rules. Header, upload and surrounding gallery layout
// are excluded because an exported document contains only one effect.
const start = slidesCSS.indexOf("/* SLIDE COMPONENT START");
const end = slidesCSS.indexOf("/* SLIDE COMPONENT END */");
if (start < 0 || end <= start) {
  throw new Error("Slide CSS boundaries changed. Update the export bundle selection.");
}
const effectCSS = slidesCSS.slice(start, end);
const assets = {
  css: standaloneCSS + "\n" + keyframes + "\n" + effectCSS,
  defaultImages: Object.fromEntries(sampleFiles.map((file, i) => [
    file, "data:image/svg+xml;base64," + samples[i].toString("base64")
  ]))
};
const output = new URL("slide-export-assets.js", dist);
await writeFile(
  output,
  "/* Bundled from slide-keyframes.css, slides.css and the three sample SVGs. No runtime fetch. */\n" +
  "window.slideExportAssets = " + JSON.stringify(assets, null, 2) + ";\n"
);
console.log("Built " + fileURLToPath(output));

