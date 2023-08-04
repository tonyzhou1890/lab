import io from '@/core/io';

let lemmatizer: any = null;

// 下载脚本，初始化实例
async function init() {
  // 加载 underscore。因为 underscore 以 _ 作为命名空间，其他库也可能用这个符号，所以直接加载覆盖。
  const underscoreSrc = '/libs/underscore/underscore-min.js';
  await io.loadScript({
    path: underscoreSrc,
    version: '1.7.0',
  });
  if (!lemmatizer) {
    const src = '/libs/lemmatizer/lemmatizer.js';
    await io.loadScript({
      path: src,
      version: '0.0.2',
    });
  }
  lemmatizer = new Lemmatizer('/libs/lemmatizer/');
}

export interface WordCountItem {
  index?: number;
  word: string;
  count: number;
  lang: string;
}

// 统计
function count(data: string): WordCountItem[] {
  type NumberObj = { [x: string]: number };

  // 英语统计
  const enData = data.replace(/\W+/g, '\n').toLowerCase();
  const enRes: NumberObj = _count(
    enData.split('\n').filter((v: string) => v),
    'en'
  );
  // 中文统计
  const zhData = data.replace(/[^\u4e00-\u9fa5]/g, '');
  const zhRes: NumberObj = _count(zhData.split(''), 'zh');

  let res: WordCountItem[] = [];

  res = res.concat(
    Object.entries(enRes).map((item) => ({
      word: item[0],
      count: item[1],
      lang: 'en',
    }))
  );
  res = res.concat(
    Object.entries(zhRes).map((item) => ({
      word: item[0],
      count: item[1],
      lang: 'zh',
    }))
  );

  res.sort((a, b) => b.count - a.count);

  return res;

  function _count(arr: string[], lang: string): NumberObj {
    const res: { [x: string]: number } = {};
    for (let i = 0, len = arr.length; i < len; i++) {
      const word = arr[i];
      if (lang === 'en') {
        const lemmasResult = lemmatizer.lemmas(word);
        lemmasResult
          .map((item: [string, string]) => item[0])
          .filter((v: string) => v)
          .map((item: string) => {
            res[item] = (res[item] || 0) + 1;
          });
      } else {
        res[word] = (res[word] || 0) + 1;
      }
    }

    return res;
  }
}

export default { init, count };

export type Init = typeof init;
export type Count = typeof count;