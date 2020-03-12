const adapters = {};

export const getAdapter = name => {
  const adapter = adapters[name];
  if (adapter === undefined) {
    throw new Error(`${name} adapter is not configured`);
  }
  return adapter;
};
export const setAdapters = newAdapters => {
  Object.assign(adapters, newAdapters);
};
