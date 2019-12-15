import React, { Component } from 'react'
import SiteList from '../sites/SiteList'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect, Link } from 'react-router-dom'
import MaterialTable from 'material-table'
import { Tab, Tabs, AppBar, Box, Typography, makeStyles, withStyles } from '@material-ui/core'
import Footer from '../layout/Footer'
import moment, { parseTwoDigitYear } from 'moment'
import { List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core'
import {editSite} from '../../store/actions/siteActions'
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
    display: 'flex',
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
});

class AdminDashboard extends Component {
  constructor(props){
    super(props),
    this.state = {
      value: 0,
      columns: [
        { title: 'Tiêu Đề', field: 'name' },
        { title: 'Địa Điểm', field: 'address' },
        { title: 'Ngày Bắt Đầu', field: 'startDate' },
        { title: 'Ngày Kết Thúc', field: 'endDate' }
      ],
      dataApproval: [
      ],
      dataPending: [
      ],
      dataDone: [
      ],
      sites:null
    }
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(event, newValue) {
    this.setState({value: newValue})
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
          id:sitePending.id
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
            id:siteDone.id
          }
          siteDon.push(data)
        })
        // console.log(sitesApprove)
        this.setState({
          dataDone:siteDon
        })
      }
}
handleApproved=(id)=>{
  console.log(id,this.props.sitesPendingis[id])
  this.props.editSite({
    ...this.props.sitesPendingis[id],
    pending:false,id:id
  }
  )
}
  render(){
    const {classes,auth} =this.props;
   
    const TableApproval = ()=>{
    
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
          }]
          }
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  this.setState(prevState => {
                    const dataApproval = [...prevState.dataApproval];
                    dataApproval.push(newData);
                    return { ...prevState, dataApproval };
                  });
                }, 600);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  if (oldData) {
                    this.setState(prevState => {
                      const dataApproval = [...prevState.data];
                      dataApproval[dataApproval.indexOf(oldData)] = newData;
                      return { ...prevState, dataApproval };
                    });
                  }
                }, 600);
              }),
            onRowDelete: oldData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  this.setState(prevState => {
                    const dataApproval = [...prevState.dataApproval];
                    dataApproval.splice(dataApproval.indexOf(oldData), 1);
                    return { ...prevState, dataApproval};
                  });
                }, 600);
              }),
          }}
        />
      );
    }
    const TablePending = ()=>{

      return ( 
        <MaterialTable
          title="Sự Kiện Chưa Duyệt"
          columns={this.state.columns}
          data={this.state.dataPending}
          actions = {
            [{
              icon: 'check',
              tooltip: 'Xác Nhận',
              onClick: (event, rowData) => {
                this.handleApproved(rowData.id)
              }},
            {icon: 'info',
            tooltip: 'Chi Tiết',
            onClick: (event, rowData) => {
              this.props.history.push('/site/'+ rowData.id );
            }
          }]
          }
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  this.setState(prevState => {
                    const dataPending = [...prevState.dataPending];
                    dataPending.push(newData);
                    return { ...prevState, dataPending };
                  });
                }, 600);
              }),
            onRowDelete: oldData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  this.setState(prevState => {
                    const dataPending = [...prevState.dataPending];
                    dataPending.splice(dataPending.indexOf(oldData), 1);
                    return { ...prevState, dataPending };
                  });
                }, 600);
              }),
          }}
        />
      );
    }
    const TableDone = ()=>{ 
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
          }]
          }
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  this.setState(prevState => {
                    const dataDone = [...prevState.dataDone];
                    dataDone.push(newData);
                    return { ...prevState, dataDone };
                  });
                }, 600);
              }),
            onRowDelete: oldData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  this.setState(prevState => {
                    const dataDone = [...prevState.dataDone];
                    dataDone.splice(dataDone.indexOf(oldData), 1);
                    return { ...prevState, dataDone };
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
      <div className={classes.root}>
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
        <TabPanel value={this.state.value} index={0}>
          <TableApproval/>
        </TabPanel>
        <TabPanel value={this.state.value} index={1}>
          <TablePending/>
        </TabPanel>
        <TabPanel value={this.state.value} index={2}>
          <TableDone/>
        </TabPanel>
        <TabPanel value={this.state.value} index={3}>
          <NotiManage/>
        </TabPanel>
        
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
    sitesPendingis:state.firestore.data.sitesPending,
    sitesDone: state.firestore.ordered.sitesDone,
    auth: state.firebase.auth,
    notifications: state.firestore.ordered.notifications
  }
}
const mapDispatchToProps = dispatch => {
  return {
    editSite: (site) => dispatch(editSite(site))
  }
}

export default compose(
  connect(mapStateToProps,mapDispatchToProps),
  firestoreConnect([
    { collection: 'sites', where:[["pending","==",true]], storeAs:'sitesPending' },{ collection: 'sites', where:[["pending","==",false]], storeAs:'sitesApproved' },{ collection: 'sites', where:[["done","==",true]], storeAs:'sitesDone' },
    { collection: 'notifications', limit: 3, orderBy: ['time', 'desc'] }
  ])
)(withStyles(useStyles)(AdminDashboard) )