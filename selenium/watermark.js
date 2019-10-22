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


// Register Watermark Usecases

async function UseCaseRegisterWaterMarkGood(driver) { 
    var form = {
        file: fs.createReadStream("./mock.png"), 
        filename: 'mock.png', //has to be replaced by tiger png from ayush name abc.png
        text: "--watermark register wm1",
        initial_comment: '--watermark register wm1',
        channels: 'watermarktesting'
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
    
      await driver.sleep(2000);
    
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
        text: "--watermark register wm1",
        initial_comment: '--watermark register wm1',
        channels: 'watermarktesting'
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
    
      await driver.sleep(2000);
    
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



async function switchChannel(driver) {
    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[3]/div/nav/div[2]/div[1]/div/div[1]/div/div/div[11]/a/span")).click();
}

// Add watermark to file
async function UseCaseWatermarkFileGood(driver) {
    var form = {
        file: fs.createReadStream("./sample.pdf"),
        filename: 'sample.pdf', 
        text: "--watermark wm1",
        initial_comment: '--watermark wm1',
        channels: 'watermarktesting'
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

      await driver.sleep(2000);
    
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
        text: "--watermark sampleWatermark", //
        initial_comment: '--watermark sampleWatermark',
        channels: 'watermarktesting'
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

      await driver.sleep(2000);
    
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
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("--watermark list", Key.RETURN);
    await driver.sleep(2000);
    

    driver.findElements(By.className("c-message__body")).then(function(elements){
        elements[elements.length -1].getText().then(function (text){
            try {
                assert.equal("Watermarks for this channel are: wm1,wm2,wm3",text);
                console.log('Usecase 4: Expectedly passed listing watermarks');
            } catch (e) {
                console.log('Usecase 4: Unexpectedly failed listing watermarks');
                return Promise.resolve('Usecase to list watermark failed');
            }
        })
    });



}

(async () => {

let driver = await new Builder().forBrowser("chrome").build();
await console.log("Test Results:")
await login(driver, slackUrl);
await switchChannel(driver);

// // Register
await UseCaseRegisterWaterMarkGood(driver);
await UseCaseRegisterWaterMarkWhenJPGIsUploaded(driver);

// Watermark files
await UseCaseWatermarkFileGood(driver);
await UseCaseUploadFileWithWrongCategoryName(driver);

//List Watermark
await UseCaseListWaterMarks(driver);

})()