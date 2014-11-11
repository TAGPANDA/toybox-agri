var React = require('react')

var sendRequest = require('./sendRequest')


var CreateAgri = React.createClass({
  render: function() {
    return (
      <button type="button" className="btn btn-default" onClick={this.props.onClick}>
        Submit
      </button>
    )
  }
})

var RemoveAgri = React.createClass({
  render: function() {
    return (
      <a href="#" onClick={this.props.onClick}>
        Remove
      </a>
    )
  }
})

var Agri = module.exports = React.createClass({
  renderTextInput: function(id, name) {
    return <input type="text" className="form-control" id={id} name={name} ref={name}/>
  },

  renderForm: function(handleSubmit) {
    return (
      <form role="form" className="form-inline" ref="createForm">
        <div className="form-group">
          <div className="input-group">
            <div className="input-group-addon">&#8451;</div>
            {this.renderTextInput('exampleInputtemp1', 'temp')}
          </div>
        </div> 
        <div className="form-group">
          <div className="input-group">
            <div className="input-group-addon">%</div>
            {this.renderTextInput('exampleInputhumi1', 'humi')}
          </div>
        </div>
        <CreateAgri onClick={handleSubmit}/>
      </form>
    )
  },

  getInitialState: function() {
    return {data: this.props.list}
  },

  updateState: function() {
    var self = this
    sendRequest.items()
      .done(function(result) {
        self.setState({data: result})
      })
  },

  removeItem: function(id, event) {
    event.preventDefault()

    var self = this
    sendRequest.removeItem(id)
      .done(function() {
        self.updateState()
      })
  },

  createSubmit: function(event) {
    event.preventDefault()

    var self = this
    var q = self.getFormData()
    sendRequest.createItem(q)
      .done(function() {
        self.updateState()
      })
      .fail(function() {
        alert('Enter Values Please!')
      })
  },

  getFormData: function() {
    var data = {
      temp: this.refs.temp.getDOMNode().value,
      humi: this.refs.humi.getDOMNode().value
    }

    return data
  },

  render: function() {
    var result = this.state.data;

    return (
      <div className="col-sm-12">
        {this.renderForm(this.createSubmit)}
        <hr/>
        <table id="agri-list" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>No.</th>
              <th>Temp</th>
              <th>Humi</th>
              <th>Date</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {result.map(function(result) {
              var removeItem = this.removeItem.bind(this, result.id)

              return (
                <tr key={result.id}>
                  <td>{result.id}</td>
                  <td>{result.temp}</td>
                  <td>{result.humi}</td>
                  <td>{result.created_at}</td>
                  <td><RemoveAgri onClick={removeItem}/></td>
                </tr>
              )
            }, this)}
          </tbody>
        </table>
      </div>
    )
  },

  _onChange: function() {
    this.updateState()
  }
})
