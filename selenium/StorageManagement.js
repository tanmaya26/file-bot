const {Builder, By, Key, util, wait} = require("selenium-webdriver")
var promise = require('selenium-webdriver').promise;
const assert = require('assert');
const fs = require('fs');

var Slack = require('nodejslack');

// Creating instance to connect to Slack. check: https://github.com/marcogbarcellos/nodejslack
var SLACK_TOKEN="xoxp-775571702198-775572561206-760713155138-2e4cc51950599d51687e88f600e8d116"
var slack = new Slack(SLACK_TOKEN);

// const slack_bot_service = require('../src/service/slack_bot_service');
// const slack = slack_bot_service.slack;


const loginEmail = process.env.LOGIN_EMAIL;
const loginPassword = process.env.LOGIN_PWD;
const slackUrl = "https://csc510workspace.slack.com"

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

async function switchChannel(driver) {
    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[3]/div/nav/div[2]/div[1]/div/div[1]/div/div/div[11]/a/span")).click();
}


// List category files Usecases

async function UseCaseListFilesOfCategoryGood(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --showFiles Project1", Key.RETURN);
    await driver.sleep(2000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Files under the category 'Project1' are  project1.pdf, se-report.pdf,", text);
                console.log('Usecase 4.1: "List files under category" expectedly passed.'); 
            } catch (e) {
                console.log('Usecase 4.1: "List files under category" unexpectedly failed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

async function UseCaseListFilesOfCategoryWithoutParams(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --showFiles", Key.RETURN);
    await driver.sleep(2000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                text = text.split(" ")[0]
                assert.equal("Error.", text);
                console.log('Usecase 4.1: "List files under category" without params expectedly failed.'); // Need to check this with first test cases
            } catch (e) {
                console.log('Usecase 4.1: "List files under category" without params unexpectedly passed .');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}


async function UseCaseListFilesOfCategoryNotAvailable(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --showFiles xyz", Key.RETURN);
    await driver.sleep(2000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Error. Category name: xyz does not exists.", text);
                console.log('Usecase : "List files under category which doesn\'t exist" expectedly failed.'); // Need to check this with first test cases
            } catch (e) {
                console.log('Usecase : "List files under category which doesn\'t exist" unexpectedly passed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}


// Delete file category use cases
async function UseCaseDeleteFileOfCategoryGood(driver) { // still need to implement
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --delete file Project1 sample.pdf", Key.RETURN);
    await driver.sleep(2000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Error. Category name: xyz does not exists.", text, "yu");
                console.log('Usecase : "List files under category which doesn\'t exist" expectedly failed.'); // Need to check this with first test cases
            } catch (e) {
                console.log('Usecase : "List files under category which doesn\'t exist" unexpectedly passed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

async function UseCaseDeleteAllFilesOfCategoryGood(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --delete category Project1", Key.RETURN);
    await driver.sleep(2000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Error. Category name: xyz does not exists.", text, "yu");
                console.log('Usecase : "List files under category which doesn\'t exist" expectedly failed.'); // Need to check this with first test cases
            } catch (e) {
                console.log('Usecase : "List files under category which doesn\'t exist" unexpectedly passed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

async function UseCaseDeleteAllFilesOfCategoryGood(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --delete xyz", Key.RETURN);
    await driver.sleep(2000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Error. Category name: xyz does not exists.", text, "yu");
                console.log('Usecase : "List files under category which doesn\'t exist" expectedly failed.'); // Need to check this with first test cases
            } catch (e) {
                console.log('Usecase : "List files under category which doesn\'t exist" unexpectedly passed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}


//Export




(async () => {

let driver = await new Builder().forBrowser("chrome").build();
await console.log("Test Results:")
await login(driver, slackUrl);
await switchChannel(driver);

//List files in a category
await UseCaseListFilesOfCategoryGood(driver);
await UseCaseListFilesOfCategoryWithoutParams(driver);
await UseCaseListFilesOfCategoryNotAvailable(driver);

//Delete Files of a project
await UseCaseDeleteFilesOfCategoryGood(driver);


})()