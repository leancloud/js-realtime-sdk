export const error = Object.freeze({
  1000: {
    name: 'CLOSE_NORMAL',
  },
  1006: {
    name: 'CLOSE_ABNORMAL',
  },
  4100: {
    name: 'APP_NOT_AVAILABLE',
    message: 'App not exists or realtime message service is disabled.',
  },
  4103: {
    name: 'INVALID_LOGIN',
    message: 'Malformed clientId.',
  },
  4105: {
    name: 'SESSION_REQUIRED',
    message: 'Message sent before session opened. ',
  },
  4107: {
    name: 'READ_TIMEOUT',
  },
  4108: {
    name: 'LOGIN_TIMEOUT',
  },
  4109: {
    name: 'FRAME_TOO_LONG',
  },
  4110: {
    name: 'INVALID_ORIGIN',
    message: 'Access denied by domain whitelist.',
  },
  4111: {
    name: 'SESSION_CONFLICT',
  },
  4112: {
    name: 'SESSION_TOKEN_EXPIRED',
  },
  4200: {
    name: 'INTERNAL_ERROR',
    message: 'Internal error, please contact LeanCloud for support.',
  },
  4201: {
    name: 'SEND_MESSAGE_TIMEOUT',
  },
  4302: {
    name: 'CONVERSATION_SIGNATURE_FAILED',
  },
  4303: {
    name: 'CONVERSATION_NOT_FOUND',
  },
  4304: {
    name: 'CONVERSATION_FULL',
  },
  4305: {
    name: 'CONVERSATION_REJECTED_BY_APP',
  },
  4306: {
    name: 'CONVERSATION_UPDATE_FAILED',
  },
  4307: {
    name: 'CONVERSATION_READ_ONLY',
  },
  4308: {
    name: 'CONVERSATION_NOT_ALLOWED',
  },
  4401: {
    name: 'INVALID_MESSAGING_TARGET',
  },
  4402: {
    name: 'MESSAGE_REJECTED_BY_APP',
  },
});

export const ErrorCode = Object.freeze(
  Object.keys(error).reduce((result, code) => Object.assign(result, {
    [error[code].name]: Number(code),
  }), {})
);

export const createError = (errorMessage) => {
  const {
    code, reason, appCode, detail,
  } = errorMessage;
  let message = reason || detail;
  if (!message && error[code]) {
    message = error[code].message || error[code].name;
  }
  if (!message) {
    message = `Unknow Error: ${code}`;
  }
  const err = new Error(message);
  return Object.assign(err, {
    code, appCode, detail,
  });
};
