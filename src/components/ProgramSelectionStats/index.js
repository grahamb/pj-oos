'use strict'
var React = require('react');
var BarChart = require('react-d3/barchart').BarChart;

var React = require('react');

var ProgramSelectionStats = React.createClass({

  propTypes: {
    data: React.PropTypes.array.isRequired
  },

  barCharts() {
    return this.props.data.map((program, i) => {
      return (
        <div key={i} className='BarChart'>
          <BarChart
            data={program.rankings}
            width={500}
            height={350}
            fill='#477DCA'
            title={program.name}
            xAxisLabel='Ranking'
            yAxisLabel='Selection Frequency'
            xAxisLabelOffset={10}
            yAxisLabelOffset={10}
            label='wtf'
          />
        </div>
      );
    });
  },

  render() {
    return (
      <div>
        {this.barCharts()}
      </div>
    );
  }

});

module.exports = ProgramSelectionStats;
