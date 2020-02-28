const adaptors = {};

export const getAdaptor = name => {
  const adaptor = adaptors[name];
  if (adaptor === undefined) {
    throw new Error(`${name} adaptor is not configured`);
  }
  return adaptor;
};
export const setAdaptor = (name, adaptor) => {
  adaptors[name] = adaptor;
};
export const setAdaptors = newAdaptors => {
  Object.assign(adaptors, newAdaptors);
};
