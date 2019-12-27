import React, { useState, useEffect } from "react";
import { withGoogleMap, withScriptjs } from "react-google-maps";
import MapClusterer from "./MapClusterer";
import {
  MenuList,
  MenuItem,
  Grid,
  withStyles,
  TableRow,
  Popper,
  Divider,
  ClickAwayListener,
  Grow
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { firestoreConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";

const API_KEY = "AIzaSyCukFLNeMl4inkvLQ8ZNNQzbC3q1zmcibI";

const MapWrapped = withScriptjs(withGoogleMap(MapClusterer));

const useStyles = theme => ({
  card: {
    display: "flex"
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
        { title: "Tiêu Đề", field: "name" },
        // { title: 'Địa Điểm', field: 'address' },
        { title: "Ảnh Đại Diện", field: "avatar" }
        // { title: 'Ngày Kết Thúc', field: 'endDate' },
      ],
      dataApproval: [],

    };
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
        // console.log(data.startDate, "startDate");
        sitesApprove.push(data);
      });
      console.log(sitesApprove, "data approval");
      this.setState({
        dataApproval: sitesApprove
      });
    }
  }

  render() {
    console.log(this.props, "All Marker Props");

    const AllSitesTable = () => {
      const { classes } = this.props;
      console.log(this.props, 'this props trong allsitestable');
      // const choseId = this.props.chosenPlaceId;
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
        var placeId = event.currentTarget.getAttribute("value");
        // var action ={
        //   type: 'ADD_PLACE',
        //   data: {
        //     site: site
        //   }
        // };
        // this.props.dispatch(action);
        console.log(placeId, 'id of place chosen');
      };
      return (
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableCell>
                  <Link to="/create">
                    <Button color="primary" background-color="primary">
                      Tạo Sự Kiện Mới
                    </Button>
                  </Link>
                </TableCell>
                <TableCell>
                  <Button
                    ref={anchorRef}
                    aria-controls={open ? "menu-list-grow" : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                  >
                    Filter By:
                  </Button>
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
                </TableCell>
              </TableHead>
              <Divider />
              <TableBody>
                {this.state.dataApproval.map( row => {
                  return (
                    <Link to={`/site/${row.id}`}>
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                        value={row.id}
                        onMouseOver={handleMouseOver}
                      >
                        {this.state.columns.map(column => {
                          const value = row[column.field];
                          return (
                            <TableCell key={column.field} align={column.align}>
                              {/*<img src='https://upload.wikimedia.org/wikipedia/commons/6/67/Firefox_Logo%2C_2017.svg'/>*/}
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </Link>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      );
    };
    return (
      // <Grid container spacing={3}>
      this.state.dataApproval ? (
        <Grid container spacing={3}>
          <Grid item xs={3} style={{ height: "100vh" }}>
            <AllSitesTable/>
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
  console.log(state, 'state trong MapWithAllMarker');

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
