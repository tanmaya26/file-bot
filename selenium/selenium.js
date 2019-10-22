const { Builder, By, Key, util, wait } = require("selenium-webdriver")
const assert = require('assert');
var Slack = require('nodejslack');
var SLACK_TOKEN = "***";
var slack = new Slack(SLACK_TOKEN);
const loginEmail = process.env.LOGIN_EMAIL;
const loginPassword = process.env.LOGIN_PWD;
const slackUrl = "https://csc510workspace.slack.com";
const textbox_xpath = "/html/body/div[2]/div/div/div[4]/div/div/footer/div/div/div[1]/div/div[1]";
const channel_xpath = "/html/body/div[2]/div/div/div[3]/div/nav/div[2]/div[1]/div/div[1]/div/div/div[11]/a/span";
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

async function navigateToChannel(driver) {
    await driver.sleep(2000);
    await driver.findElement(By.xpath(channel_xpath)).click();
}

async function UseCaseSetStorageLimitWithParams(driver) {
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --setStorageSize 3.5", Key.RETURN);
    await driver.sleep(3000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("New Size Limit has been set to \"3.5\"", text);
                console.log('Usecase 2: "Set storage limit" expectedly passed.');
            } catch (e) {
                console.log('Usecase 2: "Set storage limit" unexpectedly failed when parameter given');
                return Promise.resolve('Usecase to set storage warning failed.');
            }
        })
    });
}

async function UseCaseSetGreaterStorageLimitWithParams(driver) {
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --setStorageSize 6", Key.RETURN);
    await driver.sleep(3000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Error. Size limit cannot be more than 5.0", text);
                console.log('Usecase 3: "Set greater storage limit" expectedly failed.');
            } catch (e) {
                console.log('Usecase 3: "Set greater storage limit" unexpectedly failed.');
                return Promise.resolve('Usecase to set storage warning failed.');
            }
        })
    });
}

async function UseCaseSetStorageLimitWithoutParams(driver) {
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --setStorageSize", Key.RETURN);
    await driver.sleep(2000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Not a number", text);
                console.log('Usecase 4: "Set storage limit" expectedly failed when wrong/no parameter given');
            } catch (e) {
                console.log('Usecase 4: "Set storage limit" unexpectedly failed when wrong/no parameter given');
                return Promise.resolve('Usecase to set storage warning failed.');
            }
        })
    });
}

async function UseCaseGetStorage(driver) {
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --getStorageSize", Key.RETURN);
    await driver.sleep(2000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Current size limit is \"3.5\"", text);
                console.log('Usecase 5: "Get storage limit" expectedly passed.');
            } catch (e) {
                console.log('Usecase 5: "Get storage limit" unexpectedly failed.');
                return Promise.resolve('Usecase to get storage limit failed.');
            }
        })
    });
}

async function UseCaseRegisterCategoryWithParams(driver) {

    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --registerCategory Project4", Key.RETURN);
    await driver.sleep(2000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Category has been added with name: \"Project4\"", text);
                console.log('Usecase 6.1: "Register category" expectedly passed.');
            } catch (e) {
                console.log('Usecase 6.1: "Register category" unexpectedly failed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });

}
async function UseCaseRegisterCategoryAlreadyExistingNameWithParams(driver) { 
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --registerCategory categoryName", Key.RETURN);
    await driver.sleep(2000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Error. Category name already exists.", text);
                console.log('Usecase 6.2: "Register category" expectedly failed when user tried to add same category again.');
            } catch (e) {
                console.log('Usecase 6.2: Unexpectedly failed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

async function UseCaseRegisterCategoryWithoutParams(driver) { 

    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --registerCategory", Key.RETURN);
    await driver.sleep(2000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Not a category", text);
                console.log('Usecase 7: Expectedly failed when wrong/no parameter given');
            } catch (e) {
                console.log('Usecase 7: Unexpectedly failed when wrong/no parameter given');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

async function UseCaseAddFilesToCategoryWithFilename(driver) { 

    // Add files to category with filename and category name
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --addCategory Project4 fileName.png", Key.RETURN);
    await driver.sleep(2000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("File has been added under the category 'Project4'.", text);
                console.log('Usecase 8: "Add files to category" expectedly passed when filename given');
            } catch (e) {
                console.log('Usecase 8: "Add files to category" unexpectedly failed.');
                return Promise.resolve('Usecase to add files to category failed.');
            }
        })
    });
    
}

async function UseCaseAddFilesToCategoryWithoutCategoryName(driver) { 
    // Add files to category without category name
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --addCategory fileName.png", Key.RETURN);
    await driver.sleep(2000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                text = text.split(" ")[0]
                assert.equal("Error.", text);
                console.log('Usecase 9: "Add files to category" expectedly failed when no category name given');
            } catch (e) {
                console.log('Usecase 9: "Add files to category" unexpectedly failed.');
                return Promise.resolve('Usecase to add files to category failed.');
            }
        })
    });
}

async function UseCaseAddFilesToCategoryWithoutFilename(driver) {

    // Add files to category without filename.
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --addCategory categoryName", Key.RETURN);
    await driver.sleep(2000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                text = text.split(" ")[0]
                assert.equal("Error.", text);
                console.log('Usecase 10: "Add files to category" expectedly failed when filename not given');
            } catch (e) {
                console.log('Usecase 10: "Add files to category" unexpectedly failed.');
                return Promise.resolve('Usecase to add files to category failed.');
            }
        })
    });
    
}

// Add files to category without filename and without category name
async function UseCaseAddFilesToCategoryWithoutCategoryNameWithoutFilename(driver) { 
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --addCategory", Key.RETURN);
    await driver.sleep(2000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                text = text.split(" ")[0]
                assert.equal("Error.", text);
                console.log('Usecase 11: "Add files to category" expectedly failed when no category or file name given');
            } catch (e) {
                console.log('Usecase 11: "Add files to category" unexpectedly failed.');
                return Promise.resolve('Usecase to add files to category failed.');
            }
        })
    });
}


(async () => {

    let driver = await new Builder().forBrowser("chrome").build();
    await login(driver, slackUrl);
    await navigateToChannel(driver);
    await UseCaseSetStorageLimitWithParams(driver);
    await UseCaseSetGreaterStorageLimitWithParams(driver);
    await UseCaseSetStorageLimitWithoutParams(driver);   // CHeck with Rashik --->
    await UseCaseGetStorage(driver);
    await UseCaseRegisterCategoryWithParams(driver);
    await UseCaseRegisterCategoryAlreadyExistingNameWithParams(driver); // Need to check with Rashik --->
    await UseCaseRegisterCategoryWithoutParams(driver); //Need to check with Rashik --->
    await UseCaseAddFilesToCategoryWithoutCategoryName(driver); //check with rashik
    await UseCaseAddFilesToCategoryWithFilename(driver); //check with rashik
    await UseCaseAddFilesToCategoryWithoutFilename(driver);
    await UseCaseAddFilesToCategoryWithoutCategoryNameWithoutFilename(driver); //check with rashik
    //await logout(driver, "https://csc510workspace.slack.com");
})()