
import React, {Component, useState} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DatePicker from "react-datepicker";
import {
    Checkbox,
    Input,
    makeStyles,
    useTheme,
    InputLabel,
    FormControl,
    MenuItem,
    Select,
    Chip,
    Grid
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300
    },
    chips: {
        display: "flex",
        flexWrap: "wrap"
    },
    chip: {
        margin: 4
    },
    noLabel: {
        marginTop: theme.spacing(2)
    },
    button:{
        display: 'block',
        marginTop: theme.spacing(2),
    }
}));


function FormError(props) {
    if (props.isHidden) {
        return null;
    }
    return <div className="form-warning">{props.errorMessage}</div>;
}

 export default class CollectionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            wasteTypes: [
                {
                    type: 'organic',
                    values: [
                        {title: 'Food', qty: 0, weight: 0},
                        {title: 'Soiled Paper', qty: 0, weight: 0},
                        {title: 'Green Waste', qty: 0, weight: 0}
                    ],
                },
                {
                    type: 'Recycle',
                    values: [
                                {title: 'Paper', qty: 0, weight: 0},
                                {title: 'Glass', qty: 0, weight: 0},
                                {title: 'Food Scraps', qty: 0, weight: 0}
                            ],
                },
                {
                    type: 'NonRecyclable',
                    values: [
                                {title: 'Plastics', qty: 0, weight: 0},
                                {title: 'Metals', qty: 0, weight: 0},
                                {title: 'Batteries', qty: 0, weight: 0}
                            ]
                },
            ],


        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
     handleChange(e) {
        var wasteTypes = this.state.wasteTypes;
        console.log(e);
        e.currentTarget.getAttribute("valuelat");
        console.log(wasteTypes[e.target.indexType])
        // wasteTypes[e.target.indexType].values[e.target.indexValue][e.target.valueKey] = e.target.value;
        // this.setState({ wasteTypes: wasteTypes });
     };
    handleClickOpen(){
        this.setState({isOpen: true})
    };
    handleClose(){
        this.setState({isOpen:false})
    }
    handleSubmit(event){
        alert('submited');
        event.preventDefault()
    }
    render() {

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                Tổng Kết Sự Kiện
            </Button>
            <Dialog
                open={this.state.isOpen}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogContent>
                    <form className="white" onSubmit={this.handleSubmit}>
                        <h5
                            className="grey-text text-darken-3"
                            style={{ textAlign: "center" }}
                        >
                            Tổng Kết Sự Kiện
                        </h5>
                        {/*{this.state.wasteTypes.map((waste, indexType )=>(*/}
                        {/*    // (console.log(waste, 'waste ne'))*/}
                        {/*    <div id={indexType}>*/}
                        {/*        <h5>{waste.type}</h5>*/}
                        {/*        {waste.values.map((value, indexValue) =>(*/}
                        {/*            <div className={"input-field"} id={indexValue}>*/}
                        {/*                <i>{value.title}</i>*/}
                        {/*                <label>*/}
                        {/*                    <input*/}
                        {/*                        id={indexValue}*/}
                        {/*                        type = 'text'*/}
                        {/*                        onChange={this.handleChange}*/}
                        {/*                        valueKey={'qty'}*/}
                        {/*                        value={value.qty}*/}
                        {/*                        indexType={indexType}*/}
                        {/*                        indexValue={indexValue}*/}

                        {/*                    />*/}
                        {/*                </label>*/}
                        {/*                <label>*/}
                        {/*                    <input*/}
                        {/*                        // id = {'weight'}*/}
                        {/*                        type = 'numeric'*/}
                        {/*                        onChange={this.handleChange}*/}
                        {/*                        value={value.qty}*/}
                        {/*                    />*/}
                        {/*                </label>*/}



                        {/*            </div>*/}
                        {/*        ))}*/}
                        {/*    </div>*/}
                        {/*))}*/}


                        <div className="input-field">
                            <button className="btn lighten-1" color="#39B04B">
                                Hoàn Thành
                            </button>
                            <Button
                                onClick={this.handleClose}
                                className="btn lighten-1"
                                color="#39B04B"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
}

