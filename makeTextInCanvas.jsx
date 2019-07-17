export const makeTextInCanvas = (image,  x, y, text, font, fontsize, callback) => {
  
  const imgSrc = URL.createObjectURL(image)
  const fontstyle = fontsize + 'px ' + font;
  const canvas = document.createElement("canvas")
  const img = new Image();

  img.src = imgSrc;
  img.onload = function(){

  const ctx = canvas.getContext("2d");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img,0,0);

  ctx.font = fontstyle;

  const lineheight = fontsize;
  const lines = text.split('\n');

  for (let i = 0; i<lines.length; i++){
    ctx.fillText(lines[i], Number(x), Number(y) + (i * lineheight))
  };
  console.log("a",canvas.toDataURL());

  // return canvas; 
  callback(null, canvas);
  }
}