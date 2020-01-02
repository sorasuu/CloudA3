import React from "react";
import { withGoogleMap, withScriptjs } from "react-google-maps";
import MapClusterer from "./MapClusterer";
import {
  MenuList,  MenuItem,
  Grid,  withStyles,
  TableRow,  Popper,
  Divider,  ClickAwayListener,
  Grow,  Avatar,
  Card,  CardHeader,
  CardContent,  CardMedia,
  TableBody, TableCell, TableContainer, TableHead
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { firestoreConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";
import Paper from "@material-ui/core/Paper";

// import MoreVertIcon from '@material-ui/icons/MoreVert';
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
          startDate: Date(siteApproved.startDate).toString(),
          endDate: Date(siteApproved.endDate),
          id: siteApproved.id
        };
        sitesApprove.push(data);
      });
      // console.log(sitesApprove, "data approval");
      this.setState({
        dataApproval: sitesApprove
      });
    }
  }

  render() {
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
        this.setState({ currentId: event.currentTarget.getAttribute("value") })
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
            return (
              <Card className={classes.card}
                value = {row.id}
                onMouseOver={handleMouseOver} 

                key={row.id}>
               <Link to={`site/${row.id}`}>
                <CardHeader
                  avatar={
                    <Avatar className={classes.avatar}>
                      <img src={row.avatar} />
                    </Avatar>
                  }
                  title={row.name}
                  subheader={row.startDate}
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
              currentId={this.state.currentId}
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
