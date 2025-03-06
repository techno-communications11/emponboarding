import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";

const WeeklySchedule = () => {
  const token = localStorage.getItem("token"); // Keep localStorage as per your choice
  const [days, setDays] = useState([]);
   const [name,setname]=useState('');
  let userid = null;

  if (token) {
    try {
      userid = jwtDecode(token).id; // Decode user ID from token
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  useEffect(() => {
    if (!userid) return; // Prevent unnecessary API calls if there's no user ID

    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getweekshedule/${userid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json(); // Parse response as JSON
          data.map((x)=>{
            setname(x.employee_name);
            return;
          })
          setDays(data);
        } else {
          console.error("Failed to fetch schedule:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchData();
  }, [userid]); // Add dependency array to prevent infinite calls

  return (
    <Row>
      <Col>
      
        <span style={{color:'#E10174  '}} className="fw-bolder fs-2">{name}</span>
      
        <p>
          {days.map((day, index) => (
            <span
              className="border fw-bolder p-2 rounded"
              key={index}
              style={{
                color: day.shift_status==='OFF'? "red" : "green",
                marginRight: "15px",
                display: "inline-block",
              }}
            >
              {day.work_date} <br />
              {day.shift_status==='OFF' ? "(off)" : `${day.shift_start} - ${day.shift_end}`}
            </span>
          ))}
        </p>
      </Col>
    </Row>
  );
};

export default WeeklySchedule;
