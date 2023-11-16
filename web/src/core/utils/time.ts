import dayjs from 'dayjs'

/**
 * 将时间偏移量格式化成 HH:mm:ss.ms 的形式
 * @param time
 * @returns
 */
export function formatOffsetTime(time: number) {
  // 取整，小数会对取毫秒值产生影响
  time >>= 0
  const res =
    time === 24 * 3600 * 1000
      ? '24:00:00.000'
      : dayjs(dayjs('2000-01-01 00:00:00').valueOf() + time).format(
          'HH:mm:ss'
        ) +
        '.' +
        `000${time % 1000}`.slice(-3)
  return res
}
