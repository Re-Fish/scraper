Scraper
*******
Write a crawler/scraper that scans https://www.innoscripta.de/ and builds a list of the following information
- words used
- links to other web pages
- pictures used in the pages
All items should be listed with and ordered by their number of occurence, largest occurence on top. 
Format the output in basic HTML.

___

Comments:

* to start the project please use command `node project.js`;
* to extract all the text from html-files we can use the same method as for spans but it will take more time to write a code that will filter excess elements. Present code is dedicated just for demonstraition that it works;
* it is not feasible to extract image-urls from page styles configs with this approach because images are used as backgrounds, not as img's.
