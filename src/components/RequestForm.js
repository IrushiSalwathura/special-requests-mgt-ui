'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

const requestType =[
    {type: "EVENT_APPEARANCE", value:"Event Appearance"},
    {type: "BIRTHDAY_GREETING", value:"Birthday Greeting"},
    {type: "PRODUCT_MARKETING", value:"Product Marketing"}
]


const user =localStorage.getItem("name");
const userRole = localStorage.getItem("role");
const userId = localStorage.getItem("userId");

export default function RequestForm({mode,id}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        type: "",
        description: "",
        status: "PENDING",
        preferredDate: "",
        preferredTime: "",
        userId: userId,
    });
    
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        type: "",
        description: "",
        status: "",
        preferredDate: "",
        preferredTime: "",
        userId: ""
    });

    useEffect(() => {
        console.log(id);
        if(id!==null){
            axios.get(`http://localhost:8080/requests/${id}`)
            .then((response) => {
                console.log(response);
                setRequest(response.data.requestData);
                // setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching requests:", error);
                // setError("Failed to load requests");
                // setLoading(false);
            })
        }
        setLoading(false);
    },[])

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if(mode==="Create"){
            setFormData({
                ...formData,
                [name]: value,
            })
        }else{
            setRequest({
                ...request,
                [name]: value,
              })
        }
    };
    
    
    const validateForm = () => {
        let formIsValid = true;
        let errorMessages = {
            name: "",
            email: "",
            type: "",
            description: "",
            preferredDate: "",
            preferredTime: ""
        };
    
        const data = mode === "Create" ? formData : request;
    
        // Name validation
        if (!data.name) {
            formIsValid = false;
            errorMessages.name = "Name is required";
        }
    
        // Email validation
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!data.email) {
            formIsValid = false;
            errorMessages.email = "Email is required";
        } else if (!emailPattern.test(data.email)) {
            formIsValid = false;
            errorMessages.email = "Invalid email format";
        }
    
        // Request Type validation
        if (!data.type) {
            formIsValid = false;
            errorMessages.type = "Request Type is required";
        }
    
        // Description validation
        if (!data.description) {
            formIsValid = false;
            errorMessages.description = "Description is required";
        }
    
        // Preferred Date validation
        if (!data.preferredDate) {
            formIsValid = false;
            errorMessages.preferredDate = "Date is required";
        } else {
            const today = new Date();
            const selectedDate = new Date(data.preferredDate);
    
            if (selectedDate < today.setHours(0, 0, 0, 0)) {
                formIsValid = false;
                errorMessages.preferredDate = "Date must be in the future";
            }
        }
    
        // Preferred Time validation (includes seconds)
        if (!data.preferredTime) {
            formIsValid = false;
            errorMessages.preferredTime = "Time is required";
        } else if (data.preferredDate) {
            const today = new Date();
            const selectedDate = new Date(data.preferredDate);
            const selectedTime = data.preferredTime.split(":");
            const selectedHour = parseInt(selectedTime[0], 10);
            const selectedMinute = parseInt(selectedTime[1], 10);
            const selectedSecond = parseInt(selectedTime[2] || "0", 10); // Default to 0 if seconds not present
    
            if (selectedDate.toDateString() === today.toDateString()) {
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();
                const currentSecond = now.getSeconds();
    
                if (
                    selectedHour < currentHour ||
                    (selectedHour === currentHour && selectedMinute < currentMinute) ||
                    (selectedHour === currentHour && selectedMinute === currentMinute && selectedSecond <= currentSecond)
                ) {
                    formIsValid = false;
                    errorMessages.preferredTime = "Time must be in the future";
                }
            }
        }
    
        setErrors(errorMessages);
        return formIsValid;
    };
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Request: " + request.name);
        if (validateForm()) {
          alert("Request submitted successfully!");
          
          try {
            // Make the POST request to the backend
            if(mode === "Create"){
                const response = await axios.post("http://localhost:8080/requests", formData);
            } else {
                //If in Edit mode
                const response = await axios.put(`http://localhost:8080/requests/${id}`, request);
            }
      
            // setMessage(response.data.message); 

          } catch (error) {
            console.error("Error submitting form:", error);
            setMessage("Error submitting form.");
          }
        }
    };


    return (
    <>
    <Header name={user} role={userRole}/>
    <div className="pt-20 px-20">
        <h2 className="text-xl font-semibold mb-4">{mode} Request</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-stone-300 rounded-md focus:ring-stone-600 focus:border-stone-500"
              placeholder="Your Name"
              name="name"
              value={mode==="Create" ? formData.name || "" : request?.name || ""}
              onChange={handleInputChange}
            />
            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>
        {/* Email */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full p-2 border border-stone-300 rounded-md focus:ring-stone-600 focus:border-stone-500"
              placeholder="Your Email"
              name="email"
              value={mode==="Create" ? formData.email || "" : request?.email || ""}
              onChange={handleInputChange}
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>
        {/* Request Type */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Request Type</label>
            <select className="mt-1 block w-full border border-stone-300 p-2 rounded-md focus:border-stone-500 focus:ring-2 focus:ring-stone-500"
                    onChange={handleInputChange}
                    name="type"
                    value={mode==="Create" ? formData.type || "" : request?.type || ""}>
                <option defaultValue>Select an Option..{mode==="Edit" && request?.type}</option>
                {requestType.map(type => 
                    <option key={requestType.indexOf(type)} value={type.type}>{type.value}</option>
                )}
                {/* <option value={requestType[0].id}>{requestType[0].value}</option>
                <option value={requestType[1].id}>{requestType[1].value}</option>
                <option value={requestType[2].id}>{requestType[2].value}</option> */}
            </select>  
            {errors.type && <p style={{ color: "red" }}>{errors.type}</p>}
        </div>
        {/* Description */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full p-2 border border-stone-300 rounded-md focus:ring-stone-500 focus:border-stone-500"
              rows="4"
              placeholder="Brief Description"
              name="description"
              value={mode==="Create" ? formData.description || "" : request?.description || ""}
              onChange={handleInputChange}
            ></textarea>
            {errors.description && <p style={{ color: "red" }}>{errors.description}</p>}
        </div>
        {/* Preferred Date/Time */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Date/Time</label>
            <input
              type="date"
              className="mt-2 block w-full p-2 border border-stone-300 rounded-md focus:ring-stone-600 focus:border-stone-500"
              name="preferredDate"
              value={mode==="Create" ? formData.preferredDate || "" : request?.preferredDate || ""}
              onChange={handleInputChange}
            />
            {errors.date && <p style={{ color: "red" }}>{errors.date}</p>}
            <input
                type="time"
                step="1" // enables seconds
                className="mt-2 block w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                name="preferredTime"
                value={mode === "Create" ? formData.preferredTime || "" : request?.preferredTime || ""}
                onChange={handleInputChange}
                />
            {errors.time && <p style={{ color: "red" }}>{errors.time}</p>}

        </div>
        {/* Attachments */}
        <div>
            <label>Attachments</label>
            <input type="file" 
                    className="mt-2 w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-stone-500" 
                    onChange={handleFileChange} 
                    id="fileInput" />
        </div>
        {/* Submit */}
        <button
            type="submit"
            className="w-full bg-stone-500 text-white py-2 px-4 rounded-md hover:bg-stone-300"
            onClick={handleSubmit}
          >
            Submit
        </button>
        </form>
      </div>
      </>
    );
  }
  