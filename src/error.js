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
  4102: {
    name: 'SIGNATURE_FAILED',
    message: 'Login signature mismatch.',
  },
  4103: {
    name: 'INVALID_LOGIN',
    message: 'Malformed clientId.',
  },
  4105: {
    name: 'SESSION_REQUIRED',
    message: 'Message sent before session opened.',
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
  4113: {
    name: 'APP_QUOTA_EXCEEDED',
    message: 'The daily active users limit exceeded.',
  },
  4116: {
    name: 'MESSAGE_SENT_QUOTA_EXCEEDED',
    message: 'Command sent too fast.',
  },
  4200: {
    name: 'INTERNAL_ERROR',
    message: 'Internal error, please contact LeanCloud for support.',
  },
  4301: {
    name: 'CONVERSATION_API_FAILED',
    message: 'Upstream Conversatoin API failed, see error.detail for details.',
  },
  4302: {
    name: 'CONVERSATION_SIGNATURE_FAILED',
    message: 'Conversation action signature mismatch.',
  },
  4303: {
    name: 'CONVERSATION_NOT_FOUND',
  },
  4304: {
    name: 'CONVERSATION_FULL',
  },
  4305: {
    name: 'CONVERSATION_REJECTED_BY_APP',
    message: 'Conversation action rejected by hook.',
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
  4309: {
    name: 'CONVERSATION_UPDATE_REJECTED',
    message: 'Conversation update rejected because the client is not a member.',
  },
  4310: {
    name: 'CONVERSATION_QUERY_FAILED',
    message: 'Conversation query failed because it is too expansive.',
  },
  4311: {
    name: 'CONVERSATION_LOG_FAILED',
  },
  4312: {
    name: 'CONVERSATION_LOG_REJECTED',
    message:
      'Message query rejected because the client is not a member of the conversation.',
  },
  4313: {
    name: 'SYSTEM_CONVERSATION_REQUIRED',
  },
  4314: {
    name: 'NORMAL_CONVERSATION_REQUIRED',
  },
  4315: {
    name: 'CONVERSATION_BLACKLISTED',
    message: 'Blacklisted in the conversation.',
  },
  4316: {
    name: 'TRANSIENT_CONVERSATION_REQUIRED',
  },
  4317: {
    name: 'CONVERSATION_MEMBERSHIP_REQUIRED',
  },
  4318: {
    name: 'CONVERSATION_API_QUOTA_EXCEEDED',
    message: 'LeanCloud API quota exceeded. You may upgrade your plan.',
  },
  4323: {
    name: 'TEMPORARY_CONVERSATION_EXPIRED',
    message: 'Temporary conversation expired or does not exist.',
  },
  4401: {
    name: 'INVALID_MESSAGING_TARGET',
    message: 'Conversation does not exist or client is not a member.',
  },
  4402: {
    name: 'MESSAGE_REJECTED_BY_APP',
    message: 'Message rejected by hook.',
  },
  4403: {
    name: 'MESSAGE_OWNERSHIP_REQUIRED',
  },
  4404: {
    name: 'MESSAGE_NOT_FOUND',
  },
  4405: {
    name: 'MESSAGE_UPDATE_REJECTED_BY_APP',
    message: 'Message update rejected by hook.',
  },
  4406: {
    name: 'MESSAGE_EDIT_DISABLED',
  },
  4407: {
    name: 'MESSAGE_RECALL_DISABLED',
  },
  5130: {
    name: 'OWNER_PROMOTION_NOT_ALLOWED',
    message: "Updating a member's role to owner is not allowed.",
  },
});

export const ErrorCode = Object.freeze(
  Object.keys(error).reduce(
    (result, code) =>
      Object.assign(result, {
        [error[code].name]: Number(code),
      }),
    {}
  )
);

export const createError = ({
  code,
  reason,
  appCode,
  detail,
  error: errorMessage,
}) => {
  let message = reason || detail || errorMessage;
  let name = reason;
  if (!message && error[code]) {
    ({ name } = error[code]);
    message = error[code].message || name;
  }
  if (!message) {
    message = `Unknow Error: ${code}`;
  }
  const err = new Error(message);
  return Object.assign(err, {
    code,
    appCode,
    detail,
    name,
  });
};
