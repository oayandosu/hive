/*
hive
.at('/tweets')
//http://hello-world.dev/tweets/?limit=24
.find('/', hive.queries.tweets)
//http://hello-world.dev/tweets/:id
.find('/detail/:id', hive.models.tweet)
//http://hello-world.dev/tweets/new
.post('/new', hive.models.tweet)
//http://hello-world.dev/tweets/delete/:id
.delete('/delete/:id', hive.models.tweet);
*/
