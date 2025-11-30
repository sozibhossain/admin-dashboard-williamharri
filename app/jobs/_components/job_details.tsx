"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { jobsAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface JobDetailsProps {
  jobId: string;
}

function JobDetails({ jobId }: JobDetailsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => jobsAPI.getJobById(jobId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    );
  }

  if (error || !data?.data?.data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Failed to load job details
      </div>
    );
  }

  const job: any = data.data.data;

  // Prefer latestScaffold if available, otherwise fall back to scaffoldApplication
  const scaffoldApp: any =
    job.latestScaffold || job.scaffoldApplication || null;

  // Helper to detect PDFs for RAMS/docs
  const isPdf = (url: string) => /\.pdf(\?|#|$)/i.test(url || "");

  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle>{job.title}</CardTitle>

        {/* Job thumbnail (Next.js Image) */}
        {job.thumbnail && (
          <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-lg border">
            <Image
              src={job.thumbnail}
              alt={job.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Company */}
        <div>
          <p className="text-sm text-gray-500">Company</p>
          <p className="font-medium">{job.companyName}</p>
        </div>

        {/* Location + Price + Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{job.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-medium">£{job.price}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium capitalize">
              {job.status || job.jobStatus}
            </p>
          </div>
        </div>

        {/* Scaffold Status */}
        <div>
          <p className="text-sm text-gray-500">Scaffold Status</p>
          <p className="font-medium capitalize">
            {job.scaffoldStatus || "N/A"}
          </p>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-500">Description</p>
          <p className="mt-1 text-gray-800 whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Job Photos (from job.photos) */}
        {Array.isArray(job.photos) && job.photos.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Job Photos</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {job.photos.map((url: string, idx: number) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <img
                    src={url}
                    alt={`Job photo ${idx + 1}`}
                    className="h-24 w-full object-cover rounded-md border"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Method Statement & Risk Assessment (job-level PDF URLs) */}
        {(job.methodStatementUrl || job.riskAssessmentUrl) && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Documents</p>

            {job.methodStatementUrl && (
              <div>
                <p className="text-sm font-medium mb-1">
                  Method Statement
                </p>
                <a
                  href={job.methodStatementUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-700 underline break-all"
                >
                  {job.methodStatementUrl.split("/").pop() ??
                    "Method Statement"}
                </a>
                {isPdf(job.methodStatementUrl) && (
                  <div className="mt-2 border rounded-md overflow-hidden bg-gray-50">
                    <iframe
                      src={job.methodStatementUrl}
                      className="w-full h-64"
                      title="Method Statement"
                    />
                  </div>
                )}
              </div>
            )}

            {job.riskAssessmentUrl && (
              <div>
                <p className="text-sm font-medium mb-1">
                  Risk Assessment
                </p>
                <a
                  href={job.riskAssessmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-700 underline break-all"
                >
                  {job.riskAssessmentUrl.split("/").pop() ??
                    "Risk Assessment"}
                </a>
                {isPdf(job.riskAssessmentUrl) && (
                  <div className="mt-2 border rounded-md overflow-hidden bg-gray-50">
                    <iframe
                      src={job.riskAssessmentUrl}
                      className="w-full h-64"
                      title="Risk Assessment"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Posted By */}
        {job.postedBy && (
          <div>
            <p className="text-sm text-gray-500">Posted By</p>
            <div className="mt-1 flex items-center gap-3 text-gray-800">
              {job.postedBy.avatarUrl && (
                <img
                  src={job.postedBy.avatarUrl}
                  alt={job.postedBy.username || job.postedBy.name}
                  className="h-10 w-10 rounded-full object-cover border"
                />
              )}
              <div>
                <p className="font-medium">
                  {job.postedBy.name || job.postedBy.username}
                </p>
                <p className="text-sm text-gray-600">
                  {job.postedBy.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Assigned To */}
        {Array.isArray(job.assignedTo) && job.assignedTo.length > 0 && (
          <div>
            <p className="text-sm text-gray-500">Assigned To</p>
            <ul className="mt-2 space-y-2">
              {job.assignedTo.map((staff: any) => (
                <li
                  key={staff.id}
                  className="flex items-center gap-3 text-gray-800"
                >
                  {staff.avatarUrl && (
                    <img
                      src={staff.avatarUrl}
                      alt={staff.username || staff.name}
                      className="h-8 w-8 rounded-full object-cover border"
                    />
                  )}
                  <div>
                    <p className="font-medium">
                      {staff.name || staff.username}
                    </p>
                    <p className="text-xs text-gray-600">
                      {staff.email} • {staff.role}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Scaffold Application / Latest Scaffold */}
        {scaffoldApp && (
          <div className="pt-4 border-t border-gray-200 space-y-4">
            <p className="text-sm text-gray-500">
              Scaffold Application
              {job.latestScaffold ? " (Latest)" : ""}
            </p>

            {/* Basic scaffold info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-medium">Status: </span>
                <span className="capitalize">
                  {scaffoldApp.status ||
                    scaffoldApp.scaffoldStatus ||
                    "N/A"}
                </span>
              </div>

              <div>
                <span className="font-medium">Revision: </span>
                {scaffoldApp.revision ?? 0}
              </div>

              <div>
                <span className="font-medium">Applicant: </span>
                {scaffoldApp.applicant
                  ? `${scaffoldApp.applicant.username} (${scaffoldApp.applicant.email})`
                  : "N/A"}
              </div>

              <div>
                <span className="font-medium">Submitted At: </span>
                {scaffoldApp.createdAt
                  ? new Date(scaffoldApp.createdAt).toLocaleString()
                  : "N/A"}
              </div>

              <div>
                <span className="font-medium">Photos Count: </span>
                {Array.isArray(scaffoldApp.photos)
                  ? scaffoldApp.photos.length
                  : 0}
              </div>

              <div>
                <span className="font-medium">RAMS Docs Count: </span>
                {Array.isArray(scaffoldApp.ramsDocs)
                  ? scaffoldApp.ramsDocs.length
                  : 0}
              </div>
            </div>

            {/* Scaffold photos thumbnails */}
            {Array.isArray(scaffoldApp.photos) &&
              scaffoldApp.photos.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Scaffold Photos
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {scaffoldApp.photos.map(
                      (url: string, idx: number) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="block"
                        >
                          <img
                            src={url}
                            alt={`Scaffold photo ${idx + 1}`}
                            className="h-24 w-full object-cover rounded-md border"
                            onError={(e) => {
                              // Hide broken local/simulator paths
                              (e.currentTarget as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* RAMS documents (PDF, etc.) from scaffoldApp.ramsDocs */}
            {Array.isArray(scaffoldApp.ramsDocs) &&
              scaffoldApp.ramsDocs.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    RAMS Documents
                  </p>

                  <ul className="space-y-2 text-sm text-blue-700">
                    {scaffoldApp.ramsDocs.map(
                      (docUrl: string, idx: number) => {
                        const label =
                          docUrl.split("/").pop() ||
                          `Document ${idx + 1}`;

                        return (
                          <li key={idx}>
                            <a
                              href={docUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="underline break-all"
                            >
                              {label}
                            </a>

                              {/* Inline preview for PDFs */}
                            {isPdf(docUrl) && (
                              <div className="mt-2 border rounded-md overflow-hidden bg-gray-50">
                                <iframe
                                  src={docUrl}
                                  className="w-full h-64"
                                  title={`RAMS Document ${idx + 1}`}
                                />
                              </div>
                            )}
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              )}

            {/* Signature as image + link */}
            {scaffoldApp.signatureUrl && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Signature</p>
                <div className="flex items-center gap-4">
                  <a
                    href={scaffoldApp.signatureUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <img
                      src={scaffoldApp.signatureUrl}
                      alt="Signature"
                      className="h-24 object-contain rounded-md border bg-white"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Created At: </span>
            {job.createdAt
              ? new Date(job.createdAt).toLocaleString()
              : "-"}
          </div>
          <div>
            <span className="font-medium">Target Date: </span>
            {job.targetDate
              ? new Date(job.targetDate).toLocaleDateString()
              : "-"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default JobDetails;
