export const CLOSE_NORMAL = {
  code: 1000,
};
export const CLOSE_ABNORMAL = {
  code: 1006,
};
export const APP_NOT_AVAILABLE = {
  code: 4100,
  message: 'App not exists or realtime message service is disabled.',
};
export const INVALID_LOGIN = {
  code: 4103,
  message: 'Malformed clientId.',
};
export const SESSION_REQUIRED = {
  code: 4105,
  message: 'Message sent before session opened. ',
};
export const READ_TIMEOUT = {
  code: 4107,
};
export const LOGIN_TIMEOUT = {
  code: 4108,
};
export const FRAME_TOO_LONG = {
  code: 4109,
};
export const INVALID_ORIGIN = {
  code: 4110,
  message: 'Access denied by domain whitelist.',
};
export const SESSION_CONFLICT = {
  code: 4111,
};
export const SESSION_TOKEN_EXPIRED = {
  code: 4112,
};
export const INTERNAL_ERROR = {
  code: 4200,
  message: 'Internal error, please contact LeanCloud for support.',
};
export const SEND_MESSAGE_TIMEOUT = {
  code: 4201,
};
export const CONVERSATION_SIGNATURE_FAILED = {
  code: 4302,
};
export const CONVERSATION_NOT_FOUND = {
  code: 4303,
};
export const CONVERSATION_FULL = {
  code: 4304,
};
export const CONVERSATION_REJECTED_BY_APP = {
  code: 4305,
};
export const CONVERSATION_UPDATE_FAILED = {
  code: 4306,
};
export const CONVERSATION_READ_ONLY = {
  code: 4307,
};
export const CONVERSATION_NOT_ALLOWED = {
  code: 4308,
};
export const INVALID_MESSAGING_TARGET = {
  code: 4401,
};
export const MESSAGE_REJECTED_BY_APP = {
  code: 4402,
};

export const createError = errorMessage => {
  const {
    code, reason, appCode, detail,
    } = errorMessage;
  const error = new Error(reason || detail);
  return Object.assign(error, {
    code, appCode, detail,
  });
};
