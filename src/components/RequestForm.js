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

export default function RequestForm({mode,id}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        type: "",
        description: "",
        preferredDate: "",
        preferredTime: "",
    });
    
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        type: "",
        description: "",
        preferredDate: "",
        preferredTime: "",
    });

    useEffect(() => {
        console.log(id);
        if(id!==null){
            axios.get(`http://localhost:3000/request/${id}`)
            .then((response) => {
                console.log(response.data)
                setRequest(response.data);
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
              });
        }
    };
    
    const validateForm = () => {
        let formIsValid = true;
        let errorMessages = { name: "", email: "", type: "",
            description: "",
            preferredDate: "",
            preferredTime: "" };
    
        // Name validation
        if(mode==="Create"){
            if (!formData.name) {
                formIsValid = false;
                errorMessages.name = "Name is required";
            }
        }else{
            if (!request.name){
                formIsValid = false;
                errorMessages.name = "Name is required";
            }
        }
    
        // Email validation
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if(mode==="Create"){
            if (!formData.email) {
                formIsValid = false;
                errorMessages.email = "Email is required";
            } else if (!emailPattern.test(formData.email) ) {
                formIsValid = false;
                errorMessages.email = "Invalid email format";
                }
        }else {
            if (!request.email){
                formIsValid = false;
                errorMessages.email = "Email is required";
            }else if (!emailPattern.test(request.email) ) {
                formIsValid = false;
                errorMessages.email = "Invalid email format";
            }
        } 
    
    
        // RequestType validation
        if(mode==="Create"){
            if (!formData.type) {
                formIsValid = false;
                errorMessages.type = "Request Type is required";
            }
        }else{
            if (!request.type){
                formIsValid = false;
                errorMessages.type = "Request Type is required";
            }
        }

        // Description validation
        if(mode==="Create"){
            if (!formData.description) {
                formIsValid = false;
                errorMessages.description = "Description is required";
            }
        }else{
            if (!request.description){
                formIsValid = false;
                errorMessages.description = "Description is required";
            }
        }

        // Date validation 
        if(mode==="Create"){
            if (!formData.preferredDate) {
                formIsValid = false;
                errorMessages.preferredDate = "Date is required";
            }else if(!formData.preferredDate){
                const today = new Date();
                const selectedDate = new Date(formData.preferredDate);
        
                // date must be in the future
                if (selectedDate < today.setHours(0, 0, 0, 0)) {
                    formIsValid = false;
                    errorMessages.preferredDate = "Date must be in the future";
                }
            }
        } else {
            if (!request.preferredDate){
                formIsValid = false;
                errorMessages.preferredDate = "Date is required";
            } else if(!request.preferredDate){
                const today = new Date();
                const selectedDate = new Date(request.preferredDate);
        
                // date must be in the future
                if (selectedDate < today.setHours(0, 0, 0, 0)) {
                    formIsValid = false;
                    errorMessages.preferredDate = "Date must be in the future";
                }
            }
        } 

        // Time validation
        if (mode=="Create"){
            if(!formData.preferredTime) {
                formIsValid = false;
                errorMessages.preferredTime = "Time is required";
            } else if (formData.preferredDate) {
                const today = new Date();
                const selectedDate = new Date(formData.preferredDate);
                const selectedTime = formData.preferredTime.split(":");
                const selectedHour = parseInt(selectedTime[0]);
                const selectedMinute = parseInt(selectedTime[1]);
        
                if (selectedDate.toDateString() === today.toDateString()) {
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();
        
                if (
                    selectedHour < currentHour ||
                    (selectedHour === currentHour && selectedMinute < currentMinute)
                ) {
                    formIsValid = false;
                    errorMessages.preferredTime = "Time must be in the future";
                }
                }
            }
        } else  {
            if (!request.preferredTime){
                formIsValid = false;
                errorMessages.preferredTime = "Date is required";
            }else if (request.preferredDate) {
                const today = new Date();
                const selectedDate = new Date(request.preferredDate);
                const selectedTime = request.preferredTime.split(":");
                const selectedHour = parseInt(selectedTime[0]);
                const selectedMinute = parseInt(selectedTime[1]);
        
                if (selectedDate.toDateString() === today.toDateString()) {
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();
        
                if (
                    selectedHour < currentHour ||
                    (selectedHour === currentHour && selectedMinute < currentMinute)
                ) {
                    formIsValid = false;
                    errorMessages.preferredTime = "Time must be in the future";
                }
                }
            }
        } 
        

    setErrors(errorMessages);
        return formIsValid;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(validateForm());
        if (validateForm()) {
          alert("Request submitted successfully!");
          
          try {
            console.log(formData);
            
            // Make the POST request to the backend
            if(mode === "Create"){
                const response = await axios.post("http://localhost:3000/request", formData, {
                withCredentials: true,
                });
            } else {
                //If in Edit mode
                const response = await axios.put(`http://localhost:3000/request/${id}`, request, {
                    withCredentials: true,
                    });
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
              value={mode==="Create" ? formData.name : request?.name}
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
              value={mode==="Create" ? formData.email : request?.email}
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
                    value={mode==="Create" ? formData.type : request?.type}>
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
              value={mode==="Create" ? formData.description : request?.description}
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
              value={mode==="Create" ? formData.preferredDate : request?.preferredDate}
              onChange={handleInputChange}
            />
            {errors.date && <p style={{ color: "red" }}>{errors.date}</p>}
            <input
                type="time"
                className="mt-2 block w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                name="preferredTime"
                value={mode==="Create" ? formData.preferredTime : request?.preferredTime}
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
  