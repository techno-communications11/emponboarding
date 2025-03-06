/* WeeklySchedule.js */
import React from "react";
import { Col, Row } from "react-bootstrap";

const WeeklySchedule = () => {
  const days = [
    { name: "Monday", off: false, start: "9:00 AM", end: "5:00 PM" },
    { name: "Tuesday", off: false, start: "9:00 AM", end: "5:00 PM" },
    { name: "Wednesday", off: false, start: "9:00 AM", end: "5:00 PM" },
    { name: "Thursday", off: false, start: "9:00 AM", end: "5:00 PM" },
    { name: "Friday", off: false, start: "9:00 AM", end: "5:00 PM" },
    { name: "Saturday", off: true }, // Off day
    { name: "Sunday", off: true }, // Off day
  ];

  return (
    <Row>
      <Col>
        <p >
          {days.map((day, index) => (
            <span  className="border  fw-bolder p-2 rounded" key={index} style={{ color: day.off ? "red" : "green", marginRight: "15px", display: "inline-block" }}>
              {day.name} <br />
              {day.off ? "(Off)" : `${day.start} - ${day.end}`}
            </span>
          ))}
        </p>
      </Col>
    </Row>
  );
};

export default WeeklySchedule;