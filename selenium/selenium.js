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

function login(driver, url) {
    driver.get(url);
    driver.findElement(By.name("email")).sendKeys(loginEmail);
    driver.findElement(By.name("password")).sendKeys(loginPassword, Key.RETURN);
    driver.sleep(2000);
}

function logout(driver, url) {
    driver.findElement(By.className("c-icon p-classic_nav__team_header__team__icon c-icon--chevron-down")).click();
    driver.findElement(By.xpath("/html/body/div[6]/div/div/div/div/div/div/div[13]/button/div")).click();
}

async function UseCaseSendStorageWarning(driver, url) {

    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[4]/div/div/footer/div/div/div[1]/div/div[1]")).sendKeys("@fileninja --setStorageSize 3", Key.RETURN);
    await driver.sleep(2000);

}

(async () => {

    let driver = await new Builder().forBrowser("chrome").build();
    await login(driver, "https://csc510workspace.slack.com");
    await UseCaseSendStorageWarning(driver, "https://csc510workspace.slack.com");
    await logout(driver, "https://csc510workspace.slack.com");
    driver.quit();
})()