export const listen = (target, resolveEvent, rejectEvent) => new Promise(
  (resolve, reject) => {
    if (resolveEvent) target.once(resolveEvent, (...args) => resolve(args));
    if (rejectEvent) target.once(rejectEvent, error => reject(error));
  }
);

export const wait = time => new Promise(resolve => setTimeout(resolve, time));

export const hold = time => result => wait(time).then(() => result);

export const sinon = (typeof window !== 'undefined' && window.sinon) || require('sinon');
