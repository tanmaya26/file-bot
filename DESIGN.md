# Design

## Problem Statement:
This project solves the problem of file processing on slack. First, in a company if there is a slack channel, everyone on the team is added to that slack channel even though a lot of people are working on different projects. So if someone wants to add a file to that slack channel and tag that file for his/her project, slack doesn't give them that flexibility. Slack only allows 5GB storage space in the workspace and because of this users can't see files which has been archived by slack as thry reached their storage quota. Our bot will alert the users about this quota consumption.  
Second, people on slack want to add a watermark of there team or company on there official documents before sending the document to someone else. Slack doesn't give them to do this on the go and a user has to download a file and then add watermark to the document either using photoshop or a 3rd party softwares which are usually not free. 
Third, a lot of times user want to add comments/memo to PDF's on a specific page or a general memo for the the whole PDF. So user will have to download the PDF and make changes to it and then upload the document and can't do this dirctly on Slack.  


## Bot Description:
**Tagline** - **FileNinja**, one stop bot for File Processing.

We propose a bot which can chat in english with the user and understand the user’s need. The bot can act upon the input and automate the process of handling files and processing them, saving both time and removing human errors. Slack is a fast growing platform for team collaboration leading to sharing of files amongst them. File upload is an important functionality on Slack and it also gives us the functionality to build a bot to tag/delete files and modify files on the go. We take advantage of these abilities to make the bot understand what the user wants. The Bot responds to user's instructions, maintains a memory and knows the user, it can be categorised under 'Responders'.

### Bot’s Functionality:
- Watermarking: Bot can help to watermark documents.
- Adding Memo: Bot can help to add memos to specific page/corner of PDF documents.
- Tagging Files: Bot can help to add tags to files, making it easy for users to search for files related to specific project. This functionality also gives them flexibility to delete files related to a specific project once it's deprecated.


## Use Cases:
**USE CASE: Register Watermark**
1. Preconditions  
FileNinja is installed on slack.  
User is logged into slack and can chat with the bot.  
2. Main Flow  
User will upload an image[S1] and then tell the bot to keep this image as a watermark[S2] and will provide the name of the watermark[S2]. Bot saves the file in s3 and metadata in DynamoDB[S3].  
3. Sub Flows  
[S1] User uploads image  
[S2] User will give name to the watermark and ask the bot to save it with @fileNinja --watermark SE-Project file1.png(format is: @botName --watermark watermarkName fileName).    
[S3] Bot will save the file on S3 and makes an entry in database with name, file path and channel.  
4. Alternative Flows  
[E1] File is not in PNG or JPEG format then bot displays an appropriate message.  


**USE CASE: Add Watermark to PDF**
1. Preconditions  
User is logged into slack. FileNinja is installed on slack. User can chat with the bot.  
2. Main Flow  
User will upload the PDF[S1] and then request the bot to add watermark to the PDF with the name of the watermark to be added to the PDF [S2]. Bot will add watermark to the file and return a new file to slack with watermark added [S3].  
3. Sub Flows   
[S1] User uploads PDF.   
[S2] User will give name of the watermark to be added to the PDF as @fileNinja --addWatermark SE-Project se-reprt.pdf (format is: @botName --addWatermark watermarkName fileName).   
[S3] Bot will add watermark to the PDF, upload the watermarked PDF.    
4. Alternative Flows   
[E1] Watermark name or file name does not exist or is not in this channel then bot displays an appropriate message.  
[E2] File is not a PDF then bot displays an appropriate message.  

**USE CASE: Get all watermarks**
1. Preconditions  
FileNinja is installed on slack.  
User is logged into slack and can chat with the bot.  
2. Main Flow  
User will ask the bot to show the list of all watermarks added[S1] and bot then show the watermark list to the user [S2].  
3. Sub Flows  
[S1] User asks bot to list all watermarks with command @fileNinja --listWatermarks.   
[S2] Bot will query through DynamoDB and get all the watermarks for the specific channel user asked in and show them to the user.  
4. Alternative Flows  
[E1] If no watermark exists then bot displays an appropriate message.  


