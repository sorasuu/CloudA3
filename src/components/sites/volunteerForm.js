import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import DatePicker from "react-datepicker";
import {Checkbox} from "@material-ui/core";
import {createVolunteer} from "../../store/actions/voluteerAction";
import {editSite} from "../../store/actions/siteActions";
import {compose} from "redux";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";

function FormError(props) {
    if (props.isHidden) {
        return null;
    }
    return <div className="form-warning">{props.errorMessage}</div>;
}

export default function VolunteerForm(site) {
    console.log(site, 'site trong volunteerForm');
    const [open, setOpen] = useState(false);
    const [isBuyShirt, setBuyShirt] = useState(false);
    const [isBuyTool, setBuyTool] = useState(false);
    const dob = new Date();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleBuyShirt=()=> {
        setBuyShirt(!isBuyShirt);
    };
    const handleBuyTool=()=> {
        setBuyTool(!isBuyTool);
    };
    const handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };
    const handleSubmit = e => {
        e.preventDefault();
        // console.log(this.state);
        const volunteer = {
            id: (this.state.email + this.state.name)
                .split("@")
                .join("")
                .split(".")
                .join("")
                .split(" ")
                .join(""),
            name: this.state.name,
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            dob: this.state.dob,
            siteId: this.props.match.params.id
        };
        this.props.createVolunteer(volunteer);
        this.props.history.push("/");
    };
    const handleChangeDOB = date => {
        this.setState({
            dob: date
        });
    };
    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Đăng Kí Tham Gia
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">

                <DialogContent>
                    <form className="white" onSubmit={handleSubmit}>
                        <h5 className="grey-text text-darken-3" style={{textAlign:'center'}}>Đăng Ký Sự Kiện</h5>
                        <div className="input-field">
                            <input
                                type="text"
                                id="name"
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="name">Tên</label>
                            <FormError
                                type="title"
                                // isHidden={this.state.isInputValid}
                                // errorMessage={this.state.errorMessage}
                            />
                        </div>
                        <div className="input-field">
                      <textarea
                          id="email"
                          className="materialize-textarea"
                          onChange={handleChange}
                          required
                      >

                      </textarea>
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="input-field">
                      <textarea
                          id="phoneNumber"
                          className="materialize-textarea"
                          onChange={handleChange}
                      >

                      </textarea>
                            <label htmlFor="phoneNumber">Số Điện Thoại</label>
                            <FormError
                                type="title"
                                // isHidden={this.state.isInputValid}
                                // errorMessage={this.state.errorMessage}
                            />
                            <div className="row">
                                <div className="col xs=3">
                                    <label htmlFor="phoneNumber">Ngày Sinh </label>
                                    <DatePicker
                                        selected={dob}
                                        onChange={handleChangeDOB}
                                        dateFormat="dd-MM-yyyy"
                                    />
                                </div>
                                <div className="col xs=9">
                                    <i>Bạn có muốn mua: </i>
                                    <Checkbox
                                        checked={isBuyShirt}
                                        onClick={() => handleBuyShirt()}
                                    />
                                    Áo Earth-Day 2020 ($5) |
                                    <Checkbox
                                        checked={isBuyTool}
                                        onClick={() => handleBuyTool()}
                                    />
                                    Dụng Cụ
                                    {isBuyTool ?
                                        <div className="row">
                                            <Checkbox/> tong ($5)
                                            <Checkbox/> gloves($5)
                                            <Checkbox/> bags ($5)
                                        </div> : null
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="input-field">
                            <button className="btn lighten-1" color="#39B04B">
                                Đăng ký
                            </button>
                            <Button onClick={handleClose} className="btn lighten-1" color="#39B04B">
                                Cancel
                            </Button>
                        </div>
                    </form>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Register
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        createVolunteer: volunteers => dispatch(createVolunteer(volunteers)),

    };
};

