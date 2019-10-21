const { Builder, By, Key, util, wait } = require("selenium-webdriver")
const assert = require('assert');
var Slack = require('nodejslack');
var SLACK_TOKEN = "***";
var slack = new Slack(SLACK_TOKEN);
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
    await driver.findElement(By.name("password")).sendKeys(loginPassword, Key.RETURN);
}

async function logout(driver, url) {
    await driver.findElement(By.className("c-icon p-classic_nav__team_header__team__icon c-icon--chevron-down")).click();
    await driver.findElement(By.xpath("/html/body/div[6]/div/div/div/div/div/div/div[13]/button/div")).click();
}

async function askFilebot(driver) {
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//a[@href='https://csc510workspace.slack.com/messages/CNK1N4V5F']")).click();
}

async function UseCaseSendStorageWarningWithParams(driver) {
    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[4]/div/div/footer/div/div/div[1]/div/div[1]")).sendKeys("@fileninja --setStorageSize 3", Key.RETURN);

    await driver.sleep(3000);
}

async function UseCaseSendStorageWarningWithoutParams(driver) {

    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[4]/div/div/footer/div/div/div[1]/div/div[1]")).sendKeys("@fileninja --setStorageSize", Key.RETURN);
    await driver.sleep(2000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Not a number", text);
                console.log('Usecase 2: Expectedly failed when wrong/no parameter given');
            } catch (e) {
                console.log('Usecase 2: Unexpectedly passed when wrong/no parameter given');
                return Promise.resolve('Usecase to set storage warning failed.');
            }
        })
    });

}

(async () => {

    let driver = await new Builder().forBrowser("chrome").build();
    await login(driver, slackUrl);
    await askFilebot(driver);
    await UseCaseSendStorageWarningWithParams(driver);
    await UseCaseSendStorageWarningWithoutParams(driver);
    //await logout(driver, "https://csc510workspace.slack.com");
})()