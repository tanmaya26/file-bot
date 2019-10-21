const { Builder, By, Key, util, wait } = require("selenium-webdriver")
const assert = require('assert');

const loginEmail = process.env.LOGIN_EMAIL;
const loginPassword = process.env.LOGIN_PWD;
const slackUrl = "https://csc510workspace.slack.com";


async function example() {
    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get("http://google.com");
    await driver.findElement(By.name("domain")).sendKeys("csc510workspace", Key.RETURN);
}

async function login(driver, url) {
    await driver.get(url);
    await driver.findElement(By.name("email")).sendKeys(loginEmail);
    await driver.findElement(By.name("password")).sendKeys(loginPassword,Key.RETURN);
}

async function logout(driver, url) {
    await driver.findElement(By.className("c-icon p-classic_nav__team_header__team__icon c-icon--chevron-down")).click();
    await driver.findElement(By.xpath("/html/body/div[6]/div/div/div/div/div/div/div[13]/button/div")).click();
}

async function askFilebot(driver) {
    await driver.sleep(2000);

    await driver.findElement(By.xpath("//a[@href='https://csc510workspace.slack.com/messages/DNE0ELZNX']")).click();
}

async function UseCaseSendStorageWarning(driver) {
    
    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[4]/div/div/footer/div/div/div[1]/div/div[1]")).sendKeys("@fileninja --setStorageSize 3", Key.RETURN);
    await driver.sleep(1000);

}

(async () => {

    let driver = await new Builder().forBrowser("chrome").build();
    await login(driver, slackUrl);
    await askFilebot(driver);
    await UseCaseSendStorageWarning(driver);
    //await logout(driver, "https://csc510workspace.slack.com");
})()