import DataSet from '@antv/data-set';

export const getDateView = data => {
  const transData = _.map(data, i => {
    return {
      x: _.get(i, 'word'),
      value: Math.round(_.get(i, 'weight')),
      category: 'abc',
    };
  });
  const dv = new DataSet.View().source(transData);
  const range = dv.range('value');
  const min = range[0];
  const max = range[1];
  dv.transform({
    type: 'tag-cloud',
    fields: ['x', 'value'],
    size: [600, 500],
    font: 'rectangular',
    padding: 0,
    timeInterval: 5000, // max execute time
    rotate() {
      let random = ~~(Math.random() * 4) % 4;
      if (random == 2) {
        random = 0;
      }
      return random * 90; // 0, 90, 270
    },
    fontSize(d) {
      if (d.value) {
        const divisor = max - min !== 0 ? max - min : 1;
        return ((d.value - min) / divisor) * (40 - 12) + 12;
      }
      return 0;
    },
  });
  return dv;
};
