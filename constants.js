// 定义常量
const API_URL = 'https://example.com/api';
const API_KEY = 'your-api-key';

const MY_HEAD = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title></title>
        </head>
`

const MY_BODY_STYLE = `
            body {
                background-color: white;
                text-align: center;
            }
`

const MY_PREFIX_PATH = `/times_dust`
const MY_API_PREFIX_PATH = `/times_dust_api`


// 导出常量
module.exports = {
    API_URL,
    API_KEY,
    MY_HEAD,
    MY_BODY_STYLE,
    MY_PREFIX_PATH,
    MY_API_PREFIX_PATH
};
