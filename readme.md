to run the project

you will require a database in mongodb
after that it will run a server on 4001 port which is configurable via env variables

u just need to run npm start

sry wasnt able to write test cases as ran out of time and implement rate limiting (48 h deadline)

I tried to contact for few doubt i had but didnt get any response

key decisions

: added text index on note content so keyword queries can be efficient
: instead of mapping each user with note i have mapped note with each user considering both creating and sharing the notes
as most of the read query would be on getting notes related to the user

: functional assumption  i took was when sharing a note i assuming its an exiting note and when the creator of note upadte/delete the note, the user which its is shared with also get the changes



