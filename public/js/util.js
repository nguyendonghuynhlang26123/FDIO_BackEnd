// ---------------  GLOBAL VARIABLES ---------------------
const ACTIVE = 'selected';
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
