import logo from "./logo.svg";
import "./App.css";

import styled from "styled-components";

import RestHours from "./rest_hours.json";
import { useEffect, useState } from "react";

const InternalUseMain = styled.main`
  padding: 80px;

  .app-title {
    padding: 0 10px;
  }

  .date-and-time-picker {
    /* display: flex; */
  }

  form {
    padding: 10px;
    display: inline-block;
    width: 350px;
    fieldset {
      padding: 20px;
    }
    .form-group {
      margin-bottom: 12px;
      label {
        display: inline;
      }
      input {
        margin-top: 8px;
        display: block;
        height: 40px;
        padding: 0 12px;
        font-size: 16px;
        width: 100%;
      }
      button {
        margin-top: 12px;
        padding: 15px 20px;
        appearance: none;
        background: none;
        border: none;
        background: #2197f3;
        color: white;
        text-transform: uppercase;
        width: 100%;
        cursor: pointer;
      }
    }
  }

  .restaurants {
    margin-top: 20px;
    h2 {
      margin-left: 10px;
    }
  }

  .restaurant-cards {
    display: flex;
    flex-wrap: wrap;
  }

  .restaurant-card {
    margin: 10px;
    padding: 20px;
    background: #f7f7f7;
    border: solid 1px #efefef;
    border-radius: 8px;
    width: calc(100% / 4 - 20px);
    .restaurant-name {
      font-weight: bold;
      font-size: 12px;
      text-transform: uppercase;
    }
    .restaurant-hours {
      margin-top: 12px;
    }
  }
`;

const daysOfWeek = [
  {
    id: 1,
    dayOfWeek: "Sun",
  },
  {
    id: 2,
    dayOfWeek: "Mon",
  },
  {
    id: 3,
    dayOfWeek: "Tue",
  },
  {
    id: 4,
    dayOfWeek: "Wed",
  },
  {
    id: 5,
    dayOfWeek: "Thu",
  },
  {
    id: 6,
    dayOfWeek: "Fri",
  },
  {
    id: 7,
    dayOfWeek: "Sat",
  },
];

