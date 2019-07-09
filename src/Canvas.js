import React, { Component } from 'react'

class Canvas extends Component {
  constructor(){
    super();
    this.state={
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
    // const draw =()=> this.draw();
    form[name] = value;
    this.setState({
      form
    }) 
    this.draw();
  }
  
  draw() {
    var lineheight = 30;
    
    const form = this.state.form;
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");

    const lines = form.text.split('\n');

    const src = this.refs.image;

    if(!src) return;

    ctx.drawImage(src,0,0);
    ctx.font = "30px Arial";
    for (let i = 0; i<lines.length; i++){
      ctx.fillText(lines[i], Number(form.x) , Number(form.y) + (i*lineheight));
    }
    this.setState({
      form
    })

  }

  handleMouseDown(e) {
    e.preventDefault();
    const canvas = this.refs.canvas;
    const OFFSET_X = canvas.offsetLeft;
    const OFFSET_Y = canvas.offsetTop;
    const form = this.state.form;
    const startX = parseInt(window.scrollX + e.clientX - OFFSET_X);
    const startY = parseInt(window.scrollY + e.clientY - OFFSET_Y);

    form.selectedText = 0;
    form.x = startX;
    form.y = startY;
    
    this.setState({
      form
    })
    this.draw();
  }

  handleMouseUp(e) {
    e.preventDefault();

    const form = this.state.form;
    
    form.selectedText = -1;
    this.setState({
      form
    })
  }

  // also done dragging
  handleMouseOut(e) {
    e.preventDefault();
    
    const form = this.state.form;
    form.selectedText = -1;
  }

  handleMouseMove(e) {
    e.preventDefault();

    const form = this.state.form;

    const canvas = this.refs.canvas;
    const OFFSET_X = canvas.offsetLeft;
    const OFFSET_Y = canvas.offsetTop;

    const selectedText = form.selectedText;

    if (form.selectedText < 0 || selectedText === undefined) {
        return;
    }
    let mouseX = parseInt(window.scrollX + e.clientX - OFFSET_X); //마우스가 여기로 움직였다 MOVED POINT
    let mouseY = parseInt(window.scrollY + e.clientY - OFFSET_Y);

    form.x = mouseX;
    form.y = mouseY;
    
    this.draw();
  }

  handleImg(){
    const canvas = this.refs.canvas;
    const image = this.refs.image;
    const ctx = canvas.getContext('2d');

    const file= document.querySelector('input[type=file]').files[0];

    const reader = new FileReader();

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
  clearText(){
    const form = this.state.form;

    form.text = '';
    this.draw();
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
          <img ref="image" alt="" />  
        </div>

        <div>
          text: <textarea rows="5"  name="text" value={this.state.form.text} onChange={this.handleChange.bind(this)} style={{width: '260px', height: '110px'}}/>
        </div>
        <div>
          x : <input type="number" name="x" value={this.state.form.x} onChange={this.handleChange.bind(this)}/>
          y : <input type="number" name="y" value={this.state.form.y} onChange={this.handleChange.bind(this)}/>
        </div>
        <div>
          <button id="clear" onClick={this.clearText.bind(this)} style={{marginBottom: '20px', padding: '3px 5px'}}>Clear Text</button>
          <button id="download" onClick={this.download.bind(this)} style={{marginLeft: '100px', marginBottom: '20px', padding: '3px 5px'}}>Download</button>

        </div>

        <canvas ref="canvas" onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} onMouseMove={this.handleMouseMove.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}>
          Your browser does not support the canvas element.
        </canvas> 
      </div>
    )
  }
}

export default Canvas;
