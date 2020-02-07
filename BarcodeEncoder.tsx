import barcodes from 'jsbarcode/src/barcodes';

class BarcodeEncoder {
  constructor() {}

  // encode() handles the Encoder call and builds the binary string to be rendered
  encode(text, format, options = {}) {
    const Encoder = barcodes[format];
    // If text is not a non-empty string, throw error.
    if (typeof text !== 'string' || text.length === 0) {
      throw new Error('Barcode value must be a non-empty string');
    }

    let encoder;

    try {
      encoder = new Encoder(text, options);
    } catch (error) {
      throw new Error('Invalid barcode format.');
    }

    // If the input is not valid for the encoder, throw error.
    if (!encoder.valid()) {
      throw new Error('Invalid barcode for selected format.');
    }

    // Make a request for the binary data (and other infromation) that should be rendered
    // encoded stucture is {
    //  text: 'xxxxx',
    //  data: '110100100001....'
    // }
    let encoded = encoder.encode();

    return encoded;
  }
}

export default new BarcodeEncoder();
