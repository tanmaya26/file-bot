const {Builder, By, Key, util, wait} = require("selenium-webdriver")
var promise = require('selenium-webdriver').promise;
const assert = require('assert');
const fs = require('fs');
var Slack = require('nodejslack');

const textbox_xpath = "/html/body/div[2]/div/div/div[4]/div/div/footer/div/div/div[1]/div/div[1]";
const channel_xpath = "/html/body/div[2]/div/div/div[3]/div/nav/div[2]/div[1]/div/div[1]/div/div/div[11]/a/span";
const loginEmail = process.env.LOGIN_EMAIL;
const loginPassword = process.env.LOGIN_PWD;
const USER_SLACK_TOKEN = process.env.USER_SLACK_TOKEN
var slack = new Slack(USER_SLACK_TOKEN);
const slackUrl = "https://csc510workspace.slack.com"

async function login(driver, url) {
    await driver.get(url);
    await driver.findElement(By.name("email")).sendKeys(loginEmail);
    await driver.findElement(By.name("password")).sendKeys(loginPassword, Key.RETURN);
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
        file: fs.createReadStream("../test_files/mock.png"), 
        filename: 'mock.png', 
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
                console.log('Usecase 1: Expectedly passed to register watermark with images as png');
            } catch (e) {
                console.log('Usecase 1: Unexpectedly passed to register watermark');
                return Promise.resolve('Usecase to register watermark failed');
            }
        })
    });
}

async function UseCaseRegisterWaterMarkWhenJPGIsUploaded(driver, url) {
    var form = {
        file: fs.createReadStream("../test_files/mock.jpg"),
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

async function UseCaseRegisterWaterMarkWhenNoImageProvided(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --watermark register", Key.RETURN);
    await driver.sleep(4000);
    

    driver.findElements(By.className("c-message__body")).then(function(elements){
        elements[elements.length -1].getText().then(function (text){
            try {
                assert.equal("No file associated with command. Upload a PNG file with command to create watermark.",text);
                console.log('Usecase 3: Expectedly failed registering watermark with no file uploaded');
            } catch (e) {
                console.log('Usecase 3: Unxpectedly passed registering watermark with no file uploaded');
                return Promise.resolve('Usecase to register watermark without image');
            }
        })
    });
}

// Add watermark to file
async function UseCaseWatermarkFileGood(driver) {
    var form = {
        file: fs.createReadStream("../test_files/sample.pdf"),
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
                console.log('Usecase 4: Expectedly passed file got watermarked');
            } catch (e) {
                console.log('Usecase 4: Unexpectedly failed to watermarked');
                return Promise.resolve('Usecase to register watermark failed');
            }
        })
    });
}

async function UseCaseWaterMarkWhenFileIsNotPDFProvided(driver) {
    var form = {
        file: fs.createReadStream("../test_files/report.txt"),
        filename: 'report.txt', 
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
                assert.equal("Wrong format. All files must be of PDF format",text);
                console.log('Usecase 5: Expectedly failed matermarking a file other than a PDF');
            } catch (e) {
                console.log('Usecase 5: Unexpectedly passed matermarking a file other than a PDF');
                return Promise.resolve('Usecase to register watermark failed');
            }
        })
    });
}

async function UseCaseWaterMarkWhenNoImageProvided(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --watermark wm1", Key.RETURN);
    await driver.sleep(4000);
    

    driver.findElements(By.className("c-message__body")).then(function(elements){
        elements[elements.length -1].getText().then(function (text){
            try {
                assert.equal("No file associated with command. Upload a PDF file with command watermark the file.",text);
                console.log('Usecase 6: Expectedly failed watermarking when no file is uploaded');
            } catch (e) {
                console.log('Usecase 6: UnExpectedly failed watermarking when no file is uploaded');
                return Promise.resolve('Usecase to register watermark without image');
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
                console.log('Usecase 7: Expectedly passed listing watermarks');
            } catch (e) {
                console.log('Usecase 7: Unexpectedly failed listing watermarks');
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
                console.log('Usecase 8: "Set storage limit" expectedly passed.');
            } catch (e) {
                console.log('Usecase 8: "Set storage limit" unexpectedly failed when parameter given');
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
                console.log('Usecase 9: "Set greater storage limit" expectedly failed.');
            } catch (e) {
                console.log('Usecase 9: "Set greater storage limit" unexpectedly failed.');
                return Promise.resolve('Usecase to set storage warning failed.');
            }
        })
    });
}

