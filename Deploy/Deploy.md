**Following are the instructions to setup the application**

Our application will be deployed to AWS environment. The application will run on a remote EC2 instance. 
1. Login to AWS and obtain an EC2 machine. 
2. The EC2 should have IAM role access for DynamoDb. 
2. Remote login to the EC2 instance using AWS credentials. 

3. Once inside the EC2 instance, follow the next steps.
    1. Install Ansible in the EC2 instance. Most EC2 machines come with pre-installed Ansible. If not, install using:<br>
    ``` sudo pip install ansible ``` (Linux) or,<br>
    ``` sudo apt-get install ansible -y``` (Ubuntu)
    1. ``` git clone https://github.ncsu.edu/csc510-fall2019/CSC510-7.git```
    2. Enter into the cloned repo<br>
    ``` cd CSC510-7/src```
    3. Create a new .env file inside this (CSC510-7/src) folder:<br>
    ``` vi .env```
    4. In .env file, put the following variables.<br>
       ``` 
        USER_SLACK_TOKEN=
        BOT_ID=<@UNTLFGFB8>
        ADMIN_TOKEN=
        ```
    NOTE: Obtain the USER_SLACK_TOKEN from https://api.slack.com/custom-integrations/legacy-tokens. You will find a legacy-token
    in your slack user account.  
5. Obtain the hostname, ip and ssh key of EC2 host and add it to inventory file. The inventory file should be in CI-CD folder where deploy.yml
    is present.
6. Run the ansible playbook:<br>
    ``` ansible-playbook CI-CD/deploy.yml -i inventory -vvvv```
7. Wait for the Ansible to finish setup.


### Acceptance Testing

1. Navigate to CSC510-7/src
2. Run:
    ```
    npm install
    ```
3. Run:
    ```
    node index.js
    ```
4. Now, go to the following link (Slack channel URL): <br>
https://app.slack.com/client/TNTGTLN5U/CNK1N4V5F

5. Once inside the channel, start typing the following commands to
verify the use cases by typing the commands in text box.

    *USE CASE 1: Setting Storage Limit*
    
    -  ``@fileninja --setStorageSize 3.5``
    
          Bot Reply: <br>
     
        ``New Alert Limit has been set to 3.5 GB``
        
    - ``@fileninja --getStorageSize``
    
        Bot Reply: <br>
        
        ``Current alert limit is 3.5 GB``
        
    - ``@fileninja --setStorageSize 6``
        
        Bot Reply: <br>
        
        ``Error. Size limit cannot be more than 5.0``
        
    - ``@fileninja --setStorageSize five``
        
        Bot Reply: <br>
        
        ``Please enter a number for storage size(in GB).``
        
    *USE CASE 2: Category Registration*
    
    - ``@fileninja --registerCategory Project1``
    
        Bot Reply:
        
        ``Category registered.``
    - ``@fileninja --registerCategory Project1``
    
        Bot Reply:
        
        ``Category with name Project1 already exists in this channel``
        
    - ``@fileninja --getCategories``
    
        Bot Reply:
        
        ``Categories for this channel are: Project1,Project2``
        
    - Click on upload button to upload files, add one or more files with names such as file1.png, file2.png
      In the upload message box, add the below command to add the files to category Project 1.
    
        ``@fileninja --addCategory Project1``
        
        Bot Reply:
        
        ``File added to category.``
        
    - To see the files uploaded to Project 1:
    
        ``@fileninja --showFiles Project1``
        
        Bot Reply:
        
        ```
          file1.png: https://files.slack.com/files-pri/TNTGTLN5U-FR4EWH01J/file1.png
          fileName.png: https://files.slack.com/files-pri/TNTGTLN5U-FR751GCSJ/file2.png
        ```
    - ``@fileninja --registerCategory project3`` 
    
        Bot Reply:
        
        ````
        
        
     
    
    
    
    


