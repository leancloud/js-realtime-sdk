import StateMachine from 'javascript-state-machine';

export default () => StateMachine.create({
  initial: 'calling',
  events: [{
    name: 'connect',
    from: 'calling',
    to: 'connected',
  }, {
    name: 'close',
    from: 'connected',
    to: 'closed',
  }, {
    name: 'cancel',
    from: 'calling',
    to: 'canceled',
  }, {
    name: 'refuse',
    from: 'calling',
    to: 'refused',
  }],
});
