import * as React from 'react';
import { MapboxScene, LayerEvent, Popup, LineLayer, PolygonLayer } from '@antv/l7-react';
import { useEffect, useState } from 'react';
import { Layout, Slider, Radio, Divider } from 'antd';
import * as _ from 'lodash';
import Comment from '../common/comment';
import { calcDateCount } from '../lib/funcs';
import { getWorldStats, getWorldGeoJson } from '../../services/ncov';
import { mergeData, sliderTipFormatter, getSliderCurDate } from './util';

const { Header, Content, Footer } = Layout;

const WorldStats = () => {
  const [data, setData] = useState();
  const [time, setTime] = useState();
  const [type, setType] = useState('nowConfirm');
  const [popupInfo, setPopupInfo] = useState();
  const dayCount = calcDateCount(new Date(), new Date('2019-12-01'));

  const showPopup = row => {
    const { lngLat, feature } = row || {};
    setPopupInfo({
      lngLat,
      feature,
    });
  };

  const onSliderChange = value => {
    console.log(getSliderCurDate(value, dayCount));
  };

  useEffect(() => {
    const fetchData = async () => {
      const worldNcovData = await getWorldStats();
      const geiData = await getWorldGeoJson();
      const mergedData = mergeData(worldNcovData, geiData);
      setData(mergedData);
    };
    fetchData();
  }, [time]);

  const handleRadioChange = val => {
    setType(val.target.value);
  };

  return (
    <div style={{ width: '100%' }}>
      <Layout>
        <Header
          theme="light"
          style={{
            backgroundColor: 'white',
            fontSize: '32px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          世界新冠疫情可视化
        </Header>
        <Content style={{ marginBottom: '20px' }}>
          下图展示了全球各国的疫情情况，鼠标移到每个区域可以查看具体信息。拖动滑块可切换日期。
        </Content>
      </Layout>
      <Layout>
        <Layout>
          <Content>
            <Radio.Group defaultValue="nowConfirm" buttonStyle="solid" onChange={handleRadioChange}>
              <Radio.Button value="nowConfirm">现有确诊</Radio.Button>
              <Radio.Button value="confirm">累计确诊</Radio.Button>
            </Radio.Group>
          </Content>
          <Content style={{ width: 800, height: 600 }}>
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
                      {_.get(popupInfo, 'feature.properties.name')}
                    </h4>
                    <ul
                      style={{
                        margin: 0,
                        padding: '5px',
                        minWidth: '100px',
                      }}
                    >
                      <li>现有确诊:{_.get(popupInfo, 'feature.properties.nowConfirm')}</li>
                      <li>累计确诊:{_.get(popupInfo, 'feature.properties.confirm')}</li>
                      <li>累计治愈:{_.get(popupInfo, 'feature.properties.heal')}</li>
                      <li>累计死亡:{_.get(popupInfo, 'feature.properties.dead')}</li>
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
                        [type]: {
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
                      field: type, // 填充颜色
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
          <Content style={{ marginTop: '30px' }}>
            <Divider orientation="left">拖动下轴以查看不同时间数据</Divider>
            <Slider
              style={{ width: 800, height: 100, display: 'flex', alignItems: 'center' }}
              defaultValue={100}
              step={dayCount / 100}
              tipFormatter={val => sliderTipFormatter(val, dayCount)}
              onChange={onSliderChange}
            />
          </Content>
        </Layout>
        <Footer>
          <Comment />
        </Footer>
      </Layout>
    </div>
  );
};

export default WorldStats;
