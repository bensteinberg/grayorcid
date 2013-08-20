grayorcid
=========
This is a gadget or toy; it answers the question, Whose [ORCID](http://orcid.org/) differs from mine by only one bit?  I had the idea after hearing about [Gray codes](http://en.wikipedia.org/wiki/Gray_code).  It was an opportunity to look into the [structure of an ORCID](http://support.orcid.org/knowledgebase/articles/116780-structure-of-the-orcid-identifier) (essentially a 15-digit number with a check digit, initially assigned between 0000-0001-5000-0007 and 0000-0003-5000-0001).

Since JavaScript doesn't do bitwise operations on numbers larger than 32 bits (and the fifteen-digit decimal number needs fifty digits in binary), I decided to generate the new ORCIDs using PHP and [The GNU Multiple Precision Arithmetic Library](http://gmplib.org/), so you'll need php5-gmp or the like to run this.  That script scrapes the ORCID site for names; a later version may use an API key.

This tool is running at http://grayorcid.potswift.org/.  Please let me know if you have any suggestions for it.