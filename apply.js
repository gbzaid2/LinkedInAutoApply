const { Builder, By, Key, until } = require("selenium-webdriver");
const { email, password } = require("./linkedinLogin.json");
const prompt = require("prompt-sync")();
const todayDate = require("./dateToday.js");
const pushToAirTable = require("./record").pushToAirtable;

let appSpeedFactor = 1; // Controls speed of applying
async function main() {
  let driver = await new Builder().forBrowser("firefox").build();
  const linkedInUrl =
    "https://www.linkedin.com/jobs/search/?f_LF=f_AL%2Cf_EA&f_TPR=r86400&geoId=103644278&keywords=software%20engineer&location=United%20States";
  const linkedInUrlNew =
    "https://www.linkedin.com/jobs/search/?f_LF=f_AL%2Cf_EA&f_TPR=r604800&geoId=103644278&keywords=software%20engineer&location=United%20States";
  try {
    await driver.get(linkedInUrlNew);
    await driver.sleep(1000 * appSpeedFactor);
    await signIn(driver);
    prompt("ENTER ANY KEY TO CONTINUE");
    await driver.sleep(3000 * appSpeedFactor);

    let lastPage = await driver.executeScript(getLastPageNum);

    for (let i = 1; i <= lastPage; i++) {
      await driver.sleep(2000);
      await scrollLoadJobs(driver);
      let jobs = await driver.findElements(
        By.className(
          "disabled ember-view job-card-container__link job-card-list__title"
        )
      );
      for (job of jobs) {
        try {
          await driver.sleep(1000 * appSpeedFactor);
          job.click();
          job.click();
          let airtableRecord = await driver.executeScript(extractJobFields);
          airtableRecord["Applied Date"] = todayDate;
          pushToAirTable(airtableRecord);
          await driver.sleep(2000 * appSpeedFactor);
          await apply(driver);
        } catch (err) {
          
          continue;
        }
        //ok
      }
      await driver.executeScript(clickPage, i + 1);
    }
  } catch (err) {
    console.log("Can't start clicking jobs");
    //driver.close();
  } finally {
    //await driver.quit();
    console.log("Done");
  }
}

main();

async function signIn(driver) {
  await driver.findElement(By.className("nav__button-secondary")).click();
  await driver.wait(until.titleIs("LinkedIn Login, Sign in | LinkedIn", 5000));
  await driver.findElement(By.id("username")).sendKeys(email);
  await driver.findElement(By.id("password")).sendKeys(password, Key.RETURN);
}

function scrollDown() {
  var element = document.getElementsByClassName("jobs-search-results")[0];
  var scrollOptions = {
    top: 1000,
    left: 0,
    behavior: "smooth",
  };
  element.scrollBy(scrollOptions);
}

function scrollUp() {
  var element = document.getElementsByClassName("jobs-search-results")[0];
  element.scroll(0, 0);
}

function unfollowCompany() {
  var btn = document.getElementById("follow-company-checkbox");
  if (btn === null) {
    return null;
  } else {
    btn.click();
    return 0;
  }
}

function verifySubmitAppButton() {
  var btn = document.getElementsByClassName(
    "artdeco-button artdeco-button--2 artdeco-button--primary ember-view"
  );
  if (btn[0].children[0].innerText === "Submit application") {
    return true;
  } else {
    return false;
  }
}

async function apply(driver) {
  // Click Easy Apply
  try {
    const easyApplyBtn = await driver.findElements(
      By.className(
        "jobs-apply-button artdeco-button artdeco-button--3 artdeco-button--primary ember-view"
      )
    );
    await driver.sleep(500 * appSpeedFactor);
    await easyApplyBtn[0].click();
  } catch {
    return;
  }

  // Submit Application if possible
  try {
    // unfollow company
    await driver.sleep(500 * appSpeedFactor);
    await driver.executeScript(unfollowCompany);
    if (!(await driver.executeScript(verifySubmitAppButton))) {
      throw "No submit button here";
    } else {
      let submitApp = await driver.findElements(
        By.className(
          "artdeco-button artdeco-button--2 artdeco-button--primary ember-view"
        )
      );
      await submitApp[0].click();
      await driver.wait(1000 * appSpeedFactor);

    }
    await driver.sleep(500 * appSpeedFactor);
    let submitApp = await driver.findElements(
      By.className(
        "artdeco-button artdeco-button--2 artdeco-button--primary ember-view"
      )
    );

    while(await submitApp[0].getText() === "Next" || await submitApp[0].getText() === "Review" || await submitApp[0].getText() === "Review Application"){
      await driver.sleep(1000 * appSpeedFactor);
      await submitApp[0].click(); 
      submitApp = await driver.findElements(
        By.className(
          "artdeco-button artdeco-button--2 artdeco-button--primary ember-view"
        )
      );
    }


  } catch (err) {
    // otherwise quit application
    
    const closeAppBtn = await driver.findElements(
      By.className(
        "artdeco-modal__dismiss artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view"
      )
    );
    closeAppBtn[0].click();
    await driver.sleep(300 * appSpeedFactor);
    await driver.sleep(500 * appSpeedFactor);
    const discardBtn = await driver.findElements(
      By.className(
        "artdeco-modal__confirm-dialog-btn artdeco-button artdeco-button--2 artdeco-button--primary ember-view"
      )
    );
    await discardBtn[0].click();
  }
}

async function securityCheck() {
  return driver.titleIs("Security Verification | LinkedIn");
}

function getLastPageNum() {
  var pageNum = document.getElementsByClassName(
    "artdeco-pagination__pages artdeco-pagination__pages--number"
  );
  var lastPage =
    pageNum[0].children[pageNum[0].children.length - 1].children[0].innerText;
  return Number.parseInt(lastPage);
}

function clickPage(pageNum) {
  document
    .getElementsByClassName(
      "artdeco-pagination__pages artdeco-pagination__pages--number"
    )[0]
    .children[pageNum - 1].children[0].click();
}

async function scrollLoadJobs(driver) {
  driver.executeScript(scrollDown);
  await driver.sleep(1000 * appSpeedFactor);
  driver.executeScript(scrollDown);
  await driver.sleep(1000 * appSpeedFactor);
  driver.executeScript(scrollDown);
  await driver.sleep(1000 * appSpeedFactor);
  driver.executeScript(scrollDown);
  driver.executeScript(scrollUp);
}

function extractJobFields() {
  let job = document.getElementsByClassName(
    "jobs-details-top-card__job-title-link ember-view"
  )[0];
  let jobTitle = job.innerText;
  let jobURL = job.href;

  let jobPoster;
  try {
    jobPoster = document.getElementsByClassName(
      "jobs-poster__wrapper display-flex flex-row"
    )[0].children[0].href;
  } catch {
    jobPoster = "";
  }
  var loc = document.getElementsByClassName("jobs-details-top-card__bullet");
  loc = loc[0].innerText.substring(1);
  let company = document.getElementsByClassName(
    "jobs-details-top-card__company-url t-black--light t-normal ember-view"
  );
  companyName = company[0].innerText;
  companyURL = company[0].href;
  companyName = companyName.substring(0, companyName.length - 1);

  let airtableRecord = {
    "Job Title": jobTitle,
    Location: loc,
    "Application URL": jobURL,
    Status: "Applied",
    CompanyName: companyName,
    CompanyURL: companyURL,
    "Job Poster": jobPoster,
    "Type Of Application": ["Easy Apply"],
  };

  return airtableRecord;
}

function getButtonText() {
  return document.getElementsByClassName(
    "jobs-apply-button artdeco-button artdeco-button--3 artdeco-button--primary ember-view"
  )[0].innerText;
}
