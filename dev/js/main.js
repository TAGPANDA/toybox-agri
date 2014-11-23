var React = require('react')
var $ = window.jQuery  = require('jquery')
require('bootstrap')

var Agri = require('./view.jsx')
var Navi = require('./navbar.jsx')
var sendRequest = require('./sendRequest')
var loadcss = require('./loadcss')

// async load css
loadcss('//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css')
loadcss('//fonts.googleapis.com/css?family=Bowlby+One')
loadcss('//fonts.googleapis.com/css?family=Rokkitt')

if (location.pathname.indexOf('login') === -1) {
  sendRequest.items()
    .done(function(result) {
      React.render(
        React.createElement(Agri, {list: result}),
        document.getElementById('content'))
    })

  $(function() {
    React.render(
      React.createElement(Navi, {user: window.user}),
      document.getElementById('nav'))
  })
}
