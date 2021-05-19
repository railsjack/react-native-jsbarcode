import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
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
  const [hasError, setHasError] = useState(false);
  const {value, format} = props;

  const displayBarcode = () => {
    if (format === 'CODE128') {
      displayBarcode128();
    }

    if (format === 'EAN13') {
      displayBarcodeEAN13();
    }

    if (format === 'EAN8') {
      displayBarcodeEAN8();
    }
  };

  const displayBarcode128 = () => {
    try {
      const code = BarcodeEncoder.encode(value, format);
      SvgGenerator.setScale(dispData.containerWidth, dispData.containerHeight);
      SvgGenerator.setShowText(false);
      const barsSVG = SvgGenerator.getPathFromCode(code);
      setDispData({...dispData, barsSVG});
    } catch (e) {
      setHasError(true);
    }
  };

  const displayBarcodeEAN13 = () => {
    try {
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
    } catch (e) {
      setHasError(true);
    }
  };

  const displayBarcodeEAN8 = () => {
    try {
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
    } catch (e) {
      setHasError(true);
    }
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
      style={[
        styles.container,
        {
          backgroundColor: props.backgroundColor || 'white'
        }
      ]}
      onLayout={e => {
        setDispData({
          ...dispData,
          containerWidth: e.nativeEvent.layout.width,
          containerHeight: e.nativeEvent.layout.height,
        });
      }}>
      {hasError ? (
        <Text style={[
          styles.errorTextStyle, props.errorTextStyle
        ]}>
          {props.errorText || 'Invalid code'}
          {"\n"}
          {value} (Format: {format})
        </Text>
      ) : (
        <Svg
          style={{
            width: dispData.containerWidth,
            height: dispData.containerHeight,
          }}
          viewBox={`0 0 ${dispData.containerWidth} ${dispData.containerHeight}`}>
          {dispData.barsSVG &&
          dispData.barsSVG.map((barSVG, index) =>
            <Path fill={props.barColor || 'black'} key={String(index)} d={barSVG} />
          )}
          {dispData.textsSVG &&
          dispData.textsSVG.map((textSVG, index) => (
            <SvgText fill={props.barColor || 'black'} key={String(index)} {...textSVG}>{textSVG.text}</SvgText>
          ))}
        </Svg>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTextStyle: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  }
});

export default JSBarcode;
