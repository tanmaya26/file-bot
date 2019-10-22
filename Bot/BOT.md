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

2. Storage <br>
    - *USE CASE: Set storage limit*<br>
    This tests for setting storage limit when user specifies a storage limit <=5.0. 
    - *USE CASE: Set greater storage limit*<br>
    This tests for setting storage limit when user specifies a storage limit > 5.0. Here, the test expectedly fails.
    - *USE CASE: Set storage limit without parameters*<br>
    This tests for setting storage limit when user doesn't specify a storage limit. Here, the test expectedly fails.
    - *USE CASE: Get current storage limit*<br>
    This test simply tests for current storage limit.

3. 
