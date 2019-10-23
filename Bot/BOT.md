## Bot
In this milestone, we have implemented features such as

## Bot Implementation
## Use Case refinement

We have made some modifications to our use cases. The following are the changes:<br>
    1. USE CASE: *Export files under a specific category*<br>
    Before modification, user had the option to export files in category by specifiying file name using the command: @botName --export fileName externalStorageName. Currently, user can only export the entire category and the files in it will be exported too using the command: @botName --export categoryName externalStorageName<br>
    2. USE CASE: *Delete files under a specific category*<br>
    Before modification, user had the option to delete file in a category by specifying filename and category name using the command: @botName --deleteCategory categoryName fileName. After modification, user may only delete the entire category using the command: @botName --deleteCategory categoryName
## Selenium testing

We have used a web browser automation framework Selenium to conduct the User interface test. This framework helps to pose as a user and conducts the test. It also verifies the output for the commands given by the user on the text box in the channel. 
Currently, we have implemented test cases for major features of file bot: Watermark, Storage management, Category management and External storage. Each feature has sub-categories which are also tested and these tests have a happy path and one alternate path. Let's go over the test cases.

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
