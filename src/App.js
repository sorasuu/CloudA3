import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Dashboard from './components/dashboard/Dashboard'
import SiteDetails from './components/sites/SiteDetails'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import CreateSite from './components/sites/CreateSite'
import AdminDashboard from './components/dashboard/AdminDashboard';
import UserDashBoard from './components/dashboard/UserDashBoard';
import Footer from './components/layout/Footer';
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path='/'component={Dashboard} />
            <Route path='/site/:id' component={SiteDetails} />
            <Route path='/signin' component={SignIn} />
            <Route path='/signup' component={SignUp} />
            <Route path='/create' component={CreateSite} />
            <Route path='/admin'  component={AdminDashboard}/>
            <Route path='/profile' component= {UserDashBoard}/>
          </Switch>
          {/* <Footer/> */}
        </div>

      </BrowserRouter>
    );
  }
}

export default App;
