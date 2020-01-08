
import React, { Component } from "react";
import MapWithAllMarker from "../maps/MapWithAllMarker";
import { firestoreConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";

class Dashboard extends Component {
  render() {
    const { auth, notifications } = this.props;
    // if (!auth.uid) return <Redirect to='/signin' />
    return (


        <div className="dashboard">
            <div className={"container"}>
                <h5 style={{textAlign:"center"}}>Welcome to Earth Day</h5>
                <p>Ngày Trái Đất là ngày để nâng cao nhận thức và giá trị của môi trường tự nhiên của Trái Đất.
                    Ngày Trái Đất giờ đây được điều phối toàn cầu bởi Mạng Ngày Trái Đất (Earth Day Network) và được tổ chức hằng năm tại hơn 192 quốc gia.
                    Nhiều cộng đồng còn tổ chức Tuần Trái Đất, một tuần của các hoạt động xoay quanh các vấn đề môi trường. Năm 2020, Ngày Trái Đất đánh dấu 50 năm hoạt động. </p>
            </div>
          <div>
            <MapWithAllMarker />
          </div>


      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    // sites: state.firestore.ordered.sites,
    auth: state.firebase.auth,
    notifications: state.firestore.ordered.notifications
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: "notifications", limit: 3, orderBy: ["time", "desc"] }
  ])
)(Dashboard);

