const _ = val => Math.round(val * 100) / 100;

class SvgGenerator {
  width: number = 0;
  height: number = 0;
  onePixel: number = 1;
  showText: boolean = false;
  leftSpacing: number = 0;

  constructor() {}

  setShowText(showText) {
    this.showText = showText;
  }

  setScale(width, height, leftSpacing = 0) {
    this.width = width - leftSpacing * (width / 90);
    this.height = height;
    this.leftSpacing = leftSpacing;
  }

  setOnePixel(dataLength) {
    this.onePixel = _(this.width / dataLength);
  }

  getPathFromCodesArray(codesArray) {
    let bars = [];
    let offset = 0;
    let dataLength = 0;
    codesArray.map(code => (dataLength += code.data.length));
    this.setOnePixel(dataLength);
    codesArray.map(code => {
      bars = bars.concat(this.drawBars(code.data, offset));
      offset += code.data.length;
    });
    return bars;
  }

  getTextFromCodesArray(codesArray, firstChar = '') {
    let texts = [];
    let offset = 0;
    codesArray.map(code => {
      texts[texts.length] = this.drawTexts(code, offset);
      offset += code.data.length;
    });
    firstChar &&
      (texts[texts.length] = this.drawTexts(
        {data: '   ', text: firstChar, firstChar: true},
        0,
      ));
    return texts;
  }

  getPathFromCode(code) {
    this.setOnePixel(code.data.length);
    const bars = this.drawBars(code.data);
    return bars;
  }

  drawBars(data, offset = 0) {
    const rects = [];
    const nLen = data.length;
    let b,
      barWidth = 0,
      pos = 0;
    const height =
      this.showText && nLen > 5
        ? this.height - 10 * (this.width / 100)
        : this.height;
    
    for (let i = 0; i < nLen; i++, pos = i) {
      b = data[i];
      if (b === '1') {
        barWidth++;
      } else if (barWidth > 0) {
        rects[rects.length] = this.drawRect(
          offset + i - barWidth,
          barWidth,
          height,
        );
        barWidth = 0;
      }
    }

    if (barWidth > 0) {
      rects[rects.length] = this.drawRect(
        offset + pos - barWidth,
        barWidth,
        height,
      );
    }
    return rects;
  }

  drawRect(x, width, height) {
    const onePixel = this.onePixel;
    const x2 = this.leftSpacing + x;
    return `m ${_(x2 * onePixel)} 0 l 0 ${_(height)} l ${_(
      width * onePixel,
    )} 0 l 0 -${_(height)} z`;
  }

  drawTexts(code, offset = 0) {
    const data = code.data;
    const x =
      (code.firstChar ? 0 : this.leftSpacing) +
      _((offset + data.length / 2) * this.onePixel);
    const y = _(this.height - 1);
    const fontSize = this.onePixel * 8;
    const textAnchor = 'middle';
    const text = code.text;
    return {
      x,
      y,
      fontSize,
      textAnchor,
      text,
    };
  }
}

export default new SvgGenerator();
