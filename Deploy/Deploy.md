**Following are the instructions to setup the application**

Our application will be deployed to AWS environment. The application will run on a remote EC2 instance. 
1. Login to AWS and obtain an EC2 machine. 
2. The EC2 should have IAM role access for DynamoDb. 
2. Remote login to the EC2 instance using AWS credentials. 

3. Once inside the EC2 instance, follow the next steps.
    1. Install Ansible in the EC2 instance. Most EC2 machines come with pre-installed Ansible. If not, install using:<br>
    ``` sudo pip install ansible ``` (Linux) or,
    ``` sudo apt-get install ansible -y``` (Ubuntu)
    1. ``` git clone https://github.ncsu.edu/csc510-fall2019/CSC510-7.git```
    2. Enter into the cloned repo
    ``` cd CSC510-7/src```
    3. Create a new .env file inside this (CSC510-7/src) folder:
    ``` vi .env```
    4. In .env file, put the following variables.
        USER_SLACK_TOKEN=<br>
        BOT_ID=<@UNTLFGFB8><br>
        ADMIN_TOKEN=<br>
    NOTE: Obtain the USER_SLACK_TOKEN from https://api.slack.com/custom-integrations/legacy-tokens. You will find a legacy-token
    in your slack user account. 
    4. Run the ansible playbook:
    ``` ansible-playbook CI-CD/deploy.yml```

