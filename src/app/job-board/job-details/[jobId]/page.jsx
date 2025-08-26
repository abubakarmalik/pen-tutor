"use client"
import { useParams } from "next/navigation";

export default function JobDetails() {
    const params = useParams()
    console.log(params)
    return (
        <div>
            <h1>Job Details for {params.jobId}</h1>
        </div>
    );
}