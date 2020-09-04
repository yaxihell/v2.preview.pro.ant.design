/* eslint-disable react/react-in-jsx-scope */
import { MapboxScene, LayerEvent, Popup, LineLayer, PolygonLayer } from '@antv/l7-react';
import { useEffect, useState } from 'react';
import { Calendar, Layout, Select, Spin } from 'antd';
import * as _ from 'lodash';
import { mergeData } from './util';
import {
  getProvinceGeoJson,
  getProvincesStats,
  getCitiesStats,
  getProvincesList,
} from '../../services/ncov';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const ProvinceStats = () => {
  const [data, setData] = useState();
  const [provinceName, setProvinceName] = useState('北京市'); // 默认北京
  const [code, setCode] = useState('110000'); // 默认北京
  const [time, setTime] = useState();
  const [provinceList, setProvinceList] = useState();
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
      const provinces = await getProvincesList();
      setProvinceList(provinces);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const geoData = await getProvinceGeoJson(code);
      const ncovData = await getCitiesStats(provinceName);
      const mergedData = mergeData(geoData, ncovData);
      setData(mergedData);
    };
    fetchData();
  }, [code, provinceName]);

  const onCalendarChange = value => {
    // eslint-disable-next-line no-underscore-dangle
    const cur = _.round(value._d.getTime() / 1000);
    setTime(cur);
  };

  const handleSelectChange = val => {
    const item = _.find(provinceList, { NAME_CHN: val });
    setProvinceName(val);
    setCode(_.get(item, 'adcode'));
  };

  if (_.isEmpty(provinceList)) {
    return <Spin />;
  }
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
            fontWeight: 600,
          }}
        >
          各省份新冠疫情可视化
          <Select
            value={provinceName}
            style={{ width: 200, marginLeft: '20px' }}
            onChange={handleSelectChange}
          >
            {_.map(provinceList, item => (
              <Option value={_.get(item, 'NAME_CHN')}>{_.get(item, 'NAME_CHN')}</Option>
            ))}
          </Select>
        </Header>
        <Content style={{ marginBottom: '20px' }}>
          下图展示了全国各省的疫情情况，鼠标移到每个省份区域可以查看具体信息。可以通过日历选择要查看的日期。
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
                      {_.get(popupInfo, 'feature.properties.mapName')}
                    </h4>
                    <ul
                      style={{
                        margin: 0,
                        padding: '5px',
                        minWidth: '100px',
                      }}
                    >
                      <li>现有确诊:{_.get(popupInfo, 'feature.properties.conNum')}</li>
                      <li>累计确诊:{_.get(popupInfo, 'feature.properties.conadd')}</li>
                      <li>累计治愈:{_.get(popupInfo, 'feature.properties.cureNum')}</li>
                      <li>累计死亡:{_.get(popupInfo, 'feature.properties.deathNum')}</li>
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
                        conNum: {
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
                      field: 'conNum', // 填充颜色
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
  );
};

export default ProvinceStats;
