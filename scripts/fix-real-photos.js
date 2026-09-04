const fs = require("fs");
const path = require("path");

const root = process.cwd();
const dataFile = path.join(root, "src", "lib", "products-data.ts");

const images = {
  dipper: "/products/real/dipper-instant-henna.jpeg",
  nailPolish: "/products/real/instant-nail-polish-henna.jpeg",
  oil: "/products/real/after-care-oil.jpeg",
  lip: "/products/real/lip-balms.jpeg",
  wax: "/products/real/wax-powder.jpeg",
  ubtan: "/products/real/ubtan-powder.jpeg",
  hair: "/products/real/herbal-hair-henna.jpeg",
  antiAcne: "/products/real/anti-acne-haldi-chandan-soap.jpeg",
  skinLightening: "/products/real/skin-lightening-soap.jpeg",
  menthol: "/products/real/menthol-soap.jpeg",
  stencils: "/products/real/stencils.jpeg"
};

let data = fs.readFileSync(dataFile, "utf8");

function replaceProduct(search, image) {
  const lines = data.split("\n");
  let inside = false;
  let depth = 0;
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    if (!inside && search.test(lines[i])) {
      inside = true;
      depth = 0;
    }

    if (inside) {
      if (lines[i].includes("{")) depth++;
      if (lines[i].includes("}")) depth--;

      if (/\bimages\s*:/.test(lines[i])) {
        lines[i] = lines[i].replace(
          /images\s*:\s*\[[^\]]*\]/,
          `images: ["${image}"]`
        );
        changed = true;
        inside = false;
      }

      if (depth < 0) inside = false;
    }
  }

  data = lines.join("\n");

  console.log(changed ? "UPDATED: " + search : "NOT FOUND: " + search);
}

/* Instant products */
replaceProduct(/Dipper Instant Henna/i, images.dipper);
replaceProduct(/Instant Nail Polish Henna/i, images.nailPolish);

/* Oils */
replaceProduct(/After[- ]Care Oil/i, images.oil);

/* Lip care */
replaceProduct(/Strawberry/i, images.lip);
replaceProduct(/Beetroot/i, images.lip);

/* Powders */
replaceProduct(/Painless Wax Powder|Wax Powder/i, images.wax);
replaceProduct(/Ubtan Powder|Herbal Bridal Ubtan/i, images.ubtan);

/* Herbal hair colours */
replaceProduct(/Black.*Herbal.*Hair|Herbal.*Black/i, images.hair);
replaceProduct(/Brown.*Herbal.*Hair|Herbal.*Brown/i, images.hair);
replaceProduct(/Burgundy.*Herbal.*Hair|Herbal.*Burgundy/i, images.hair);

/* Soaps */
replaceProduct(/Anti[- ]Acne.*Haldi.*Chandan/i, images.antiAcne);
replaceProduct(/Skin Lightening Soap/i, images.skinLightening);
replaceProduct(/Menthol Soap/i, images.menthol);

/* All stencil products use the same stencil photograph */
replaceProduct(/Medium.*Stencil|Stencil.*Medium/i, images.stencils);
replaceProduct(/Large.*Stencil|Stencil.*Large/i, images.stencils);
replaceProduct(/Finger.*Stencil|Stencil.*Finger/i, images.stencils);
replaceProduct(/Kids.*Stencil|Stencil.*Kids/i, images.stencils);
replaceProduct(/Bridal Full Hands/i, images.stencils);
replaceProduct(/Semi[- ]Bridal/i, images.stencils);

fs.writeFileSync(dataFile, data);

console.log("");
console.log("PHOTO MAPPING FINISHED.");