const express = require('express');
const app = express();
const fetch = require("node-fetch");
const router = express.Router();

const { MY_HEAD } = require('../constants');
const { MY_BODY_STYLE } = require('../constants');
const { MY_PREFIX_PATH } = require('../constants');
const { MY_API_PREFIX_PATH } = require('../constants');

router.get('/', (req, res) => {
    var dynamicUploadHTML = MY_HEAD + `
        <body onload='body_load()'>
            <h1>添加视频文件</h1>
            <!--form action="http://192.168.43.130:8080/upload" method="post" enctype="multipart/form-data"-->
            <form action=back_end_path("/upload") method="post" enctype="multipart/form-data" id="uploadForm">

                <div style="border-radius: 10px;border: 1px solid LightGray;width: 400px;margin: auto;">
                    <!-- 下拉列表 -->
                    <br>
                    <label for="add_method" required>添加方式:</label>
                    <select id="add_method_selector" name="add_method" onclick="method_ctl(this)">
                        <option value="local" selected>上传本地视频</option>
                        <option value="server">添加服务器本地视频</option>
                        <option value="network">下载网络视频</option>
                    </select>
                    <br>

                    <label id="lb_local_file" for="file" style="display:none">本地视频文件:</label>
                    <input id="ip_local_file" type="file" name="file" accept="video/mp4,video/x-matroska,video/matroska" style="display:active" required>
                    <label id="lb_server_file" for="file" style="display:none">服务器视频文件路径:</label>
                    <label id="lb_network_file" for="file" style="display:none">网络视频文件地址:</label>
                    <textarea id="ta_server_file" name="server_path" rows="6" cols="50" style="display:none;resize:none" placeholder="/data/media/foobar.mp4" required></textarea>
                    <textarea id="ta_network_file" name="network_url" rows="6" cols="50" style="display:none;resize:none" placeholder="https://www.foobar.com/foobar.mp4"></textarea>
                    <br>
                    <br>
                </div>

                <br>
                <br>

                <div style="border-radius: 10px;border: 1px solid LightGray;width: 400px;margin: auto;">
                    <br>
                    <label for="title">标题:</label>
                    <br>
                    <textarea name="title" id="title" rows="1" cols="50" autofocus style="resize:none"
                        placeholder="我的标题..."></textarea>
                    <br>
                    <br>

                    <label for="description">描述:</label>
                    <br>
                    <textarea name="description" id="description" rows="4" cols="50" style="resize:none"
                        placeholder="我的描述..."></textarea>
                    <br>
                    <br>

                    <label for="label">标签:</label>
                    <br>
                    <textarea name="label1" id="label1" rows="1" cols="20" maxlength="10" style="resize:none"
                        placeholder="标签1"></textarea>
                    <textarea name="label2" id="label2" rows="1" cols="20" maxlength="10" style="resize:none"
                        placeholder="标签2"></textarea>
                    <br>
                    <textarea name="label3" id="label3" rows="1" cols="20" maxlength="10" style="resize:none"
                        placeholder="标签3"></textarea>
                    <textarea name="label4" id="label4" rows="1" cols="20" maxlength="10" style="resize:none"
                        placeholder="标签4"></textarea>
                    <br>
                    <textarea name="label5" id="label5" rows="1" cols="20" maxlength="10" style="resize:none"
                        placeholder="标签5"></textarea>
                    <textarea name="label6" id="label6" rows="1" cols="20" maxlength="10" style="resize:none"
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
                </div>

                <br>
                <input width="50" id="submit_btn" type="submit" value="上传" onclick="submit_video_1()" style="width: 400px;margin: auto;">
                <br>
                <br>
                <br>
                <a id="id_home_page" href="">首页</a>
            </form>
            <br>
            <br>
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
            .tab-btn {
                display: inline-block;
                padding: 8px 16px;
                border: 1px solid #ddd;
                border-bottom: none;
                cursor: pointer;
            }
            .tab-btn.active {
                border-bottom: 1px solid #ddd;
            }
            .tab-content {
                padding: 16px;
                border: 1px solid #ddd;
            }

        </style>

        <script id="id_script_spark_md5" src="` + MY_PREFIX_PATH + `/public/3th_modules/js-spark-md5-3.0.2/spark-md5.js"></script>
        <script>
            function body_load() {
                var el_home_page = document.getElementById("id_home_page");
                el_home_page.href = front_end_path("");

                //var el_script_spark_md5 = document.getElementById("id_script_spark_md5");
                //el_script_spark_md5.src = front_end_path("/public/3th_modules/js-spark-md5-3.0.2/spark-md5.js");

                const el_local_file = document.getElementById('ip_local_file');
                el_local_file.addEventListener("change", load_local_file);

                const el_method_selector = document.getElementById('add_method_selector');
                //el_method_selector.value = 'local';
                el_method_selector.selectedIndex = 0;
            };

            function load_local_file() {
                const el_local_file = document.getElementById('ip_local_file');
                //包含一系列 File 对象的 FileList 对象
                console.log('el_local_file: ', el_local_file.value)
                console.log('el_local_file name: ', el_local_file.files[0].name)
                console.log('el_local_file size: ', el_local_file.files[0].size)
                console.log('el_local_file type: ', el_local_file.files[0].type)
                var file = el_local_file.files[0]
                var md5 = ""
                if (file){
                    md5 = caculate_md5(file);
                } else {
                    alert('请先选择文件');
                }
            }

            function method_ctl(selector) {                
                var selectedOption = selector.options[selector.selectedIndex];
                console.log('method_ctl: ', selectedOption.value);

                const lb_local_file = document.getElementById('lb_local_file');
                const ip_local_file = document.getElementById('ip_local_file');
                //ta_server_file
                const lb_server_file = document.getElementById('lb_server_file');
                const ta_server_file = document.getElementById('ta_server_file');
                // lb_network_file ta_network_file
                const lb_network_file = document.getElementById('lb_network_file');
                const ta_network_file = document.getElementById('ta_network_file');

                console.log('lb_local_file.style.display: ', lb_local_file.style.display);
                if(selectedOption.value == 'local') {
                    lb_local_file.style.display = "none";
                    ip_local_file.style.display = "";
                    lb_server_file.style.display = "none";
                    ta_server_file.style.display = "none";
                    lb_network_file.style.display = "none";
                    ta_network_file.style.display = "none";
                } else if(selectedOption.value == 'server'){
                    lb_local_file.style.display = "none";
                    ip_local_file.style.display = "none";
                    lb_server_file.style.display = "none";
                    ta_server_file.style.display = "";
                    lb_network_file.style.display = "none";
                    ta_network_file.style.display = "none";
                } else if(selectedOption.value == 'network') {
                    lb_local_file.style.display = "none";
                    ip_local_file.style.display = "none";
                    lb_server_file.style.display = "none";
                    ta_server_file.style.display = "none";
                    lb_network_file.style.display = "none";
                    ta_network_file.style.display = "";
                }
            };


            // 处理上传进度
            function progressFunction(e){
                // console.log("上传进度: ", e);
                if (e.lengthComputable) {
                    var loading = Math.round(1000.0 * e.loaded / e.total) / 10.0;
                    const submit_botton = document.getElementById('submit_btn');
                    submit_botton.value = '上传中： ' + loading + '%';
                }
            }
            // 上传成功
            function uploadComplete(e) {
                console.log("上传成功！", e);
                const submit_botton = document.getElementById('submit_btn');
                submit_botton.value = '上传成功';
                resultContainer.textContent = 'HTTP Status: ' + e.currentTarget.status + ' '
                     + e.currentTarget.statusText + '.    ' + e.currentTarget.response

            }
            // 上传失败
            function uploadFailed(e) {
                console.log("上传失败", e);
                const submit_botton = document.getElementById('submit_btn');
                submit_botton.value = '上传失败';
                resultContainer.textContent = 'HTTP Status: ' + e.currentTarget.status + ' '
                     + e.currentTarget.statusText + '.    ' + e.currentTarget.response
            }


            function submit_video() {
                console.log('submit')

                event.preventDefault(); // 阻止默认表单提交行为

                // 获取表单和结果容器
                const uploadForm = document.getElementById('uploadForm');
                const resultContainer = document.getElementById('resultContainer');

                // 创建 FormData 对象
                const formData = new FormData(uploadForm);
                formData.delete('file');
                var url = back_end_path("/upload");

                // 改用XMLHttpRequest, 增加上传进度的的功能, fetch方法就不用了
                var xhr = new XMLHttpRequest();
                xhr.onload = uploadComplete; // 添加 上传成功后的回调函数
                xhr.onerror =  uploadFailed; // 添加 上传失败后的回调函数
                xhr.upload.onprogress = progressFunction; // 添加 监听函数
                xhr.open("POST", url, true);
                xhr.send(formData);
                console.log('Finish!');
                return ;

                // 发起 POST 请求
                fetch(back_end_path('/upload'), {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(\`HTTP error! Status: \${ response.status }\`);
                    }
                    const response_text = response.text() // text()解析文本，只能调一次
                    console.log('response:', response_text)

                    resultContainer.textContent = response_text;
                    return response_text; // 解析文本结果
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
                    // window.location.href = redirectUrl; // 假设结果中有一个 redirectUrl 字段
                })
                .catch(error => {
                    console.log('Error:', error.toString());
                    resultContainer.textContent = '上传失败    ' + error.toString();
                });

            };



            function submit_video_1() {
                console.log('submit_video_1')
                event.preventDefault(); // 阻止默认表单提交行为

                const el_method_selector = document.getElementById('add_method_selector');
                if (el_method_selector.value == 'local') {
                    const formDataSegmentRequest = new FormData();

                    const el_local_file = document.getElementById('ip_local_file');
                    //包含一系列 File 对象的 FileList 对象
                    //console.log('el_local_file: ', el_local_file.value)
                    //console.log('el_local_file name: ', el_local_file.files[0].name)
                    //console.log('el_local_file size: ', el_local_file.files[0].size)
                    //console.log('el_local_file type: ', el_local_file.files[0].type)
                    formDataSegmentRequest.append('add_method', 'local');
                    formDataSegmentRequest.append('video_id', '');
                    formDataSegmentRequest.append('file_size', el_local_file.files[0].size.toString());
                    formDataSegmentRequest.append('file_name', el_local_file.files[0].name);

                    // total_size = el_local_file.files[0].size;
                    // var accepted_size = new Array(1);
                    // accepted_size[0] = 0;

/*                     var accepted_size = [];
                    accepted_size[0] = 111;
                    accepted_size[1] = 222;
                    accepted_size[2] = 333;
                    console.log('accepted_size: ' + accepted_size);
                    console.log('typeof accepted_size[0]: ' + typeof accepted_size[0]);
                    console.log('Outside, accepted_size.length: ' + accepted_size.length); */

                    var url = back_end_path("/video");

                    // 改用XMLHttpRequest, 增加上传进度的的功能, fetch方法就不用了
                    var xhr = new XMLHttpRequest();
                    xhr.onload = segmentRequestComplete; // 添加 上传成功后的回调函数
                    xhr.onerror =  uploadFailed; // 添加 上传失败后的回调函数
                    xhr.upload.onprogress = segmentProgressFunction; // 添加 监听函数
                    xhr.open("POST", url, true);
                    xhr.send(formDataSegmentRequest);
                    console.log('Finish!');

                    function segmentRequestComplete(e) {
                        // console.log("上传成功！", e);
                        // const submit_botton = document.getElementById('submit_btn');
                        // submit_botton.value = '上传成功';
                        resultContainer.textContent = 'HTTP Status: ' + e.currentTarget.status + ' '
                            + e.currentTarget.statusText + '.    ' + e.currentTarget.response
                        console.log('segment info: ', e.currentTarget.response)
                        var response_json = eval('(' + e.currentTarget.response + ')');
                        video_id = response_json['video_id']
                        segNum = response_json['segment_info'].length
                        console.log('segNum: ', segNum)

                        const el_local_file = document.getElementById('ip_local_file');
                        total_size = el_local_file.files[0].size;
                        var accepted_size = [];
                        console.log('total_size: ', total_size)
                        console.log('accepted_size: ' + accepted_size);


                        var idx = 0
                        var test = []
                        for (idx = 0; idx < segNum; idx++) {
                            console.log('idx: ' + idx)
                            test.push(0)
                            // accepted_size[idx] = 0;
                            accepted_size.push(0);
                            segment = response_json['segment_info'][idx];
                            const formDataSegment = new FormData();
                            formDataSegment.append('add_method', 'local');
                            formDataSegment.append('video_id', video_id);
                            formDataSegment.append('relative_info', false);
                            formDataSegment.append('seg_index', idx);

                            const start = segment['start'];
                            const end = segment['start'] + segment['size'];
                            console.log('start: ' + start + ', end: ', end)
                            const blob = el_local_file.files[0].slice(start, end);

                            formDataSegment.append('file', blob);
                            console.log('Outside before call, typeof accepted_size[0]: ' + typeof accepted_size[0]);
                            console.log('Outside before call, accepted_size.length: ' + accepted_size.length);
                            uploadSegment(idx, formDataSegment);


                            function uploadSegment(index, form_data) {
                                form_data.append('add_method', 'local');
                                var xhr = new XMLHttpRequest();
                                xhr.onload = segmentUploadComplete; // 添加 上传成功后的回调函数
                                xhr.onerror =  uploadFailed; // 添加 上传失败后的回调函数
                                xhr.upload.onprogress = function (e) {
                                    // console.log('e.currentTarget: ', e.currentTarget)
                                    // console.log('e.target: ', e.target)
                                    // console.log('e.loaded: ', e.loaded);
                                    console.log('uploadSegment. index: ' + index + '. e.loaded: ' + e.loaded + ', accepted_size.length: ' + accepted_size.length);
                                    console.log('typeof index: ' + typeof index + ', typeof e.loaded: ' + typeof e.loaded + ', typeof accepted_size[0]: ' + typeof accepted_size[0]);
                                    accepted_size[index] = e.loaded;
                                    total_accepted_size = 0.0;
                                    for (j = 0; j < accepted_size.length; j++) {
                                        console.log('accepted_size[' + j + ']: ' + accepted_size[j])
                                        total_accepted_size += accepted_size[j];
                                    }
                                    console.log('total_accepted_size: ', total_accepted_size);
                                    var loading = Math.round(1000.0 * total_accepted_size / total_size) / 10.0;
                                    const submit_botton = document.getElementById('submit_btn');
                                    submit_botton.value = '上传中： ' + loading + '%';

                                }; // 添加 监听函数
                                var url_seg = back_end_path("/video/" + video_id);
                                xhr.open("POST", url_seg, true);
                                xhr.send(form_data);
                            }

                        }
                        return ;

                    }


                    function segmentUploadComplete(e) {
                        console.log("分片上传完成！", e);
                        var response_json = eval('(' + e.currentTarget.response + ')');
                        segNum = response_json['segment_info'].length;
                        all_accepted = true
                        for (i = 0; i < segNum; i++) {
                            segment = response_json['segment_info'][i];
                            console.log('segment: ' + segment)
                            if (segment['accepted'] == false) {
                                all_accepted = false
                            }
                        }
                        // 分片全部上传完了，上传视频相关信息
                        if (all_accepted == true) {
                            const formDataRelativeInfo = new FormData();
                            formDataRelativeInfo.append('add_method', 'local');
                            formDataRelativeInfo.append('video_id', video_id);
                            formDataRelativeInfo.append('relative_info', true);
                            formDataRelativeInfo.append('description', document.getElementById('description').value);
                            formDataRelativeInfo.append('title', document.getElementById('title').value);
                            formDataRelativeInfo.append('label1', document.getElementById('label1').value);
                            formDataRelativeInfo.append('label2', document.getElementById('label2').value);
                            formDataRelativeInfo.append('label3', document.getElementById('label3').value);
                            formDataRelativeInfo.append('label4', document.getElementById('label4').value);
                            formDataRelativeInfo.append('label5', document.getElementById('label5').value);
                            formDataRelativeInfo.append('label6', document.getElementById('label6').value);
                            var el_category = document.getElementById("category");
                            formDataRelativeInfo.append('category', el_category.options[el_category.selectedIndex].text);
                            var el_poli_sens = document.getElementById("political_sensitivity");
                            formDataRelativeInfo.append('political_sensitivity', el_poli_sens.options[el_poli_sens.selectedIndex].text);
                            var el_erot_sens = document.getElementById("erotic_sensitivity");
                            formDataRelativeInfo.append('erotic_sensitivity', el_erot_sens.options[el_erot_sens.selectedIndex].text);
                            formDataRelativeInfo.append('file_name', el_local_file.files[0].name);
                            
                            var xhr = new XMLHttpRequest();
                            xhr.onload = relativeUploadComplete; // 添加 上传成功后的回调函数
                            xhr.onerror =  uploadFailed; // 添加 上传失败后的回调函数
                            xhr.upload.onprogress = progressFunction; // 添加 监听函数
                            var url_seg = back_end_path("/video/" + video_id);
                            xhr.open("POST", url_seg, true);
                            xhr.send(formDataRelativeInfo);
                        }
                    }

                    function relativeUploadComplete(e) {
                        console.log("视频相关信息上传完成！", e);
                        var response_json = eval('(' + e.currentTarget.response + ')');
                        console.log('Relative upload: ' + e.currentTarget.response);
                        return;
                    }

                    function segmentProgressFunction(e){
                        // console.log("上传进度: ", e);
                        // var loading = Math.round(1000.0 * e.loaded / e.total) / 10.0;
                        // const submit_botton = document.getElementById('submit_btn');
                        // submit_botton.value = '上传中： ' + loading + '%';

                        // accepted_size += e.loaded;
                        // var loading = Math.round(1000.0 * accepted_size / total_size) / 10.0;
                        // const submit_botton = document.getElementById('submit_btn');
                        // submit_botton.value = '上传中： ' + loading + '%';
                    };

                }

                return ;

            };

            function caculate_md5(file) {
                var file_md5 = "";
                if (file) {
                    // 小文件一次性计算md5
                    if (file.size < 50 * 1024 * 1024) {
                        const fileReader = new FileReader();
                        fileReader.onload = function(event) {
                            const arrayBuffer = event.target.result;
                            const spark = new SparkMD5.ArrayBuffer();
                            console.log('aaa');
                            spark.append(arrayBuffer);
                            console.log('bbb');
                            const md5 = spark.end();
                            //document.getElementById('md5Result').innerText = md5;
                            console.log('Small md5: ', md5);
                            file_md5 = md5;
                        };
                        fileReader.readAsArrayBuffer(file);
                        console.log('fileReader readyState: ', fileReader.readyState);
                    } else {
                        // 大文件分块读
                            console.log('aaa Big');
                            const CHUNK_SIZE = 100 * 1024 * 1024; // 每次读取的块大小，这里设置为1MB
                            let currentChunk = 0;
                            const spark = new SparkMD5.ArrayBuffer();
                            const fileReader = new FileReader();
                            console.log('bbb Big');

                            fileReader.onload = function(event) {
                                spark.append(event.target.result); // 将当前块的 ArrayBuffer 添加到 SparkMD5 实例中

                                currentChunk++; // 更新当前块的索引
                                if (currentChunk < chunks) {
                                    loadNextChunk(); // 如果还有下一块，则继续读取
                                } else {
                                    const md5 = spark.end(); // 所有块读取完成，计算最终的 MD5 值
                                    console.log('Big md5: ', md5);
                                    file_md5 = md5;
                                }
                            };

                            function loadNextChunk() {
                                const start = currentChunk * CHUNK_SIZE; // 计算当前块的起始位置
                                const end = Math.min(start + CHUNK_SIZE, file.size); // 计算当前块的结束位置

                                const blob = file.slice(start, end); // 使用 slice 方法获取当前块的 Blob 对象
                                fileReader.readAsArrayBuffer(blob); // 读取当前块的内容
                            }

                            const chunks = Math.ceil(file.size / CHUNK_SIZE); // 计算文件需要分成的总块数
                            loadNextChunk(); // 开始读取第一块

                    }
                }
                return file_md5;
            };
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
    `;

    dynamicUploadHTML += func_slice_path;
        
    dynamicUploadHTML += `
             </script>
        </html>
    `;
    res.send(dynamicUploadHTML);
});



module.exports = router;