'use client';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { useRouter } from "next/navigation";
import {Loader} from "../../components/Loader";


export default function ReviewRequest() {
    const searchParams = useSearchParams();
    const requestId = searchParams.get("id");
    const [request, setRequest] = useState({});
    const [loading, setLoading] = useState(true);
    const [decision, setDecision] = useState("");
    const [feedback, setFeedback] = useState("");


    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedRole =
            typeof window !== "undefined" ? localStorage.getItem("role") : null;
        const storedName =
            typeof window !== "undefined" ? localStorage.getItem("name") : null;
        if (!storedRole && !storedName) {
            router.push("/login"); // Redirect if no role found
        } else {
            setUser({ name: storedName, role: storedRole });
        }
    }, [router]);

    useEffect(() => {
        getRequestById();
    }, [])

    const getRequestById = () => {
        axios.get(`http://localhost:3000/request/${requestId}`)
            .then((response) => {
                setRequest(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching requests:", error);
                setError("Failed to load requests");
                setLoading(false);
            })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!decision) {
            alert("Please select a decision.");
            return;
        }

        const response = axios.put(`http://localhost:3000/request/review/${requestId}`, {
            status: decision,
            feedback: feedback || null,
        })
            .then((response) => {
                alert("Request reviewed successfully!");
                router.push("/dashboard"); // Redirect after submission
            })
            .catch((error) => {
                console.error("Error submitting review:", error);
                alert("Failed to submit review.");
            });
    };

    if(loading) return <Loader />
    return (
        <>
            <Header name={user.name} role={user.role} />
            <div className="pt-20 px-20">
                <div className="p-6 bg-white shadow-md rounded-lg border border-stone-200">
                    <h2 className="text-xl font-semibold text-stone-700 mb-4">Request Details</h2>

                    <div className="mb-2">
                        <span className="font-medium text-stone-600">Name: </span>
                        <span className="text-stone-800">{request.name}</span>
                    </div>

                    <div className="mb-2">
                        <span className="font-medium text-stone-600">Email: </span>
                        <span className="text-stone-800">{request.email}</span>
                    </div>

                    <div className="mb-2">
                        <span className="font-medium text-stone-600">Request Type: </span>
                        <span className="text-stone-800">{request.type}</span>
                    </div>

                    <div className="mb-2">
                        <span className="font-medium text-stone-600">Description: </span>
                        <p className="text-stone-800">{request.description || "No description provided."}</p>
                    </div>

                    <div className="mb-2">
                        <span className="font-medium text-stone-600">Preferred Date/Time: </span>
                        <span className="text-stone-800">{request.preferredDate +" "+ request.preferredTime || "Not specified"}</span>
                    </div>

                    {/* {formData.file && (
                            <div className="mt-4">
                                <span className="font-medium text-stone-600">Attachment: </span>
                                <a
                                    href={URL.createObjectURL(formData.file)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    View File
                                </a>
                            </div>
                        )} */}

                    {/* Review Form */}
                    <div className="mt-6 p-6 bg-white shadow-md rounded-lg border border-stone-200">
                        <h3 className="text-lg font-semibold text-stone-700 mb-4">Review Request</h3>
                        <form onSubmit={handleSubmit}>
                            {/* Decision Options */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Decision:</label>
                                <select
                                    className="mt-1 block w-full border border-stone-300 p-2 rounded-md focus:border-stone-500 focus:ring-2 focus:ring-stone-500"
                                    value={decision}
                                    onChange={(e) => setDecision(e.target.value)}
                                >
                                    <option value="">Select an option...</option>
                                    <option value="ACCEPTED">Accept</option>
                                    <option value="REJECTED">Reject</option>
                                    <option value="CHANGES_REQUESTED">Request Changes</option>
                                </select>
                            </div>

                            {/* Feedback Field (Only show if "Request Changes" is selected) */}
                            {(decision === "REJECTED" || decision === "CHANGES_REQUESTED") && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Feedback:</label>
                                    <textarea
                                        className="mt-1 block w-full p-2 border border-stone-300 rounded-md focus:ring-stone-500 focus:border-stone-500"
                                        rows="4"
                                        placeholder="Provide feedback"
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                    ></textarea>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-stone-500 text-white py-2 px-4 rounded-md hover:bg-stone-600 transition"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>


                </div>
            </div>
        </>
    );
}
