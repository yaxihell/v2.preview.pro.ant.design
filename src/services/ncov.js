import { xFetch } from './util';
// 获取全国地理数据

export const getChinaGeoJson = () => {
  return xFetch({
    url: '/data/getGeoJson',
  });
};

export const getProvincesStats = time => {
  return xFetch({
    url: time ? `/data/getProvinceStats?time=${time}` : '/data/getProvinceStats',
  });
};

export const getProvincesList = () => {
  return xFetch({
    url: '/data/getProvincesList',
  });
};

export const getWorldStats = () => {
  return xFetch({
    url: '/data/getWorldStats',
  });
};

export const getCountriesList = () => {
  return xFetch({
    url: '/data/getCountriesList',
  });
};

export const getCitiesStats = provinceName => {
  return xFetch({
    url: `/data/getCitiesStats?province=${provinceName}`,
  });
};

export const getWorldGeoJson = () => {
  return xFetch({
    url: '/data/getWorldGeoJson',
  });
};

export const getProvinceGeoJson = code => {
  return xFetch({
    url: `/data/getProvinceGeoJson?code=${code}`,
  });
};

export const getChinaNcovWithTime = () => {
  return xFetch({
    url: '/data/getChinaNcovWithTime',
  });
};

export const getNewsList = () => {
  return xFetch({
    url: '/data/getNewsList',
  });
};

export const getTimeline = () => {
  return xFetch({
    url: '/data/getTimeline',
  });
};
