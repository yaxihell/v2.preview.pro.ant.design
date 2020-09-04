import * as _ from 'lodash';

export const joinData = (geodata, ncovData) => {
  const ncovDataObj = {};
  _.forEach(ncovData, (item = {}) => {
    const { currentConfirm, totalConfirmed, totalDeath, totalCured, name } = item;
    // 为什么只对中国的数据进行累计
    ncovDataObj[name] = {
      provinceName: name,
      currentConfirm,
      totalConfirmed,
      totalDeath,
      totalCured,
    };
  });

  geodata.features.forEach(feature => {
    const { name } = feature.properties;
    const keys = _.keys(ncovDataObj);
    const cur = _.find(keys, k => _.includes(k, name));
    const ncov = ncovDataObj[cur] || {};
    feature.properties = {
      ...feature.properties,
      ...ncov,
    };
  });
  return geodata;
};
