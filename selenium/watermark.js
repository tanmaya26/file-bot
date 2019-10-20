const {Builder, By, Key, util, wait} = require("selenium-webdriver")
var promise = require('selenium-webdriver').promise;
const assert = require('assert');

const loginEmail = process.env.LOGIN_EMAIL;
const loginPassword = process.env.LOGIN_PWD;
const slackUrl = "https://csc510workspace.slack.com"

console.log(loginEmail);
console.log(loginPassword);

async function login(driver, url) {
    await driver.get(url);
    await driver.findElement(By.name("email")).sendKeys(loginEmail);
    await driver.findElement(By.name("password")).sendKeys(loginPassword, Key.RETURN);
    // await driver.sleep(2000);
}

async function logout(driver, url) {
    await driver.findElement(By.className("c-icon p-classic_nav__team_header__team__icon c-icon--chevron-down")).click();
    await driver.findElement(By.xpath("/html/body/div[6]/div/div/div/div/div/div/div[13]/button/div")).click();
}

async function UseCaseRegisterWaterMarkGood(driver, url) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --watermark --register SE-Project-1 water-icon.png", Key.RETURN);
    // asert here
    await driver.sleep(1000);
}

async function UseCaseRegisterWaterMarkWhenJPGIsUploaded(driver, url) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --watermark --register SE-Project-2 water-icon.jpg", Key.RETURN);
    // asert here
    await driver.sleep(1000);
}

async function UseCaseRegisterWaterMarkWhenImageNotFound(driver, url) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --watermark --register SE-Project-3 watericon.png", Key.RETURN);
    // asert here
    await driver.sleep(1000);
}

async function UseCaseRegisterWaterMarkWhenTagAlreadyExist(driver, url) {
    //TODO: make a fake tag
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --watermark --register SE-Project-1 water-icon.png", Key.RETURN);
    // asert here
    await driver.sleep(1000);
}

async function UseCaseAddWaterMark(driver, url) {

    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[4]/div/div/footer/div/div/div[1]/div/div[1]")).sendKeys("@fileNinja --addWatermark SE-Project se-report.pdf", Key.RETURN);
    await driver.sleep(1000);
    // await driver.quit();
}




async function switchChannel(driver) {
    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[3]/div/nav/div[2]/div[1]/div/div[1]/div/div/div[11]/a/span")).click();
}

(async () => {

let driver = await new Builder().forBrowser("chrome").build();
await login(driver, slackUrl);
await switchChannel(driver);
await UseCaseRegisterWaterMark(driver, "https://csc510workspace.slack.com");
// await UseCaseAddWaterMark(driver, "https://csc510workspace.slack.com");
})()