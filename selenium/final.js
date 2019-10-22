const {Builder, By, Key, util, wait} = require("selenium-webdriver")
var promise = require('selenium-webdriver').promise;
const assert = require('assert');
const fs = require('fs');

var Slack = require('nodejslack');

// Creating instance to connect to Slack. check: https://github.com/marcogbarcellos/nodejslack
var SLACK_TOKEN="xoxp-775571702198-775572561206-760713155138-2e4cc51950599d51687e88f600e8d116"
// process.env.SLACK_TOKEN
var slack = new Slack(SLACK_TOKEN);
const textbox_xpath = "/html/body/div[2]/div/div/div[4]/div/div/footer/div/div/div[1]/div/div[1]";
const channel_xpath = "/html/body/div[2]/div/div/div[3]/div/nav/div[2]/div[1]/div/div[1]/div/div/div[11]/a/span";


// const slack_bot_service = require('../src/service/slack_bot_service');
// const slack = slack_bot_service.slack;


const loginEmail = process.env.LOGIN_EMAIL;
const loginPassword = process.env.LOGIN_PWD;
const USER_SLACK_TOKEN = process.env.USER_SLACK_TOKEN
const slackUrl = "https://csc510workspace.slack.com"

async function login(driver, url) {
    await driver.get(url);
    await driver.findElement(By.name("email")).sendKeys(loginEmail);
    await driver.findElement(By.name("password")).sendKeys(loginPassword, Key.RETURN);
    // await driver.sleep(4000);
}

async function logout(driver, url) {
    await driver.findElement(By.className("c-icon p-classic_nav__team_header__team__icon c-icon--chevron-down")).click();
    await driver.findElement(By.xpath("/html/body/div[6]/div/div/div/div/div/div/div[13]/button/div")).click();
}

async function switchChannel(driver) {
    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[3]/div/nav/div[2]/div[1]/div/div[1]/div/div/div[6]/a/span")).click();
}

async function navigateToChannel(driver) {
    await driver.sleep(4000);
    await driver.findElement(By.xpath(channel_xpath)).click();
}

// Register Watermark Usecases

async function UseCaseRegisterWaterMarkGood(driver) { 
    var form = {
        file: fs.createReadStream("./mock.png"), 
        filename: 'mock.png', //has to be replaced by tiger png from ayush name abc.png
        text: "<@UNTLFGFB8> --watermark register wm1",
        initial_comment: '<@UNTLFGFB8> --watermark register wm1',
        channels: 'bottesting'
    };
    
      await slack.fileUpload(form)
      .then(function(response){

          if(!response || !response.ok){
              return Promise.reject(new Error('Something wrong happened during the upload.'));
          }
          return Promise.resolve(response);
      })
      .catch(function(err){
          console.log('Failed on Uploading:',err);
        });
    
      await driver.sleep(4000);
    
      driver.findElements(By.className("c-message__body")).then(function(elements){
        elements[elements.length -1].getText().then(function (text){
            try {
                assert.equal("Watermark created successfully.",text);
                console.log('Usecase 1: Expecteddly passed to register watermark with images as png');
            } catch (e) {
                console.log('Usecase 1: Unexpectedly passed to register watermark');
                return Promise.resolve('Usecase to register watermark failed');
            }
        })
    });
}

async function UseCaseRegisterWaterMarkWhenJPGIsUploaded(driver, url) {
    var form = {
        file: fs.createReadStream("./mock.jpg"),  // same tiger png saved as jpg name it abc.jpg
        filename: 'mock.jpg',
        text: "<@UNTLFGFB8> --watermark register wm1",
        initial_comment: '<@UNTLFGFB8> --watermark register wm1',
        channels: 'bottesting'
    };
    
      await slack.fileUpload(form)
      .then(function(response){

          if(!response || !response.ok){
              return Promise.reject(new Error('Something wrong happened during the upload.'));
          }
          return Promise.resolve(response);
      })
      .catch(function(err){
          console.log('Failed on Uploading:',err);
        });
    
      await driver.sleep(4000);
    
      driver.findElements(By.className("c-message__body")).then(function(elements){
        elements[elements.length -1].getText().then(function (text){
            try {
                assert.equal("Wrong format for file . Watermark only accepts .png files",text);
                console.log('Usecase 2: Expectedly failed when JPG format image uploaded');
            } catch (e) {
                console.log('Usecase 2: Unexpectedly passed when JPG format image uploaded');
                return Promise.resolve('Usecase to register watermark failed');
            }
        })
    });
}

