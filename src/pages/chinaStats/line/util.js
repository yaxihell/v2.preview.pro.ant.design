import * as _ from 'lodash';

export const transData = data => {
  let res = [];
  _.forEach(data, (item = {}) => {
    const { date, total: { confirm, dead, heal, storeConfirm } = {} } = item;

    const itemArr = [
      {
        date,
        number: confirm,
        type: 'confirm',
      },
      {
        date,
        number: dead,
        type: 'dead',
      },
      {
        date,
        number: heal,
        type: 'heal',
      },
      {
        date,
        number: storeConfirm,
        type: 'storeConfirm',
      },
    ];

    res = res.concat(itemArr);
  });

  return res;
};
