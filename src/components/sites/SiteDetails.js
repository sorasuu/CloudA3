import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import DatePicker from "react-datepicker";
import { makeStyles } from '@material-ui/core/styles';
import CollectionTable from './collectionTable'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Grid, Divider, Button, Checkbox } from "@material-ui/core";
import Dropzone from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
import {
  withScriptjs,
  withGoogleMap,
  Marker,
  GoogleMap,
  InfoWindow
} from "react-google-maps";
import MaterialTable from "material-table";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { createVolunteer } from "../../store/actions/voluteerAction";
import { editSite } from "../../store/actions/siteActions";
function MapMarker(site) {
  // console.log(site, "Marker Site");

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
        // icon={}
      >

        <InfoWindow>
          <b>{site.site.title}</b>
        </InfoWindow>
      </Marker>
    </GoogleMap>
  );
}

const API_KEY = "AIzaSyCukFLNeMl4inkvLQ8ZNNQzbC3q1zmcibI";

const MapWrapped = withScriptjs(withGoogleMap(MapMarker));

function FormError(props) {
  if (props.isHidden) {
    return null;
  }
  return <div className="form-warning">{props.errorMessage}</div>;
}
const validateInput = checkingText => {
  const regexp = /^[a-zA-Z]+$/;
  const checkingResult = regexp.exec(checkingText);
  if (checkingResult !== null) {
    return { isInputValid: true, errorMessage: "" };
  } else {
    return { isInputValid: false, errorMessage: "Error " };
  }
};

const ImageAudioVideo = () => {
  const getUploadParams = ({ meta }) => {
    const url = "https://httpbin.org/post";
    return {
      url,
      meta: { fileUrl: `${url}/${encodeURIComponent(meta.name)}` }
    };
  };

  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta);
  };

  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta));
    allFiles.forEach(f => f.remove());
  };

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept="image/*,audio/*,video/*"
      inputContent={(files, extra) =>
        extra.reject
          ? "Image, audio and video files only"
          : "Upload Event Photos & Videos "
      }
      styles={{
        dropzoneReject: { borderColor: "red", backgroundColor: "#DAA" },
        inputLabel: (files, extra) => (extra.reject ? { color: "red" } : {})
      }}
    />
  );
};

// for create collection table
const TAX_RATE = 0.07;

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createRow('Paperclips (Box)', 100, 1.15),
  createRow('Paper (Case)', 10, 45.99),
  createRow('Waste Basket', 2, 17.99),
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;


class SiteDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: "Name", field: "name" },
        { title: "SDT", field: "phoneNumber", type: "numeric" },
        { title: "Email", field: "email" },
      ],
      volunteers: [],
      name: "",
      email: "",
      phoneNumber: "",
      volunteerNum: "",
      trashLoad: "",
      dob: new Date(),
      owner: false,
      isBuyShirt: false,
      isBuyTool: false,
      tools: [
        {tong:''},
        {gloves:''},
        {bags:''}
      ],
      showRequest: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      volunteers: nextProps.volunteers
    });
    if (nextProps.site) {
      if (nextProps.auth.uid == nextProps.site.authorId) {
        this.setState({ owner: true });
      }
    }
  }
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    // console.log(this.state);
    const volunteer = {
      id: (this.state.email + this.state.name)
        .split("@")
        .join("")
        .split(".")
        .join("")
        .split(" ")
        .join(""),
      name: this.state.name,
      email: this.state.email,
      phoneNumber: this.state.phoneNumber,
      dob: this.state.dob,
      siteId: this.props.match.params.id
    };
    this.props.createVolunteer(volunteer);
    this.props.history.push("/");
  };
  handleChangeDOB = date => {
    this.setState({
      dob: date
    });
  };
  handleSubmitDone = e => {
    e.preventDefault();
    console.log(this.state);
    this.props.editSite({
      ...this.props.site,
      done: true,
      volunteerNum: this.state.volunteerNum,
      trashLoad: this.state.trashLoad,
      id: this.props.match.params.id
    });
    this.props.history.push("/");
  };
  handleDownloadExcel = e => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(this.state.volunteers);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "volunteer" + fileExtension);
  };
  handleBuyShirt() {
    this.setState({ isBuyShirt: !this.state.isBuyShirt });
  }
  handleBuyTool() {
    this.setState({ isBuyTool: !this.state.isBuyTool });
  }
  togglePopup(){
    this.setState({
      showRequest: !this.state.showRequest,
    });
    console.log(this.state.showRequest, 'show request');
  }
  render() {
    const { site } = this.props;
    const VolunteerTable = () => {
      return (
        <MaterialTable
          title="Danh Sách Tham Gia"
          // style={{width:'100%', height:'80vh'}}
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
              })
          }}
        />
      );
    };

    if (site) {
      return (
        <div className="container section site-details">
          <div className="row">
            <div style={{ textAlign: "center" }}>
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

                        <h4
                          style={{ textAlign: "center", marginTop: "15px" }}
                          className="card-title"
                        >
                          {site.authorName}
                        </h4>
                        <p style={{ textAlign: "center" }}>Người Lập Sự Kiện</p>
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
                        <h5
                          style={{ textAlign: "center", marginTop: "15px" }}
                          className="card-title"
                        >
                          Nội Dung Sự Kiện
                        </h5>
                        <p style={{ textAlign: "center" }}>{site.content}</p>
                        <div className="card-content"></div>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <h5 style={{ textAlign: "center" }}>Địa Điểm Tổ Chức</h5>
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
              {this.state.owner ? null : (
                <div className="container">
                  <form className="white" onSubmit={this.handleSubmit}>
                    <h5 className="grey-text text-darken-3">Đăng Ký Sự Kiện</h5>
                    <div className="input-field">
                      <input
                        type="text"
                        id="name"
                        onChange={this.handleChange}
                        required
                      />
                      <label htmlFor="name">Tên</label>
                      <FormError
                        type="title"
                        isHidden={this.state.isInputValid}
                        errorMessage={this.state.errorMessage}
                      />
                    </div>
                    <div className="input-field">
                      <textarea
                        id="email"
                        className="materialize-textarea"
                        onChange={this.handleChange}
                        required
                      >

                      </textarea>
                      <label htmlFor="email">Email</label>
                    </div>
                    <div className="input-field">
                      <textarea
                        id="phoneNumber"
                        className="materialize-textarea"
                        onChange={this.handleChange}
                      >

                      </textarea>
                      <label htmlFor="phoneNumber">Số Điện Thoại</label>
                      <FormError
                        type="title"
                        isHidden={this.state.isInputValid}
                        errorMessage={this.state.errorMessage}
                      />
                      <div className="row">
                        <div className="col xs=3">
                          <label htmlFor="phoneNumber">Ngày Sinh </label>
                          <DatePicker
                            selected={this.state.dob}
                            onChange={this.handleChangeDOB}
                            dateFormat="dd-MM-yyyy"
                          />
                        </div>
                        <div className="col xs=9">
                          <i>Bạn có muốn mua: </i>
                          <Checkbox
                            checked={this.state.isBuyShirt}
                            onClick={e => this.handleBuyShirt(e)}
                          />
                          Áo Earth-Day 2020 ($5) |
                          <Checkbox
                            checked={this.state.isBuyTool}
                            onClick={e => this.handleBuyTool(e)}
                          />
                          Dụng Cụ
                          {this.state.isBuyTool ?
                              <div className="row">
                                <Checkbox/> tong ($5)
                                <Checkbox/> gloves($5)
                                <Checkbox/> bags ($5)
                              </div> : null
                          }
                        </div>
                      </div>
                    </div>
                    <div className="input-field">
                      <button className="btn lighten-1" color="#39B04B">
                        Đăng ký
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            <Grid container spacing={3}>
              <Grid item xs={6}>
              <VolunteerTable />

              <Button onClick={e => this.handleDownloadExcel(e)}>
                Download Excel
              </Button>
                <Button onClick={e => this.togglePopup.bind(this)}>
                  Send Tool Request
                </Button>

                {this.state.showRequest ?
                    <div></div>
                    :null
                    }
              </Grid>
              <Grid item xs={6}>

                {/*Event Pictures*/}

              {this.state.owner ? (
                <div className="container">
                  <ImageAudioVideo />
                </div>
              ) : null}
              </Grid>
            </Grid>
            <CollectionTable/>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container center">
          <p>Loading site...</p>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log(state, "all state");
  // const user = state.firestore.data.users
  const id = ownProps.match.params.id;
  const sites = state.firestore.data.sites;
  const site = sites ? sites[id] : null;
  const volunteers = state.firestore.ordered.volunteers;
  return {
    site: site,
    auth: state.firebase.auth,
    volunteers: volunteers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createVolunteer: volunteers => dispatch(createVolunteer(volunteers)),
    editSite: site => dispatch(editSite(site))
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => {
    if (!props.sites)
      return [
        { collection: "sites", doc: props.match.params.id },
        {
          collection: "sites",
          doc: props.match.params.id,
          subcollections: [{ collection: "volunteers" }],
          storeAs: "volunteers"
        }
      ];
  })
)(SiteDetails);
