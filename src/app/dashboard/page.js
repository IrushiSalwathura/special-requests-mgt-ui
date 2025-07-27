'use client';
import { useEffect, useState } from "react";
import axios from "axios";

import Header from "../../components/Header";
import List from "../../components/List";
import { useRouter } from "next/navigation";


export default function Dashbaord(){
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Ensure this runs only in the browser
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
        axios.get("http://localhost:3000/request")
        .then((response) => {
            setRequests(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching requests:", error);
            setError("Failed to load requests");
            setLoading(false);
        } )
    }, []);

    if (!user) return null;
    return (
      <>
        <Header name={user.name} role={user.role} />
        <section className="pt-20 px-10">
          <List role={user.role} data={requests}/>
        </section>
      </>
    );
}