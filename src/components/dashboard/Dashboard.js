import React, { Component } from 'react'
import MaterialTable from 'material-table'
import { Redirect, Link } from 'react-router-dom'
import MapWithAllMarker from '../layout/MapWithAllMarker'
import { firestoreConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Button} from '@material-ui/core'
class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state={
      columns: [
        { title: 'Tiêu Đề', field: 'name' },
        { title: 'Địa Điểm', field: 'address' },
        { title: 'Ngày Bắt Đầu', field: 'startDate' },
        { title: 'Ngày Kết Thúc', field: 'endDate' },
        
      ],  
      dataApproval: [],
    }

  }
  UNSAFE_componentWillReceiveProps(nextProps){
    var sitesApprove= []
   
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
    console.log(sitesApprove,"klhjkjik")
    this.setState({
      dataApproval:sitesApprove
    })
  }
}
  render() {
    const { auth, notifications } = this.props;
    // if (!auth.uid) return <Redirect to='/signin' />
    console.log(this.state.dataApproval)
    const AllSitesTable = ()=>{ 
      return ( 
        <MaterialTable
          title="Sự Kiện Đang Hoạt Động"
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
          
        />
      );
    }
    return (
      <div className="container">
      
          <div>
            <MapWithAllMarker/>    
          </div>
          <div style={{textAlign:'center'}}><Link to="/create"><Button color='primary' background-color='primary'>Tạo Sự Kiện Mới</Button></Link></div>
          <div>
            <AllSitesTable/>
          </div>
        </div>
     
    )
  }
}

const mapStateToProps = (state) => {
  // console.log(state);
  return {
    // sites: state.firestore.ordered.sites,
    sitesApproved: state.firestore.ordered.sitesApproved,
    auth: state.firebase.auth,
    notifications: state.firestore.ordered.notifications
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'sites', where:[["pending","==",false]], storeAs:'sitesApproved' },
    { collection: 'notifications', limit: 3, orderBy: ['time', 'desc'] }
  ])
)(Dashboard) 