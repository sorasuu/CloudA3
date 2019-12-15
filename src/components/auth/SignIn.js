import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signIn, signInWithFaceBook, signInWithGoogle } from '../../store/actions/authActions'
import { Redirect } from 'react-router-dom'

class SignIn extends Component {
  state = {
    email: '',
    password: ''
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.signIn(this.state)
  }
  render() {
    const { authError, auth } = this.props;
    if (auth.uid) return <Redirect to='/' /> 
    return (
      <div className="container">
        <form className="white" onSubmit={this.handleSubmit}>
          <h5 className="grey-text text-darken-3">Sign In</h5>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input type="email" id='email' onChange={this.handleChange} />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input type="password" id='password' onChange={this.handleChange} />
          </div>
          <div className="input-field">
            <button className="btn  lighten-1 z-depth-0" color = "#39B04B">Login</button>
            <button className="btn  lighten-1 z-depth-0" color = "#39B04B" onClick = {this.props.signInWithFaceBook}>Login With FaceBook</button>
            <button className="btn  lighten-1 z-depth-0" color = "#39B04B" onClick = {this.props.signInWithGoogle}>Login With Google</button>
            <div className="center red-text">
              { authError ? <p>{authError}</p> : null }
            </div>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return{
    authError: state.auth.authError,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (creds) => dispatch(signIn(creds)),
    signInWithFaceBook : ()=> dispatch(signInWithFaceBook()),
    signInWithGoogle : ()=> dispatch(signInWithGoogle())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