// Add watermark to file
async function UseCaseWatermarkFileGood(driver) {
    var form = {
        file: fs.createReadStream("./sample.pdf"),
        filename: 'sample.pdf', 
        text: "<@UNTLFGFB8> --watermark wm1",
        initial_comment: '<@UNTLFGFB8> --watermark wm1',
        channels: 'bottesting'
      };

    await slack.fileUpload(form)
      .then(function(response){

      if(!response || !response.ok){
              return Promise.reject(new Error('Something wrong happened during the upload.'));
          }
          return Promise.resolve(response);
      })
      .catch(function(err){
          console.log('Failed on Uploading:',err);
      });

      await driver.sleep(6000);
    
      driver.findElements(By.className("c-message__body")).then(function(elements){
        elements[elements.length -1].getText().then(function (text){
            try {
                assert.equal("File watermarked successfully",text);
                console.log('Usecase 3: Expectedly passed file got watermarked');
            } catch (e) {
                console.log('Usecase 3: Unexpectedly failed to watermarked');
                return Promise.resolve('Usecase to register watermark failed');
            }
        })
    });
}

async function UseCaseUploadFileWithWrongCategoryName(driver) {
    var form = {
        file: fs.createReadStream("./sample.pdf"),
        filename: 'sample.pdf', 
        text: "<@UNTLFGFB8> --watermark sampleWatermark", //
        initial_comment: '<@UNTLFGFB8> --watermark sampleWatermark',
        channels: 'bottesting'
      };

    await slack.fileUpload(form)
      .then(function(response){

      if(!response || !response.ok){
              return Promise.reject(new Error('Something wrong happened during the upload.'));
          }
          return Promise.resolve(response);
      })
      .catch(function(err){
          console.log('Failed on Uploading:',err);
      });

      await driver.sleep(4000);
    
      driver.findElements(By.className("c-message__body")).then(function(elements){
        elements[elements.length -1].getText().then(function (text){
            try {
                text = text.split(" ",4).join(" ")
                assert.equal("Could not find watermark",text);
                console.log('Usecase 4: Expectedly failed file watermarking');
            } catch (e) {
                console.log('Usecase 4: Unexpectedly passed watermarked');
                return Promise.resolve('Usecase to watermark failed');
            }
        })
    });
}

// List all watermarks
async function UseCaseListWaterMarks(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --watermark list", Key.RETURN);
    await driver.sleep(4000);
    

    driver.findElements(By.className("c-message__body")).then(function(elements){
        elements[elements.length -1].getText().then(function (text){
            try {
                assert.equal("Watermarks for this channel are: wm1,wm2,wm3",text);
                console.log('Usecase 5: Expectedly passed listing watermarks');
            } catch (e) {
                console.log('Usecase 5: Unexpectedly failed listing watermarks');
                return Promise.resolve('Usecase to list watermark failed');
            }
        })
    });
}

//Storage Size
async function UseCaseSetStorageLimitWithParams(driver) {
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --setStorageSize 3.5", Key.RETURN);
    await driver.sleep(3000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("New Size Limit has been set to \"3.5\"", text);
                console.log('Usecase 6: "Set storage limit" expectedly passed.');
            } catch (e) {
                console.log('Usecase 6: "Set storage limit" unexpectedly failed when parameter given');
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
                console.log('Usecase 7: "Set greater storage limit" expectedly failed.');
            } catch (e) {
                console.log('Usecase 7: "Set greater storage limit" unexpectedly failed.');
                return Promise.resolve('Usecase to set storage warning failed.');
            }
        })
    });
}

