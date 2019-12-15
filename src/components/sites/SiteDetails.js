import React from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import moment from 'moment'
import { Grid, Divider, Button } from '@material-ui/core'
import { mergeClasses } from '@material-ui/styles'
import { withScriptjs, withGoogleMap, Marker, GoogleMap, InfoWindow } from 'react-google-maps'
import MaterialTable from 'material-table'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import {createVolunteer} from '../../store/actions/voluteerAction'
import {editSite} from '../../store/actions/siteActions'
function MapMarker(site) {

  console.log(site, "Marker Site")

  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: 10.7296192, lng: 106.6943174 }}
    // defaultOptions={{ styles: mapStyles }}
    >
      <Marker
        position={{
          lat: parseFloat(site.site.location.lat),
          lng: parseFloat(site.site.location.lng)
        }}

      />
      <InfoWindow
        position={{
          lat: parseFloat(site.site.location.lat),
          lng: parseFloat(site.site.location.lng),
        }}
      >
        <b>{site.site.title}</b>


      </InfoWindow>
    </GoogleMap>
  )
}

const API_KEY = 'AIzaSyCukFLNeMl4inkvLQ8ZNNQzbC3q1zmcibI'

const MapWrapped = withScriptjs(withGoogleMap(MapMarker))

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
}

class SiteDetails extends React.Component {
  state = {
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Email', field: 'email' },
      { title: 'Số Điện Thoại', field: 'phoneNumber', type: 'numeric' },
    ],
    volunteers: [],
    name: '',
    email: '',
    phoneNumber: '',
    volunteerNum: '',
    trashLoad: '',
    owner: false,
    
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("next", nextProps)
    this.setState({
      volunteers: nextProps.volunteers
    })
    if(nextProps.site){
    if (nextProps.auth.uid == nextProps.site.authorId) {
      this.setState({ owner: true })
    }
  }}
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    // console.log(this.state);
    const volunteer = {
      id: (this.state.email + this.state.name).split('@').join('').split('.').join('').split(' ').join(''),
      name: this.state.name,
      email: this.state.email,
      phoneNumber: this.state.phoneNumber,
      siteId: this.props.match.params.id
    }
    this.props.createVolunteer(volunteer);
    this.props.history.push('/');
  }
  handleSubmitDone = (e) => {
    e.preventDefault();
    console.log(this.state);
    this.props.editSite({
      ...this.props.site,
      done: true,
      volunteerNum: this.state.volunteerNum,
      trashLoad: this.state.trashLoad,id:this.props.match.params.id
    })
    this.props.history.push('/');
  }

  handleDownloadExcel = (e) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(this.state.volunteers);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "volunteer" + fileExtension);
  }

  render() {
    const { site, auth } = this.props;

    const VolunteerTable = () => {
      return (
        <MaterialTable
          title="Danh Sách Tình Nguyện Viên"
          columns={this.state.columns}
          data={this.state.volunteers}
          editable={{
            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  if (oldData) {
                    this.setState(prevState => {
                      const volunteers = [...prevState.volunteers];
                      volunteers[volunteers.indexOf(oldData)] = newData;
                      return { ...prevState, volunteers };
                    });
                  }
                }, 600);
              }),
            onRowDelete: oldData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  this.setState(prevState => {
                    const volunteers = [...prevState.volunteers];
                    volunteers.splice(volunteers.indexOf(oldData), 1);
                    return { ...prevState, volunteers };
                  });
                }, 600);
              }),
          }}
        />
      );
    }
    // if (!auth.uid) return <Redirect to='/signin' />
    // console.log(auth, "Auth ne")
    // console.log(site, "Site ne")



    if (site) {
      return (
        <div className="container section site-details">
          <div className="row">
            <div style={{ textAlign: 'center' }}>
              <h1>{site.title}</h1>
            </div>
            <Divider />
            <div>
              <Grid container spacing={3}>
                <Grid item xs={6} md={6} lg={6}>
                  <div className="row">
                    <div className="col s6 m6">
                      <div className="card">
                        <div className="card-image">
                          <img src={site.authorPhotoURL} />
                        </div>

                        <h4 style={{ textAlign: 'center', marginTop: '15px' }} className="card-title">{site.authorName}</h4>
                        <p style={{ textAlign: 'center' }}>Người Lập Sự Kiện</p>
                        <div className="card-content">
                          <li>
                            <i>Email: </i>
                            <a>{site.authorEmail}</a>
                          </li>
                          <li>
                            <i>Số Điện Thoại: </i>
                            <a>{site.phoneNumber}</a>

                          </li>
                        </div>
                      </div>
                    </div>
                    <div className="col s6 m6">
                      <div className="card">

                        <h5 style={{ textAlign: 'center', marginTop: '15px' }}
                          className="card-title">Nội Dung Sự Kiện</h5>
                        <p style={{ textAlign: 'center' }}>{site.content}</p>
                        <div className="card-content">

                        </div>
                      </div>
                    </div>
                  </div>

                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <h5 style={{ textAlign: 'center' }}>Địa Điểm Tổ Chức</h5>
                  <MapWrapped
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${API_KEY}`}
                    loadingElement={<div style={{ height: `80%` }} />}
                    containerElement={<div style={{ height: `80%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    site={site}
                  />
                </Grid>

              </Grid>
            </div>
            <div>
            {this.state.owner ?null:
              <div className="container">
                <form className="white" onSubmit={this.handleSubmit}>
                  <h5 className="grey-text text-darken-3">Đăng Ký Sự Kiện</h5>
                  <div className="input-field">
                    <input type="text" id='name' onChange={this.handleChange} required />
                    <label htmlFor="name">Tên</label>
                    <FormError type="title" isHidden={this.state.isInputValid} errorMessage={this.state.errorMessage}/>

                  </div>
                  <div className="input-field">
                    <textarea id="email" className="materialize-textarea" onChange={this.handleChange} required></textarea>
                    <label htmlFor="email">Email</label>
                  </div>
                  <div className="input-field">
                    <textarea id="phoneNumber" className="materialize-textarea" onChange={this.handleChange}></textarea>
                    <label htmlFor="phoneNumber">Số Điện Thoại</label>
                    <FormError type="title" isHidden={this.state.isInputValid} errorMessage={this.state.errorMessage}/>

                  </div>
                  <div className="input-field">
                    <button className="btn lighten-1" color="#39B04B">Đăng ký</button>
                  </div>
                </form>
              </div>}
            </div>
            <div>
              <h5 style={{ textAlign: 'center' }}>Danh Sách Tình Nguyện Viên</h5>
            </div>
            <VolunteerTable />
            <Button onClick={(e) => this.handleDownloadExcel(e)}>Dowload Excel</Button>
            {this.state.owner ? <div className="container">
              <form className="white" onSubmit={this.handleSubmitDone}>
                <h5 className="grey-text text-darken-3">Tổng Kết Sự Kiện</h5>
                <div className="input-field">
                  <input type="text" id='volunteerNum' onChange={this.handleChange} />
                  <label htmlFor="volunteerNum">Số Lượng Người Tham Gia</label>
                </div>
                <div className="input-field">
                  <textarea id="trashLoad" className="materialize-textarea" onChange={this.handleChange}></textarea>
                  <label htmlFor="trashLoad">Lượng Rác thu Gom</label>
                </div>
                <div className="input-field">
                  <button className="btn lighten-1" color="#39B04B">Lưu</button>
                </div>
              </form>
            </div> : null}
          </div>    
          </div>
        




      )
    } else {
      return (
        <div className="container center">
          <p>Loading site...</p>
        </div>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state, 'all state');
  // const user = state.firestore.data.users
  const id = ownProps.match.params.id;
  const sites = state.firestore.data.sites;
  const site = sites ? sites[id] : null;
  const volunteers= state.firestore.ordered.volunteers
  return {
    site: site,
    auth: state.firebase.auth,
    volunteers: volunteers
  }
}

const mapDispatchToProps = dispatch => {
  return{
  createVolunteer: (volunteers) => dispatch(createVolunteer(volunteers)),
  editSite: (site) => dispatch(editSite(site)),
}
}

export default compose(
  connect(mapStateToProps,mapDispatchToProps),
  firestoreConnect((props) => {
    if (!props.sites) return [{ collection: 'sites', doc: props.match.params.id }, { collection: 'sites', doc: props.match.params.id, subcollections: [{ collection: "volunteers" }], storeAs: "volunteers" }]

  })
)(SiteDetails)
