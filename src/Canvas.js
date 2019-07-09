import React, { Component } from 'react'

class Canvas extends Component {
  constructor(){
    super();
    this.state={
      texts: [],
      form: {
        x: 30,
        y: 0,
        text: '',
        selectedText: -1
      },
      fontSize: 30
    }
  }

  componentDidMount() {
    const form = this.state.form;
    form.y = this.state.fontSize;
    this.setState({
      form
    })
  }

  checkImg(){
    const src = this.refs.image.src;
    if(!src) return true;
  }

  handleChange(e){
    const {name, value} = e.target;
    const form = this.state.form;
    const checkImg =()=> this.checkImg()
    if(checkImg()){
      return
    }
    const draw =()=> this.draw();
    form[name] = value;
    this.setState({
      form
    }) 
    draw();
  }
  ////
  draw() {
    console.log(this)
    var lineheight = 30;
    
    const form = this.state.form;
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");

    var text = form.text;
    var lines = text.split('\n');

    const src = this.refs.image;
    if(!src) return;
    ctx.drawImage(src,0,0);
    ctx.font = "30px Arial";
    console.log(lines);
    console.log(lines.length);
    const textWidth = ctx.measureText(lines).width / 2;
    const textHeight = parseInt(ctx.font) * lines.length /3;
    console.log(form);
    for (let i = 0; i<lines.length; i++){
      ctx.fillText(lines[i], Number(form.x) , Number(form.y) + (i*lineheight));
    }
    this.setState({
      form
    })

  }
textHittest(x, y, textIndex) {
  const texts = this.state.texts;

  var text = texts[textIndex];
  return (x >= text.x && x <= text.x + text.width && y >= text.y - text.height && y <= text.y);
}
handleMouseDown(e) {
  const canvas = this.refs.canvas;
  const OFFSET_X = canvas.offsetLeft;
  const OFFSET_Y = canvas.offsetTop;
  const form = this.state.form;
  const texts = this.state.texts;

  e.preventDefault();
  
  const startX = parseInt(e.clientX - OFFSET_X);
  const startY = parseInt(e.clientY - OFFSET_Y);
  // Put your mousedown stuff here
  for (var i = 0; i < texts.length; i++) {
      // if (this.textHittest(startX, startY, i)) {
          form.selectedText = i;
          texts[i].selectedText = i;
      // }
  }
  console.log(form.selectedText);
  form.x = startX;
  form.y = startY;
  
  this.setState({
    texts,
    form
  })
  this.applyText()
}

handleMouseUp(e) {
  const form = this.state.form;
  e.preventDefault();
  // this.draw();
  form.selectedText = -1;
}

// also done dragging
handleMouseOut(e) {
  const form = this.state.form;
  e.preventDefault();
  form.selectedText = -1;
}

handleMouseMove(e) {
  const form = this.state.form;

  const canvas = this.refs.canvas;
  const OFFSET_X = canvas.offsetLeft;
  const OFFSET_Y = canvas.offsetTop;
  const texts = this.state.texts;
  const selectedText = form.selectedText;

  if (form.selectedText < 0 || selectedText === undefined) {
      return;
  }
  e.preventDefault();
  let startX = form.x;
  let startY = form.y;
  let mouseX = parseInt(e.clientX - OFFSET_X); //마우스가 여기로 움직였다 MOVED POINT
  let mouseY = parseInt(e.clientY - OFFSET_Y);

  // Put your mousemove stuff here
  var dx = mouseX - startX;
  var dy = mouseY - startY;
  startX = mouseX;
  startY = mouseY;
  console.log(this.state);
  console.log(selectedText);
  const text = texts[selectedText];
  form.x += dx;
  form.y += dy;
  
  console.log(dx);
  this.draw();

}



/////
  applyText() {
    const form = this.state.form;
    const content = form.text;

    const x = Number(form.x);
    const y = Number(form.y)

    const src = this.refs.image.src;
    const canvas = this.refs.canvas;
    const texts = this.state.texts;
    texts.push(form);
    const ctx = canvas.getContext("2d");
    // const draw = () => this.draw;
    const draw = () => this.draw();
    const img = new Image();
    img.onload = function(){
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img,0,0);
      ctx.font = "30px Arial";
      draw();
    }
    img.src = src;
    this.setState({
      texts,
      form
    })
  }

  handleImg(){
    const canvas = this.refs.canvas;
    const image = this.refs.image;
    const ctx = canvas.getContext('2d');

    const file= document.querySelector('input[type=file]').files[0];

    const reader = new FileReader();

    // reader.onload = function(event){
      reader.addEventListener("load", function (event) {
      const img = new Image();
      img.onload = function(){
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img,0,0);
      }
      image.onload = function(){
        image.width = canvas.width;
        image.height = canvas.height;
      }
      img.src = event.target.result;
      image.src = event.target.result;
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  download(){
    const canvas = this.refs.canvas;
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

    window.location.href=image;
  }

  render() {
    return (
      <div style={{display: 'relative'}}>
       <label>Image File:</label><br/>
        <input type="file" id="imageLoader" ref="imageLoader" name="imageLoader" onChange={this.handleImg.bind(this)}/>
        <div>
          <img ref="image" alt=""/>  
        </div>

        <div>
          text: <textarea rows="5"  name="text" value={this.state.form.text} onChange={this.handleChange.bind(this)} style={{width: '310px'}}/>
        </div>
        <div>
          x : <input type="number" name="x" value={this.state.form.x} onChange={this.handleChange.bind(this)}/>
          y : <input type="number" name="y" value={this.state.form.y} onChange={this.handleChange.bind(this)}/>
        </div>
        <div>

          <button id="download" onClick={this.download.bind(this)} style={{marginLeft: '125px', marginBottom: '20px', padding: '3px 5px'}}>Downloads as Image</button>
        </div>
        <canvas ref="canvas" onMouseDown={(e)=>this.handleMouseDown(e)} onMouseUp={(e)=>this.handleMouseUp(e)} onMouseMove={(e)=>this.handleMouseMove(e)} onMouseOut={(e)=>this.handleMouseOut(e)}>
          Your browser does not support the canvas element.
        </canvas> 
      </div>
    )
  }
}

export default Canvas;
