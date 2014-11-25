var React = require('react')
var Nav = require('react-bootstrap/Nav')
var NavItem = require('react-bootstrap/NavItem')
var Navbar = require('react-bootstrap/Navbar')
var DropdownButton = require('react-bootstrap/DropdownButton')
var MenuItem = require('react-bootstrap/MenuItem')


var Navi = module.exports = React.createClass({
  getInitialState: function() {
    return {user: this.props.user}
  },

  render: function() {
    var result = this.state.user

    return (
      <Navbar>
        <Nav>
          <NavItem eventKey={1} href="/"><i className="fa fa-home"></i></NavItem>
        </Nav>
        <Nav className="navbar-right">
          <DropdownButton eventKey={1} title={result.name}>
            <MenuItem eventKey="2" href={'/logout'}>Logout <i className="fa fa-sign-out"></i></MenuItem>
          </DropdownButton>
        </Nav>
      </Navbar>
    )
  }
});
