import puppeteer from 'puppeteer'

 /**
  * Scrapes the c2cbus.ipp.cornell.edu website to select travel options and print out possible tickets for the next day.
  */
const puppeteerScraper = async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    // const browser = await puppeteer.launch({ headless: false });
    
    const page = await browser.newPage();

    await page.goto('https://c2cbus.ipp.cornell.edu/mobile/?a=mobile');

    // Selects travelers
    await page.select('#ctl00_cph_ddlQty', '1');

    // Selects one way
    await page.select('#ctl00_cph_ddlTripType', 'One Way');

    // Selects pickup location as Ithaca, North Campus
    await page.select('#ctl00_cph_ddlDepPickLocation', '7,16');

    // // Selects dropoff location as New York City, Cornell Club
    await page.waitForSelector('#ctl00_cph_ddlDepDropLocation');
    await page.select('#ctl00_cph_ddlDepDropLocation', '8,19');

    // Closes popup message if there is one
    try {
        await page.waitForSelector('#msgClose.btn', {timeout: 2000, visible: true});

        await page.click('#msgClose.btn');
    } catch (e) {
        console.log("No popup");
    }

    // Clicks date picker
    await page.click('#ctl00_cph_txtDepDate');

    // Selects date (tomorrow for testing)
    // Increases day by one
    await page.waitForXPath('/html/body/form/div[5]/div[3]/div[4]/div[2]/div[2]/table/tr[4]/td[2]');
    await page.click('xpath//html/body/form/div[5]/div[3]/div[4]/div[2]/div[2]/table/tr[4]/td[2]');

    // // Selects set button
    await page.click("xpath//html/body/form/div[5]/div[3]/div[4]/div[2]/div[2]/table/tr[5]/td[3]");

    // Prints out the possible tickets for the date
    const date = new Date();
    date.setDate(date.getDate() + 1);
    console.log(date.toDateString() + ":");

    await page.waitForSelector('label.radio');
    const elements = await page.$$('label.radio');

    const tripData: string[] = [];

    for (const element of elements) {
        const text = await element.$eval('span', el => el.textContent);
        tripData.push(text);
    }

    console.log(tripData);

    await browser.close();
} 

var startTime = performance.now();
await puppeteerScraper();
var endTime = performance.now();
console.log("Time elapsed: " + (endTime - startTime) + "ms");