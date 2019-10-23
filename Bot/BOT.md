## Bot
In this milestone, we have implemented features such as

## Bot Implementation

## Selenium testing

The selenium tests the latest Bot's response which makes sure it does not test for stale responses from previous threads in the channel. It tests for the commands given by user on the text box in the channel.
Currently, we have implemented test cases for four major features of file bot: Watermark, Storage management, Category management and External storage. Each feature has sub-categories which are also tested and these tests have a happy path and one alternate path. Let's go over the test cases.

1. Watermark
    - USE CASE: *Register Watermark*<br>
        The happy path here, tests for registering a watermark when file format is correct.
    - USE CASE: *Register Watermark for unacceptable file format*   
    This is an alternate path for the previous test. This tests for registering a watermark when a user uploads an unacceptable format which is jpeg
        in this case.<br>
    - USE CASE: *Add Watermark to file*<br>
        This test case tests for adding watermark to file.<br>
    - USE CASE: *Get all watermarks*<br>
        This tests for listing all registered watermarks.

2. Storage Management <br>
    - USE CASE: *Set storage limit*<br>
    This tests for setting storage limit when user specifies a storage limit <=5.0. 
    - USE CASE: *Set greater storage limit*<br>
    This tests for setting storage limit when user specifies a storage limit > 5.0. Here, the test expectedly fails.
    - USE CASE: *Set storage limit with non-integer parameters*<br>
    This tests for setting storage limit when user specifies a non-integer storage limit. Here, the test expectedly fails. this is an alternate path for our previous test.
    - USE CASE: *Get current storage limit*<br>
    This test simply tests for current storage limit.

3. Category Management <br>
    - USE CASE: *Register category with params*<br>
    This is the first command the user needs to give to create a category where it can add files. 
    - USE CASE: *Register category that already exists*<br>
    This tests if any user gives the same category name again and the Bot responds by saying the category name already exists.
    - USE CASE: *Add files to category*<br>
    This tests for the Bot's actions when a user wants to add files to a category created.  
     - USE CASE: *Show files in a category*<br>
    This represents a happy path. This tests for Bot's actions in the case when user asks to list all files in a category. 
     - USE CASE: *Show files a category which does not exist*<br>
    This tests for Bot's actions in the case when user gives a non-existing category name to list all files in it. This test expectedly fail.  
    - USE CASE: *Delete a category*<br>
    This tests for Bot's actions the case when user deletes the category.
    - USE CASE: *Delete a category which does not exist*<br>
    This tests for Bot's actions the case when user deletes the category but the category does not exist.

4. External Storage<br>
    - USE CASE: *Export category to external storage*<br>
    This represents a happy path. This test case tests when user exports the category to external storage for better storage management. 
    - USE CASE: *Export category for a category which does not exist*<br>
    This test case tests when user exports the category to external storage but gives a category name that is not created. The test will expectedly fail in this case.
    
To summarize, we have written tests for happy paths and alternate (error) paths for the various scenarios mentioned above. The selenium files can be found at ![selenium.js](../selenium/final.js)

## Mock Infrastructure
#### Mocking HTTP and third party calls:
For mocking HTTP and third party calls we have used nock.js, which is a server mocking and expectations library for NODE js.
It overrides Node's http.request functionality and creates an interceptor list which is used to mock any request made to the URL
present in the list. The scope for it's use in our project is that it mocks calls like GET/POST request to slack to fetch a resource, or other HTTP and third party requests.
Since nock.js allows us to set custom response for the mocked calls, we use the mocked data from a JSON file called mock.json, where have
hardcoded the response values for various calls.

#### Mocking Database calls:
For mocking database calls, we decided to go with aws-sdk-mock. It is a mocking library for AWS DynamoDB, which is the database we plan to use in the future.
It mocks the call and response to and from the DynamoDB respectively. It also allows us to set custom response data and status which it then passes it into the 
callback function defined for a given call. The advantage of doing this is that it will make transition towards the actual implementation of DynamoDB much simpler.
Secondly,It helps us set up the database layer just as we would for the real DynamoDB call, without actually interacting with the database. The mocked response it picked up from
the mock.json file for all the different database calls like 'get', 'getAll' etc.

#### Mocking Data:
All mocked data and responses for HTTP and Database calls have been hardcoded and stored in mock.json in JSON format.