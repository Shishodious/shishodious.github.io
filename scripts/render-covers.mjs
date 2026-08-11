// Dev-only helper: renders scripts/covers.html sections to project cover JPGs.
import puppeteer from "puppeteer-core";
import { fileURLToPath } from "url";
import path from "path";

const here = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-first-run", "--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1700, height: 1300, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(here, "covers.html"), {
  waitUntil: "networkidle0",
});
await page.evaluateHandle("document.fonts.ready");
await new Promise((r) => setTimeout(r, 800));

for (const id of ["momentum", "creatorvision", "videotube", "chatapp", "uber", "oversocs", "autocrawler"]) {
  const el = await page.$(`#${id}`);
  await el.screenshot({ path: `/tmp/cover-${id}.png` });
  console.log("rendered", id);
}

await browser.close();
