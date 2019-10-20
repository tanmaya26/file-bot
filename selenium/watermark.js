const {Builder, By, Key, util, wait} = require("selenium-webdriver")
var promise = require('selenium-webdriver').promise;
const assert = require('assert');
const fs = require('fs');

var Slack = require('nodejslack');

const slack_bot_service = require('../src/service/slack_bot_service');
const slack = slack_bot_service.slack;


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

async function UseCaseRegisterWaterMarkGood(driver, url) {
    // await driver.findElement(By.className("c-icon p-message_input_file_icon c-icon--paperclip")).click();
    
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

async function switchChannel(driver) {
    await driver.findElement(By.xpath("/html/body/div[2]/div/div/div[3]/div/nav/div[2]/div[1]/div/div[1]/div/div/div[11]/a/span")).click();
}

// Add watermark to file
async function UseCaseWatermarkFileGood(driver) {
    var form = {
        file: fs.createReadStream("./sample.pdf"), // Optional, via multipart/form-data. If omitting this parameter, you MUST submit content
        // content: 'Your text here', // Optional, File contents. If omitting this parameter, you must provide a `file` 
        filename: 'sample.pdf', // Required 
        // fileType: 'post', // Optional, See more file types in https://api.slack.com/types/file#file_types
        // title: 'Title of your file!', // Optional
        text: "--watermark WM2",
        initial_comment: '--watermark WM2', // Optional
        channels: 'watermarktesting' //Optional, If you want to put more than one channel, separate using comma, example: 'general,random'
      };

    await slack.fileUpload(form)
      .then(function(response){

          if(!response || !response.ok){
              return Promise.reject(new Error('Something wrong happened during the upload.'));
          }
        //   console.log('Uploaded Successfully:',response);

          return Promise.resolve(response);
      })
      .catch(function(err){
          console.log('Failed on Uploading:',err);

        //   return Promise.reject(err);
      });
}

async function UseCaseUploadFileWithWrongCategoryName(driver) {
    var form = {
        file: fs.createReadStream("./sample.pdf"), // Optional, via multipart/form-data. If omitting this parameter, you MUST submit content
        // content: 'Your text here', // Optional, File contents. If omitting this parameter, you must provide a `file` 
        filename: 'sample.pdf', // Required 
        // fileType: 'post', // Optional, See more file types in https://api.slack.com/types/file#file_types
        // title: 'Title of your file!', // Optional
        text: "--watermark WM3",
        initial_comment: '--watermark WM3', // Optional
        channels: 'watermarktesting' //Optional, If you want to put more than one channel, separate using comma, example: 'general,random'
      };

    await slack.fileUpload(form)
      .then(function(response){

          if(!response || !response.ok){
              return Promise.reject(new Error('Something wrong happened during the upload.'));
          }
        //   console.log('Uploaded Successfully:',response);

          return Promise.resolve(response);
      })
      .catch(function(err){
          console.log('Failed on Uploading:',err);

        //   return Promise.reject(err);
      });
}

// List all watermarks
async function UseCaseListWaterMarks(driver, url) {
    await driver.findElement(By.className("ql-editor ql-blank")).sendKeys("@fileninja --watermark --list", Key.RETURN);
    await driver.sleep(2000);
}
(async () => {

let driver = await new Builder().forBrowser("chrome").build();
await login(driver, slackUrl);
await switchChannel(driver);
await UseCaseWatermarkFileGood(driver)
})()