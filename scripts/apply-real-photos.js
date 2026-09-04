const fs = require("fs");
const path = require("path");

const root = process.cwd();
const realDir = path.join(root, "public", "products", "real");
const dataFile = path.join(root, "src", "lib", "products-data.ts");

const imageExts = [".jpg", ".jpeg", ".png", ".webp"];

function getImages(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);

    if (item.isDirectory()) {
      results = results.concat(getImages(full));
    } else if (imageExts.includes(path.extname(item.name).toLowerCase())) {
      results.push(full);
    }
  }

  return results;
}

const files = getImages(realDir);

function findImage(patterns) {
  return files.find(file => {
    const text = file.toLowerCase().replace(/\\/g, "/");
    return patterns.some(pattern => pattern.test(text));
  });
}

function copyImage(patterns, filename) {
  const source = findImage(patterns);

  if (!source) {
    console.log("NOT FOUND:", filename);
    return null;
  }

  const destination = path.join(root, "public", "products", filename);
  fs.copyFileSync(source, destination);

  console.log("FOUND:", path.basename(source), "->", filename);
  return `/products/${filename}`;
}

const mappings = {
  "p-dipper-instant-henna": [
    /instant.*18/i,
    /18.*instant/i
  ],

  "p-instant-nail-polish-henna": [
    /instant.*13/i,
    /13.*instant/i
  ],

  "p-aftercare-oil": [
    /oil/i
  ],

  "p-wax-powder": [
    /powders.*17/i,
    /17.*powders/i,
    /wax/i
  ],

  "p-ubtan": [
    /powders.*4/i,
    /4.*powders/i,
    /ubtan/i
  ],

  "p-hair-powder-black": [
    /powders.*13/i,
    /13.*powders/i,
    /natural.*herbal.*henna/i,
    /herbal.*hair.*henna/i
  ],

  "p-hair-powder-brown": [
    /powders.*13/i,
    /13.*powders/i,
    /natural.*herbal.*henna/i,
    /herbal.*hair.*henna/i
  ],

  "p-hair-powder-burgundy": [
    /powders.*13/i,
    /13.*powders/i,
    /natural.*herbal.*henna/i,
    /herbal.*hair.*henna/i
  ],

  "p-lip-balm-strawberry": [
    /lip.*balm.*1/i,
    /1.*lip.*balm/i
  ],

  "p-lip-balm-beetroot": [
    /lip.*balm.*1/i,
    /1.*lip.*balm/i
  ],

  "p-soap-anti-acne": [
    /soap.*2/i,
    /2.*soap/i,
    /anti.*acne/i,
    /haldi.*chandan/i
  ],

  "p-soap-skin-lightening": [
    /08.*1/i,
    /1.*08/i,
    /skin.*lightening/i
  ],

  "p-soap-menthol": [
    /soap.*11/i,
    /11.*soap/i,
    /menthol/i
  ],

  "p-stencil-medium": [
    /stencil/i
  ],

  "p-stencil-medium-2": [
    /stencil/i
  ],

  "p-stencil-large": [
    /stencil/i
  ],

  "p-stencil-large-2": [
    /stencil/i
  ],

  "p-stencil-fingers": [
    /stencil/i
  ],

  "p-stencil-fingers-2": [
    /stencil/i
  ],

  "p-stencil-kids": [
    /stencil/i
  ],

  "p-stencil-kids-3": [
    /stencil/i
  ],

  "p-stencil-bridal-full": [
    /stencil/i
  ],

  "p-stencil-semi-bridal": [
    /stencil/i
  ]
};

const copied = {};

for (const [id, patterns] of Object.entries(mappings)) {
  const filename = `real-${id}.jpg`;
  const result = copyImage(patterns, filename);

  if (result) copied[id] = result;
}

let data = fs.readFileSync(dataFile, "utf8");

for (const [id, imagePath] of Object.entries(copied)) {
  const blockRegex = new RegExp(
    `(id:\\s*"${id}"[\\s\\S]*?images:\\s*)\\[[^\\]]*\\]`,
    "m"
  );

  data = data.replace(
    blockRegex,
    `$1["${imagePath}"]`
  );
}

fs.writeFileSync(dataFile, data);

console.log("");
console.log("DONE!");
console.log("Real photos connected:", Object.keys(copied).length);
console.log("Products without photos were left unchanged.");