'use strict';

import React from 'react';
import UnitTable from 'UnitTable';

const json_el = document.getElementById('units_json')
const units = JSON.parse(json_el.innerHTML);
json_el.parentNode.removeChild(json_el);

React.render(<UnitTable tableHeight={800} tableWidth={1087} units={units}/>, document.getElementById('unittable'));