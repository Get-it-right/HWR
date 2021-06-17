const http = require("http");
const server = http.createServer();
const formidable = require("formidable");
const path = require("path");
const fs = require('fs');
server.on("request",(req,res)=>{
    if(req.method=="POST"){
        var form = new formidable.IncomingForm();//接收新文件
        form.multiples = true;//带着就是
        form.uploadDir =path.join(__dirname,"upload");//__dirname全局变量,表示网站根目录。添加到upload文件夹      
        form.parse(req,function(err,fields,files){ 
            let bitmap = fs.readFileSync(files.a.path,function (err) {
                if (err) throw err;
            });
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
                    fs.writeFile("a.txt","腾讯云识别结果：",function (err) {
                        if (err) throw err;
                    });
                    i=0;
                    while(i<data.TextDetections.length){
                        fs.appendFile("a.txt",data.TextDetections[i].DetectedText,function (err) {
                            if (err) throw err;
                    });
                        i=i+1;
                    }
                },
                (err) => {
                    console.error("error", err);
                }
            );
            var AipOcrClient = require("baidu-aip-sdk").ocr;
            var APP_ID = "24315977";
            var API_KEY = "fkGSfQ0DPkq3fcDnqOGAfufK";
            var SECRET_KEY = "wi6qyUzhytDrusdFbTa14s3lhaxIlLEj";
            var client2 = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);
            client2.generalBasic(stringbase64).then(
                (result) => {
                fs.writeFile("b.txt","百度云识别结果：",function (err) {
                        if (err) throw err;
                    });
                i=0;
                while(i<result.words_result.length){
                    fs.appendFile("b.txt",result.words_result[i].words,function (err) {
                        if (err) throw err;
                    });
                    i=i+1;
                }
                res.end(" ");
                },
                (err) => {
                    res.end(err);
                }
            );
        });
    }
});
server.listen(15833,"10.0.4.2",()=>{
    console.log("Server is running...");
});