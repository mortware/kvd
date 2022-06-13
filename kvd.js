const config = require("./config.json");
const fs = require("fs");
const playwright = require("playwright");
const { getMaxListeners } = require("process");
const path = require("path");

const baseUrl = "https://www.karaoke-version.com";
const loginUrl = "my/login.html";
const filesUrl = "my/download.html";

(async () => {
  const browser = await playwright["chromium"].launch({
    //headless: false,
    //devtools: true,
  });

  const context = await browser.newContext({
    acceptDownloads: true,
  });

  const page = await context.newPage();
  await login(page);

  for (let songIndex = 0; songIndex < config.songs.length; songIndex++) {
    const songUrl = config.songs[songIndex];
    await openSong(page, songUrl);
    const dir = await fetchSongInfo(page);

    const trackElements = await page.$$(".mixer__inner > .track");
    for (let trackIndex = 0; trackIndex < trackElements.length; trackIndex++) {
      const trackElement = trackElements[trackIndex];
      await resetMixer(page);
      await soloTrack(trackElement);

      const name = await getInnerText(trackElement, ".track__caption");
      let fileName = name
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()
        .split("_")
        .filter((item) => item)
        .join("_");
      fileName = `${String(trackIndex).padStart(2, "0")}_${fileName}`;
      let filePath = path.join(__dirname, dir, `${fileName}.mp3`)
      console.log(filePath);
      await downloadMix(page, filePath);
    }

    const playAlongElements = await page.$$("#presets a.preset");
    for (let paIndex = 0; paIndex < playAlongElements.length; paIndex++) {
      const paElement = playAlongElements[paIndex];
      await paElement.click();
      await unmuteTrack(trackElements[trackElements.length-1]);

      const name = await getInnerText(paElement);
      //console.log(name);
      let fileName = name
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()
        .split("_")
        .filter((item) => item)
        .join("_");
      fileName = `play_along_${fileName}`;
      let filePath = path.join(__dirname, dir, `${fileName}.mp3`);
      console.log(filePath);
      let doesFileExist = await fileExists(filePath);
      if (doesFileExist) {
        console.log("SKIPPING - File already exists");
        continue;
      }

      
      await downloadMix(page, filePath);
    }
  }

  console.log("All done!");
  await browser.close();
})();

const login = async (page) => {
  await page.goto(`${baseUrl}/${loginUrl}`);
  await page.fill(`#frm_login`, config.username);
  await page.fill(`#frm_password`, config.password);
  await page.click(`#sbm`);
};

const fileExists = async (filePath) => {
  try {
    fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const openSong = async (page, song) => {
  await page.goto(`${baseUrl}/custombackingtrack/${song}`);

  await page.waitForResponse((res) => {
    return res.request().resourceType() === "xhr";
  });
};

const resetMixer = async (page) => {
  const resetBtn = await page.$('button.mixer__reset');
  await resetBtn.click();
}

const soloTrack = async (trackElement) => {
  const soloBtnElement = await trackElement.$(`button.track__solo`);
  await soloBtnElement.click();
};

const unmuteTrack = async (trackElement) => {
  const muteBtnElement = await trackElement.$(`button.track__mute`);
  await muteBtnElement.click();
}

const downloadMix = async (page, filePath) => {
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 60000 }),
    page.click("a.download"),
  ]);
  await download.saveAs(filePath);
  await page.click(".js-modal-close.modal__close");
};

const fetchSongInfo = async (page) => {
  const title = await getInnerText(page, "#navbar li:last-child");
  const artist = await getInnerText(page, "#navbar li:nth-last-child(2)");

  console.log(`${artist} - ${title}`);
  const dir = `tracks\\${artist} - ${title}`;
  const infoElement = await page.$("#audio-infos");
  await infoElement.screenshot({
    path: path.join(__dirname, dir, `_info.png`),
  });
  return dir;
};

const getInnerText = async (pageOrElement, selector) => {
  let element = pageOrElement;
  if (selector) {
    element = await pageOrElement.$(selector);
  }
  const innerText = await element.innerText();
  return innerText.trim();
};

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));
