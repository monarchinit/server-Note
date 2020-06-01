export function getControllerProxy(target) {
  return new Proxy(target, {
    get: (target, key) => {
      const prop = target[key];

      if (typeof prop === "function") {
        return async (req, res, next) => {
          await Promise.resolve(prop.call(target, req, res, next)).catch(next);
        };
      }

      return prop;
    },
  });
}
