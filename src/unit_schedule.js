'use strict';

import React from 'react';
import UnitSchedule from 'UnitSchedule';
// import ProgramSwapModal from 'ProgramSwapModal';

const json_el = document.getElementById('dehydrated_data')
const data = JSON.parse(json_el.innerHTML);
json_el.parentNode.removeChild(json_el);

React.render(<UnitSchedule programPeriods={data.programPeriods} unitId={data.unitId} />, document.getElementById('unit_schedule'));