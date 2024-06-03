const express = require('express');
const app = express();
const fetch = require("node-fetch");
const router = express.Router();

const { MY_HEAD } = require('../constants');
const { MY_BODY_STYLE } = require('../constants');
const { MY_PREFIX_PATH } = require('../constants');
const { MY_API_PREFIX_PATH } = require('../constants');


// 路由处理，当访问根路径时返回一个动态生成的HTML页面
router.get('/', (req, res) => {
    // 动态生成一个简单的HTML页面
    const dynamicSubHTML = MY_HEAD + `
        <body>
            <h1>陈一发儿 Live</h1>
            <p>${new Date().toLocaleString()}</p>  
            <br>
            <br> 
           
        </body>
        <style>
            h1 {
                color: black;
                text-align: center;
            }
            p {
                font-family: "Times New Roman";
                font-size: 12px;
            }
            video {
                text-align: center;
                object-fit: fill;
            }
            `
        + MY_BODY_STYLE
        + `
        </style>
        <script src="` + MY_PREFIX_PATH + `/public/3th_modules/hls_js/dist/hls.js">
        </script>
        <div>
            <video id="id_video_tag" controls width="360" height="202" object-fit:none loop autoplay style="border-radius: 15px;border: 2px solid LightGray;">
            </video>
        </div>
        <script>
            var video = document.getElementById('id_video_tag');
            var videoSrc = '/media/mp4/uncategorized/2024-05-11_19-58-43_834229526/c3f1eecdfe.mp4';
            if (Hls.isSupported()) {
                var hls = new Hls();
                hls.loadSource(videoSrc);
                hls.attachMedia(video);
            }
            else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = videoSrc;
            }
        </script>
        </html>
        `;
    res.send(dynamicSubHTML);

    // <script src="https://cdn.jsdelivr.net/npm/hls.js@1"></script>
    // /data/media/hls/live/a.m3u8
    // http://192.168.43.130:8088/media/hls/live/a.m3u8
    // '/media/hls/gufeng/gufeng.m3u8'
});


module.exports = router;
