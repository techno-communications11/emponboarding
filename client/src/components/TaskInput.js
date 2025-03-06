/* TaskInput.js */
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

const TaskInput = ({ id, setSubmittedData, submittedData }) => {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task || !date) return;
    const newTask = { userid: id, task, date, status: "Pending" };
    setSubmittedData([...submittedData, newTask]);
    setTask("");
    setDate("");
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Form.Group>
        <Form.Control type="text" placeholder="Enter Task" value={task} onChange={(e) => setTask(e.target.value)} required />
      </Form.Group>
      <Form.Group className="mt-2">
        <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-2">
        <FaPlus /> Add Task
      </Button>
    </Form>
  );
};

export default TaskInput;