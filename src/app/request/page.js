"use client";
import RequestForm from "../../components/RequestForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Request() {
    const searchParams = useSearchParams();
    const requestId = searchParams?.get("id");
    const [mode, setMode] = useState("Create");

    useEffect(() => {
        if(requestId !=null){
            setMode("Edit")
        }
            
    },[])

    return (
    <>
        <RequestForm mode={mode} id={requestId}/>
    </>
    );
}
  