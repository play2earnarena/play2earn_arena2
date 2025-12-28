const c = document.getElementById("game");
const ctx = c.getContext("2d");

let y = 500, v = 0, score = 0, alive = true;

document.addEventListener("touchstart", jump);
document.addEventListener("keydown", e => e.code==="Space" && jump());

function jump(){
  if(y >= 500){ v = -18; }
}

function loop(){
  if(!alive) return;
  ctx.clearRect(0,0,360,640);

  v += 1;
  y += v;
  if(y > 500){ y = 500; v = 0; }

  ctx.fillStyle="lime";
  ctx.fillRect(170,y,20,20);

  score++;
  ctx.fillStyle="#fff";
  ctx.fillText("Score: "+score,10,20);

  requestAnimationFrame(loop);
}
loop();
