var a=document.getElementByIdx("myfile1").files[0];
const tencentcloud = require("tencentcloud-sdk-nodejs");
const OcrClient = tencentcloud.ocr.v20181119.Client;
const fs = require('fs');
let bitmap = fs.readFileSync(a);
let base64str = Buffer.from(bitmap, 'binary').toString('base64'); // base64编码
let stringbase64=base64str+"";
const clientConfig = {
  credential: {
    secretId: "AKIDe6IEtJRIsCF0VkiPpxpQkna6KHyOXOyI",
    secretKey: "4rNcaHH1TeZCYdRyECtJTLwGJ5aolRqx",
  },
  region: "ap-guangzhou",
  profile: {
    httpProfile: {
      endpoint: "ocr.tencentcloudapi.com",
    },
  },
};

const client = new OcrClient(clientConfig);
const params = {
  "ImageBase64":stringbase64,
};
client.GeneralHandwritingOCR(params).then(
  (data) => {
    console.log("test.txt",data.TextDetections[0].DetectedText);
  },
  (err) => {
    console.error("error", err);
  }
);