async function UseCaseSetStorageLimitWithoutParams(driver) {
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --setStorageSize yu", Key.RETURN);
    await driver.sleep(4000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Not a number", text);
                console.log('Usecase 8: "Set storage limit" expectedly failed when wrong/no parameter given');
            } catch (e) {
                console.log('Usecase 8: "Set storage limit" unexpectedly failed when wrong/no parameter given');
                return Promise.resolve('Usecase to set storage warning failed.');
            }
        })
    });
}


async function UseCaseGetStorage(driver) {
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --getStorageSize", Key.RETURN);
    await driver.sleep(4000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Current size limit is \"3.5\"", text);
                console.log('Usecase 9: "Get storage limit" expectedly passed.');
            } catch (e) {
                console.log('Usecase 9: "Get storage limit" unexpectedly failed.');
                return Promise.resolve('Usecase to get storage limit failed.');
            }
        })
    });
}

//Register Category
async function UseCaseRegisterCategoryWithParams(driver) {

    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --registerCategory Project4", Key.RETURN);
    await driver.sleep(4000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Category has been added with name: \"Project4\"", text);
                console.log('Usecase 10: "Register category" expectedly passed.');
            } catch (e) {
                console.log('Usecase 10: "Register category" unexpectedly failed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

async function UseCaseRegisterCategoryAlreadyExistingNameWithParams(driver) { 
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --registerCategory Project1", Key.RETURN);
    await driver.sleep(4000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Error. Category name already exists.", text);
                console.log('Usecase 11: "Register category" expectedly failed when user tried to add same category again.');
            } catch (e) {
                console.log('Usecase 11: Unexpectedly failed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

// Add file to a category
async function UseCaseAddFilesToCategoryWithFilename(driver) { 

    // Add files to category with filename and category name
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --addCategory Project1 fileName.png", Key.RETURN);
    await driver.sleep(4000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("File 'fileName.png' has been added under the category 'Project1'.", text);
                console.log('Usecase 12: "Add files to category" expectedly passed when filename given');
            } catch (e) {
                console.log('Usecase 12: "Add files to category" unexpectedly failed.');
                return Promise.resolve('Usecase to add files to category failed.');
            }
        })
    });
    
}

async function UseCaseAddNonExistingFilesToCategoryWithFilename(driver) { 

    // Add files to category with filename and category name
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --addCategory Project1 blank.pdf", Key.RETURN);
    await driver.sleep(4000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                text = text.split(" ")[0]
                assert.equal("File 'fileName.png' has been added under the category 'Project1'.", text);
                console.log('Usecase 13: "Add files to category" expectedly passed when filename given');
            } catch (e) {
                console.log('Usecase 13: "Add files to category" unexpectedly failed.');
                return Promise.resolve('Usecase to add files to category failed.');
            }
        })
    });
    
}

