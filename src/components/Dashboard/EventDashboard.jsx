import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { server } from "../../server/server";
import Loader from "../../loader/Loader";

const EventDashboard = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, [token]);

  const logOutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredEvents = eventsData.filter((event) => {
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;
    const matchesDate = selectedDate === "" || event.date === selectedDate;
    // console.log(matchesCategory, matchesDate);

    return matchesCategory && matchesDate;
  });

  const categories = ["Workshop", "Webinar", "Conference", "Meetup"];

  const getEvents = async () => {
    setLoading(true);
    const { data } = await axios.get(`${server}/event/get-events`);

    if (data.success) {
      setEventsData(data.events);
    }

    setLoading(false);
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Dashboard</h1>
        <button
          className=" inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          onClick={logOutHandler}
        >
          Logout
        </button>
      </div>

      {/* Filter Section */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedDate("");
              }}
              className="mt-6 md:mt-0 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      {/* Create new Event btn */}
      <div className="mb-4 flex justify-center">
        <Link
          to="/create-event"
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Create New Event
        </Link>
      </div>

      {/* Event List */}

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Loader color="red" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length >0 ?filteredEvents.map((event) => {
            const dateObj = new Date(event.date);

            const month = String(dateObj.getMonth() + 1).padStart(2, "0");
            const day = String(dateObj.getDate()).padStart(2, "0");
            const year = String(dateObj.getFullYear()).slice(-2);

            // Format to mm/dd/yy
            const formattedDate = `${month}/${day}/${year}`;

            return (
              <div
                key={event._id}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {event.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                      Date: {formattedDate}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Category: {event.category}
                    </p>

                    <Link
                      to={`/event/${event._id}`}
                      className="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                      Join
                    </Link>
                  </div>
                  <div>
                    <img src={event.image} alt="event image" className="h-40 w-28 object-cover bg-center"/>
                  </div>
                </div>
              </div>
            );
          }): <div className="flex justify-center text-xl text-red-600 h-52 border items-center">
            <h1>There is no Event Yet</h1></div>}
        </div>
      )}
    </div>
  );
};

export default EventDashboard;
