export const listen = (target, eventName) => new Promise(
  resolve => target.once(eventName, (...args) => resolve(args)
));

export const wait = time => new Promise(resolve => setTimeout(resolve, time));

export const hold = time => result => wait(time).then(() => result);
