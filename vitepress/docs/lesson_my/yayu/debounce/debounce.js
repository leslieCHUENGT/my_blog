var count = 1;
var container = document.getElementById('container');

function getUserAction() {
    container.innerHTML = count++;
};

//DOM 0级事件
container.onmousemove = getUserAction;




