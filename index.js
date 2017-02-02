#!/usr/bin/env node
const https = require('https');
const color = require('colors');

const source = {
  reddit: {
    url: 'https://www.reddit.com',
    sub: {
      dad: '/r/dadjokes.json'
    }
  },
}

function filterOutLink(j) {
  return j.data.selftext.indexOf("http") == -1;
}
function filterUpVotes(j) {
  return j.data.ups >= 10;
}

https.get(source.reddit.url + source.reddit.sub.dad, (response)=>{
  let json = '';
  response.on('data', (chunk)=>{
    json += chunk;
  });
  response.on('end', ()=>{
    const jokes = JSON.parse(json).data.children
      .filter(filterOutLink)
      .filter(filterUpVotes)
      .map((joke)=>{
        let { title, selftext } = joke.data;
        return { title, selftext };
      });
    jokes.slice(0,3).map((joke, i)=>{
      console.log(`Joke ${i+1}:`.underline)
      console.log(`${joke.title}\n${joke.selftext}\n`);
    });
  });
  
  response.on('error', (err)=>{
    console.warn(err);
  });
});