async function UseCaseSetStorageLimitWithoutParams(driver) {
    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --setStorageSize five", Key.RETURN);
    await driver.sleep(4000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Not a number", text);
                console.log('Usecase 10: "Set storage limit" expectedly failed when wrong/no parameter given');
            } catch (e) {
                console.log('Usecase 10: "Set storage limit" unexpectedly failed when wrong/no parameter given');
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
                assert.equal("Current size limit is 3.5", text);
                console.log('Usecase 11: "Get storage limit" expectedly passed.');
            } catch (e) {
                console.log('Usecase 11: "Get storage limit" unexpectedly failed.');
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
                console.log('Usecase 13: "Register category" expectedly passed.');
            } catch (e) {
                console.log('Usecase 13: "Register category" unexpectedly failed.');
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
                console.log('Usecase 12: "Register category" expectedly failed when user tried to add same category again.');
            } catch (e) {
                console.log('Usecase 12: Unexpectedly failed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}

// Add file to a category
async function UseCaseAddFilesToCategoryWithFilename(driver) { 

    await driver.findElement(By.xpath(textbox_xpath)).sendKeys("@fileninja --addCategory Project1 fileName.png", Key.RETURN);
    await driver.sleep(4000);

    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("File 'fileName.png' has been added under the category 'Project1'.", text);
                console.log('Usecase 14: "Add files to category" expectedly passed when filename given');
            } catch (e) {
                console.log('Usecase 14: "Add files to category" unexpectedly failed.');
                return Promise.resolve('Usecase to add files to category failed.');
            }
        })
    });
    
}

// Export to external storage
async function UseCaseExportCategoryToExternalStorageGood(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --exportCategory Project1 googleDrive", Key.RETURN);
    await driver.sleep(4000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Files of category 'Project1' have been moved to external storage.", text);
                console.log('Usecase 15: "Uploading category to external storage" expectedly passed.');
            } catch (e) {
                console.log('Usecase 15: "Uploading category to external storage" unexpectedly failed.');
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
                assert.equal("Error. Category name: Sample does not exists.", text);
                console.log('Usecase 16: "Uploading non existing file to external storage" expectedly failed.');
            } catch (e) {
                console.log('Usecase 16: "Uploading non existing file to external storage" unexpectedly passed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}


// Delete file/category
async function UseCaseDeleteCategory(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --deleteCategory Project1", Key.RETURN);
    await driver.sleep(4000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Files of category 'Project1' have been deleted.", text);
                console.log('Usecase 17: "Deleting file from a category" expectedly passed.');
            } catch (e) {
                console.log('Usecase 17: "Deleting file from a category" unexpectedly failed.');
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
                assert.equal("Error. Category name: Sample1 does not exists.", text);
                console.log('Usecase 18: "Uploading non existing file to external storage" expectedly failed.');
            } catch (e) {
                console.log('Usecase 18: "Uploading non existing file to external storage" unexpectedly passed.');
                return Promise.resolve('Usecase to register category failed.');
            }
        })
    });
}
async function UseCaseShowFilesOfCategory(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --showFiles Project1", Key.RETURN);
    await driver.sleep(4000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Files under the category 'Project1' are  project1.pdf, sample.pdf,", text);
                console.log('Usecase 19: "Showing all files of a category" expectedly passed.');
            } catch (e) {
                console.log('Usecase 19: "Showing all files of a category" unexpectedly passed.');
                return Promise.resolve('Usecase to show file failed');
            }
        })
    });
}

async function UseCaseShowFilesOfNonExistingCategory(driver) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --showFiles Project3", Key.RETURN);
    await driver.sleep(4000);
    driver.findElements(By.className("c-message__body")).then(function (elements) {
        elements[elements.length - 1].getText().then(function (text) {
            try {
                assert.equal("Error. Category name: Project3 does not exists.", text);
                console.log('Usecase 20: "Showing all files of a category" expectedly failed.');
            } catch (e) {
                console.log('Usecase 20: "Showing all files of a category" unexpectedly passed.');
                return Promise.resolve('Usecase to show file passed');
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
    await UseCaseRegisterWaterMarkWhenNoImageProvided(driver);

    //Watermark files
    await UseCaseWatermarkFileGood(driver);
    await UseCaseWaterMarkWhenFileIsNotPDFProvided(driver);
    await UseCaseWaterMarkWhenNoImageProvided(driver);
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

    //Show category files
    await UseCaseShowFilesOfCategory(driver);
    await UseCaseShowFilesOfNonExistingCategory(driver);

    await driver.sleep(1000)
    await driver.quit()

    })()
