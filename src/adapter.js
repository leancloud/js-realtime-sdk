const adapters = {};

const getAdapter = name => {
  const adapter = adapters[name];
  if (adapter === undefined) {
    throw new Error(`${name} adapter is not configured`);
  }
  return adapter;
};

/**
 * 指定 Adapters
 * @function
 * @memberof module:leancloud-realtime
 * @param {Adapters} newAdapters Adapters 的类型请参考 {@link https://url.leanapp.cn/adapter-type-definitions @leancloud/adapter-types} 中的定义
 */
const setAdapters = newAdapters => {
  Object.assign(adapters, newAdapters);
};

export { getAdapter, setAdapters };
