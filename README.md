# CSC510-7

## Project 
FileBot
## Team Members 
1. Tanmaya Nanda (tnanda)
2. Rashik Bhasin (rbhasin)
3. Ketul Patani (kpatani)
4. Ayush Arnav (aarnav)

### Problem Statement
1. File upload is an important functionality on Slack. SlackBot solves a lot of problems like 
searching channels within workspace, search messages and members but when it comes to file sharing within a conversation thread, we would like to have a 
Bot that does basic tasks with our files and even more. Some of the manual, tedious yet important files tasks will be handled by our Bot to give members
a good 'Slack' experience.
2. No doubt Slack does a really good job in uploading the files and saving them in a 'shared' folder. However, our Bot will give members 
an opportunity to access the files through a shared link. Temporary link generation helps to speed up the process of manually uploading a file, providing ease
of access  
and the link comes with a validity period. 
3. Slack does not give heed to the type of file that is uploaded and treats every file the same. Our bot can recognise file types and use 
them to the advantage of members.
3. Handling tasks like adding/deleting files asynchronously and renaming files without going to the storage facility reduces human effort and time.
4. Often people upload images of note and slack channels, our bot will be able to read through the images and convert them to pdf for 
better readability.

### Bot Description

1. User will tell the Bot as a text input, what task it wants to perform from one of these options:
    - Upload files to either permanent storage or temporary storage with specific validity.
    - Zip/Unzip file or folder
    - Convert image text to pdf and vice versa.
    - Rename specific file/folder.
    - Delete file/folder.
    - Add watermark to image/pdf.
2. Then our bot will perform the specific task in asynchronously manner and then ask for further instructions.
3. While uploading a file, if the user does not specify any instruction as text, The Bot will study the file type and suggest related options or tasks
to user. For example, if a zip file is uploaded, Bot will ask the user to unzip it. 
4. Since our Bot responds to user's instructions, maintains a memory and knows the user it can be categorised under 'Responders'

