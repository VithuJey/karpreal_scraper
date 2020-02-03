const puppeteer = require("puppeteer");

let URL =
  "https://www.karpreal.com/property/for-sale/lot-155-5th-avenue-inchcape-terrace-wellhouse-st-philip";

// https://www.karpreal.com/property/for-sale/lot-155-5th-avenue-inchcape-terrace-wellhouse-st-philip

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 926 });
  await page.goto(URL);

  houseDetails = await page.evaluate(() => {
    let houseJson = {};
    try {
      if (
        document.querySelector(
          'div[class="field-item even"] > span[class="price"]'
        ) != null
      ) {
        houseJson.price =
          "$" +
          document.querySelector(
            'div[class="field-item even"] > span[class="price"]'
          ).innerText +
          " US";
      }

      if (
        document.querySelector(
          'div[class="field field-name-field-net-land-area field-type-number-integer field-label-inline clearfix"] > div[class="field-items"] > div[class="field-item even"]'
        ) != null
      ) {
        houseJson.netLandArea = document.querySelector(
          'div[class="field field-name-field-net-land-area field-type-number-integer field-label-inline clearfix"] > div[class="field-items"] > div[class="field-item even"]'
        ).innerText;
      }

      if (
        document.querySelector(
          'div[class="field field-name-field-gross-land-area field-type-number-integer field-label-inline clearfix"] > div[class="field-items"] > div[class="field-item even"]'
        ) != null
      ) {
        houseJson.landArea = document.querySelector(
          'div[class="field field-name-field-gross-land-area field-type-number-integer field-label-inline clearfix"] > div[class="field-items"] > div[class="field-item even"]'
        ).innerText;
      }

      if (
        document.querySelector(
          'div[class="field field-name-field-property-type field-type-list-text field-label-inline clearfix"] > div[class="field-items"] > div[class="field-item even"]'
        ) != null
      ) {
        houseJson.listingType = document.querySelector(
          'div[class="field field-name-field-property-type field-type-list-text field-label-inline clearfix"] > div[class="field-items"] > div[class="field-item even"]'
        ).innerText;
      }

      if (document.querySelector('div[class="field-item even"] > h2') != null) {
        houseJson.name = document.querySelector(
          'div[class="field-item even"] > h2'
        ).innerText;
      }

      if (
        document.querySelector(
          'div[class="field field-name-field-listing-type field-type-list-text field-label-inline clearfix"] > div[class="field-items"] > div[class="field-item even"]'
        ) != null &&
        "For Sale" ==
          document.querySelector(
            'div[class="field field-name-field-listing-type field-type-list-text field-label-inline clearfix"] > div[class="field-items"] > div[class="field-item even"]'
          ).innerText
      )
        houseJson.saleStatus = "available";
      else houseJson.saleStatus = "sold";

      if (document.querySelectorAll("head > meta[property='og:url']") != null) {
        houseJson.providerLink = document.querySelectorAll(
          "head > meta[property='og:url']"
        )[0].content;
      }
    } catch (exception) {
      console.log(exception);
    }

    return houseJson;
  });

  console.log(houseDetails);
})();
