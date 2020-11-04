const { Builder, By, Key, until } = require("selenium-webdriver");
const { email, password } = require("./linkedinLogin.json");
const prompt = require("prompt-sync")();
const todayDate = require("./dateToday.js");
//const pushToAirTable = require("./record").pushToAirtable;

let appSpeedFactor = 2; // Controls speed of applying
async function main() {
  let driver = await new Builder().forBrowser("firefox").build();
  const linkedInUrl =
    "https://www.linkedin.com/jobs/search/?f_LF=f_AL%2Cf_EA&f_TPR=r604800&geoId=103644278&keywords=software%20engineer%20NOT%20(%22frontend%22%20OR%20%22front%20end%22%20OR%20%22web%22)&location=United%20States";

  try {
    console.log("Session id: " + driver.getSession());
    await driver.get(linkedInUrl);
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
          // Check to see if dialog needs to be closed
          await driver.executeScript(closeModal);
          await job.click();
          await driver.sleep(2000 * appSpeedFactor);
          let result = await driver.executeAsyncScript(apply);
          if (result === 0) {
            let airtableRecord = await driver.executeScript(extractJobFields);
            airtableRecord["Applied Date"] = todayDate;
            //pushToAirTable(airtableRecord);
          }
          await driver.sleep(2000 * appSpeedFactor);
        } catch (err) {
          console.log("Couldn't click/process this job, line 44");
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

async function apply() {
  var callback = arguments[arguments.length - 1];
  var ezapply = document.getElementsByClassName(
    "jobs-apply-button artdeco-button artdeco-button--3 artdeco-button--primary ember-view"
  )[0];
  await new Promise((r) => setTimeout(r, 1000));
  if (ezapply === undefined) {
    callback(1);
  } else {
    ezapply.click();
  }
  await new Promise((r) => setTimeout(r, 500));

  // Edge case
  var edgeButton = document.getElementsByClassName(
    "js-message-apply-submit artdeco-button artdeco-button--3 artdeco-button--primary ember-view"
  );
  if (
    edgeButton.length > 0 &&
    edgeButton[0].innerText === "Submit application"
  ) {
    edgeButton[0].click();
    callback(0);
  }
  var button = document.getElementsByClassName(
    "artdeco-button artdeco-button--2 artdeco-button--primary ember-view"
  )[0];

  console.log(button.innerText);
  // Keep clicking next
  while (button.innerText !== "Submit application") {
    await new Promise((r) => setTimeout(r, 1000));
    var progress = document.getElementsByClassName(
      "artdeco-completeness-meter-linear__progress-element"
    )[0];
    var progressValueOld = progress.value;

    button.click();

    if (progressValueOld === progress.value) {
      console.log("Can't complete application; discarding.");
      var close = document.getElementsByClassName(
        "artdeco-modal__dismiss artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view"
      )[0];
      close.click();
      await new Promise((r) => setTimeout(r, 500));
      var discard = document.getElementsByClassName(
        "artdeco-modal__confirm-dialog-btn artdeco-button artdeco-button--2 artdeco-button--primary ember-view"
      )[0];
      discard.click();
      callback(1);
    }
    button = document.getElementsByClassName(
      "artdeco-button artdeco-button--2 artdeco-button--primary ember-view"
    )[0];
  }
  await new Promise((r) => setTimeout(r, 500));
  // Final page
  var unfollowCheck = document.getElementById("follow-company-checkbox");
  if (unfollowCheck !== null) unfollowCheck.click();
  button.click();
  await new Promise((r) => setTimeout(r, 1000));
  // Check to see if dialog needs to be closed
  var close = document.getElementsByClassName(
    "artdeco-modal__dismiss artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view"
  )[0];
  if (close !== undefined) {
    close.click();
  }
  await new Promise((r) => setTimeout(r, 500));
  // check to see if it needs to discard application becasue of an error submitting
  var discard = document.getElementsByClassName(
    "artdeco-modal__confirm-dialog-btn artdeco-button artdeco-button--2 artdeco-button--primary ember-view"
  )[0];
  if (discard !== undefined) {
    discard.click();
    callback(1);
  } else {
    callback(0);
  }
}

async function securityCheck() {
  return driver.titleIs("Security Verification | LinkedIn");
}

function closeModal() {
  var close = document.getElementsByClassName(
    "artdeco-modal__dismiss artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view"
  )[0];
  if (close !== undefined) {
    close.click();
  }
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
