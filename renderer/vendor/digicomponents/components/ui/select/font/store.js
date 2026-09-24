import { ref } from "vue";
const STYLE_SHEET_BATCH_SIZE = 100;
function isTextFont(font) {
  return !font.family.toLowerCase().includes("icons");
}
function isLatinFont(font) {
  return font.subsets.includes("latin");
}
async function getFonts() {
  try {
    const response = await fetch(
      "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDO79QazM_nH4O_3W4UG_juQrYneP50oEc"
    );
    const data = await response.json();
    return data.items.filter(isTextFont).filter(isLatinFont);
  } catch {
    return [];
  }
}
function getStyleSheetUrl(fonts) {
  const url = new URL("https://fonts.googleapis.com/css");
  const familiesStr = fonts.map((font) => `${font.family}:regular`);
  url.searchParams.append("family", familiesStr.join("|"));
  url.searchParams.append("subset", "latin");
  const familyNamesConcat = fonts.map((font) => font.family).join("");
  const downloadChars = familyNamesConcat.split("").filter((char, pos, self) => self.indexOf(char) === pos).join("");
  url.searchParams.append("text", downloadChars);
  url.searchParams.append("font-display", "swap");
  return url.href;
}
function getStyleSheetUrlsByBatch(fonts) {
  const styleSheetUrls = [];
  for (let i = 0; i < fonts.length; i += STYLE_SHEET_BATCH_SIZE) {
    const batch = fonts.slice(i, i + STYLE_SHEET_BATCH_SIZE);
    styleSheetUrls.push(getStyleSheetUrl(batch));
  }
  return styleSheetUrls;
}
function useFontsStore() {
  const fonts = ref([]);
  const styleSheetUrls = ref([]);
  const isLoaded = ref(false);
  async function load() {
    if (!isLoaded.value) {
      fonts.value = await getFonts();
      styleSheetUrls.value = getStyleSheetUrlsByBatch(fonts.value);
      isLoaded.value = true;
    }
    return { fonts: fonts.value, styleSheetUrls: styleSheetUrls.value };
  }
  return { load };
}
export {
  useFontsStore
};
