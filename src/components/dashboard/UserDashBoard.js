import React, { Component } from 'react'
import SiteList from '../sites/SiteList'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect, Link } from 'react-router-dom'
import MaterialTable from 'material-table'
import { Tab, Tabs, AppBar, Box, Typography, makeStyles, withStyles } from '@material-ui/core'
import { Grid, Divider } from '@material-ui/core'
import { List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        height: 224,

    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex'
    },
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
    },
    divider: {
        margin: theme.spacing(2, 0),
    },

});


class UserDashboard extends Component {
    constructor(props) {
        super(props),
            this.state = {
                value: 0,
                columns: [
                    { title: 'Tiêu Đề', field: 'name' },
                    { title: 'Địa Điểm', field: 'address' },
                    { title: 'Ngày Bắt Đầu', field: 'startDate', type: 'date' },
                    { title: 'Ngày Kết Thúc', field: 'endDate', type: 'date' }
                    
                ],
                dataApproval: [],
             
                dataPending: [],
                dataDone: []
            }
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event, newValue) {
        this.setState({ value: newValue })
        console.log(this.state.value)
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        var sitesApprove= []
        var sitesPend=[]
        var siteDon=[]
        if(nextProps.sitesApproved){
      nextProps.sitesApproved.map(siteApproved=>{
          const data = {
            name:siteApproved.title,
            address:siteApproved.address,
            startDate: Date(siteApproved.startDate),
            endDate:Date(siteApproved.endDate),
            id: siteApproved.id
          }
          sitesApprove.push(data)
        })
        console.log(sitesApprove)
        this.setState({
          dataApproval:sitesApprove
        })
      }
      if(nextProps.sitesPending){
        nextProps.sitesPending.map(sitePending=>{
            const data = {
              name:sitePending.title,
              address:sitePending.address,
              startDate: Date(sitePending.startDate),
              endDate:Date(sitePending.endDate),
              id: sitePending.id,
            
            }
            sitesPend.push(data)
          })
          // console.log(sitesApprove)
          this.setState({
            dataPending:sitesPend
          })
        }
        if(nextProps.sitesDone){
          nextProps.sitesDone.map(siteDone=>{
              const data = {
                name:siteDone.title,
                address:siteDone.address,
                startDate: Date(siteDone.startDate),
                endDate:Date(siteDone.endDate),
                id: siteDone.id,
              }
              siteDon.push(data)
            })
            // console.log(sitesApprove)
            this.setState({
              dataDone:siteDon
            })
          }
    }


