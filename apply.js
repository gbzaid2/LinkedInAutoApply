const {Builder, By, Key, until} = require('selenium-webdriver');
const {email, password} = require("./linkedinLogin.json")

async function example() {
  let driver = await new Builder().forBrowser('firefox').build();
  const linkedInUrl = "https://www.linkedin.com/jobs/search/?f_LF=f_AL%2Cf_EA&f_TPR=r86400&geoId=103644278&keywords=software%20engineer&location=United%20States";
  try {
    await driver.get(linkedInUrl);
    await signIn(driver);
    
    
    await driver.wait(until.titleIs("(10) software engineer Jobs in United States | LinkedIn"), 5000);
    await driver.sleep(3000);
    driver.executeScript(scrollDown);
    await driver.sleep(1000);
    driver.executeScript(scrollDown);
    await driver.sleep(1000);
    driver.executeScript(scrollDown);
    await driver.sleep(1000);
    //await scrollDown();
    const jobs = await driver.findElements(By.className("disabled ember-view job-card-container__link job-card-list__title"));
    //const testElement = await driver.findElement(By.id("a11y-menu"));
    //console.log(testElement.getId());
    //const jobs = await driver.findElements(By.className("jobs-search-results__list-item occludable-update p0 relative ember-view"));
    
    console.log(jobs.length);
    //await jobs[9].click();
    
    //jobs[5].click();
   
    //await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } catch(err) {
    console.log(err);
    console.log("Something went wrong");
    //driver.close();
  } finally {
    //await driver.quit();
    console.log("Done");

  }
};

example();

async function signIn(driver){
  await driver.findElement(By.className("nav__button-secondary")).click();
  await driver.wait(until.titleIs('LinkedIn Login, Sign in | LinkedIn', 5000))
  await driver.findElement(By.id("username")).sendKeys(email);
  await driver.findElement(By.id("password")).sendKeys(password, Key.RETURN);

}

function scrollDown(){
  
  var element = document.getElementsByClassName("jobs-search-results")[0];
  var scrollOptions = {
    top: 1000,
    left: 0,
    behavior: 'smooth'
  }
  element.scrollBy(scrollOptions);
}

