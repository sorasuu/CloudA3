
import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import VolunteerForm from "./volunteerForm";
import { MapMarker } from "../maps/MapSiteDetail";
import CollectionTable from "./collectionTable";
import { Grid, Divider, Button } from "@material-ui/core";
import Dropzone from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
import { withScriptjs, withGoogleMap } from "react-google-maps";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { createVolunteer } from "../../store/actions/voluteerAction";
import { editSite } from "../../store/actions/siteActions";
import ToolRequest from "./toolRequestForm";
import AgendaTable from "./AgendaTable";
import EnhancedTable from "./Volunteer";
import CarouselImage from "../layout/ImageGridView";

const API_KEY = "AIzaSyCukFLNeMl4inkvLQ8ZNNQzbC3q1zmcibI";

const MapWrapped = withScriptjs(withGoogleMap(MapMarker));

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
      agendaColumns: [
        { title: "Date", field: "date", type: "date" },
        { title: "Activity", field: "activity", type: "text" }
      ],
      columns: [
        { title: "Name", field: "name" },
        { title: "SDT", field: "phoneNumber", type: "numeric" },
        { title: "Email", field: "email" }
      ],
      agendaData: [],
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
                  <AgendaTable date={this.props.site.date} />
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
              <EnhancedTable volunteers={this.state.volunteers} />
              <Grid container spacing={3}>
                <Grid item xs={4}>
                    <div className="col xs=4 md=4 lg=4">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={e => this.handleDownloadExcel(e)}
                      >
                        Download Excel
                      </Button>
                    </div>
                </Grid>
                <Grid item xs={4}> <div className="col xs=4 md=4 lg=4">
                  <ToolRequest />
                </div></Grid>
                <Grid item xs={4}> <div>
                  {this.state.owner ? (
                      <div>
                        <ImageAudioVideo />
                      </div>
                  ) : null}
                </div></Grid>

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
