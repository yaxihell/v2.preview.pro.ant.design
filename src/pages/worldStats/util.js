import * as _ from 'lodash';
import moment from 'moment';
import { plusDate } from '../lib/funcs';

export const mergeData = (ncovData, geoData) => {
  const ncovs = _.get(ncovData, 'data');
  geoData.features = _.map(geoData.features, item => {
    const name = _.get(item, 'properties.name');
    const ncov = _.chain(ncovs)
      .find(i => _.get(i, 'name') === name)
      .value();
    return { ...item, properties: { ..._.get(item, 'properties'), ...ncov } };
  });
  return geoData;
};

export const getSliderCurDate = (val, dayCount) => {
  const percent = val / 100;
  const days = dayCount * percent;
  return plusDate(new Date('2019-12-01'), days);
};

// eg: val: 40  dayCount: 244
export const sliderTipFormatter = (val, dayCount) => {
  const resDate = getSliderCurDate(val, dayCount);
  return moment(resDate).format('YYYY-MM-DD');
};
