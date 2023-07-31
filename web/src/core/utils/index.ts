import config from '../config';

export function changePathLangIso(path: string, langIso: string): string {
  const pathArr = path.split('/').filter((v) => v);
  if (!config.langIsoList.includes(pathArr[0])) {
    pathArr.unshift(langIso);
  } else {
    pathArr[0] = langIso;
  }
  return '/' + pathArr.join('/');
}
