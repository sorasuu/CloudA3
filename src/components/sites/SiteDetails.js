import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import DatePicker from "react-datepicker";
import VolunteerForm from "./volunteerForm";
import { MapMarker } from "../maps/MapSiteDetail";
import CollectionTable from "./collectionTable";
import { Grid, Divider, Button } from "@material-ui/core";
import Dropzone from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
import {
  withScriptjs,
  withGoogleMap
} from "react-google-maps";
import MaterialTable from "material-table";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { createVolunteer } from "../../store/actions/voluteerAction";
import { editSite } from "../../store/actions/siteActions";
import ToolRequest from "./toolRequestForm";

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

class SiteDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: "Name", field: "name" },
        { title: "SDT", field: "phoneNumber", type: "numeric" },
        { title: "Email", field: "email" }
      ],
      volunteers: [],
      phoneNumber: "",
      volunteerNum: "",
      owner: false,
      showRequest: false
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
                <Grid item xs={5} md={3} lg={3}>
                  <div>
                    <div className="card" style={{ minWidth: 200 }}>
                      <div className="card-image">
                        <img src={site.authorPhotoURL} />
                      </div>

                      <h4
                        style={{ textAlign: "center", marginTop: "15px" }}
                        className="card-title"
                      >
                        {site.authorName}
                      </h4>
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
                  <div>
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
                </Grid>
                <Grid item xs={7} md={9} lg={9}>
                  <h5 style={{ textAlign: "center" }}>Địa Điểm Tổ Chức</h5>
                  <MapWrapped
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${API_KEY}`}
                    loadingElement={<div style={{ height: `80%` }} />}
                    containerElement={<div style={{ height: `80%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    site={site}
                  />
                  <div style={{textAlign:'center', marginTop:10}}>{this.state.owner ? null : <VolunteerForm site={site} />}</div>
                </Grid>
              </Grid>
            </div>


            <Grid container spacing={3}>
              <Grid item xs={6}>
                <VolunteerTable />
                <div className="row">
                  <div className="col xs=6 md=6 lg=6">
                  <Button variant="outlined" color="primary" onClick={e => this.handleDownloadExcel(e)}>
                    Download Excel
                  </Button>
                  </div>
                  <div className="col xs=6 md=6 lg=6">
                    <ToolRequest/>
                  </div>


                </div>
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
            <h5 style={{textAlign:"center"}}>Collection Table</h5>
            <CollectionTable props={this.props} />
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
