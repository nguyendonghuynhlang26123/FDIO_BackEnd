// ---------------  GLOBAL VARIABLES ---------------------
const ACTIVE = 'selected';
const DISABLE = 'disabled';
const DONE = 'completed';
const PROCESSING = 'processing';
const DENY = 'deny';
const WAITING = 'waiting';
const WEB_SERVER = 'http://localhost:8002';

//FNS
const subtractTime = (prevTime) => {
  let time = Date.now() - prevTime;
  let diffHr = Math.floor((time % 86400000) / 3600000);
  let diffMins = Math.round(((time % 86400000) % 3600000) / 60000);
  return `${diffHr == 0 ? '' : diffHr + 'h'} ${diffMins}`;
};

async function sendHTTPRequest(method, url = '', data = {}) {
  console.log(`SEND ${method} request to ${url}`);
  // Default options are marked with *
  const response = await fetch(url, {
    method: method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