    render() {
        const { classes, site, auth } = this.props;
        if (!auth.uid)  return <Redirect to='/signin'/>
        const TableApproval = () => {

            return (

                <MaterialTable
                    title="Sự Kiện Đã Duyệt"
                    columns={this.state.columns}
                    data={this.state.dataApproval}
                    actions = {[
                        {icon: 'info',
                        tooltip: 'Chi Tiết',
                        onClick: (event, rowData) => {
                          this.props.history.push('/site/'+ rowData.id );
                        }
                      }]}
                    editable={{
                        
                        onRowUpdate: (newData, oldData) =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                    resolve();
                                    if (oldData) {
                                        this.setState(prevState => {
                                            const data = [...prevState.data];
                                            data[data.indexOf(oldData)] = newData;
                                            return { ...prevState, data };
                                        });
                                    }
                                }, 600);
                            }),
                        onRowDelete: oldData =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                    resolve();
                                    this.setState(prevState => {
                                        const data = [...prevState.data];
                                        data.splice(data.indexOf(oldData), 1);
                                        return { ...prevState, data };
                                    });
                                }, 600);
                            }),
                    }}
                />

            );
        }
        const TablePending = () => {

            return (
                <MaterialTable
                    title="Sự Kiện Chưa Duyệt"
                    columns={this.state.columns}
                    data={this.state.dataPending}
                    actions = {[
                        {icon: 'info',
                        tooltip: 'Chi Tiết',
                        onClick: (event, rowData) => {
                          this.props.history.push('/site/'+ rowData.id );
                        }
                      }]}
                    editable={{
                        onRowAdd: newData =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                    resolve();
                                    this.setState(prevState => {
                                        const data = [...prevState.data];
                                        data.push(newData);
                                        return { ...prevState, data };
                                    });
                                }, 600);
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                    resolve();
                                    if (oldData) {
                                        this.setState(prevState => {
                                            const data = [...prevState.data];
                                            data[data.indexOf(oldData)] = newData;
                                            return { ...prevState, data };
                                        });
                                    }
                                }, 600);
                            }),
                        onRowDelete: oldData =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                    resolve();
                                    this.setState(prevState => {
                                        const data = [...prevState.data];
                                        data.splice(data.indexOf(oldData), 1);
                                        return { ...prevState, data };
                                    });
                                }, 600);
                            }),
                    }}
                />
            );
        }
        const TableDone = () => {

            return (
                <MaterialTable
                    title="Sự Kiện Đã Hoàn Thành"
                    columns={this.state.columns}
                    data={this.state.dataDone}
                    actions = {[
                        {icon: 'info',
                        tooltip: 'Chi Tiết',
                        onClick: (event, rowData) => {
                          this.props.history.push('/site/'+ rowData.id );
                        }
                      }]}
                    editable={{
                        onRowAdd: newData =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                    resolve();
                                    this.setState(prevState => {
                                        const data = [...prevState.data];
                                        data.push(newData);
                                        return { ...prevState, data };
                                    });
                                }, 600);
                            }),

                        onRowDelete: oldData =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                    resolve();
                                    this.setState(prevState => {
                                        const data = [...prevState.data];
                                        data.splice(data.indexOf(oldData), 1);
                                        return { ...prevState, data };
                                    });
                                }, 600);
                            }),
                    }}
                />
            );
        }
        const NotiManage = () => {
            const { notifications } = this.props;
            return notifications.map(noti => {
              return <List>
                      <ListItem>
                          <ListItemAvatar>
                              <Avatar alt="Remy Sharp" src={noti.avatarURL} />
                          </ListItemAvatar>
                          <ListItemText
                              primary={noti.title}
                              secondary={
                                  <React.Fragment>
                                      <Typography
                                          component="span"
                                          variant="body2"
                                          className={classes.inline}
                                          color="textPrimary"
                                      >
                                          {noti.user}
                                      </Typography>
                                      : {noti.content} at {noti.address}
                                  </React.Fragment>
                              }
                          />
                      </ListItem>
                  </List>
            })
                
            
        }

        return (
            <div className="container">

                <div style={{ textAlign: 'center', paddingBottom: '50px' }}>
                    <h5>Chào Mừng đến Việt Nam Sạch Và Xanh! </h5>
                    <Divider />
                </div>


                <Grid container spacing={3}>
                    <Grid id="user-profile" item xs={3}>

                        <img id="profile-picture" src={auth.photoURL} />
                        <li>Name: {auth.displayName}</li>
                        <li>Email: {auth.email}</li>
                        <li>Sự Kiện:</li>
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={this.state.value}
                            onChange={this.handleChange}
                            aria-label="Vertical tabs example"
                            className={classes.tabs}
                        >
                            <Tab label="Đã Duyệt" {...a11yProps(0)} />
                            <Tab label="Chưa Duyệt" {...a11yProps(1)} />
                            <Tab label="Đã Xong" {...a11yProps(2)} />
                            <Tab label="Thông Báo" {...a11yProps(3)} />

                        </Tabs>
                    </Grid>
                    <Grid item xs={9}>
                        <div>
                            <div>
                                <h5 style={{ textAlign: 'center' }}>Danh Sách Quản Lí Sự Kiện</h5>
                            </div>
                        </div>
                        <div className={classes.root}>

                            <TabPanel value={this.state.value} index={0}>
                                <TableApproval />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={1}>
                                <TablePending />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={2}>
                                <TableDone />
                            </TabPanel>
                            <TabPanel value={this.state.value} index={3}>
                                <NotiManage />
                            </TabPanel>
                        </div>

                    </Grid>
                </Grid>
            </div>


        );
    }
}

// AdminDashboard.prototype ={
//   classes: PropTypes.object.isRequired,
// }

const mapStateToProps = (state) => {
    console.log(state);
    return {
      sitesPending: state.firestore.ordered.sitesPending,
      sitesApproved: state.firestore.ordered.sitesApproved,
      sitesDone: state.firestore.ordered.sitesDone,
      auth: state.firebase.auth,
      notifications: state.firestore.ordered.notifications
    }
  }
  
  export default compose(
    connect(mapStateToProps),
    firestoreConnect((props) => {
        if(!props.auth.uid){
            props.history.push("/")
        }else{
      return  [{ collection: 'sites', where:[["pending","==",true], ["authorId",'==',props.auth.uid]], storeAs:'sitesPending' },{ collection: 'sites', where:[["pending","==",false],["authorId",'==',props.auth.uid]], storeAs:'sitesApproved' },{ collection: 'sites', where:[["done","==",true], ["authorId",'==',props.auth.uid]], storeAs:'sitesDone' },
              { collection: 'notifications', limit: 3, where:[ ["uid",'==',props.auth.uid]] }]
      }})
    )(withStyles(useStyles)(UserDashboard) )
//   