function App() {
  const [dayOfWeekNumber, setDayOfWeekNumber] = useState("");
  const [time, setTime] = useState("");
  const [openRestaurants, setOpenRestaurants] = useState([]);

  const handleDateChange = (e) => {
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let userInput = e.target.value;
    let weekday = new Date(userInput).getUTCDay();
    let getTruncatedWeekDay = weekdays[weekday].slice(0, 3);
    let weekDayNumber = daysOfWeek.find(
      (x) => x.dayOfWeek === getTruncatedWeekDay
    ).id;
    setDayOfWeekNumber(weekDayNumber);
  };

  const handleTimeChange = (e) => {
    let newTime = e.target.value;
    setTime(newTime);
  };

  const getRestaurantList = () => {
    const ogOpenRestaurants = [];
    RestHours.map((x) => {
      let daysOfOperation = [];
      for (let i = 0; i < x.times.length; i++) {
        const str = x.times[i];
        const splitStr = x.times[i].split(/[\s, ]+/);
        const arrOfFirstDays = splitStr[0].split("-");
        if (arrOfFirstDays.length > 1) {
          let firstDay, lastDay;
          firstDay = arrOfFirstDays[0];
          lastDay = arrOfFirstDays[1];

          // convert to number of week
          let firstDayNumOfWeek = daysOfWeek.find(
            (x) => x.dayOfWeek === firstDay
          ).id;
          let lastDayNumOfWeek = daysOfWeek.find(
            (x) => x.dayOfWeek === lastDay
          ).id;
          for (let i = firstDayNumOfWeek; i <= lastDayNumOfWeek; i++) {
            daysOfOperation.push(i);
          }
        } else {
          daysOfOperation.push(
            daysOfWeek.find((x) => x.dayOfWeek === arrOfFirstDays[0]).id
          );
        }
        // check for any other single days
        for (let i = 0; i < splitStr.length; i++) {
          let singleDays = daysOfWeek.find((x) => x.dayOfWeek === splitStr[i]);
          if (singleDays) daysOfOperation.push(singleDays.id);
        }
        let matchingDay;
        // is there a day match
        for (let i = 0; i < daysOfOperation.length; i++) {
          if (parseInt(daysOfOperation[i]) === dayOfWeekNumber) {
            matchingDay = daysOfOperation[i];
            break;
          } else {
            matchingDay = false;
          }
        }
        if (matchingDay) {
          let daysOfWeekAb = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          let dateRange = str.split(" ");

          for (let i = 0; i < daysOfWeekAb.length; i++) {
            dateRange = dateRange.filter((x) => !x.includes(daysOfWeekAb[i]));
          }

          dateRange = dateRange.join(" ").split(", ");
          dateRange = dateRange.find((x) => x.includes(" - "));
          let timeRange = dateRange.split(" - ");

          const timeToDecimal = (t, timePosition) => {
            let formattedTime;
            if (t.includes(":")) {
              t = t.split(":");
              formattedTime = parseInt(t[0], 10) * 1 + parseInt(t[1], 10) / 60;
            } else {
              t = t.split(" ");
              formattedTime = parseInt(t[0]);
            }

            let inTheAfternoon = t[1].includes("pm") ? true : false;
            let intoTheNextMorning =
              t[1].includes("am") && timePosition === "endTime" ? true : false;

            if (inTheAfternoon) {
              formattedTime = formattedTime + 12;
            }

            if (intoTheNextMorning) {
              formattedTime = formattedTime + 24;
            }

            return formattedTime;
          };

          let formatUserTime = (userTime) => {
            userTime = userTime.split(":");
            let userTimeHour = parseInt(userTime[0]);
            let userTimeMinute = userTime[1];
            let userTimeAmOrPm = userTimeHour > 12 ? "pm" : "am";

            if (userTimeHour > 12) {
              userTimeHour = (userTimeHour - 12).toString();
            }

            if (userTimeMinute) {
              userTimeHour = userTimeHour + ":" + userTimeMinute;
            }

            userTimeHour = userTimeHour + " " + userTimeAmOrPm;

            return userTimeHour;
          };

          let userTimeAsDecimal = timeToDecimal(
            formatUserTime(time),
            "userTime"
          );
          let startTimeAsDecimal = timeToDecimal(timeRange[0], "startTime");
          let endTimeAsDecimal = timeToDecimal(timeRange[1], "endTime");

          let showOrHide =
            userTimeAsDecimal >= startTimeAsDecimal &&
            userTimeAsDecimal <= endTimeAsDecimal
              ? "show"
              : "hide";

          if (showOrHide === "show") {
            ogOpenRestaurants.push(x);
            let newRestaurantArray = [...new Set(ogOpenRestaurants)];
            setOpenRestaurants(newRestaurantArray);
          }
        }
      }
    });
  };

  useEffect(() => {
    getRestaurantList();
  }, [dayOfWeekNumber, time]);

  return (
    <InternalUseMain>
      <div className="app-title">
        <h1>Restaruant Hours App</h1>
      </div>
      <form>
        <fieldset>
          <legend>Restaurant Date and Time</legend>
          <p className="form-group">
            <label htmlFor="">Date</label>
            <input onChange={(e) => handleDateChange(e)} type="date" />
          </p>
          <p className="form-group">
            <label htmlFor="">Time</label>
            <input onChange={(e) => handleTimeChange(e)} type="time" />
          </p>
        </fieldset>
      </form>
      <div className="date-and-time-picker">{/* <DateTimePicker /> */}</div>
      <section className="restaurants">
        <h2>Restaurants:</h2>
        <div className="restaurant-cards">
          {openRestaurants.map((restaurant) => {
            return (
              <div key={restaurant.name} className="restaurant-card">
                <div className="restaurant-name">{restaurant.name}</div>
                <div className="restaurant-hours">{restaurant.times}</div>
              </div>
            );
          })}
        </div>
      </section>
    </InternalUseMain>
  );
}

export default App;
