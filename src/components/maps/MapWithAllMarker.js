
import React from "react";
import { withGoogleMap, withScriptjs } from "react-google-maps";
import MapClusterer from "./MapClusterer";
import {
  MenuList,  MenuItem,
  Grid,  withStyles, Popper,
  ClickAwayListener,
  Grow,  Avatar,
  Card,  CardHeader,
  CardContent
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { firestoreConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";
import Paper from "@material-ui/core/Paper";
import FilterListIcon from '@material-ui/icons/FilterList';

const API_KEY = "AIzaSyCukFLNeMl4inkvLQ8ZNNQzbC3q1zmcibI";
const MapWrapped = withScriptjs(withGoogleMap(MapClusterer));
const useStyles = theme => ({
  card: {
    display: "flex"
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    width: 151
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  playIcon: {
    height: 38,
    width: 38
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: "100%"
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
});

class MapWithAllMarker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: "Tiêu Đề", field: "name", phoneNumber: '' },
        { title: "Ảnh Đại Diện", field: "avatar" },
        { title: "Event Date", field: 'startDate' },
        { title: 'address', field: 'address' }
      ],
      dataApproval: [],
      currentLocation: {lat:'', lng:''},
      currentId: '',
    };
  }

  updateShared(shared_value) {
    this.setState({ currentMarker: shared_value });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const sitesApprove = [];
    if (nextProps.sitesApproved) {
      nextProps.sitesApproved.map(siteApproved => {
        const data = {
          name: siteApproved.title,
          address: siteApproved.address,
          date: (siteApproved.date.toDate()).toLocaleString('en-GB'),
          id: siteApproved.id,
          avatar: siteApproved.image,
          location: siteApproved.location
        };
        sitesApprove.push(data);
      });
      this.setState({
        dataApproval: sitesApprove
      });
    }
  }

  render() {
    console.log(this.state.dataApproval, 'dataApproval');
    const AllSitesTable = () => {
      const { classes } = this.props;
      const [open, setOpen] = React.useState(false);
      const anchorRef = React.useRef(null);
      const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
      };

      const handleClose = event => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
          return;
        }
        setOpen(false);
      };

      function handleListKeyDown(event) {
        if (event.key === "Tab") {
          event.preventDefault();
          setOpen(false);
        }
      }

      // return focus to the button when we transitioned from !open -> open
      const prevOpen = React.useRef(open);
      React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
          anchorRef.current.focus();
        }

        prevOpen.current = open;
      }, [open]);

      const handleMouseOver = (event) => {
        const currentLocation = {
          lat: event.currentTarget.getAttribute("valueLat"),
          lng: event.currentTarget.getAttribute("valueLng")
        };
        this.setState({ currentId: event.currentTarget.getAttribute("value")});
        this.setState({ currentLocation: currentLocation });
        console.log(this.state.currentLocation.lat, this.state.currentLocation.lng, "day la location");
        console.log(event.currentTarget.getAttribute("value"), 'day la id')
      };
      return (

        <Grid container spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={8} md={8} style={{ textAlign: 'center' }}>
              <Link to="/create">
                <Button color="primary" background-color="primary">
                  Tạo Sự Kiện Mới
              </Button>
              </Link>
            </Grid>
            <Grid item xs={4} md={4} style={{ textAlign: 'center' }}>
              <FilterListIcon
                ref={anchorRef}
                aria-controls={open ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={handleToggle} />

              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom"
                          ? "center top"
                          : "center bottom"
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="menu-list-grow"
                          onKeyDown={handleListKeyDown}
                        >
                          <MenuItem onClick={handleClose}>
                            Địa Điểm Tổ Chức
                              </MenuItem>
                          <MenuItem onClick={handleClose}>
                            Số Người Tham Gia
                              </MenuItem>
                          <MenuItem onClick={handleClose}>
                            Ngày Tổ Chức
                              </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Grid>
          </Grid>

          {this.state.dataApproval.map(row => {
            console.log(row.location.lat, 'row location ne');
            return (
              <Card className={classes.card}
                valueLat = {row.location.lat}
                    valueLng={row.location.lng}
                    value = {row.id}
                onMouseOver={handleMouseOver} 
                style={{marginBottom:5}}
                key={row.id}>
               <Link to={`site/${row.id}`}>
                <CardHeader
                  avatar={
                    <Avatar className={classes.avatar}>
                      <img src={row.avatar}  alt={'picture'}/>
                    </Avatar>
                  }
                  title={row.name}
                  subheader={row.date}
                />
                <CardContent>
                  {row.address}
                </CardContent>
                </Link>
              </Card>
            );
          })}

        </Grid>

    );
  };
    return (
      // <Grid container spacing={3}>
      this.state.dataApproval ? (
        <Grid container spacing={3}>
          <Grid item xs={3} style={{ height: "100vh" }}>
            <AllSitesTable />
          </Grid>
          <Grid item xs={1}>
            <img src={'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD'}/>
            {[
              "https://vietnamsachvaxanh.org/wp-content/uploads/a1.-HCMC-US-Consulate-logo-high-ress.png",
              "https://vietnamsachvaxanh.org/wp-content/uploads/a1.-SSISs.png",
              "https://vietnamsachvaxanh.org/wp-content/uploads/Logo-WAVE.png",
              "https://vietnamsachvaxanh.org/wp-content/uploads/aaAmChamss.png"
            ].map((logo, index) => (
              <Card key={index}>
                <img style={{ width: 100, height: 100 }} src={logo} />
              </Card>
            ))}
          </Grid>
          <Grid item xs={7} style={{ width: "100%", height: "100vh" }}>
            <MapWrapped
              googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${API_KEY}`}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `100%` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              props={this.props}
              currentLocation={this.state.currentLocation}
              currentId = {this.state.currentId}
            />
          </Grid>
          <Grid item xs={1}>

            {[
              "https://vietnamsachvaxanh.org/wp-content/uploads/vespa-adventures.png",
              "https://vietnamsachvaxanh.org/wp-content/uploads/a2000px-Intel-logo.svgs_.png",
              "https://vietnamsachvaxanh.org/wp-content/uploads/1.png",
              "https://vietnamsachvaxanh.org/wp-content/uploads/heineken-vietnam-brewery-5a050226408b8.jpg"
            ].map((logo, index) => (
              <Card key={index}>
                <img style={{ width: 110, height: 110 }} src={logo} />
              </Card>
            ))}
          </Grid>
        </Grid>
      ) : null
    );
  }
}

const mapStateToProps = (state) => {

  return {
    sites: state.firestore.ordered.sitesApproved,
    sitesApproved: state.firestore.ordered.sitesApproved,
    // chosenPlaceId: state.site.id
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "sites",
      where: [["pending", "==", false]],
      storeAs: "sitesApproved"
    }
    // { collection: 'sites', where:[["pending","==",false]] },
    // { collection: 'notifications', limit: 3, orderBy: ['time', 'desc']}
  ])
)(withStyles(useStyles)(MapWithAllMarker));

