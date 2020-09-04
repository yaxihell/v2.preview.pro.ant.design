/* eslint-disable react/react-in-jsx-scope */

import { useEffect, useState } from 'react';
import { Divider, Timeline, Tag, PageHeader } from 'antd';
import * as _ from 'lodash';
import { getTimeline } from '../../services/ncov';
import styles from './index.less';

const NcovTimeline = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const timelineList = await getTimeline();
      setData(timelineList);
    };
    fetchData();
  }, []);

  return (
    <>
      <PageHeader title="疫情详细时间线" />
      <Divider />
      <Timeline style={{ marginLeft: '200px' }}>
        {_.map(data, item => {
          return (
            <Timeline.Item className={styles['timeline-item']}>
              <Tag
                color="geekblue"
                style={{ marginBottom: '10px', marginRight: '30px', maxHeight: '25px' }}
              >
                {item.date || '--'}
              </Tag>
              <div>
                {_.map(item.events, event => {
                  return <p>{event}</p>;
                })}
              </div>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </>
  );
};

export default NcovTimeline;
