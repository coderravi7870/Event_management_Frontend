import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../server/server";
import Loader from "../loader/Loader";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {  
  const token = localStorage.getItem("token")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    category: "Workshop",
    image:null
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit =async (e) => {
    e.preventDefault();

    const newformData = new FormData();
    newformData.append("name", formData.name);
    newformData.append("description", formData.description);
    newformData.append("date", formData.date);
    newformData.append("category", formData.category);
    newformData.append("image", formData.image);
    newformData.append("token", token);


    setLoading(true);
    const result = await axios.post(`${server}/event/create-event`, newformData,{
      headers: {"Content-Type": "multipart/form-data"}
    });


    if(result.data.success){
      toast.success(result.data.message);
      navigate("/");
    }else{
      toast.error(result.data.message);
    }
    setLoading(false);
  };

  

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-400 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Create New Event</h2>
      <form onSubmit={handleSubmit}>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Event Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          >
            <option value="Workshop">Workshop</option>
            <option value="Webinar">Webinar</option>
            <option value="Conference">Conference</option>
            <option value="Meetup">Meetup</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        {
          loading ? <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          <Loader/>
        </button> : <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Create Event
        </button>
        }
      </form>
    </div>
  );
};

export default CreateEvent;
