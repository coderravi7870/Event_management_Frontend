import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../server/server";
import { io } from "socket.io-client";
import Loader from "../loader/Loader"

const socket = io(server);

const EventAttendees = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  const { eventId } = useParams();

  const [eventData, setEventData] = useState(null);
  const [attendees, setAttendees] = useState(0);
  const [loading, setLoading] = useState(false);

  const getEvents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/event/${eventId}`);
      if (data.success) {
        setEventData(data.event);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, [eventId]);

  useEffect(() => {
    socket.emit("joinEvent", eventId);

    const handleUpdateAttendees = ({ eventId: updatedEventId, count }) => {
      if (updatedEventId === eventId) setAttendees(count);
    };

    socket.on("updateAttendees", handleUpdateAttendees);

    return () => {
      socket.off("updateAttendees", handleUpdateAttendees);
      socket.emit("leaveEvent", eventId);
    };
  }, [eventId]);

  return loading ? (
    <div className="flex justify-center h-52 items-center">
      <Loader color="red" />
    </div>
  ) : (
    <div className="bg-white flex flex-col items-center p-6">
      <img
        src={eventData?.image}
        alt={eventData?.name || "Event Image"}
        className="w-40 h-40 object-cover rounded-lg shadow-md"
      />
      <div className="p-6 mt-4 rounded-lg shadow-lg bg-gray-200 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          <span className="font-medium">Name of Event:</span>{" "}
          <strong>{eventData?.name}</strong>
        </h2>
        <h2 className="text-xl font-semibold text-gray-800 mt-2">
          <span className="font-medium">Category:</span>{" "}
          <strong>{eventData?.category}</strong>
        </h2>
        <h2 className="text-xl font-semibold text-gray-800 mt-2">
          <span className="font-medium">Attendees:</span>{" "}
          <strong>{attendees || eventData?.attendees || "N/A"}</strong>
        </h2>
      </div>
    </div>
  );
};

export default EventAttendees;