**USE CASE: Add Memo to PDF**
1. Preconditions  
User is logged into slack. FileNinja is installed on slack. User can chat with the bot.  
2. Main Flow  
User will upload the PDF[S1]. Then user requests the bot to add memo to the PDF on specific page and corner[S2]. Bot will process the user’s request and return the PDF with added memo [S3].  
3. Sub Flows  
[S1] User uploads PDF.   
[S2] User will instruct bot to add the memo to the PDF as @fileNinja --addMemo “hi, this is a memo message” 2 footer se-reprt.pdf (format is: @botName --addMemo memoMessage pageNumber memoLocation filename).    
[S3] Bot will add memo to the PDF and return it to slack.    
4. Alternative Flows    
[E1] File name does not exist or is not in this channel then bot displays an appropriate message.  
[E2] File is not a PDF then bot displays an appropriate message.  

**USE CASE: Set storage warning sign**
1. Preconditions  
FileNinja is installed on slack.  
User is logged into slack and can chat with the bot.  
2. Main Flow  
User will tell the bot the maximum file storage for the workspace [S1], after which the bot should alert user for clean-up[S2] (maximum storage allowed by slack is 5GB). 
3. Sub Flows  
[S1] User will ask the bot to save the file storage limit as @fileNinja --setStorageSize 3 (format is: @botName --setStorageSize sizeInGB).  
[S2] Bot will save the storage requirement in database.  
4. Alternative Flows  
[E1] Storage size given is more than 5GB then bot displays an appropriate message.  
[E2] If user doesn’t give any storage limit and uploads file, bot asks the user to either set it himself or the bot sets it to 3GB by default.  

**USE CASE: Register Project in catalog**
1. Preconditions  
FileNinja is installed on slack.  
User is logged into slack and can chat with the bot.  
2. Main Flow  
User will ask the bot to save the corresponding project name in catalog [S1]. Bot saves the name in DynamoDB[S2].  
3. Sub Flows  
[S1] User will give name to the project to be saved in catalog and asks the bot to save it with @fileNinja --registerProject Project1 (format is: @botName --registerProject projectName).  
[S2] Bot makes an entry in database with corresponding meta data.  
4. Alternative Flows  
[E1] If project name already exists in catalog, then bot displays an appropriate message.  

**USE CASE: Give file a project tag**
1. Preconditions  
User is logged into slack. FileNinja is installed on slack. User can chat with the bot.  
2. Main Flow  
User will upload the PDF[S1] and then request the bot to give the PDF a tag from the catalog [S2]. Bot will save the file under the following tag and make an entry in database [S2].  
3. Sub Flows  
[S1] User uploads PDF.   
[S2] User will give name of the Catalog the file should be added in as @fileNinja --addCatalog homework se-reprt.pdf (format is: @botName --addCatalog catalogName filename).  
[S3] Bot will add watermark to the PDF and return it to slack.  
4. Alternative Flows  
[E1] Tag name or file name does not exist or is not in this channel then bot displays an appropriate message.  

**USE CASE: Show all files in a specific project**
1. Preconditions  
User is logged into slack. FileNinja is installed on slack. User can chat with the bot.  
2. Main Flow  
User will ask the bot to show all files under a specific tag/ project [S1]. Bot displays all corresponding files to the user [S2].  
3. Sub Flows  
[S1] User asks bot to list all files under a project with command @fileNinja --showFiles Project1 (format is: @botName --showFiles projectName).  
[S2] Bot will get all the file names from the database and their paths and then show them to user.   
4. Alternative Flows   
[E1] Tag name does not exist then bot displays an appropriate message.  


**USE CASE: Delete files under a specific tag**
1. Preconditions  
FileNinja is installed on slack.  
User is logged into slack and can chat with the bot.  
2. Main Flow  
User will ask the bot to delete a single file or all files under a specific project [S1]. Bot will confirm once again and then deletes the files [S2].  
3. Sub Flows  
[S1] User asks bot to delete files under a specific project with command @fileNinja --deleteProject Project1 se-report.pdf (format is: @botName --deleteProject projectName fileName) or @fileNinja --deleteProject Project1 (format is: @botName --deleteProject projectName) to delete all files in a project.  
[S2] Bot will confirm from user if he wants to delete the files or not, and if user says yes, bot will delete those files.  
4. Alternative Flows  
[E1] Catalog name or file name does not exist or is not in this channel then bot displays an appropriate message.  

## StoryBoard


