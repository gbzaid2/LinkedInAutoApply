const { By } = require("selenium-webdriver");

const processForm = async function(driver){

    let formElement = await  driver.findElement(By.xpath("/html/body/div[4]/div/div/div[2]/div/form/div/div"));

    let homeAddress;
    await driver.findElement(By.xpath("/html/body/div[4]/div/div/div[2]/div/form/div/div/h3")).then(v=> homeAddress = await v.getText()).catch(err => {})
    if(homeAddress === "Home address"){

    } else if (homeAddress.getText() === "Home address"){

    }

    let city = driver.findElement(By.xpath("/html/body/div[4]/div/div/div[2]/div/form/div/div/div[1]/div/label/span"));

}

exports.processForm = processForm;

// xpaths or headings
let h3Heading = "/html/body/div[4]/div/div/div[2]/div/form/div/div/h3";
let privacypolicy = "/html/body/div[4]/div/div/div[2]/div/form/div/div/h3"
// Additional
// Are you legally eligible to work in the U.S.?
// Do you require sponsorship
// Are you comfortable commuting to this job's location"
// Voluntary self identification

function myTest(){
    let heading = $x("/html/body/div[4]/div/div/div[2]/div/form/div/div/h3");
    if (heading.length === 0) return;
    heading = heading[0].innerText;
    if (heading === "Home address"){
        let myForm = $x("/html/body/div[4]/div/div/div[2]/div/form/div/div");
        let inputs = myForm[0].getElementsByTagName("input");
        for(input of inputs){
            if (input.value === ""){
                input.
            }
        } 
    }

}