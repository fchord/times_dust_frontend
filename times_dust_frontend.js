
// 引入Express框架
const express = require('express');
const app = express();
const port = 3000;
const fetch = require("node-fetch");
const path = require('path');

const alias_reg = require('module-alias/register');
const { MY_PREFIX_PATH } = require('./constants');


const route_root = require('./routes/root.js');
const route_upload = require('./routes/upload.js');
const route_add_live = require('./routes/add_live.js');
const route_watch = require('./routes/watch.js');
const route_all = require('./routes/all.js');
const route_test_hls = require('./routes/hls_player.js');

app.use(MY_PREFIX_PATH + '/', route_root);
app.use(MY_PREFIX_PATH + '/upload', route_upload);
app.use(MY_PREFIX_PATH + '/add_live', route_add_live);
app.use(MY_PREFIX_PATH + '/watch', route_watch);
app.use(MY_PREFIX_PATH + '/all', route_all);
app.use(MY_PREFIX_PATH + '/hls_player', route_test_hls);

// 设置静态文件目录，前端需要的文件从这里找
//app.use(express.static(path.join(__dirname, 'public')), 'times_dust/public');
// 给静态文件设置一个虚拟前缀
app.use(MY_PREFIX_PATH + '/public', express.static('public'))

const { MY_HEAD } = require('./constants');
const { MY_BODY_STYLE } = require('./constants');

// 子页路由
app.get(MY_PREFIX_PATH + '/subpage', (req, res) => {
    // 动态生成一个简单的HTML页面
    const dynamicSubHTML = MY_HEAD + `
        <body>
            <h1>Subpage!</h1>
            <p>Current time: ${new Date().toLocaleString()}</p>
            <video controls width=device-width loop autoplay>
                <source src="/media/mp4/uncategorized/2023-11-20_13-29-55_444423135/a.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>   
            <br>
            <br> 
            <a href="/">首页</a>    
        </body>
        <style>
            h1 {
                color: black;
                text-align: center;
            }
            p {
                font-family: "Times New Roman";
                font-size: 20px;
            }
            video {
                text-align: center;
                object-fit: fill;
            }
            `
        + MY_BODY_STYLE 
        + `
        </style>
        <script>
            var video = document.getElementsByTagName('video')[0];
            video.requestFullscreen();
        </script>
        </html>
        `;    
    res.send(dynamicSubHTML);
});


// 使用 Fetch API 发起带参数的 HTTP 请求
function fetchDataWithParameters(url, params) {
    // 将参数拼接到URL
    const urlWithParams = new URL(url);
    //urlWithParams.search = new URLSearchParams(params).toString();
    

    // 使用 Fetch 发起 GET 请求
    const requestPromise = fetch(urlWithParams)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // 解析 JSON 格式的响应
        })
        .then(data => {
            console.log('Data:', data);
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
  
    // 使用 await 等待 Promise 结束，并获取结果
    /* try {
        const result = await requestPromise;
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error; // 可以选择抛出错误或以其他方式处理
    } */
};

async function waitFetch(url, params) {
    return await fetchDataWithParameters(url, params)
}


function buildMultiVideoHTML(data) {
    
    var results = data['result']

    h1 = `<h1>` + `全部视频` + `</h1>`

    dynamicWatchHTML = MY_HEAD + `
        <body>
            `
        + h1
        + `<p>${new Date().toLocaleString()}</p>`

    i = 0
    for (; i < results.length; i++) {
        videoTag = `<video controls width="380" height="260" poster="/media/时代微尘logo.png" loop>`
        videoTag += `<source src="`
        videoTag += results[i]['play_addr']
        videoTag += `" type="video/mp4">`
        videoTag += `Your browser does not support the video tag.
            </video> `
        videoTag += `<br><br>`
        dynamicWatchHTML += videoTag
    }

    dynamicWatchHTML += `  
            <br> 
            <br>
        </body>
        <style>
            h1 {
                color: black;
                text-align: center;
                font-size: 20px;
            }
            p {
                font-family: "Times New Roman";
                font-size: 12px;
            }
            video {
                text-align: center;
            } `
        + MY_BODY_STYLE
        + `
            </style>        
            </html>`;
    return dynamicWatchHTML;      
}



// 监听端口
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
