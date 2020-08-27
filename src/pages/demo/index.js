/* eslint-disable react/react-in-jsx-scope */
import { LineLayer, MapboxScene, PolygonLayer } from '@antv/l7-react';
import { useEffect, useState } from 'react';
import { joinData } from 'util';

const DEMO = () => {
  const [data, setData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const [geoData, ncovData] = await Promise.all([
        // 地理数据
        fetch(
          'https://gw.alipayobjects.com/os/bmw-prod/e62a2f3b-ea99-4c98-9314-01d7c886263d.json'
        ).then(d => d.json()),
        // https://lab.isaaclin.cn/nCoV/api/area?latest=1
        // 疫情数据
        fetch(
          'https://gw.alipayobjects.com/os/bmw-prod/55a7dd2e-3fb4-4442-8899-900bb03ee67a.json'
        ).then(d => d.json()),
      ]);
      setData(joinData(geoData, ncovData.results));
    };
    fetchData();
  }, []);

  return (
    <div>
      <MapboxScene
        map={{
          center: [110.19382669582967, 50.258134],
          pitch: 0,
          style: 'blank',
          zoom: 1,
        }}
        style={{
          position: 'absolute',
          background: '#fff', // 地图背景色
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {data && [
          <PolygonLayer
            key="1"
            options={{
              autoFit: true,
            }}
            source={{
              data,
            }}
            scale={{
              values: {
                confirmedCount: {
                  type: 'quantile',
                },
              },
            }}
            active={{
              option: {
                color: '#0c2c84',
              },
            }}
            color={{
              field: 'confirmedCount', // 填充颜色
              values: ['#732200', '#CC3D00', '#FF6619', '#FF9466', '#FFC1A6', '#FCE2D7'].reverse(),
            }}
            shape={{
              values: 'fill',
            }}
            style={{
              opacity: 1,
            }}
          />,
          <LineLayer
            key="2"
            source={{
              data,
            }}
            size={{
              values: 0.6,
            }}
            color={{
              values: '#aaa', // 描边颜色
            }}
            shape={{
              values: 'line',
            }}
            style={{
              opacity: 1,
            }}
          />,
        ]}
      </MapboxScene>
    </div>
  );
};

export default DEMO;
