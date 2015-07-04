import React from 'react';
import moment from 'moment';
import request from 'superagent';

const PropTypes = {React};

const format_time_string = function(fmt, time) {
  time = time.split(':');
  var date = moment({ hour: time[0], minute: time[1], seconds: time[2] });
  return date.format(fmt);
};

const UnitSchedule = React.createClass({

  getInitialState() {
    return {
      programPeriods: this.props.programPeriods
    };
  },

  removeProgram(period, el) {
    request
      .del(`/units/${this.props.unitId}/schedule/${period}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (res.ok) {
          this.setState({
            programPeriods: JSON.parse(res.text)
          });
        }
      }.bind(this));
  },

  swapProgram(period, el) {
    console.log('swapProgram');
  },

  render() {
    const bus_info = (period) => {
      return period.BusDeparture ? (
        <div><i className="fa fa-bus"></i> Bus {period.BusDeparture.bus_number.join('/')} &nbsp;&nbsp;
        <i className="fa fa-clock-o"></i> Departs at {format_time_string('h:mm A', period.BusDeparture.departure_time)}</div>
      ) : '';
    };

    const program_link = (program) => {
      return {
        __html: program.id === 25 ? program.full_name_text : `<a href="/programs/${program.id}">${program.full_name_text}</a>`
      }
    };

    const starred_activity = (program) => {
      var star_icon = '<i class="fa fa-star"></i>';
      return {
        __html: program.premium_activity ? '<i class="fa fa-star"></i>' : ''
      }
    };

    const humanized_period = function(period) {
      switch (period.spans_periods) {
        case 3:
          return 'All Day + ' + moment(period.end_at).format('dddd') + ' Morning';
          break;
        case 2:
          return 'All Day';
          break;
        case 1:
          if (moment(period.start_at).hour() < 12) {
            return 'Morning';
          } else {
            return 'Afternoon';
          }
          break;
      }
    };

    const deleteButton = (period) => {
      return period.program_id === 25 ? '' : (
        <button onClick={this.removeProgram.bind(this, period.id)} className="button button-small red">
            <i className="fa fa-remove"></i>Remove Program
        </button>
      )
    };

    const schedule = this.state.programPeriods.map( (period, i, a) => {
      return (
        <div className="period" key={i}>
          <h3>{moment(period.start_at).format('dddd')} {humanized_period(period)}</h3>
          <div className="period-info">
            <div>
              <span dangerouslySetInnerHTML={starred_activity(period.Program)}></span>
              <span dangerouslySetInnerHTML={program_link(period.Program)}></span>
            </div>
            {bus_info(period)}
          </div>
          <div className="program_period_controls">
              <button onClick={this.swapProgram.bind(this, period.id)} className="button button-small">
                  <i className="fa fa-retweet"></i>Swap Program
              </button>

              {deleteButton(period)}
          </div>
        </div>
      )
    });

    return (
      <div>
        <h2>Unit Schedule</h2>
        {schedule}
      </div>
    );
  }

});

export default UnitSchedule;