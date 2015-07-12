import React from 'react';
import ReactModal from 'react-modal';
import moment from 'moment';
var ExecutionEnvironment = require('react/lib/ExecutionEnvironment');

const PropTypes = {React};

if (ExecutionEnvironment.canUseDOM) {
  ReactModal.setAppElement(document.getElementById('unit_schedule'));
}

const ProgramSwapModal = React.createClass({

  getInitialState() {
    return {
      modalIsOpen: false,
      selectedPeriods: [],
      originalPeriodId: null,
      showContinue: true,
    };
  },

  componentDidMount() {
    this.setState({
      modalIsOpen: this.props.modalIsOpen
    });
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.alternatives) return;


    switch(nextProps.alternatives.length) {
      case 1:
        this.setState({
          selectedPeriods: [nextProps.alternatives[0][0].id],
          showContinue: true
        });
        break;
      case 2:
        this.setState({
          selectedPeriods: [nextProps.alternatives[0][0].id, nextProps.alternatives[1][0].id],
          showContinue: false
        });
        break;
      case 3:
        this.setState({
          selectedPeriods: [nextProps.alternatives[0][0].id, nextProps.alternatives[0][0].id, nextProps.alternatives[1][0].id, nextProps.alternatives[2][0].id],
          showContinue: false
        });
        break;
    }
  },

  renderSingleAlternatives(data) {
    if (!data) {
      return (
        <p>There are no availble programs to swap for this program period</p>
      )
    }

    var options = data[0].map(function(p, i) {
      return <option value={p.id} key={i}>{p.name} • {p.location} • Available: {p.available}</option>
    });
    return (
      <div>
        <p>The following periods fit the unit's schedule. Double-check availability before adding.</p>
        <select onChange={this.onSelectChange}>
          {options}
        </select>
      </div>
    );
  },

  renderDoubleAlternatives(data) {
    var humanizedPeriod = this.humanizedPeriod;
    if (!data) {
      return (
        <p>There are no availble programs to swap for this program period</p>
      )
    }

    var selects = data.map(function(periods, i) {
      var options = periods.map(function(p, i) {
        return <option value={p.id} key={i}>{p.name} • {p.location} • Available: {p.available}</option>
      });
      return (
        <div>
          <p>{moment(periods[0].start_at).format('dddd')} {humanizedPeriod(periods[0].start_at)}:</p>
          <select onChange={this.onSelectChange}>
            {options}
          </select>
        </div>
      )
    }.bind(this));
  },

  renderTripleAlternatives(data) {

  },

  renderAlternatives(data) {
    if (!data) return '';

    if (data.length === 1) {
      return this.renderSingleAlternatives(data);
    } else {
      return <p>To swap an all-day or overnight activity, first drop the original activity and then swap one or more of the new free periods.</p>
    }
  },

  humanizedPeriod(start_at) {
    if (moment(start_at).hour() < 12) {
      return 'Morning';
    } else {
      return 'Afternoon';
    }
  },

  onSelectChange(ev) {
    this.setState({
      selectedPeriods: [ev.target.value]
    });
  },

  doSwap() {
    this.props.doSwap(this.state.selectedPeriods);
    this.setState({selectedPeriods: []})
    this.closeModal();
  },

  closeModal() {
    this.setState({
      alternatives: null
    });
    this.props.closeModal();
  },

  buttons() {
    var buttons = [<button onClick={this.closeModal}>Cancel</button>]
    if (this.state.showContinue) {
      buttons.push(<button onClick={this.doSwap} className="button green" autoFocused={true}>Continue</button>)
    }
    return buttons;
  },

  render() {
    var alternatives = this.renderAlternatives(this.props.alternatives);
    return (
      <ReactModal
        isOpen={this.props.modalIsOpen}
        onRequestClose={this.closeModal}
      >
        <h2>Swap Program</h2>
          {alternatives}
          <div className="ReactModal__Content--buttons">
          {this.buttons()}
          </div>
      </ReactModal>

    );
  }

});

export default ProgramSwapModal;