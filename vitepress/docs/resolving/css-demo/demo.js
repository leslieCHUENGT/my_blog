var obj = {
    "name": "abc",
    "desc": "wer",
    "type": "text",
    "content": "12345",
    "children": [
        {
            "name": "wer",
            "type": "img",
            "url": "www.didi.com",
            "children": [{
                "name": "cvb",
                "type": "text",
                "content": "56947",
                children: [{
                    name: 'leaf-3',
                    type: 'text',
                    content: 'lolo'
                }, {
                    type: 'url',
                    content: 'http://didi.com'
                }]
            }]
        },
        {
            "name": "try",
            "type": "text",
            "content": "55533"
        },
        {
            "name": "1",
            type: "url",
            content: 'text'
        }
    ]
}
// 参数，返回值：content内容
let content = [];
const getContent = (obj) => {
    // 获取content
    let pathContent = obj.content ? obj.content : '';
    content.push(pathContent);
    if (!obj.hasOwnProperty('children')) { 
        return;
    } else {
        for (let child of obj.children) { 
            getContent(child);
        }
    }
}

console.log(getContent(obj));
