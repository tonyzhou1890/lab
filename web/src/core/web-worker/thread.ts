// worker 收到信息并执行相关操作
function thread<T extends { [x: string]: any }>(utils: T) {
  self.onmessage = async function (e: MessageEvent) {
    const {
      action,
      param = [],
      _sign,
    } = e.data as {
      action: string;
      param: any[];
      _sign: string;
    };
    if (typeof utils[action] === 'function') {
      const res = {
        action,
        result: await utils[action](...param),
        _sign,
      };
      postMessage(res);
    } else {
      postMessage({
        action,
        _sign,
        errorCode: 1,
      });
    }
  };
}

export default thread;
