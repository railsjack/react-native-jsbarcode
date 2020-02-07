import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Path, Text as SvgText} from 'react-native-svg';
import BarcodeEncoder from './BarcodeEncoder';
import SvgGenerator from './SvgGenerator';

const initialState = {
  containerWidth: 0,
  containerHeight: 0,
  barsSVG: [],
  textsSVG: [],
};

const JSBarcode = props => {
  const [dispData, setDispData] = useState(initialState);
  const {value, format} = props;

  const displayBarcode = () => {
    if (format === 'CODE128') {
      displayBarcode128();
    }

    if (format === 'EAN13') {
      displayBarcodeEAN13();
    }
  };

  const displayBarcode128 = () => {
    const code = BarcodeEncoder.encode(value, format);
    SvgGenerator.setScale(dispData.containerWidth, dispData.containerHeight);
    const barsSVG = SvgGenerator.getPathFromCode(code);
    setDispData({...dispData, barsSVG});
  };

  const displayBarcodeEAN13 = () => {
    const codesArray = BarcodeEncoder.encode(value, format);
    SvgGenerator.setScale(
      dispData.containerWidth,
      dispData.containerHeight,
      5,
    );
    SvgGenerator.setShowText(true);
    const barsSVG = SvgGenerator.getPathFromCodesArray(codesArray);
    const textsSVG = SvgGenerator.getTextFromCodesArray(codesArray, value[0]);
    setDispData({...dispData, barsSVG, textsSVG});
  };

  const componentDidMount = () => {
    if (dispData.containerWidth > 0) {
      // start here...
      displayBarcode();
    }
    const componentWillUnmount = () => {};
    return componentWillUnmount;
  };
  useEffect(componentDidMount, [dispData.containerWidth]);

  return (
    <View
      style={styles.container}
      onLayout={e => {
        setDispData({
          ...dispData,
          containerWidth: e.nativeEvent.layout.width,
          containerHeight: e.nativeEvent.layout.height,
        });
      }}>
      <Svg
        style={{
          width: dispData.containerWidth,
          height: dispData.containerHeight,
        }}
        viewBox={`0 0 ${dispData.containerWidth} ${dispData.containerHeight}`}>
        {dispData.barsSVG &&
          dispData.barsSVG.map(barSVG => <Path d={barSVG} />)}
        {dispData.textsSVG &&
          dispData.textsSVG.map(textSVG => (
            <SvgText {...textSVG}>{textSVG.text}</SvgText>
          ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default JSBarcode;
