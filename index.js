const express = require('express');
const app = express();
const fetch = require('node-fetch');

/*This is the Cache Object, this stores
the information of the requests so that
it can be quickly checked for the desired
ID instead of immediately pinging the
database. */

cache = {}

app.get('/', (req,res) => {
    res.redirect('/get_photo')
})

/* This URI endpoint takes the query parameter ID
and pings the jsonplaceholder for the requested
ID.
 */

app.get('/get_photo', async (req, res) => {

  let id = req.query.id

  if(!cache.hasOwnProperty(`id_${id}`))
  {
    await fetch(`https://jsonplaceholder.typicode.com/photos/${id}`)
    .then(response => response.json()).then(obj => {

      /*Check if the Object returned is Empty,
      or in other words, it doesn't exist.
      If the object isn't equal to 0 in length
      then there's something there. */

      if(Object.keys(obj).length != 0)
      {

        cache[`id_${id}`] = {
          title: obj.title,
          url: obj.url
        }

        res.json({title: obj.title,
        url: obj.url});

      }else{
        res.send('No Such ID Exists In Database')
      }
    });
  }else{

    res.json(cache[`id_${id}`]);
  }

})

/* Gets the Cache of the application
and returns it. */

app.get('/get_cache', (req, res) => {

  res.json(cache)
})

app.listen(process.env.PORT);

/*
IF RUNNING LOCALLY

app.listen(3000);

*/
