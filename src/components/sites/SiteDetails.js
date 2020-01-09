

import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import VolunteerForm from "./volunteerForm";
import { MapMarker } from "../maps/MapSiteDetail";
import CollectionTable from "./collectionTable";
import { Grid, Divider, Button } from "@material-ui/core";
import Dropzone from "react-dropzone-uploader";
import { withScriptjs, withGoogleMap } from "react-google-maps";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { createVolunteer } from "../../store/actions/voluteerAction";
import { editSite, updateSite, sendTool } from "../../store/actions/siteActions";
import ToolRequest from "./toolRequestForm";
import AgendaTable from "./AgendaTable";
import EnhancedTable from "./Volunteer";
import CarouselImage from "../layout/ImageGridView";
import anh2 from "../../images/ok2.png";
import FileUploader from "react-firebase-file-uploader";
import firebase from "firebase";

const API_KEY = "AIzaSyCukFLNeMl4inkvLQ8ZNNQzbC3q1zmcibI";

const MapWrapped = withScriptjs(withGoogleMap(MapMarker));


class SiteDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      agendaColumns: [
        { title: "Date", field: "date", type: "date" },
        { title: "Activity", field: "activity", type: "text" }
      ],
      columns: [
        { title: "Name", field: "name" },
        { title: "SDT", field: "phoneNumber", type: "numeric" },
        { title: "Email", field: "email" }
      ],
      volunteers: [],
      phoneNumber: "",
      volunteerNum: "",
      owner: false,
      showRequest: false,
      filenames: [],
      downloadURLs: [],
      isUploading: false,
      uploadProgress: 0
    };
  }
  handleUploadStart = () =>
  this.setState({
    isUploading: true,
    uploadProgress: 0
  });

handleProgress = progress =>
  this.setState({
    uploadProgress: progress
  });

handleUploadError = error => {
  this.setState({
    isUploading: false
    // Todo: handle error
  });
  console.error(error);
};

handleUploadSuccess = async filename => {
  const downloadURL = await firebase
    .storage()
    .ref("images")
    .child(filename)
    .getDownloadURL();

  this.setState(oldState => ({
    filenames: [...oldState.filenames, filename],
    downloadURLs: [...oldState.downloadURLs, downloadURL],
    uploadProgress: 100,
    isUploading: false
  }));
};
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
    console.log(this.props, 'site details props');

    if (site && this.state.volunteers) {
      return (
        <div>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CarouselImage />
            </Grid>
            <Grid item xs={6}>
              <CarouselImage />
            </Grid>
          </Grid>
          <div className="container section site-details">
            <div>
              <div style={{ textAlign: "center" }}>
                <h1>{site.title}</h1>
              </div>
              <Divider />
              <div className={'card'}>
                <Grid container spacing={3}>
                  <Grid item xs={5} md={3} lg={3}>
                    <div
                      className="card"
                      style={{ minWidth: 100, maxWidth: 200 }}
                    >
                      <div className="card-image">
                        <img src={site.authorPhotoURL} />
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={7} md={9} lg={9}>
                    <Grid container spacing={2}>
                      <Grid item xs={7}>
                        <div
                          style={{
                            width: `100%`,
                            height: `100%`,
                            paddingLeft: 30
                          }}
                        >
                          <Grid container spacing={2}>
                            <div className={'row'} style={{marginLeft:20}}>
                              <h5>Organization:</h5>
                              <div>{site.authorName}</div>
                              <h6>Email:</h6>
                              <div>{site.authorEmail}</div>
                              <h6>Phone Number:</h6>
                              <div>{site.phoneNumber}</div>
                            </div>
                          </Grid>
                        </div>
                      </Grid>
                      <Grid item xs={5} md={3} lg={3}>
                        <div
                          style={{ width: `100%`, height: `100%` }}
                        >
                          <div className={'container'}  style={{ textAlign: "center" }}>
                            <h5>
                              Content
                            </h5>
                            <p>
                              {site.content}
                            </p>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <h5>Agenda</h5>
                  {this.props.site?<AgendaTable props= {this.props}  />:<p>Loading...</p>}
                  
                  {this.state.owner ? null : (
                      <div style={{textAlign: "center", paddingTop:20}}>
                      <VolunteerForm props={this.props} />
                      </div>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <h6>Địa Điểm Tổ Chức</h6>
                  <MapWrapped
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${API_KEY}`}
                    loadingElement={<div style={{ height: `80%` }} />}
                    containerElement={<div style={{ height: `80%` }} />}
                    mapElement={<div style={{ height: 500 }} />}
                    site={site}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <EnhancedTable volunteers={this.state.volunteers} />
                  <div className="row">
                    <div className="col xs=6 md=6 lg=6">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={e => this.handleDownloadExcel(e)}
                      >
                        Download Excel
                      </Button>
                    </div>
                    <div className="col xs=6 md=6 lg=6">
                      <ToolRequest props ={this.props}/>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  {/*Event Pictures*/}
                  <CarouselImage />
                  {this.state.owner ? (
                    <div className="container">
                      <FileUploader
          accept="image/*"
          name="image-uploader-multiple"
          randomizeFilename
          storageRef={firebase.storage().ref("images")}
          onUploadStart={this.handleUploadStart}
          onUploadError={this.handleUploadError}
          onUploadSuccess={this.handleUploadSuccess}
          onProgress={this.handleProgress}
          multiple
        />
 
        <p>Progress: {this.state.uploadProgress}</p>
 
        <p>Filenames: {this.state.filenames.join(", ")}</p>
 
        <div>
          {this.state.downloadURLs.map((downloadURL, i) => {
            // console.log(this.state.downloadURLs)
            return <img key={i} src={downloadURL} />;
          })}
        </div>
                    </div>
                  ) : null}
                </Grid>
              </Grid>
              <h5 style={{ textAlign: "center" }}>Collection Table</h5>
              <CollectionTable props={this.props} />
            </div>
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
    editSite: site => dispatch(editSite(site)),
    updateSite : site => dispatch(updateSite(site)),
    sendTool: tool => dispatch(sendTool(tool))
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
