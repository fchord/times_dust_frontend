const express = require('express');
const app = express();
const fetch = require("node-fetch");
const router = express.Router();

const { MY_HEAD } = require('../constants');
const { MY_BODY_STYLE } = require('../constants');

router.get('/', (req, res) => {
    const dynamicUploadHTML = MY_HEAD + `
        <body>
            <h1>添加直播视频</h1>
            <!--form action="http://192.168.43.130:8080/upload" method="post" enctype="multipart/form-data"-->
            <form action="/api/add_live" method="post" enctype="multipart/form-data" id="addLiveForm">

                <label for="title">标题:</label>
                <br>
                <textarea name="title" id="title" rows="1" cols="50" autofocus
                    placeholder="我的标题..."></textarea>
                <br>
                <br>

                <label for="description">描述:</label>
                <br>
                <textarea name="description" id="description" rows="4" cols="50"
                    placeholder="我的描述..."></textarea>
                <br>
                <br>

                <label for="src_url">源链接:</label>
                <br>
                <textarea name="src_url" id="src_url" rows="4" cols="50"
                    placeholder=""></textarea>
                <br>
                <br>

                <label for="label">标签:</label>
                <br>
                <textarea name="label1" id="label1" rows="1" cols="20" maxlength="10"
                    placeholder="标签1"></textarea>
                <textarea name="label2" id="label2" rows="1" cols="20" maxlength="10"
                    placeholder="标签2"></textarea>
                <br>
                <textarea name="label3" id="label3" rows="1" cols="20" maxlength="10"
                    placeholder="标签3"></textarea>
                <textarea name="label4" id="label4" rows="1" cols="20" maxlength="10"
                    placeholder="标签4"></textarea>
                <br>
                <textarea name="label5" id="label5" rows="1" cols="20" maxlength="10"
                    placeholder="标签5"></textarea>
                <textarea name="label6" id="label6" rows="1" cols="20" maxlength="10"
                    placeholder="标签6"></textarea>
                <br>
                <br>

                <label for="category">分类:</label>
                <br>
                <select id="category" name="category">
                    <option value="时政">时政</option>
                    <option value="经济">经济</option>
                    <option value="军事">军事</option>
                    <option value="生活">生活</option>
                    <option value="娱乐">娱乐</option>
                    <option value="美女">美女</option>
                    <option value="动物">动物</option>
                    <option value="历史">历史</option>
                    <option value="音乐">音乐</option>
                    <option value="科技">科技</option>
                    <option value="成人">成人</option>
                </select>
                <br>
                <br>

                <label for="political_sensitivity">时政敏感度:</label>
                <br>
                <select id="political_sensitivity" name="political_sensitivity">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <br>
                <br>

                <label for="erotic_sensitivity">儿童敏感度:</label>
                <br>
                <select id="erotic_sensitivity" name="erotic_sensitivity">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <br>
                <br>

                <input width="50" type="submit" value="增加">
                <br>
                <br>
                <br>
                <a href="/">首页</a>
            </form>
            <!-- 显示上传结果的区域 -->
            <div id="resultContainer"></div>
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
            }
        `
        + MY_BODY_STYLE
        + `
        </style>

        <script>
        document.addEventListener('DOMContentLoaded', function () {
            console.log('addEventListener')
            // 获取表单和结果容器
            const addLiveForm = document.getElementById('addLiveForm');
            const resultContainer = document.getElementById('resultContainer');

            // 添加表单提交事件监听器
            addLiveForm.addEventListener('submit', function (event) {
                console.log('submit')
                event.preventDefault(); // 阻止默认表单提交行为

                // 创建 FormData 对象
                const formData = new FormData(addLiveForm);

                // 发起 POST 请求
                fetch('/api/add_live', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    console.log('response:', response)
                    if (!response.ok) {
                        throw new Error(\`HTTP error! Status: \${ response.status }\`);
                    }
                    return response.text(); // 解析文本结果
                })
                .then(result => {
                    console.log('result:', result)
                    // 在结果容器中显示上传结果
                    resultContainer.textContent = result;

                    // 在这里处理结果，比如解析结果并跳转到自定义链接
                    const parsedResult = JSON.parse(result);                    
                    video_id = parsedResult['video_id'];
                    
                    redirectUrl = '/watch?v=' + video_id;
                    console.log('redirectUrl: ', redirectUrl);
                    window.location.href = redirectUrl; // 假设结果中有一个 redirectUrl 字段
                })
                .catch(error => {
                    console.error('Error:', error);
                    resultContainer.textContent = '上传失败';
                });
            });
        });
        </script>


        </html>
    `;
    res.send(dynamicUploadHTML);
});



module.exports = router;