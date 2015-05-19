module.exports = {

  halfDayProgramPeriods: [
    {
      "start_at": new Date("2015-07-12T20:30:00.000Z"),
      "end_at": new Date("2015-07-12T23:30:00.000Z")
    },
    {
      "start_at": new Date("2015-07-13T16:00:00.000Z"),
      "end_at": new Date("2015-07-13T19:00:00.000Z")
    },
    {
      "start_at": new Date("2015-07-13T20:30:00.000Z"),
      "end_at": new Date("2015-07-13T23:30:00.000Z")
    },

    {
      "start_at": new Date("2015-07-14T16:00:00.000Z"),
      "end_at": new Date("2015-07-14T19:00:00.000Z")
    },
    {
      "start_at": new Date("2015-07-14T20:30:00.000Z"),
      "end_at": new Date("2015-07-14T23:30:00.000Z")
    },

    {
      "start_at": new Date("2015-07-15T16:00:00.000Z"),
      "end_at": new Date("2015-07-15T19:00:00.000Z")
    },
    {
      "start_at": new Date("2015-07-15T20:30:00.000Z"),
      "end_at": new Date("2015-07-15T23:30:00.000Z")
    },

    {
      "start_at": new Date("2015-07-16T16:00:00.000Z"),
      "end_at": new Date("2015-07-16T19:00:00.000Z")
    },
    {
      "start_at": new Date("2015-07-16T20:30:00.000Z"),
      "end_at": new Date("2015-07-16T23:30:00.000Z")
    },

    {
      "start_at": new Date("2015-07-17T16:00:00.000Z"),
      "end_at": new Date("2015-07-17T19:00:00.000Z")
    },
    {
      "start_at": new Date("2015-07-17T20:30:00.000Z"),
      "end_at": new Date("2015-07-17T23:30:00.000Z")
    }

  ],

  fullDayProgramPeriods: [
    {
      "start_at": new Date("2015-07-13T16:00:00.000Z"),
      "end_at": new Date("2015-07-13T23:30:00.000Z")
    },
    {
      "start_at": new Date("2015-07-14T16:00:00.000Z"),
      "end_at": new Date("2015-07-14T23:30:00.000Z")
    },
    {
      "start_at": new Date("2015-07-15T16:00:00.000Z"),
      "end_at": new Date("2015-07-15T23:30:00.000Z")
    },
    {
      "start_at": new Date("2015-07-16T16:00:00.000Z"),
      "end_at": new Date("2015-07-16T23:30:00.000Z")
    },
    {
      "start_at": new Date("2015-07-17T16:00:00.000Z"),
      "end_at": new Date("2015-07-17T23:30:00.000Z")
    }
  ],


  limitedAvailabilityHalfDayProgramPeriods: [
    {
      "start_at": new Date("2015-07-13T16:00:00.000Z"),
      "end_at": new Date("2015-07-13T19:00:00.000Z")
    },
    {
      "start_at": new Date("2015-07-13T20:30:00.000Z"),
      "end_at": new Date("2015-07-13T23:30:00.000Z")
    },
    {
      "start_at": new Date("2015-07-15T16:00:00.000Z"),
      "end_at": new Date("2015-07-15T19:00:00.000Z")
    },
    {
      "start_at": new Date("2015-07-16T20:30:00.000Z"),
      "end_at": new Date("2015-07-16T23:30:00.000Z")
    }
  ],

  limitedAvailabilityFullDayProgramPeriods: [
    {
      "start_at": new Date("2015-07-13T16:00:00.000Z"),
      "end_at": new Date("2015-07-13T23:30:00.000Z")
    },
    {
      "start_at": new Date("2015-07-14T16:00:00.000Z"),
      "end_at": new Date("2015-07-14T23:30:00.000Z")
    },
    {
      "start_at": new Date("2015-07-15T16:00:00.000Z"),
      "end_at": new Date("2015-07-15T23:30:00.000Z")
    },
    {
      "start_at": new Date("2015-07-16T16:00:00.000Z"),
      "end_at": new Date("2015-07-16T23:30:00.000Z")
    }
  ],

  unit: {
    number_of_youth: 6,
    number_of_adults: 2,
    total_participants: 8
  },

  emptyUnitSchedule: { ProgramPeriods: [] },

  partialUnitSchedule: { ProgramPeriods: [

    {
      "start_at": new Date("2015-07-13T16:00:00.000Z"),
      "end_at": new Date("2015-07-13T19:00:00.000Z"),
      "Program": {
        id: 9,
        premium_activity: false
      }
    },

    {
      "start_at": new Date("2015-07-15T16:00:00.000Z"),
      "end_at": new Date("2015-07-15T23:30:00.000Z"),
      "Program": {
        id: 25,
        premium_activity: false
      }
    },

    {
      "start_at": new Date("2015-07-16T20:30:00.000Z"),
      "end_at": new Date("2015-07-16T23:30:00.000Z"),
      "Program": {
        id: 12,
        premium_activity: true
      }
    }

  ]},

  fullUnitSchedule: { ProgramPeriods: [
    {
      "start_at": new Date("2015-07-12T20:30:00.000Z"),
      "end_at": new Date("2015-07-12T23:30:00.000Z")
    },


    {
      "start_at": new Date("2015-07-13T16:00:00.000Z"),
      "end_at": new Date("2015-07-13T19:00:00.000Z")
    },
    {
      "start_at": new Date("2015-07-13T20:30:00.000Z"),
      "end_at": new Date("2015-07-13T23:30:00.000Z")
    },


    {
      "start_at": new Date("2015-07-14T16:00:00.000Z"),
      "end_at": new Date("2015-07-14T19:00:00.000Z")
    },
    {
      "start_at": new Date("2015-07-14T20:30:00.000Z"),
      "end_at": new Date("2015-07-14T23:30:00.000Z")
    },


    {
      "start_at": new Date("2015-07-15T16:00:00.000Z"),
      "end_at": new Date("2015-07-15T23:30:00.000Z")
    },


    {
      "start_at": new Date("2015-07-16T16:00:00.000Z"),
      "end_at": new Date("2015-07-16T19:00:00.000Z")
    },
    {
      "start_at": new Date("2015-07-16T20:30:00.000Z"),
      "end_at": new Date("2015-07-16T23:30:00.000Z")
    },


    {
      "start_at": new Date("2015-07-17T16:00:00.000Z"),
      "end_at": new Date("2015-07-17T23:30:00.000Z")
    }

  ]}

};

