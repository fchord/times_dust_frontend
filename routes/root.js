const express = require('express');
const app = express();
const fetch = require("node-fetch");
const path = require('path');
const router = express.Router();

const { MY_HEAD } = require('../constants');
const { MY_BODY_STYLE } = require('../constants');
const { MY_PREFIX_PATH } = require('../constants');


const alias_reg = require('module-alias/register');


// 路由处理，当访问根路径时返回一个动态生成的HTML页面
router.get('/', (req, res) => {
    console.log(path.join(__dirname, 'times_dust/public'))
    // 动态生成一个简单的HTML页面
    const dynamicHTML = MY_HEAD + `
        <body>
            <div class="header">
                <h1>时代微尘</h1>
            </div>
            <div class="topnav">
                <a href="#">链接</a>
                <a href="#">链接</a>
                <a href="#">链接</a>
            </div>
            <p>Current time: ${new Date().toLocaleString()}</p>
            <video controls width="380" loop>
                <!--  http://192.168.43.130:8088/media/gufeng.mp4  -->
                <source src="/media/gufeng.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>   
            <br> 
            <br>         
            <a href="` + MY_PREFIX_PATH + `/subpage">一个子页</a>
            <br> 
            <br>         
            <a href="` + MY_PREFIX_PATH + `/upload">添加视频文件</a>
            <br>
            <br>         
            <a href="` + MY_PREFIX_PATH + `/add_live">添加直播视频</a>
            <br>            
            <br> 
            <a href="` + MY_PREFIX_PATH + `/watch">测试watch</a>    
            <br>
            <br> 
            <a href="` + MY_PREFIX_PATH + `/all">全部视频</a>                           
        </body>
        <style>
            /* 头部样式 */
            .header {
                background-color: #f1f1f1;
                padding: 20px;
                text-align: center;
                width: device-width;
            }        
            h1 {
                color: black;
                text-align: center;
            }
            /* 导航条 */
            .topnav {
                overflow: hidden;
                background-color: #333;
            }  
            /* 导航链接 */
            .topnav a {
                float: left;
                display: block;
                color: #f2f2f2;
                text-align: center;
                padding: 14px 16px;
                text-decoration: none;
            }
            /* 链接 - 修改颜色 */
            .topnav a:hover {
                background-color: #ddd;
                color: black;
            }

            p {
                font-family: "Times New Roman";
                font-size: 20px;
            }
            video {
                text-align: center;
            } `
        + MY_BODY_STYLE
        + `
            </style>        
            </html>`
        ;

    // 将生成的HTML发送到客户端
    res.send(dynamicHTML);
});


module.exports = router;
