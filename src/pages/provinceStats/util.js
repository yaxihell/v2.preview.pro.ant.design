import * as _ from 'lodash';

export const mergeData = (geoData, ncovData) => {
  const cities = _.get(ncovData, 'city');
  geoData.features = _.map(geoData.features, item => {
    const name = _.get(item, 'properties.name');
    const ncov = _.chain(cities)
      .find(i => _.get(i, 'mapName') === name)
      .value();
    return {
      ...item,
      properties: { ..._.get(item, 'properties'), ...ncov },
    };
  });
  return geoData;
};
