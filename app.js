const puppeteer = require("puppeteer");
const fs = require('fs');

let URL = 
"https://www.karpreal.com/view-properties-for-sale?keyword=&ref=&type%5B%5D=Land&parish%5B%5D=PHI&price%5Bmin%5D=0&price%5Bmax%5D=350000&bedrooms=&bathrooms=&zoning=All";

  (async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 926 });
  await page.goto(URL);

  // Save all house details in a JSON
  let houses = [];

  // list to store all house page urls
  let houseURLs = [];

  console.log("Scraping on process...");

  // global variable to save Next button url globally to use it for the while loop condition
  let next = "";

  while(next != null) {

    // go to Chrome Dev Tool and perform 'querySelectorAll' and get the results here
  let {URLs,nextURL} =  await page.evaluate(() => {
    // array to store house-page URLs
    let URLs = [];
    // get the house list elements
    let housesElms = document.querySelectorAll(
      'div[class="field-item even"] > a'
    );

    // To save next button url locally
    let nextURL;
    if (document.querySelectorAll('li[class="pager-next"] > a').item(0) != null)
      nextURL = document.querySelectorAll('li[class="pager-next"] > a').item(0).href;
    else
      nextURL = null;

    // get the house URLs(href) from elements
    housesElms.forEach(housesElm => {
      // get the url of each house page
      let house_URL = "";
      try {
        house_URL = housesElm.href;
      } catch (error) {
        console.log(error);
      }
      URLs.push(house_URL);
    });

    return {URLs, nextURL}
  });

  // delete duplicate URLs and adding each unique URL to a common list called houseURLs
  houseURLs = houseURLs.concat(Array.from(new Set(URLs)));
  // save the next URL to access it globally
  next = nextURL;
  // If nextURL is not null then it can go to next page, not needed condition. 
  if (nextURL != null)
    await page.goto(nextURL);
  }

  
  // console.log(houseURLs);
  console.log("Fetching house details...")  
// let i =0;
  for(let houseURL of houseURLs) {
    await page.goto(houseURL);
    
    let houseDetails = await page.evaluate(() => {
      let houseJson = {};
            try {
                houseJson.price = "$" + document.querySelector('div[class="field-item even"] > span[class="price"]').innerText + " US";
                houseJson.netLandArea = document.querySelector('div[class="field field-name-field-net-land-area field-type-number-integer field-label-inline clearfix"] > div[class="field-items"] > div[class="field-item even"]').innerText;
                houseJson.landArea = document.querySelector('div[class="field field-name-field-gross-land-area field-type-number-integer field-label-inline clearfix"] > div[class="field-items"] > div[class="field-item even"]').innerText;
                houseJson.listingType = document.querySelector('div[class="field field-name-field-property-type field-type-list-text field-label-inline clearfix"] > div[class="field-items"] > div[class="field-item even"]').innerText;
                houseJson.name = document.querySelector('div[class="field-item even"] > h2').innerText;
                
                houseJson.location = {
                  coordinates:  document.querySelectorAll("head > meta[name='geo.position']")[0].content //lng, lat
                  };

                if ("For Sale" == document.querySelector('div[class="field field-name-field-listing-type field-type-list-text field-label-inline clearfix"] > div[class="field-items"] > div[class="field-item even"]').innerText)
                  houseJson.saleStatus = "available"
                else
                  houseJson.saleStatus = "sold"
                
                houseJson.providerLink = document.querySelectorAll("head > meta[property='og:url']")[0].content; 
            }
            catch (exception){
                console.log(exception)
            }
            
            return houseJson;
    })

    houses.push(houseDetails);

    // i++;
    // if (i==2)
    //   break;

  }
  
  // Write json values in a json file
  let data = JSON.stringify(houses);
  fs.writeFileSync('house1.json', data);

  console.log(houses)

  console.log("Scraping is done!");
  console.log("house.json file created with scraped data.");

  await browser.close();
})();
