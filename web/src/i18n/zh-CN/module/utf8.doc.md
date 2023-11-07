1. 转换借助于浏览器原生 API——TextEncoder 和 TextDecoder 进行，相比于自行实现转换函数，浏览器原生 API 更可靠方便。

2. Unicode 编码和 UTF8 编码之间的转换规则可以参考这篇文章：https://blog.dowhat.top/archives/1083。

3. 不建议转换特别长的文本或者 UTF8 编码，因为会造成浏览器卡顿。

4. UTF8 的输入请格外注意，需要为 `[123,231,23]` 这样的数组，数值为 `[0~255]` 的整数。
