const express = require('express');
const app = express();
const fetch = require("node-fetch");
const router = express.Router();

const { MY_HEAD } = require('../constants');
const { MY_BODY_STYLE } = require('../constants');
const { MY_PREFIX_PATH } = require('../constants');
const { MY_API_PREFIX_PATH } = require('../constants');


router.get('/', (req, res) => {
    const apiUrl = 'http://localhost:3001' + MY_API_PREFIX_PATH + '/video';
    const urlWithParams = new URL(apiUrl);
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
            //console.log('Data:', data);
            //console.log('Data[video_path]:', data['video_path']);
            if (data['result'] == '') {
                res.send(buildNullHTML());
            } else {
                var results = data['result']
                res.send(buildMultiVideoLinkHTML(data));
            }
            return data;
        })
        .catch(error => {
            console.error('Error:', error.toString());
        });
});


function buildMultiVideoLinkHTML(data) {
    var results = data['result']

    h1 = `<h1>` + `全部视频` + `</h1>`

    dynamicWatchHTML = MY_HEAD + `
        <body  onload='queryServer()'>
            `
        + h1
        + `<p>${new Date().toLocaleString()}</p>`

    i = 0

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
            }
            table{
                border: 1px solid;
                margin: auto;
                width: max-width;
            }
            td,th{
                text-align: center;
                border: 1px solid;
            }`
        + MY_BODY_STYLE
        + `
            </style>        
            </html>`;

    dynamicWatchHTML += `
            <table id="id_videos_table">
                <!-- 表格标题 -->
                <caption>动态视频列表</caption>
                <!-- 表格第一行：表格表头 -->
                <tr>
                    <th>index</th>
                    <th>video_id</th>
                    <th>title</th>
                    <th>link</th>
                    <th>net_path_name</th>
                    <th>category</th>
                    <th>操作</th>
                </tr>
            </table>`

    dynamicWatchHTML += `
        <script>
            
            // 删除方法
            function deleteThisVideo(object, vid) {
                console.log('deleteThisVideo. vid: ', vid);
                const videoId = '';

                // 获取table节点
                var table = object.parentNode.parentNode.parentNode;
                console.log('table rows: ', table.rows.length);
                // 获取所有的表头单元格
                /* const thCells = table.querySelectorAll('th');
                for (let i = 0; i < thCells.length; i++) {
                    console.log('Table head: ', thCells[i]);
                } */
                //var row = object.parentNode.parentNode;
                //console.log('row typeof: ', typeof row)
                // 获取行中的所有单元格
                //const rowCells = row.rowCells;
                //console.log('rowCells typeof: ', typeof rowCells)

                // 遍历每个单元格
                /* for (let i = 0; i < rowCells.length; i++) {
                    // 获取表头的内容
                    const thContent = thCells[i].textContent;
                    // 获取单元格的内容
                    const cellContent = rowCells[i].textContent;                    
                    // 输出单元格内容和数据类型
                    console.log('Table head: %s. Row content: %s.', thContent, cellContent);
                    if (thContent == 'video_id'){
                        videoId = cellContent;
                    }
                } */

                
                // const http_body = 'video_id=' + vid;
                const http_body = '';
                // 发起 POST 请求
                fetch(back_end_path('/video/' + vid), {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    body: http_body,
                })
                .then(response => {
                    console.log('response:', response)
                    if (!response.ok) {
                        // throw new Error(\`HTTP error! Status: \${ response.status }\`);
                        var err_msg = 'Delete video: ' + vid  + '\\n' +
                            'HTTP response status: ' + response.status + ' ' + response.statusText
                        alert(err_msg);
                    } else {
                        // 获取te节点
                        var tr = object.parentNode.parentNode;
                        // 删除（并返回）当前节点的指定子节点。
                        table.removeChild(tr);
                    }
                    return response.text(); // 解析文本结果
                })
                .then(result => {
                    console.log('result:', result)
                })
                .catch(error => {
                    console.error('Error:', error.toString());
                });

            };


            function queryServer() {
                // 发起 POST 请求
                fetch(back_end_path('/video'), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        },
                })
                .then(response => {
                    console.log('response:', response)
                    return response.text(); // 解析文本结果
                })
                .then(data => {
                    //console.log('data:', data)
                    //console.log('data type: ', typeof data)
                    var results = JSON.parse(data)['result']
                    //console.log('results:', results)

                    for (let i = 0; i < results.length; i++) {

                        //3.创建单元格，赋值单元格的标签体
                        // index 的 单元格
                        var td_index = document.createElement("td");              // 创建单元格
                        var text_index = document.createTextNode(i);             // 赋值给单元格的标签体
                        td_index.appendChild(text_index);
                        // video_id 的 单元格
                        var td_video_id = document.createElement("td");
                        var text_video_id = document.createTextNode(results[i]['video_id']);
                        td_video_id.appendChild(text_video_id);
                        //title 的 单元格
                        var td_title = document.createElement("td");
                        var text_title = document.createTextNode(results[i]['title']);
                        td_title.appendChild(text_title);
                        // a标签Link的单元格
                        var td_a = document.createElement("td");
                        var ele_a = document.createElement("a");
                        ele_a.setAttribute("href", front_end_path("/watch?v=" + results[i]['video_id']));
                        // ele_a.setAttribute("onclick","deleteThisVideo(this, \'" + results[i]['video_id'] + "\');");
                        var text_a = document.createTextNode("播放");
                        ele_a.appendChild(text_a);                         // 为a标签写入文本内容："链接"
                        td_a.appendChild(ele_a);                           // 为td标签添加子标签（a标签）
                        //net_path_name 的 单元格
                        var td_net_path_name = document.createElement("td");
                        var text_net_path_name = document.createTextNode(results[i]['net_path_name']);
                        td_net_path_name.appendChild(text_net_path_name);
                        //category 的 单元格
                        var td_category = document.createElement("td");
                        var text_category = document.createTextNode(results[i]['category']);
                        td_category.appendChild(text_category);
                        // a标签删除操作的单元格
                        var td_a_del = document.createElement("td");
                        var ele_a_del = document.createElement("a");
                        ele_a_del.setAttribute("href","javascript:void(0);");
                        console.log('results[i][video_id] type: ', typeof results[i]['video_id']);
                        ele_a_del.setAttribute("onclick","deleteThisVideo(this, \'" + results[i]['video_id'] + "\');");
                        var text_a_del = document.createTextNode("删除");
                        ele_a_del.appendChild(text_a_del);                         // 为a标签写入文本内容："删除"
                        td_a_del.appendChild(ele_a_del);                           // 为td标签添加子标签（a标签）

                        // 4.创建表格行
                        var tr = document.createElement("tr");
                        // 5.添加单元格到表格行中
                        tr.appendChild(td_index);
                        tr.appendChild(td_video_id);
                        tr.appendChild(td_title);
                        tr.appendChild(td_a);
                        tr.appendChild(td_net_path_name);
                        tr.appendChild(td_category);
                        tr.appendChild(td_a_del);
                        // 6.获取table
                        var table = document.getElementById("id_videos_table");
                        table.appendChild(tr);

                    }


                })
                .catch(error => {
                    console.error('Error:', error.toString());
                });

                // data['result']
            }
            
        `;

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


        </script>
    `

    dynamicWatchHTML += func_slice_path;





    return dynamicWatchHTML;
}



module.exports = router;