import {Builder, By} from 'selenium-webdriver';

const scrapingTest = async () => {
    var driver = await new Builder()
        .forBrowser('chrome')
        .build();

    driver.get('https://c2cbus.ipp.cornell.edu/mobile/?a=mobile');

    await driver.manage().setTimeouts({ implicit: 2000 });

    // selects travelers
    await driver.findElement(By.id('ctl00_cph_ddlQty')).sendKeys('1');
    
    // selects one way
    await driver.findElement(By.id('ctl00_cph_ddlTripType')).sendKeys('One Way');

    // selects pickup location as Ithaca, North Campus
    await driver.findElement(By.id('ctl00_cph_ddlDepPickLocation')).sendKeys('Ithaca, North Campus');


    // // selects dropoff location as New York City, Cornell Club
    await driver.findElement(By.id('ctl00_cph_ddlDepDropLocation')).sendKeys('New York City, Cornell Club');

    // closes popup if there is one
    try {
        await driver.findElement(By.id('msgClose')).click();
    } catch (e) {
        console.log("No popup");
    }

    // clicks date picker
    await driver.findElement(By.id('ctl00_cph_txtDepDate')).click();

    // selects date (tomorrow for testing)
    // increases day by one
    await driver.findElement(By.xpath("//td[@style='cursor: pointer;' and contains(text(), '▼')][2]")).click();

    // selects set button
    await driver.findElement(By.xpath("//td[@style='border-top: 1px solid rgb(204, 204, 204); cursor: pointer;'][2]")).click();

    // prints out the possible tickets for the date
    const date = new Date();
    date.setDate(date.getDate() + 1);
    console.log(date.toDateString() + ":");

    let elements = await driver.findElements(By.xpath("//label[@class='radio']"));

    for(let e of elements) {
        console.log("Element:", await e.findElement(By.tagName("span")).getText());
    }

    driver.quit();
}

var startTime = performance.now();
await scrapingTest();
var endTime = performance.now();
console.log("Time elapsed: " + (endTime - startTime) + "ms");