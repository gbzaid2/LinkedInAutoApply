const { Builder, By, Key, until } = require("selenium-webdriver");

async function test() {
  let driver = await new Builder().forBrowser("firefox").build();

  await driver.get(
    "https://www.linkedin.com/jobs/view/2191053358/?alternateChannel=search&refId=03ab492f-84e0-4da0-b874-14b15e28db3d&trackingId=Gu5WxYMRkH4LJWxzuHWTHQ%3D%3D&trk=flagship3_search_srp_jobs"
  );

  let ezApply = driver
    .findElement(
      By.xpath(
        "/html/body/div[8]/div[3]/div/div[1]/div[1]/div/div[1]/div/section/div[2]/div[2]/div[2]/div[2]/div/div/button"
      )
    )
    .catch((e) => {
      console.log("couldn't find ez apply button");
    });
  ezApply.click();
  let homeAddress = await driver
    .findElement(
      By.xpath("/html/body/div[4]/div/div/div[2]/div/form/div/div/h3")
    )
    .catch((err) => {console.log("Couldn't find home address page")});
}

exports.test = test;

async function loadPage(){

}


async function clickNextOrSubmit(){
  var button = document.getElementsByClassName("artdeco-button artdeco-button--2 artdeco-button--primary ember-view")[0];
  
  // Keep clicking next
  while(button.innerText !== "Submit application"){
    var progress = $x("/html/body/div[4]/div/div/div[2]/div/div[1]/div/div/progress")[0];
    var progressValueOld = progress.value;
    button.click();
    if(progressValueOld === progress.value) {
      console.log("Can't progress");
      var close = document.getElementsByClassName("artdeco-modal__dismiss artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view")[0];
      close.click();
      var discard = document.getElementsByClassName("artdeco-modal__confirm-dialog-btn artdeco-button artdeco-button--2 artdeco-button--primary ember-view")[0];
      discard.click();
      return 1;
    }
    submit = document.getElementsByClassName("artdeco-button artdeco-button--2 artdeco-button--primary ember-view")[0];
  }
  // Final page 
  var unfollowCheck = document.getElementById("follow-company-checkbox");
  if(unfollowCheck !== null) unfollowCheck.click();
  submit.click();

  // Check to see if dialog needs to be closed
  var close = document.getElementsByClassName("artdeco-modal__dismiss artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view")[0];
  if(close !== undefined) close.click();
  return 0;
}
