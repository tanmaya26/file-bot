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
    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[3]/div/nav/div[2]/div[1]/div/div[1]/div/div/div[11]/a/span")).click();
}

async function UseCaseSetStorageLimitWithParams(driver) {
    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[4]/div/div/footer/div/div/div[1]/div/div[1]")).sendKeys("@fileninja --setStorageSize 3", Key.RETURN);
    await driver.sleep(3000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Size Limit has been set to 3", text);
                console.log('Usecase 2: "Set storage limit" expectedly passed.');
            } catch (e) {
                console.log('Usecase 2: "Set storage limit" unexpectedly failed when parameter given');
                return Promise.resolve('Usecase to set storage warning failed.');
            }
        })
    });
}

async function UseCaseSetStorageLimitWithoutParams(driver) {
    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[4]/div/div/footer/div/div/div[1]/div/div[1]")).sendKeys("@fileninja --setStorageSize", Key.RETURN);
    await driver.sleep(2000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Not a number", text);
                console.log('Usecase 2: "Set storage limit" expectedly failed when wrong/no parameter given');
            } catch (e) {
                console.log('Usecase 2: "Set storage limit" unexpectedly failed when wrong/no parameter given');
                return Promise.resolve('Usecase to set storage warning failed.');
            }
        })
    });
}

async function UseCaseGetStorage(driver) {
    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[4]/div/div/footer/div/div/div[1]/div/div[1]")).sendKeys("@fileninja --getStorageSize", Key.RETURN);
    await driver.sleep(2000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Current size limit is 3", text);
                console.log('Usecase 3: "Get storage limit" expectedly passed.');
            } catch (e) {
                console.log('Usecase 3: "Get storage limit" unexpectedly failed.');
                return Promise.resolve('Usecase to get storage limit failed.');
            }
        })
    });
}

async function UseCaseRegisterCategoryWithParams(driver) {

    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[4]/div/div/footer/div/div/div[1]/div/div[1]")).sendKeys("@fileninja --registerCategory Project1", Key.RETURN);
    await driver.sleep(2000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Category has been added.", text);
                console.log('Usecase 4.1: "Register category" expectedly passed.');
            } catch (e) {
                console.log('Usecase 4.1: "Register category" unexpectedly failed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });

    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[4]/div/div/footer/div/div/div[1]/div/div[1]")).sendKeys("@fileninja --registerCategory Project1", Key.RETURN);
    await driver.sleep(2000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Error. Category name already exists.", text);
                console.log('Usecase 4.2: "Register category" expectedly failed when user tried to add same category again.');
            } catch (e) {
                console.log('Usecase 4.2: Unexpectedly failed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

async function UseCaseRegisterCategoryWithoutParams(driver) {

    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[4]/div/div/footer/div/div/div[1]/div/div[1]")).sendKeys("@fileninja --registerCategory", Key.RETURN);
    await driver.sleep(2000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Not a number", text);
                console.log('Usecase 5: Expectedly failed when wrong/no parameter given');
            } catch (e) {
                console.log('Usecase 5: Unexpectedly failed when wrong/no parameter given');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

(async () => {

    let driver = await new Builder().forBrowser("chrome").build();
    await login(driver, slackUrl);
    await askFilebot(driver);
    await UseCaseSetStorageLimitWithParams(driver);
    await UseCaseSetStorageLimitWithoutParams(driver);
    await UseCaseGetStorage(driver);
    await UseCaseRegisterCategoryWithParams(driver);
    //await UseCaseRegisterCategoryWithoutParams(driver);
    //await logout(driver, "https://csc510workspace.slack.com");
})()