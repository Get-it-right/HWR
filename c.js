const http = require("http");
const server = http.createServer();
const formidable = require("formidable");
const path = require("path");
const fs = require('fs');
server.on("request",(req,res)=>{
    if(req.method=="POST"){
        var form = new formidable.IncomingForm();//接收新文件
        form.multiples = true;//带着就是
        form.uploadDir =path.join(__dirname,"upload");//添加到upload文件夹              
        form.parse(req,function(err,fields,files){    
            let bitmap = fs.readFileSync(files.a.path);
            let base64str = Buffer.from(bitmap, 'binary').toString('base64'); // base64编码
            let stringbase64=base64str+"";
            const tencentcloud = require("tencentcloud-sdk-nodejs");
            const OcrClient = tencentcloud.ocr.v20181119.Client;
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
                    res.writeHead(200, {
                        'content-type': 'text/html;charset=utf8'
                    });
                    res.end(data.TextDetections[0].DetectedText);
                },
                (err) => {
                    console.error("error", err);
                }
            );
        });
    }
})
server.listen(4000,()=>{
    console.log("Server is running...");
})