import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { FaCalendarAlt, FaShareAlt } from "react-icons/fa";

const TaskList = ({ groupedData, handleShare }) => {
  return (
    <Card className="shadow-sm task-display-card">
      <Card.Header className="bg-primary text-white">
        <h4 className="mb-0">
          <FaCalendarAlt className="me-2" /> Task History
        </h4>
      </Card.Header>
      <Card.Body>
        {Object.keys(groupedData).length > 0 ? (
          Object.entries(groupedData).map(([date, items]) => (
            <div key={date} className="mb-4">
              <h5>
                <Badge bg="pink" className="date-badge px-3 py-2">
                  <FaCalendarAlt className="me-2" /> {date}
                </Badge>
              </h5>
              <ul className="list-group mt-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item task-item d-flex justify-content-between align-items-center"
                  >
                    <div className="task-text">{item.taskdata}</div>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleShare(item.taskdata)}
                    >
                      <FaShareAlt /> Share
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div className="text-center p-4">
            <p className="mb-0 text-muted">No tasks found for the selected criteria.</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TaskList;
