function initCanvas(){
    var ctx = document.getElementById('my_canvas').getContext('2d');
    var backgroundImage = new Image();
    var naveImage = new Image(); // Nave
    var enemiespic1 = new Image(); // enemigo 1
    var enemiespic2 = new Image(); // enemigo 2

    backgroundImage.src = 'imagenes/background-pic.jpg'; // Fondo del canvas
    naveImage.src = 'imagenes/spaceship-pic.png'; // Nave aliada
    // Naves enemigas
    enemiespic1.src = 'imagenes/enemigo1.png';
    enemiespic2.src = 'imagenes/enemigo2.png';

    var cW = ctx.canvas.width; // 700px
    var cH = ctx.canvas.height; // 600px

    var enemyTemplate = function(options){
        return {
            id: options.id || '',
            x: options.x || '',
            y: options.y || '',
            w: options.w || '',
            h: options.h || '',
            image: options.image || enemiespic1
        }
    }

    var enemies = [
                    // Primer grupo naves enemigas
                    new enemyTemplate({id: '1', x: 100, y: -20, w: 50, h:30}),
                    new enemyTemplate({id: '2', x: 225, y: -20, w: 50, h:30}),
                    new enemyTemplate({id: '3', x: 350, y: -20, w: 80, h:30}),
                    new enemyTemplate({id: '4', x: 100, y: -70, w: 80, h:30}),
                    new enemyTemplate({id: '5', x: 225, y: -70, w: 50, h:30}),
                    new enemyTemplate({id: '6', x: 350, y: -70, w: 50, h:30}),
                    new enemyTemplate({id: '7', x: 475, y: -70, w: 50, h:30}),
                    new enemyTemplate({id: '8', x: 600, y: -70, w: 80, h:30}),
                    new enemyTemplate({id: '9', x: 475, y: -20, w: 50, h:30}),
                    new enemyTemplate({id: '10', x: 600, y: -20, w: 50, h:30}),

                    // Segundo grupo naves enemigas
                    new enemyTemplate({id: '11', x: 100, y: -220, w: 50, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '12', x: 225, y: -220, w: 50, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '13', x: 350, y: -220, w: 80, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '14', x: 100, y: -270, w: 80, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '15', x: 225, y: -270, w: 50, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '16', x: 350, y: -270, w: 50, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '17', x: 475, y: -270, w: 50, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '18', x: 600, y: -270, w: 80, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '19', x: 475, y: -200, w: 50, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '20', x: 600, y: -200, w: 50, h:30, image: enemiespic2})
                  ];

    var renderEnemies = function(enemyList) {
        for(var i=0; i<enemyList.length; i++){
            // console.log(enemyList[i]);
            ctx.drawImage(enemyList[i].image, enemyList[i].x, enemyList[i].y += .5, enemyList[i].w, enemyList[i].h);
            // Detecta colision de naves enemigas con nave aliada
            launcher.hitDetectLowerLevel(enemyList[i]);
        }
    }

    function Launcher(){
        // Ubicación de misiles
        this.y = 500,
        this.x = cW*.5-25,
        this.w = 100,
        this.h = 100,
        this.direccion,
        this.bg = 'white', // Color del misil
        this.misiles = [];

        this.gameStatus = {
            over: false,
            message: '',
            fillStyle: 'white',
            font: 'italic bold 36px Arial, sans-serif',
        }

        this.render = function() {
            if(this.direccion === 'left'){
                this.x -= 5;
            }else if(this.direccion === 'right'){
                this.x += 5;
            }else if(this.direccion === 'downArrow'){
                this.y += 5;
            }else if(this.direccion === 'upArrow'){
                this.y -= 5;
            }

            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 0, 0); // Fondo del canvas
            ctx.drawImage(naveImage, this.x, this.y, 100, 90); // Nave aliada

            for(var i=0; i<this.misiles.length; i++){
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y-=5, m.w, m.h); // Dirección del misil
                this.hitDetect(this.misiles[i], i);
                if(m.y <= 0){
                    this.misiles.splice(i, 1);
                }
            }

            if(enemies.length === 0){
                clearInterval(animateInterval); // Terminar juego
                ctx.font = this.gameStatus.font;
                ctx.fillText('¡Tú ganas!', cW * .5 - 80, 50);
            }
        }

        // Función que detecta impacto de misil con nave enemiga
        this.hitDetect = function(m, mi) {
            for(var i=0; i<enemies.length; i++){
                var e = enemies[i];
                if(m.x+m.w >= e.x &&
                   m.x <= e.x+e.w &&
                   m.y >= e.y &&
                   m.y <= e.y+e.h){
                    this.misiles.splice(this.misiles[mi], 1); // Eliminar misil
                    enemies.splice(i, 1); // Eliminar nave enemiga
                    document.querySelector('.barra').innerHTML = 'Enemigos destruidos ' + e.id + ' ';
                }
            }
        }

        this.hitDetectLowerLevel = function(enemy) {
            if(enemy.y > 550){
                this.gameStatus.over = true;
                this.gameStatus.message = '¡Los enemigos han pasado!';
            }

            if((enemy.y < this.y + 25 && enemy.y > this.y - 25) &&
                (enemy.x < this.x + 45 && enemy.x > this.x - 45)){
                    this.gameStatus.over = true;
                    this.gameStatus.message = '¡Moriste!';
            }

            if(this.gameStatus.over === true){
                clearInterval(animateInterval); // Se termina el juego
                ctx.fillStyle = this.gameStatus.fillStyle;
                ctx.font = this.gameStatus.font;
                // Mostrar mensaje al usuario
                ctx.fillText(this.gameStatus.message, cW * .5 - 140, 50); // Texto x, y
            }
        }
    }

    var launcher = new Launcher();

    function animate(){
        ctx.clearRect(0, 0, cW, cH);
        launcher.render();
        renderEnemies(enemies);
    }

    var animateInterval = setInterval(animate, 6);

    var left_btn = document.getElementById('left_btn');
    var right_btn = document.getElementById('right_btn');
    var fire_btn = document.getElementById('fire_btn');
    var reset_btn = document.getElementById('reset_btn');

    // Controles utilizando el teclado
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37){ // Tecla posición izquierda
            launcher.direccion = 'left';
            if(launcher.x < cW*.2-130){
                launcher.x += 0;
                launcher.direccion = '';
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 37){
            launcher.x += 0;
            launcher.direccion = '';
        }
    });

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 39){ // Tecla posición derecha
            launcher.direccion = 'right';
            if(launcher.x > cW-110){
                launcher.x -= 0;
                launcher.direccion = '';
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 39){
            launcher.x -= 0;
            launcher.direccion = '';
        }
    });

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 38){ // Tecla posición arriba
            launcher.direccion = 'upArrow';
            if(launcher.y < cH*.2-80){
                launcher.y += 0;
                launcher.direccion = '';
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 38){
            launcher.y += 0;
            launcher.direccion = '';
        }
    });

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 40){ // Tecla posición abajo
            launcher.direccion = 'downArrow';
            if(launcher.y > cH-110){
                launcher.y -= 0;
                launcher.direccion = '';
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 40){
            launcher.y -= 0;
            launcher.direccion = '';
        }
    });

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 32){
            launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3, h: 10});
        }
    });

    // Controles utilizando botones
    left_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'left';
    });

    left_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });

    right_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'right';
    });

    right_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });

    fire_btn.addEventListener('mousedown', function(event) {
        launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3, h: 10});
    });

    reset_btn.addEventListener('mousedown', function(event) {
        location.reload();
    });

}

window.addEventListener('load', function(event) {
    initCanvas();
});