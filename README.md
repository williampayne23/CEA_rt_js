# Note from Will:

Updated the test and rope.ts files.

Bringing attention to things I changed:
+ Implemented splitAt, delete, insert, and rebalance functions
+ In order to make splitAt run a bit faster added a isLeaf() method so I dont have to make a map to get access to kind (although I'm sure there must be some easier way to check type in typescript). (This is defined in IRope and implemented in both functions)
+ Added some tests for the splitAt function (and also made it an export so I could do that)
+ Added some extra tests for other cases as well, I have some time so I might make these more exhaustive. As of this commit there are cases for a branched tree and some cases for a right heavy tree 



# CEA Rope Implementation Challenge
This project contains a partial implementation of a [Rope](https://en.wikipedia.org/wiki/Rope_%28data_structure%29). Your challenge is to complete the implementation and make all of the tests pass. 

You may read Wikipedia articles or generic articles about data structures, but please don’t copy and paste or look up existing code for the implementation.

The tests entitled "extra credit" are, well, extra credit. If you are able to do them that's great, but you should focus on the other ones first.

We suggest commenting out all of the tests except for insertion or deletion and then starting with those.

## Installation
Install dependencies with command `yarn install`.

## Tests
Tests can be run with the command `yarn test`.