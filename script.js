//Функция отрисовки QR-кода 
function drawQR(link) {
  const qrcode = new QRCode(document.getElementById("qrcode"), {
    text: link,
    width: 365,
    height: 365,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
  return qrcode;
}

async function getLinks() {
    try {
        const response = await fetch("http://localhost:5500/links.json");
        const data = await response.json();
        console.log(data);
        return data;    
    }
    catch (e) {
        console.log(e);
    }
}

//Функция создания QR-кода
async function makeQR(){
    const links = await getLinks();
    let key = Math.floor(Math.random() * Object.keys(links).length) + 1;
    console.log(key);
    drawQR(links[key]);
}


//Добавляем событие создания QR по клику на кнопку
const buttonQR = document.getElementById('buttonQR');

buttonQR.addEventListener('click', function() {
    document.querySelector('.qr-code').textContent = '';
    makeQR();
});

document.addEventListener('DOMContentLoaded', async function() {
    makeQR();
});
