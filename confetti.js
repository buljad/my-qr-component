// Константы
const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI * 0.5;

// Настройки canvas
var viewWidth = window.innerWidth,
    viewHeight = window.innerHeight,
    drawingCanvas,
    ctx,
    timeStep = (1/60),
    particles = [],
    animationRunning = false;

// Класс для координат
function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

// Класс для частиц конфетти
function Particle(p0, p1, p2, p3) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;

    this.time = 0;
    this.duration = 3 + Math.random() * 2;
    this.color = '#' + Math.floor((Math.random() * 0xffffff)).toString(16);

    this.w = 8;
    this.h = 6;

    this.complete = false;
}

Particle.prototype = {
    update: function() {
        this.time = Math.min(this.duration, this.time + timeStep);

        var f = Ease.outCubic(this.time, 0, 1, this.duration);
        var p = cubeBezier(this.p0, this.p1, this.p2, this.p3, f);

        var dx = p.x - this.x;
        var dy = p.y - this.y;

        this.r = Math.atan2(dy, dx) + HALF_PI;
        this.sy = Math.sin(Math.PI * f * 10);
        this.x = p.x;
        this.y = p.y;

        this.complete = this.time === this.duration;
    },
    draw: function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.r);
        ctx.scale(1, this.sy);

        ctx.fillStyle = this.color;
        ctx.fillRect(-this.w * 0.5, -this.h * 0.5, this.w, this.h);

        ctx.restore();
    }
};

// Инициализация Canvas
function initDrawingCanvas() {
    drawingCanvas = document.getElementById("drawing_canvas");
    if (!drawingCanvas) {
        // Создаем canvas, если его нет
        drawingCanvas = document.createElement('canvas');
        drawingCanvas.id = 'drawing_canvas';
        drawingCanvas.style.position = 'fixed';
        drawingCanvas.style.top = '0';
        drawingCanvas.style.left = '0';
        drawingCanvas.style.pointerEvents = 'none';
        drawingCanvas.style.display = 'none';
        drawingCanvas.style.zIndex = '1000';
        document.body.appendChild(drawingCanvas);
    }
    
    // Настраиваем размеры canvas
    drawingCanvas.width = viewWidth;
    drawingCanvas.height = viewHeight;
    ctx = drawingCanvas.getContext('2d');
}

// Создание частиц конфетти
function createParticles() {
    particles = [];
    for (var i = 0; i < 128; i++) {
        var p0 = new Point(viewWidth * 0.5, viewHeight * 0.5);
        var p1 = new Point(Math.random() * viewWidth, Math.random() * viewHeight);
        var p2 = new Point(Math.random() * viewWidth, Math.random() * viewHeight);
        var p3 = new Point(Math.random() * viewWidth, viewHeight + 64);

        particles.push(new Particle(p0, p1, p2, p3));
    }
}

// Обновление состояния частиц
function update() {
    particles.forEach(function(p) {
        p.update();
    });
}

// Отрисовка частиц
function draw() {
    ctx.clearRect(0, 0, viewWidth, viewHeight);
    
    particles.forEach(function(p) {
        p.draw();
    });
}

// Основной цикл анимации
function loop() {
    if (!animationRunning) return;
    
    update();
    draw();

    if (checkParticlesComplete()) {
        // Создаем новые частицы, когда предыдущие закончились
        createParticles();
    }

    requestAnimationFrame(loop);
}

// Проверка завершения всех частиц
function checkParticlesComplete() {
    for (var i = 0; i < particles.length; i++) {
        if (particles[i].complete === false) return false;
    }
    return true;
}

// Функция для запуска эффекта конфетти
function startConfetti() {
    // Инициализируем canvas при первом запуске
    if (!ctx) {
        initDrawingCanvas();
    }
    
    // Адаптируем размеры для текущего окна
    viewWidth = window.innerWidth;
    viewHeight = window.innerHeight;
    drawingCanvas.width = viewWidth;
    drawingCanvas.height = viewHeight;
    
    // Показываем canvas
    drawingCanvas.style.display = "block";
    
    // Создаем частицы
    createParticles();
    
    // Запускаем анимацию
    animationRunning = true;
    requestAnimationFrame(loop);
}

// Функция для остановки эффекта конфетти
function stopConfetti() {
    // Скрываем canvas
    if (drawingCanvas) {
        drawingCanvas.style.display = "none";
    }
    
    // Останавливаем анимацию
    animationRunning = false;
}

// Функции для плавных анимаций
var Ease = {
    outCubic: function(t, b, c, d) {
        t /= d;
        t--;
        return c*(t*t*t + 1) + b;
    }
};

// Функция для расчета кривой Безье
function cubeBezier(p0, c0, c1, p1, t) {
    var p = new Point();
    var nt = (1 - t);

    p.x = nt * nt * nt * p0.x + 3 * nt * nt * t * c0.x + 3 * nt * t * t * c1.x + t * t * t * p1.x;
    p.y = nt * nt * nt * p0.y + 3 * nt * nt * t * c0.y + 3 * nt * t * t * c1.y + t * t * t * p1.y;

    return p;
}

// Делаем функции доступными глобально
window.startConfetti = startConfetti;
window.stopConfetti = stopConfetti;