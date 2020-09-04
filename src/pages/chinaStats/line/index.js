/* eslint-disable react/react-in-jsx-scope */
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import { useEffect, useState } from 'react';
import { Layout, PageHeader } from 'antd';
import moment from 'moment';
import Slider from 'bizcharts-plugin-slider';
import { transData } from './util';
import { getChinaNcovWithTime } from '../../../services/ncov';

const { Header, Sider, Content } = Layout;

const ChinaStatsLine = () => {
  const [data, setData] = useState();
  const [start, setStart] = useState('2020-01-13');
  const [end, setEnd] = useState(moment().format('YYYY-MM-DD'));
  useEffect(() => {
    const fetchData = async () => {
      const ncovData = await getChinaNcovWithTime();
      const resData = transData(ncovData);
      setData(resData);
    };
    fetchData();
  }, []);

  const onSliderChange = val => {
    const { startValue, endValue } = val;
    setStart(startValue);
    setEnd(endValue);
  };

  return (
    <Layout theme="light">
      <Header theme="light" style={{ backgroundColor: 'white', paddingLeft: '10px' }}>
        <PageHeader
          style={{
            lineHeight: '30px',
          }}
          title="国内疫情折线图"
          subTitle="随时间记录疫情中的最新确诊数、累计确诊数、治愈数和死亡数等信息，并将其直观显示出来"
        />
      </Header>
      <Layout>
        <Content style={{ height: '680px', marginTop: '50px' }}>
          <Chart height={680} width={800} data={data} forceFit>
            <Legend />
            <Axis name="date" />
            <Axis
              name="number"
              label={{
                formatter: val => `${val}人`,
              }}
            />
            <Tooltip
              crosshairs={{
                type: 'y',
              }}
            />
            <Geom type="line" position="date*number" size={2} color="type" shape="smooth" />
            <Geom
              type="point"
              position="date*number"
              size={2}
              shape="circle"
              color="type"
              style={{
                stroke: '#fff',
                lineWidth: 1,
              }}
            />
          </Chart>
          <Slider
            width={800}
            height={26}
            start={start}
            end={end}
            xAxis="date"
            yAxis="number"
            // scales={{
            //   date: {
            //     type: 'date',
            //     tickCount: 10,
            //     //   mask: "M/DD H:mm"
            //   },
            // }}
            data={data || []}
            backgroundChart={{
              type: 'line',
            }}
            onChange={onSliderChange}
          />
        </Content>
        <Sider>Sider</Sider>
      </Layout>
    </Layout>
  );
};

export default ChinaStatsLine;
