/* eslint-disable react/react-in-jsx-scope */
import { MapboxScene, LayerEvent, Popup, LineLayer, PolygonLayer } from '@antv/l7-react';
import { useEffect, useState } from 'react';
import { Calendar, Layout } from 'antd';
import * as _ from 'lodash';
import { joinData } from './util';
import { getChinaGeoJson, getProvincesStats } from '../../services/ncov';

const { Header, Sider, Content } = Layout;

const ChinaStats = props => {
  const [data, setData] = useState();
  const [time, setTime] = useState();
  const [popupInfo, setPopupInfo] = useState();

  const showPopup = row => {
    const { lngLat, feature } = row || {};
    setPopupInfo({
      lngLat,
      feature,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      // const secondTime = date
      const geoData = await getChinaGeoJson();
      const ncovData = await getProvincesStats(time);
      const mergedData = joinData(geoData, ncovData);
      setData(mergedData);
    };
    fetchData();
  }, [time]);

  const onCalendarChange = value => {
    const time = _.round(value._d.getTime() / 1000);
    setTime(time);
  };

  return (
    props.children || (
      <div style={{ width: '100%' }}>
        <Layout>
          <Header
            theme="light"
            style={{ backgroundColor: 'white', fontSize: '32px', marginBottom: '20px' }}
          >
            全国新冠疫情可视化
          </Header>
          <Content style={{ marginBottom: '20px' }}>
            下图展示了全国各省的疫情情况，鼠标移到每个省份区域可以查看具体信息。可以通过日历选择要查看的日期
          </Content>
        </Layout>
        <Layout>
          <Layout>
            <Content>
              <div style={{ width: 800, height: 600, position: 'relative' }}>
                <MapboxScene
                  map={{
                    center: [110.19382669582967, 50.258134],
                    pitch: 0,
                    style: 'blank',
                    zoom: 1,
                  }}
                  option={{
                    logoVisible: false,
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                >
                  {popupInfo && (
                    <Popup lnglat={_.get(popupInfo, 'lngLat')}>
                      <h4 style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
                        {_.get(popupInfo, 'feature.properties.provinceName')}
                      </h4>
                      <ul
                        style={{
                          margin: 0,
                          padding: '5px',
                          minWidth: '100px',
                        }}
                      >
                        <li>现有确诊:{_.get(popupInfo, 'feature.properties.currentConfirm')}</li>
                        <li>累计确诊:{_.get(popupInfo, 'feature.properties.totalConfirmed')}</li>
                        <li>累计治愈:{_.get(popupInfo, 'feature.properties.totalCured')}</li>
                        <li>累计死亡:{_.get(popupInfo, 'feature.properties.totalDeath')}</li>
                      </ul>
                    </Popup>
                  )}
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
                          currentConfirm: {
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
                        field: 'currentConfirm', // 填充颜色
                        values: [
                          '#732200',
                          '#CC3D00',
                          '#FF6619',
                          '#FF9466',
                          '#FFC1A6',
                          '#FCE2D7',
                        ].reverse(),
                      }}
                      shape={{
                        values: 'fill',
                      }}
                      style={{
                        opacity: 1,
                      }}
                    >
                      <LayerEvent type="mousemove" handler={showPopup} />
                    </PolygonLayer>,
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
            </Content>
            <Sider theme="light" width={280}>
              <Calendar fullscreen={false} onChange={onCalendarChange} />
            </Sider>
          </Layout>
        </Layout>
      </div>
    )
  );
};

export default ChinaStats;