// Export to external storage
async function UseCaseExportFileToExternalStorageGood(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --exportFile project1.pdf googleDrive", Key.RETURN);
    await driver.sleep(4000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                console.log(text);
                assert.equal("File 'project1.pdf' has been moved to external storage.", text);
                console.log('Usecase 14: "Uploading single file to external storage" expectedly passed.');
            } catch (e) {
                console.log('Usecase 14: "Uploading single file to external storage" unexpectedly failed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

async function UseCaseExportNonExistingFileToExternalStorage(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --exportFile abc.pdf googleDrive", Key.RETURN);
    await driver.sleep(4000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                console.log(text);
                assert.equal("Error. File name: abc.pdf does not exists.", text);
                console.log('Usecase 15: "Uploading non existing file to external storage" expectedly failed.');
            } catch (e) {
                console.log('Usecase 15: "Uploading non existing file to external storage" unexpectedly passed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

async function UseCaseExportCategoryToExternalStorageGood(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --exportCategory Project1 googleDrive", Key.RETURN);
    await driver.sleep(4000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                console.log(text);
                assert.equal("Files of category 'Project1' have been moved to external storage.", text);
                console.log('Usecase 16: "Uploading category to external storage" expectedly passed.');
            } catch (e) {
                console.log('Usecase 16: "Uploading category to external storage" unexpectedly failed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

async function UseCaseExportNonExistingCategoryToExternalStorage(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --exportCategory Sample googleDrive", Key.RETURN);
    await driver.sleep(4000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                console.log(text);
                assert.equal("Error. Category name: Sample does not exists.", text);
                console.log('Usecase 17: "Uploading non existing file to external storage" expectedly failed.');
            } catch (e) {
                console.log('Usecase 17: "Uploading non existing file to external storage" unexpectedly passed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}


// Delete file/category
async function UseCaseDeleteFile(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --deleteFile project1.pdf", Key.RETURN);
    await driver.sleep(4000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                console.log(text);
                assert.equal("File 'project1.pdf' has been deleted.", text);
                console.log('Usecase 14: "Deleting file from a category" expectedly passed.');
            } catch (e) {
                console.log('Usecase 14: "Deleting file from a category" unexpectedly failed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

async function UseCaseDeleteNonExistingFile(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --deleteFile sample1.pdf", Key.RETURN);
    await driver.sleep(4000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                console.log(text);
                assert.equal("Error. File name: sample1.pdf does not exists.", text);
                console.log('Usecase 15: "Uploading non existing file to external storage" expectedly failed.');
            } catch (e) {
                console.log('Usecase 15: "Uploading non existing file to external storage" unexpectedly passed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

async function UseCaseDeleteCategory(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --deleteCategory Project1", Key.RETURN);
    await driver.sleep(4000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Files of category 'Project1' have been deleted.", text);
                console.log('Usecase 14: "Deleting file from a category" expectedly passed.');
            } catch (e) {
                console.log('Usecase 14: "Deleting file from a category" unexpectedly failed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

async function UseCaseDeleteNonExistingCategory(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --deleteCategory Sample1", Key.RETURN);
    await driver.sleep(4000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                console.log(text);
                assert.equal("Error. Category name: Sample1 does not exists.", text);
                console.log('Usecase 15: "Uploading non existing file to external storage" expectedly failed.');
            } catch (e) {
                console.log('Usecase 15: "Uploading non existing file to external storage" unexpectedly passed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}


(async () => {

    let driver = await new Builder().forBrowser("chrome").build();
    await console.log("Test Results:")
    await login(driver, slackUrl);
    await switchChannel(driver);
    
    // Register Watermark
    await UseCaseRegisterWaterMarkGood(driver);
    await UseCaseRegisterWaterMarkWhenJPGIsUploaded(driver);
    
    //Watermark files
    await UseCaseWatermarkFileGood(driver);
    await driver.sleep(3000);

    //List Watermark
    await UseCaseListWaterMarks(driver);

    //Storage Size
    await UseCaseSetStorageLimitWithParams(driver);
    await UseCaseSetGreaterStorageLimitWithParams(driver);
    await UseCaseSetStorageLimitWithoutParams(driver);  
    await UseCaseGetStorage(driver);

    //Register Category
    await UseCaseRegisterCategoryAlreadyExistingNameWithParams(driver);
    await driver.sleep(3000);
    await UseCaseRegisterCategoryWithParams(driver);

    //Add files to category
    await UseCaseAddFilesToCategoryWithFilename(driver);
    

    //Export File/Category
    await UseCaseExportCategoryToExternalStorageGood(driver);
    await UseCaseExportNonExistingCategoryToExternalStorage(driver);
    await driver.sleep(3000);
    //Delete file/category
    await UseCaseDeleteCategory(driver);
    await UseCaseDeleteNonExistingCategory(driver);
    })()
