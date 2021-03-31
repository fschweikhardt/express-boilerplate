function makeTestArray() {
    return [
      {
        id: 1,
        test_name: "Martin",
        date: new Date("1975-09-25").toISOString()
      },
      {
        id: 2,
        test_name: "Jonathan",
        date: new Date("1993-12-31").toISOString()
      },
      {
        id: 3,
        test_name: "Melissa",
        date: new Date("2001-06-11").toISOString()
      },
      {
        id: 4,
        test_name: "Howard",
        date: new Date("1966-02-01").toISOString()
      }
    ]
  }
  
  module.exports = { makeTestArray }