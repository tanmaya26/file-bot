## Bot
In this milestone, we have implemented features such as

## Bot Implementation

## Selenium testing

Currently, we have implemented test cases for three major features of file bot: Watermark, Storage management, Category management. Each 
feature has sub-categories which are also tested and these tests have a happy path and one alternate path. Let's go over the test cases.

1. Watermark
    - *USE CASE: Register Watermark*<br>
        The happy path for this test case tests for registering a watermark when file format is correct.
        The alternate path tests for registering a watermark when a user uploads an unacceptable format which is jpeg 
        in this case.<br>
    - *USE CASE: Add Watermark to file*<br>
        This test case tests for adding watermark to file.<br>
    - *USE CASE: Get all watermarks*<br>
        This tests for listing all registered watermarks.

2. Storage Management <br>
    - *USE CASE: Set storage limit*<br>
    This tests for setting storage limit when user specifies a storage limit <=5.0. 
    - *USE CASE: Set greater storage limit*<br>
    This tests for setting storage limit when user specifies a storage limit > 5.0. Here, the test expectedly fails.
    - *USE CASE: Set storage limit without parameters*<br>
    This tests for setting storage limit when user doesn't specify a storage limit. Here, the test expectedly fails. this is an alternate path for our previous test.
    - *USE CASE: Get current storage limit*<br>
    This test simply tests for current storage limit.

3. Category Management <br>
    - *USE CASE: Register category with params*<br>
    This is the first command the user needs to give to create a category where it can add files. 
    - *USE CASE: Register category that already exists*<br>
    This tests if any user gives the same category name again and the Bot responds by saying the category name already exists.
    - *USE CASE: Add files to category*<br>
    This tests for the Bot's actions when a user wants to add files to a category created. 
    - *USE CASE: Add files to category without filename*<br>
    This tests for the Bot's actions when a user wants to add files to a category created but forgets to mention the file name. The test expectedly fails. This is an alternate path to previous test case.  
    
