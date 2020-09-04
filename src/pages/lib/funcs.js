// 传入参数为 Date 对象，计算两个日期之间的天数
export const calcDateCount = (startDate, endDate) => {
  return parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24, 10) + 1; // 把相差的毫秒数转换为天数
};

// 计算某个日期加上一个日期数是哪天
// data: Date对象 dayCount: number
export const plusDate = (date, dayCount) => {
  const millseconds = date.getTime();
  const during = dayCount * 24 * 60 * 60 * 1000;
  return new Date(millseconds + during);
};
