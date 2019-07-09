import React, { Component } from 'react'

class Canvas extends Component {
  constructor(){
    super();
    this.state={
      form: {
        x: 0,
        y: 30,
        text: ''
      }
    }
  }

  makeTextInCanvas(x, y, text, originalImage){
    const file= document.querySelector('input[type=file]').files[0];
    const image = this.refs.image;
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    const reader = new FileReader();
    
    if (file) {
      reader.readAsDataURL(file);
    }

    reader.addEventListener("load", function (event) {

      const img = new Image();
      img.onload = function(){
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img,0,0);

        ctx.font = "30px Arial";
  
        const lineheight = 30;
        const lines = text.split('\n');
  
        for (let i = 0; i<lines.length; i++){
          ctx.fillText(lines[i], Number(x), Number(y) + (i * lineheight))
        };
      }
      image.onload = function(){
        image.width = canvas.width;
        image.height = canvas.height;
      }
      img.src = event.target.result;
      image.src = event.target.result;
    }, false);

    const CanvasUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
    return CanvasUrl;
  }

  handleChange(e){
    const {name, value} = e.target;
    const form = this.state.form;
    form[name] = value;
      
    this.setState({
      form
    }) 
  }

  // applyText() {
  //   const form = this.state.form;
  //   const content = form.text;

  //   const x = Number(form.x);
  //   const y = Number(form.y)

  //   const src = this.refs.image.src;
  //   const canvas = this.refs.canvas;
  //   const ctx = canvas.getContext("2d");

  //   const img = new Image();
  //   img.onload = function(){
  //     canvas.width = img.width;
  //     canvas.height = img.height;
  //     ctx.drawImage(img,0,0);
  //     ctx.font = "30px Arial";

  //     var lineheight = 30;
  //     var lines = content.split('\n');

  //     for (let i = 0; i<lines.length; i++){
  //       ctx.fillText(lines[i], x, y + (i*lineheight) )};
  //     // ctx.fillText(content,x,y);
  //   }
  //   img.src = src;

  // }

  // handleImg(){
  //   const canvas = this.refs.canvas;
  //   const image = this.refs.image;
  //   const ctx = canvas.getContext('2d');

  //   const file= document.querySelector('input[type=file]').files[0];

  //   const reader = new FileReader();

  //   // reader.onload = function(event){
  //     reader.addEventListener("load", function (event) {

  //     const img = new Image();
  //     img.onload = function(){
  //       canvas.width = img.width;
  //       canvas.height = img.height;
  //       ctx.drawImage(img,0,0);
  //     }
  //     image.onload = function(){
  //       image.width = canvas.width;
  //       image.height = canvas.height;
  //     }
  //     img.src = event.target.result;
  //     image.src = event.target.result;
  //   }, false);

  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // }

  download(){
    const canvas = this.refs.canvas;
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
    window.location.href=image;
  }

  render() {
    return (
      <div style={{display: 'relative'}}>
       <label>Image File:</label><br/>
        <input type="file" id="imageLoader" ref="imageLoader" name="imageLoader"/>
        <div>
          <img id="originalImage" ref="image" alt=""/>  
        </div>

        <div>
          text: <textarea rows="5" name="text" value={this.state.form.text} onChange={this.handleChange.bind(this)}  ref="text" style={{width: '310px'}}/>
        </div>
        <div>
          x : <input type="number" name="x" value={this.state.form.x} onChange={this.handleChange.bind(this)} ref="x"/>
          y : <input type="number" name="y" value={this.state.form.y} onChange={this.handleChange.bind(this)} ref="y"/>
        </div>
        <div>
          <button id="apply" onClick={this.makeTextInCanvas.bind(this, this.state.form.x, this.state.form.y, this.state.form.text)}>적용</button>
          <button id="download" onClick={this.download.bind(this)} style={{marginLeft: '125px', marginBottom: '20px', padding: '3px 5px'}}>Downloads as Image</button>
        </div>
        <div style={{position: 'relative'}}>
          <canvas ref="canvas" >
            Your browser does not support the canvas element.
          </canvas> 
        </div>
      </div>
    )
  }
}

export default Canvas;
