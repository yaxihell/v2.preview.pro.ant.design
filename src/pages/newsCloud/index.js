import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
import { Spin, Card } from 'antd';
import { Chart, Geom, Tooltip, Coord, Shape } from 'bizcharts';
import DataSet from '@antv/data-set';
import { getNewsList } from '../../services/ncov';
import { getDateView } from './util';

const getTextAttrs = cfg =>
  _.assign({}, cfg.style, {
    fillOpacity: cfg.opacity,
    fontSize: cfg.origin._origin.size,
    rotate: cfg.origin._origin.rotate,
    text: cfg.origin._origin.text,
    textAlign: 'center',
    fontFamily: cfg.origin._origin.font,
    fill: cfg.color,
    textBaseline: 'Alphabetic',
  });

const scale = {
  x: {
    nice: false,
  },
  y: {
    nice: false,
  },
};

const NewsCloud = props => {
  const [data, setData] = useState([]);
  useEffect(() => {
    // nodejieba.load();
    const fetchData = async () => {
      const newsList = await getNewsList();
      // const [chinaNews, worldNews] = newsList;
      setData(newsList);
    };
    fetchData();
  }, []);

  if (_.isEmpty(data)) {
    return <Spin />;
  }

  Shape.registerShape('point', 'cloud', {
    drawShape(cfg, container) {
      const attrs = getTextAttrs(cfg);
      return container.addShape('text', {
        attrs: _.assign(attrs, {
          x: cfg.x,
          y: cfg.y,
        }),
      });
    },
  });

  const chinaNewsData = getDateView(data[0]);
  const worldNewsData = getDateView(data[1]);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Card title="全国新闻信息词云可视化" extra={<a href="#">More</a>} style={{ width: 300 }}>
          <p>
            收集近百条疫情相关新闻，经过去噪、分词得到频率前100的高频词，将其可视化。文本大小代表出现的频率高低。
          </p>
        </Card>
        <div style={{ padding: '20px', border: '1px solid #ddd' }}>
          <Chart width={600} data={chinaNewsData} scale={scale} padding={0} forceFit>
            <Tooltip showTitle={false} />
            <Coord reflect="y" />
            <Geom type="point" position="x*y" color="category" shape="cloud" tooltip="text*value" />
          </Chart>
        </div>
      </div>
      <div style={{ display: 'flex', marginTop: '30px' }}>
        <Card
          title="国外新闻信息词云可视化"
          extra={<a href="#">More</a>}
          style={{ width: 300 }}
        ></Card>
        <div style={{ padding: '20px', border: '1px solid #ddd' }}>
          <Chart width={600} data={worldNewsData} scale={scale} padding={20} forceFit>
            <Tooltip showTitle={false} />
            <Coord reflect="y" />
            <Geom type="point" position="x*y" color="category" shape="cloud" tooltip="text*value" />
          </Chart>
        </div>
      </div>
    </div>
  );
};

export default NewsCloud;
