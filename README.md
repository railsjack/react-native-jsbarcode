# react-native-jsbarcode

React Native component to generate barcodes. Uses [JsBarcode](https://github.com/lindell/JsBarcode) for encoding of data.

## Getting started

#### Step 1

Install `react-native-jsbarcode`:

    npm install react-native-jsbarcode --save


#### Step 2

Start using the component

```javascript
import Barcode from 'react-native-jsbarcode';

<JSBarcode value="Hello World" format="CODE128" />
```

You can find more info about the supported barcodes in the [JsBarcode README](https://github.com/lindell/JsBarcode#supported-barcodes).
