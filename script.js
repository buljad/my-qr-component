//Функция отрисовки QR-кода
function drawQR(link) {
  const qrcode = new QRCode(document.getElementById("qrcode"), {
    text: link,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
  return qrcode;
}

// Получаем с сервера (localhost развернутого с помощью расширения live serverв VSCode)
// JSON с ссылками на полезные frontend ресурсы и одной пасхалкой

async function getLinks() {
  try {
    const response = await fetch("http://localhost:5500/links.json");
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
}

let confettiShown = false;

//Функция создания QR-кода
async function makeQR() {
  //Рисуем QR случайной ссылки
  const links = await getLinks();
  let key = Math.floor(Math.random() * Object.keys(links).length) + 1;
  drawQR(links[key]);

  //Проверяем "особенную ссылку"
  if (links[key] === "https://t.me/BIGJCHANNEL" && !confettiShown) {
    startConfetti();
    confettiShown = true;

    document.querySelector(".lucky-text").style.display = "block";
    // Делаем кнопку неактивной
    const button = document.getElementById("buttonQR");
    button.disabled = true;

    // Через 3 секунды снова делаем кнопку активной
    setTimeout(function () {
      stopConfetti();
      button.disabled = false;
      confettiShown = false;
    }, 3000); // 3000 миллисекунд = 3 секунды
  } else {
    document.querySelector(".lucky-text").style.display = "none";
  }
}

//Добавляем событие создания QR по клику на кнопку
const buttonQR = document.getElementById("buttonQR");

buttonQR.addEventListener("click", function () {
  document.querySelector(".qr-code").textContent = "";
  makeQR();
});

document.addEventListener("DOMContentLoaded", async function () {
  makeQR();
});
