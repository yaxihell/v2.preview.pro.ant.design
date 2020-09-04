/* eslint-disable react/react-in-jsx-scope */
import { Icon } from 'antd';
import { imgMaps } from './util';

const CustomIcon = ({ imgStyle, imgType }) => {
  const imgSrc = imgMaps[imgType];
  return (
    <Icon
      component={() => (
        <img style={{ width: '1em', height: '1em', ...imgStyle }} src={imgSrc} alt="icon" />
      )}
    />
  );
};

export default CustomIcon;
