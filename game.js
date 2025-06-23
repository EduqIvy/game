const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: 100, y: 250, size: 20, speed: 4 };
let bullets = [];
let enemies = [
  { x: 700, y: 150, size: 20, health: 100 },
  { x: 700, y: 350, size: 20, health: 100 }
];

const keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    bullets.push({ x: player.x, y: player.y, size: 6, dx: 7 });
  }
});

function update() {
  if (keys['w'] && player.y - player.size > 0) player.y -= player.speed;
  if (keys['s'] && player.y + player.size < canvas.height) player.y += player.speed;
  if (keys['a'] && player.x - player.size > 0) player.x -= player.speed;
  if (keys['d'] && player.x + player.size < canvas.width) player.x += player.speed;

  bullets.forEach((b, bi) => {
    b.x += b.dx;
    if (b.x > canvas.width) bullets.splice(bi, 1);
  });

  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (e.health > 0) {
        const dx = b.x - e.x;
        const dy = b.y - e.y;
        const dist = Math.hypot(dx, dy);
        if (dist < b.size + e.size) {
          e.health -= 25;
          bullets.splice(bi, 1);
        }
      }
    });
  });

  enemies = enemies.filter(e => e.health > 0);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'cyan';
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'orange';
  bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
    ctx.fill();
  });

  enemies.forEach(e => {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
    ctx.fill();

    const barWidth = 40;
    ctx.fillStyle = 'lime';
    const healthWidth = barWidth * (e.health / 100);
    ctx.fillRect(e.x - barWidth / 2, e.y - e.size - 10, healthWidth, 6);
    ctx.strokeStyle = '#555';
    ctx.strokeRect(e.x - barWidth / 2, e.y - e.size - 10, barWidth, 6);
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
