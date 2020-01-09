
import React, { Component, useCallback } from 'react'
import { connect } from 'react-redux'
import { createSite } from '../../store/actions/siteActions'
import { Redirect } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import MapWithSearch from '../maps/MapWithSearch'
import {toast } from 'react-toastify';
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import axios from "axios"
import {Grid} from '@material-ui/core'
function FormError(props){
  if (props.isHidden){return null;}
  return(
    <div className="form-warning">
      {props.errorMessage}
    </div>
  )
}
const API_ENDPOINT =
  "https://lddhkkp8ta.execute-api.ap-southeast-1.amazonaws.com/Prod";
const MAX_IMAGE_SIZE = "10000000";
const validateInput = checkingText => {
  const regexp = /^[a-zA-Z]+$/;
  const checkingResult = regexp.exec(checkingText);
  if (checkingResult !== null) {
    return { isInputValid: true, errorMessage: "" };
  } else {
    return { isInputValid: false, errorMessage: "Error " };
  }
};

class CreateSite extends Component {
  state = {
    title: "",
    content: "",
    address: "",
    phoneNumber: "",
    date: new Date(),
    location: {
      lat: "",
      lng: ""
    },
    confirm: false,
    pending: true,
    image: null,
    uploadURL: null,

    file:null,
    organization:"",

  };
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state);
    this.props.createSite({
      ...this.state,
      location: {
        lat: localStorage.getItem("lat"),
        lng: localStorage.getItem("lng")
      },
      address: localStorage.getItem("address")
    });
    this.props.history.push("/");
    localStorage.clear();
  };
  handleChangeDate = e => {
    this.setState({ date: e });
  };

  handleShowMap() {
    this.setState({ showMap: !this.state.showMap });
  }
  onFileChange(e) {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    this.createImage(files[0]);
  }

createImage= (file)=>{
        
    let reader = new FileReader()
    reader.onload = (e)=>{
        console.log('length: ', e.target.result.includes('data:image/jpeg'))
        if (!e.target.result.includes('data:image/jpeg')) {
          return alert('Wrong file type - JPG only.')
        }
        if (e.target.result.length > MAX_IMAGE_SIZE) {
          return alert('Image is loo large - 1Mb maximum')
        }
        this.state.image= e.target.result
    }
    reader.readAsDataURL(file)
}
  onClickHandler = (e) => {
    let binary = atob(this.state.image.split(',')[1])
    let array = []
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }

    let blobData = new Blob([new Uint8Array(array)], {type: 'image/jpeg'})
    this.setState({image: null})
    return axios.get(API_ENDPOINT).then((response)=>{
      console.log(response)
      console.log(response.data.uploadURL.split('?')[0]) 
      this.setState({uploadURL:response.data.uploadURL.split('?')[0]})
      return fetch(response.data.uploadURL, {
          method: 'PUT',
          body: blobData
        })
          .then(res => {
            // then print response status
            toast.success("upload success");
          })
          .catch(err => {
            // then print response status
            toast.error("upload fail");
          });
      })
      .catch(err => {
        console.log("Error in response");
        console.log(err);
      });
  };
  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;

    return (
      <div className="container">
        <form className="white" onSubmit={this.handleSubmit}>
          <h5
            className="grey-text text-darken-3"
            style={{ textAlign: "center" }}
          >
            Tạo Sự Kiện Mới
          </h5>
          <div className="input-field">
            <input
              type="text"
              id="title"
              onChange={this.handleChange}
              required
            />
            <label htmlFor="title">Tiêu Đề Sự Kiện</label>
            <FormError
              type="title"
              isHidden={this.state.isInputValid}
              errorMessage={this.state.errorMessage}
            />
          </div>
          <div className="input-field">
            <textarea
              id="content"
              className="materialize-textarea"
              onChange={this.handleChange}
              required
            ></textarea>
            <label htmlFor="content">Nội Dung Sự Kiện</label>
            <FormError
              type="title"
              isHidden={this.state.isInputValid}
              errorMessage={this.state.errorMessage}
            />
          </div>
          <div className="input-field">

            <textarea id="organization" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label htmlFor="organization">Tổ Chức Thành Lập Sự Kiện</label>
            <FormError
              type="title"
              isHidden={this.state.isInputValid}
              errorMessage={this.state.errorMessage}
            />
          </div>
          {/* <Grid container spacing={3}>
            <Grid item xs={6} md={6} lg={6}><ImageAudioVideo /></Grid>
          </Grid> */}

          <input type="file" name="file" onChange={(e)=>this.onFileChange(e)}/>
          <button type="button" class="btn btn-success btn-block" onClick={(e)=>this.onClickHandler(e)}>Upload</button>
          <div className="input-field">
            <input
              type="text"
              id="phoneNumber"
              onChange={this.handleChange}
              required
            />
            <label htmlFor="title">Số Điện Thoại Liên Hệ</label>
            <FormError
              type="title"
              isHidden={this.state.isInputValid}
              errorMessage={this.state.errorMessage}
            />
          </div>

          <div className="row">
            <div className="col xs=6 sm=6 md=6">
              Ngày Sự Kiện Diễn Ra :
              <DatePicker
                selected={this.state.date}
                onChange={this.handleChangeDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeInterval={15}
                timeCaption="time"
                dateFormat="d-MM-yyyy h:mm aa"
              />
            </div>
          </div>

          <MapWithSearch
            google={this.props.google}
            center={{ lat: 10.7296192, lng: 106.6943174 }}
            height="300px"
            zoom={15}
          />

          <div className="input-field">

            {this.state.uploadURL?<button className="btn lighten-1" color="#39B04B">Tạo Sự Kiện</button>:<button className="btn lighten-1" disabled="true" color="#39B04B">Tạo Sự Kiện</button>}
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createSite: (site) => dispatch(createSite(site)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateSite)