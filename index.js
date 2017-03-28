#!/usr/bin/env node
const https = require('https');
const color = require('colors');
const ora = require('ora');
const say = require('say');
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

const spinner = ora('asking reddit').start();

async function fetch() {
  return new Promise((resolve, reject) => {
    let req = https.get(source.reddit.url + source.reddit.sub.dad, (response)=> {
      let json = '';
      response.on('data', (chunk)=>{
        json += chunk;
      });

      response.on('end', ()=> {
        try {
          var body = json;
        } catch (e) {
          reject(e);
        }
        resolve(body);
      });
      
      response.on('error', (err)=>{
        reject(e);
        console.warn(err);
      }); 
    });

  });
}

const outputResponse = function (body) {
  const jokes = JSON.parse(body).data.children
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
};

fetch()
  .then((body) => {
    spinner.stop();
    outputResponse(body)
  });