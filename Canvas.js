import React, { Component } from 'react';
import {makeTextInCanvas} from './makeTextInCanvas';

class Canvas extends Component {
  constructor(){
    super();
    this.state={
      form: {
        x: 0,
        y: 30,
        text: ''
      },
      result : undefined
    }
  }

  handleChange(e) {
    const {name, value} = e.target;
    const form = this.state.form;
    form[name] = value;

    this.makeCanvas();
    this.setState({
      form
    }); 

  }

  makeCanvas() {
    const inputImage = this.state.file;
    const {x, y, text} = this.state.form;
    const font = 'Arial';
    const fontsize = 30;
    if(inputImage === undefined) {
      alert("이미지 파일을 선택해 주세요");
      return;
    }

    makeTextInCanvas(inputImage, x, y, text, font, fontsize, (err, result) => {
      console.log("result !! ", this);
      console.log('makeCanvas res',result);
      if(err) {
        console.log(err);
      }
      this.setState({
        result : result
      });
    });
  }

  apply(){
    this.makeCanvas()
  }

  handleImageChange(e) {
    e.preventDefault();
    const target = e.target;
    const reader = new FileReader();
    const file = target.files[0];

    reader.onloadend = () => {
      if(!file.type.startsWith('image/')){
        alert("이미지 파일이 아닙니다");
        return;
      }
      
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file);

  }

  download(){
    const image = this.state.result.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href = image;
  }

  render() {
    console.log("render",this.state.result && this.state.result.toDataURL());
    return (
      <div style={{display: 'relative'}}>
       <label>Image File:</label><br/>
        <input type="file" onChange={this.handleImageChange.bind(this)} multiple/>
        <div>
          <img ref="image" src={this.state.imagePreviewUrl} alt=""/>  
        </div>

        <div>
          text: <textarea rows="5" name="text" value={this.state.form.text} onChange={this.handleChange.bind(this)} style={{width: '250px'}}/>
        </div>
        <div>
          x : <input type="number" name="x" value={this.state.form.x} onChange={this.handleChange.bind(this)} />
          y : <input type="number" name="y" value={this.state.form.y} onChange={this.handleChange.bind(this)} />
        </div>
        <div>
          <button id="apply" onClick={this.apply.bind(this)}>적용</button>
          <button id="download" onClick={this.download.bind(this)} style={{marginLeft: '125px', marginBottom: '20px', padding: '3px 5px'}}>Download</button>
        </div>
        <div style={{position: 'relative'}}>
          <img ref="canv" src={this.state.result && this.state.result.toDataURL()}  alt=''/>
        </div>
      </div>
    )
  }
}

export default Canvas;
