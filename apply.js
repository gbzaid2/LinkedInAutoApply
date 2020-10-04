const {Builder, By, Key, until} = require('selenium-webdriver');
 
async function example() {
  let driver = await new Builder().forBrowser('chrome').build();
  const linkedInUrl = "https://www.linkedin.com/jobs/search/?f_LF=f_AL%2Cf_EA&f_TPR=r86400&geoId=103644278&keywords=software%20engineer&location=United%20States";
  try {
    await driver.get(linkedInUrl);
    //await driver.findElement(By.id('ember1480')).click();
    const jobs = await driver.findElements(By.className("result-card__full-card-link"));
    await jobs[9].click();
    
    //jobs[5].click();
   
    //await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } catch(err) {
    console.log(err);
    console.log("Something went wrong");
  } finally {
    //await driver.quit();
    console.log("Done");
  }
};

example();

async function signIn(){
  
}

