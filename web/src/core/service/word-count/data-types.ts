import { WordCountItem } from './utils';

export class CountOutputData {
  constructor(value: WordCountItem[]) {
    this.value = value;
  }
  value: WordCountItem[];
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  download() {}
}
