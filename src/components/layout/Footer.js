import React from "react";
import {Grid} from '@material-ui/core'
var style = {
    backgroundColor: "#F8F8F8",
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "20px",
    position: "absolute",
    left: "0",
    bottom: "0",
    height: "60px",
    width: "100%",
}

var phantom = {
    display: 'block',
    padding: '20px',
    height: '60px',
    width: '100%',
}

const Footer = () => {
    return (
        <div>
            <div style={phantom} />
            <div className="container" style={style}>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <h6>Tin Tức Mới Nhất</h6>
                    </Grid>
                    <Grid item xs={3}>
                        <h6>Tin Tức Mới Nhất</h6>
                    </Grid>
                    <Grid item xs={3}>
                        <h6>Địa Chỉ</h6>
                    </Grid>
                    <Grid item xs={3}>
                        <h6>Liên Hệ Chúng Tôi</h6>
                    </Grid>
                </Grid>
                <div>&copy; {new Date().getFullYear()} Copyright: <a href="https://vietnamsachvaxanh.org"> vietnamsachvaxanh.org </a></div>
            </div>
        </div>
    );
    }

export default Footer;