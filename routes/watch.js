const express = require('express');
const app = express();
const fetch = require("node-fetch");
const router = express.Router();

const { MY_HEAD } = require('../constants');
const { MY_BODY_STYLE } = require('../constants');
const { MY_PREFIX_PATH } = require('../constants');
const { MY_API_PREFIX_PATH } = require('../constants');



router.get('/', (req, res) => {
    const agent = req.headers['user-agent'];
    console.log('agent: ', agent);
    var is_phone = agent.toLowerCase().match(/(iphone|ipod|android)/);
    var is_pc = agent.toLowerCase().match(/(windows|mac|ipad)/);
    console.log('is phone: ', is_phone);
    console.log('is pc: ', is_pc);

    const videoId = req.query.v;
    if (videoId == '') {
        res.send(buildNullHTML());
        return
    }

    // 例子：发起带参数的请求，并解析 JSON 格式的结果
    //const apiUrl = 'http://192.168.43.130:8088/api/request/';
    // const apiUrl = 'http://localhost:3001/times_dust_api/request';
    const apiUrl = 'http://localhost:3001/times_dust_api/video/' + videoId;
    // const params = { video_id: videoId };
    // const params = {};

    // 将参数拼接到URL
    const urlWithParams = new URL(apiUrl);
    // urlWithParams.search = new URLSearchParams(params).toString();

    // 使用 Fetch 发起 GET 请求
    const requestPromise = fetch(urlWithParams)
        .then(response => {
            if (!response.ok) {
                // throw new Error(`HTTP error! Status: ${response.status}`);
                res.send(buildNullHTML());
                // return response;
            }
            return response.json(); // 解析 JSON 格式的响应
        })
        .then(data => {
            console.log('Data:', data);
            //console.log('Data[video_path]:', data['video_path']);
            if (data['video_path'] == '') {
                res.send(buildNullHTML());
            } else {
                res.send(buildVideoHTML(data['title'], data['video_path'], data['width'], data['height']));
            }
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function buildNullHTML() {
    const dynamicNullHTML = MY_HEAD + `
        <body>
            <h1>你所请求的视频不存在</h1>
            <p>Current time: ${new Date().toLocaleString()}</p>
            <br> 
            <br>
            <br>
            <a href="` + MY_PREFIX_PATH + `/">首页</a>
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
            } `
        + MY_BODY_STYLE
        + `
            </style>        
            </html>`;
    return dynamicNullHTML;
}

function buildVideoHTML(title, play_addr, video_width, video_height) {
    console.log('title: ', title)
    console.log('play_addr: ', play_addr)
    console.log('video_width: ', video_width)
    console.log('video_height: ', video_height)
    h1 = `<div  id="watch_head"><h1>` + title + `</h1></div>`

    // <div id="player_div" width="360" height="240"  style="border-radius: 6px;border: 4px solid LightGray;background: AliceBlue">
    videoTag = `
        <video id="id_video_tag" controls preload="none" width="360" height="240" style="border-radius: 10px;" loop disabled="disabled">` // poster="/media/时代微尘logo.png"
    videoTag += `<source id="id_source_tag" type="video/mp4">`
    //videoTag += play_addr
    //videoTag += `" type="video/mp4">`
    videoTag += `Your browser does not support the video tag.
            </video> `
    // </div>
    dynamicWatchHTML = MY_HEAD + `
        <body onload='body_load()'>
            `
        + h1
        // + `<p>${new Date().toLocaleString()}</p><br>`
        + videoTag + `  
            <br> 
            <br>
        </body>
        <style>
            h1 {
                color: black;
                text-align: center;
                font-size: 24px;
            }
            p {
                font-family: "Times New Roman";
                font-size: 12px;
            }
            video {
                text-align: center;
            } `
        + MY_BODY_STYLE
        + ` </style>`
        + ` <script src="` + MY_PREFIX_PATH + `/public/3th_modules/hls_js/dist/hls.js"></script>` 
        + ` <script>

                document.addEventListener('keyup',(e)=>{
                    // console.log('document.addEventListener: ', e);
                    // play_control_key(e);
                })
                document.onkeyup = function(e) {            
                    play_control_key(e);
                }
                window.onresize = function() {
                    set_player_position();
                }
                function body_load() {
                    console.log('body_load');
                    set_play_addr();
                    var player = document.getElementById("id_video_tag");
                    player.removeEventListener('keyup', (e)=>{});
                    player.addEventListener('keyup',(e)=>{ 
                        // e.preventDefault(); // 好像没啥用
                        console.log('player.addEventListener: ', e);
                        if(e["key"] == " ") {
                            // 全局监听和video标签监听都禁用，使用默认监听
                            e.stopPropagation(); // 它可以阻止 document.onkeyup的执行，但反过来不行
                            return;
                        } else if(e["key"] == "m") {
                            //静音应该是默认没有快捷键的，让全局快捷键生效，禁用video标签监听
                            //e.stopPropagation();
                            return;
                        } else if(e["key"] == "ArrowRight") {
                            // 全局监听和video标签监听都禁用，使用默认监听
                            e.stopPropagation();
                            return;
                        } else if(e["key"] == "ArrowLeft") {
                            // 全局监听和video标签监听都禁用，使用默认监听
                            e.stopPropagation();
                            return;
                        } else if(e["keyCode"] >= 48 && e["keyCode"] <= 57) {
                            // 没有默认监听，使用全局监听
                            return;
                        }
                        // 好像没必要了
                        play_control_key(e);
                    })
                    
                    // player.addEventListener("timeupdate", function() { console.log("Current time: " + player.currentTime); });
                    set_player_position();
                    
                }

                function play_control_key(e) {
                    console.log('play_control_key: ' + e["key"] + ', key code: ' + e["keyCode"]);
                    const player = document.getElementById("id_video_tag");
                    if(e["key"] == "f") {
                        if(document.fullscreen){
                            document.exitFullscreen();
                        } else {
                            player.requestFullscreen(); //requestFullscreen
                        }
                    } else if(e["key"] == " ") {
                        console.log('paused: ' + player.paused);
                        if (player.paused) {
                            player.play();
                        } else {
                            player.pause();
                        }
                    } else if(e["keyCode"] >= 48 && e["keyCode"] <= 57) {
                        if(player.duration > 0)
                            player.currentTime = player.duration * (e["keyCode"] - 48) / 10;
                    } else if(e["key"] == "m") {
                        if (player.muted) {
                            player.muted = 0;
                        } else {
                            player.muted = 1;
                        }
                    } else if(e["key"] == "ArrowRight") {
                        if(player.duration > 0) {
                            var t = player.currentTime + 15; // video标签默认就是15s，保持一致
                            player.currentTime = t > player.duration ? player.currentTime : t;
                        }   
                    } else if(e["key"] == "ArrowLeft") {
                        if(player.duration > 0) {
                            var t = player.currentTime - 15;
                            player.currentTime = t < 0 ? 0 : t;
                        }
                    }

                }

                function set_player_position() {

                    console.log('screen width: ', screen.width) //3440
                    console.log('screen height: ', screen.height) //1440
                    console.log('screen availWidth: ', screen.availWidth) //3440
                    console.log('screen availHeight: ', screen.availHeight) //1392
                    console.log('window innerWidth: ', window.innerWidth) //3440
                    console.log('window innerHeight: ', window.innerHeight) //1271

                    var display_width_max = 0;
                    var display_height_max = 0;
                    /* if (screen.width > screen.height)  // 横屏，则把绘制最大宽度限定为屏幕高度
                    {
                        display_width_max = screen.height;
                        
                    } else { // 是竖屏，则把绘制宽度设为最大
                        display_width_max = screen.width;
                    }
                    display_height_max = screen.height * 2 / 3; */
                    if (window.innerWidth > window.innerHeight)  // 横屏，则把绘制最大宽度限定为屏幕高度
                    {
                        display_width_max = window.innerHeight;

                    } else { // 是竖屏，则把绘制宽度设为最大
                        display_width_max = window.innerWidth;
                    }
                    display_height_max = window.innerHeight * 2 / 3;

                    // watch_head
                    const el_watch_head = document.getElementById("watch_head")
                    el_watch_head.width = display_width_max * 90 / 100; // 设了也没用, 在手机chrome上h1太长, 第二行还是在右边超出去一点点

                    const el_player_div = document.getElementById("player_div")
                    //el_player_div.width = display_width_max;
                    //el_player_div.height = display_width_max * 9 / 16;
                    // player
                    const el_player = document.getElementById("id_video_tag")
                    // 最佳播放器宽度（针对竖屏）。必须要缩减一点，再宽左右白边就不对称了，右边就会超出。再窄就不好看了。没法做到刚好充满屏幕宽度。😒 这是为什么？
                    var player_best_max_width = display_width_max * 95 / 100; 
                    var vw = get_video_width();
                    var vh = get_video_height();

                    if (vw / vh >= player_best_max_width / display_height_max) { // 上下留白边
                        el_player.width = player_best_max_width;
                        el_player.height = el_player.width * vh / vw;
                    } else { // 左右留白边
                        el_player.height = display_height_max;
                        // el_player.width = el_player.height * vw / vh;
                        el_player.width = player_best_max_width; // 还是不留白边，保持控件足够大
                    }

                    //el_player.width = player_best_max_width;
                    //el_player.height = player_best_max_width * 9 / 16;
                }

                function set_play_addr() {
                    const player = document.getElementById("id_video_tag");
                    const source = document.getElementById("id_source_tag");
                    var addr = get_play_addr();
                    console.log('addr: ' + addr);
                    if(addr.substring(addr.length - 3) == 'mp4') {
                        console.log('It is mp4.');
                        player.src = addr;
                        console.log('source.src: ' + source.src);
                        //type="video/mp4"
                        player.type = 'video/mp4';
                    } else if(addr.substring(addr.length - 4) == 'm3u8') {
                        if (Hls.isSupported()) {
                            var hls = new Hls();
                            hls.loadSource(addr);
                            hls.attachMedia(player);
                        }
                    }
                }
        `
        + ` function get_video_width() { return ` + video_width.toString() + `; }`
        + ` function get_video_height() { return ` + video_height.toString() + `; }`
        + ` function get_play_addr() { return '` + play_addr.toString() + `'; }`;
    const func_slice_path = `
            function front_end_path(path) {
                if ("` + MY_PREFIX_PATH + `" == "" && path == "")
                    return "/";
                else
                    return "` + MY_PREFIX_PATH + `" + path;
            };
            function back_end_path(path) {
                return "` + MY_API_PREFIX_PATH + `" + path;
            };
    `;

    dynamicWatchHTML += func_slice_path;


    dynamicWatchHTML += ` </script>
        </html>`;
        
    return dynamicWatchHTML;
}



module.exports = router;