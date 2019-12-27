import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createSite } from '../../store/actions/siteActions'
import { Redirect } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import MapWithSearch from '../maps/MapWithSearch'

function FormError(props){
  if (props.isHidden){return null;}
  return(
    <div className="form-warning">
      {props.errorMessage}
    </div>
  )
}
const validateInput = (checkingText) =>{
  const regexp = /^[a-zA-Z]+$/;
  const checkingResult = regexp.exec(checkingText);
  if (checkingResult !==null){
    return { isInputValid: true,
    errorMessage: ''};
  }else{
    return { isInputValid: false,
    errorMessage: 'Error '}
  }
};

class CreateSite extends Component {

  state = {
    title: '',
    content: '',
    address: '',
    phoneNumber:'',
    startDate: new Date(),
    endDate: new Date(),
    location:{
      lat:'',
      lng:''
    },
    showMap: false,
    confirm: false,
    pending: true,
  };
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  };
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    this.props.createSite({...this.state,location:{
      lat:localStorage.getItem('lat'),
      lng:localStorage.getItem('lng')
    },address:localStorage.getItem('address')
  });
    this.props.history.push('/');
    localStorage.clear();
  };
  handleChangeStart = date => {
    this.setState({
      startDate: date
    });
  };
  handleChangeEnd = date => {
    this.setState({
      endDate: date
    });
  };

  handleShowMap(){
    this.setState({showMap: !this.state.showMap})
  }
  render() {
    const { auth } = this.props;
    if (!auth.uid)  return <Redirect to='/signin' />;

    return (
      <div className="container">
        <form className="white" onSubmit={this.handleSubmit}>
          <h5 className="grey-text text-darken-3" style={{textAlign:"center"}}>Tạo Sự Kiện Mới</h5>
          <div className="input-field">
            <input type="text" id='title' onChange={this.handleChange} required />
            <label htmlFor="title">Tiêu Đề Sự Kiện</label>
            <FormError type="title" isHidden={this.state.isInputValid} errorMessage={this.state.errorMessage}/>

          </div>
          <div className="input-field">
            <textarea id="content" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label htmlFor="content">Nội Dung Sự Kiện</label>
            <FormError type="title" isHidden={this.state.isInputValid} errorMessage={this.state.errorMessage}/>

          </div>
          <div className="input-field">
            <input type="text" id='phoneNumber' onChange={this.handleChange} required />
            <label htmlFor="title">Số Điện Thoại Liên Hệ</label>
            <FormError type="title" isHidden={this.state.isInputValid} errorMessage={this.state.errorMessage}/>

          </div>
          
          <div className="row">
            <div className="col xs=6 sm=6 md=6">Ngày Bắt Đầu :
              <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChangeStart}
                showTimeSelect
                timeFormat="HH:mm"
                timeInterval={15}
                timeCaption = "time"
                dateFormat="d MMMM, yyyy h:mm aa"
              />
            </div>
            <div className="col xs=6 sm=6 md=6">
              Ngày Kết Thúc :
              <DatePicker
                selected={this.state.endDate}
                onChange={this.handleChangeEnd}
                showTimeSelect
                timeFormat="HH:mm"
                timeInterval={15}
                timeCaption = "time"
                dateFormat="d MMMM, yyyy h:mm aa"
              />
            </div>
          </div>
          
           <MapWithSearch
              google = {this.props.google}
              center = {{lat: 10.7296192, lng: 106.6943174}}
              height ='300px'
              zoom={15}
              // locationFromChild = {this.callbackfromchild}
            />
        
          <div className="input-field">
            <button className="btn lighten-1" color="#39B04B">Tạo Sự Kiện</button>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createSite: (site) => dispatch(createSite(site)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateSite)