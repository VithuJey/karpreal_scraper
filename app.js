const puppeteer = require("puppeteer");

let URL =
  "https://www.karpreal.com/view-properties-for-sale?keyword=&ref=&type%5B%5D=Land&parish%5B%5D=PHI&price%5Bmin%5D=0&price%5Bmax%5D=350000&bedrooms=&bathrooms=&zoning=All";
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 926 });
  await page.goto(URL);

  console.log("Start");

  // get house details
  let houseData = await page.evaluate(() => {
    // array to store house-page URLs
    let house_URLs = [];

    // get the house elements
    let housesElms = document.querySelectorAll(
      'div[class="field-item even"] > a'
    );

    console.log(housesElms);

    // get the house data
    housesElms.forEach(housesElm => {
      let house_URL = "";
      try {
        house_URL = housesElm.href;
      } catch (error) {
        console.log(error);
      }
      house_URLs.push(house_URL);
    });

    return house_URLs;
  });

  console.log(Array.from(new Set(houseData)));

//   await page.goto(URL);

  debugger;

  await browser.close();
})();

/*

let houses = [];
        // get the house elements
        let housesElms = document.querySelectorAll('div.sr_property_block[data-hotelid]');
        // get the house data
        housesElms.forEach((houseElement) => {
            let houseJson = {};
            try {
                houseJson.name = houseElement.querySelector('span.sr-hotel__name').innerText;
                houseJson.reviews = houseElement.querySelector('span.review-score-widget__subtext').innerText;
                houseJson.rating = houseElement.querySelector('span.review-score-badge').innerText;
                if(houseElement.querySelector('strong.price')){
                    houseJson.price = houseElement.querySelector('strong.price').innerText;
                }
            }
            catch (exception){
                console.log(exception)
            }
            houses.push(houseJson);
        });
        return houses;

*/
