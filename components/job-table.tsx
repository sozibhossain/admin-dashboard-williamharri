"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsAPI } from "@/lib/api";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Edit, Eye, Trash2, Check, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScaffoldView } from "@/app/jobs/_components/Scaffold_view";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface UserSummary {
  id: string;
  email: string;
  username: string;
  role: string;
  phone: string | null;
  avatarUrl: string;
  uniqueId: string;
}

export interface ScaffoldApplication {
  id: string;
  job: string;
  applicant?: UserSummary | null;
  title: string;
  description: string;
  photos?: string[];
  ramsDocs?: string[];
  termsAccepted?: boolean;
  methodStatementAgreed?: boolean;
  riskAssessmentAgreed?: boolean;
  signatureUrl?: string;
  revision?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: string; // some backends use this
  scaffoldStatus?: string; // some backends use this
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  price: number;

  // job meta
  jobStatus?: string; // "active" | "assignedToStaffs" | "completed"
  scaffoldStatus?: string; // "submitted" | "redo" | "accepted"
  createdAt: string;
  targetDate: string;

  assignedTo?: UserSummary[];
  latestScaffold?: ScaffoldApplication;
  scaffoldApplication?: ScaffoldApplication;
}

interface PaginationData {
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface JobTableProps {
  onEdit?: (job: Job) => void;
  onViewDetails?: (job: Job) => void;
}

export const JobStatus = Object.freeze([
  "active",
  "assignedToStaffs",
  "completed",
]);

const scaffoldStates = ["submitted", "redo", "accepted"] as const;

/* -------------------------------------------------------------------------- */
/*                               ScaffoldView                                 */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                                 JobTable                                   */
/* -------------------------------------------------------------------------- */

export function JobTable({ onEdit, onViewDetails }: JobTableProps) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selectedJobForScaffold, setSelectedJobForScaffold] =
    useState<Job | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["jobs", page],
    queryFn: async () => {
      const response = await jobsAPI.getAllJobs(page, limit);
      return response.data.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ jobId, status }: { jobId: string; status: string }) =>
      jobsAPI.updateJobStatus(jobId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job status updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  const updateScaffoldStatusMutation = useMutation({
    mutationFn: ({
      applicationId,
      scaffoldStatus,
    }: {
      applicationId: string;
      scaffoldStatus: string;
    }) => jobsAPI.updateJobScaffoldStatus(applicationId, scaffoldStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Scaffold application status updated");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update scaffold status"
      );
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: (jobId: string) => jobsAPI.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete job");
    },
  });

  const jobs: Job[] = data?.results || [];
  const pagination: PaginationData = data?.pagination || {
    page: 1,
    limit: 10,
    totalDocs: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error loading jobs
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scaffold</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-10 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : jobs.map((job) => {
                    const jobStatusValue = job.jobStatus ?? "";
                    const hasScaffold = !!(
                      job.latestScaffold || job.scaffoldApplication
                    );
                    return (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">
                          <p className="line-clamp-2 whitespace-normal break-words">
                            {job.title}
                          </p>
                        </TableCell>

                        <TableCell>
                          <p className="line-clamp-2 whitespace-normal break-words">
                            {job.companyName}
                          </p>
                        </TableCell>

                        <TableCell>
                          <p className="line-clamp-2 whitespace-normal break-words">
                            {job.location}
                          </p>
                        </TableCell>

                        <TableCell>£{job.price}</TableCell>

                        {/* JOB STATUS SELECT */}
                        <TableCell>
                          <Select
                            value={jobStatusValue}
                            onValueChange={(value) => {
                              updateStatusMutation.mutate({
                                jobId: job.id,
                                status: value,
                              });
                            }}
                            disabled={updateStatusMutation.isPending}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="assignedToStaffs">
                                Assigned to Staffs
                              </SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* SCAFFOLD BUTTON */}
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (hasScaffold) setSelectedJobForScaffold(job);
                            }}
                            disabled={!hasScaffold}
                            className={
                              !hasScaffold
                                ? "cursor-not-allowed opacity-60"
                                : ""
                            }
                          >
                            {hasScaffold
                              ? "View Scaffold"
                              : "Awaiting Scaffold"}
                          </Button>
                        </TableCell>

                        {/* ACTIONS */}
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit?.(job)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewDetails?.(job)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                deleteJobMutation.mutate(job.id)
                              }
                              disabled={deleteJobMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, pagination.totalDocs)} of{" "}
            {pagination.totalDocs} results
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(pagination.totalPages, 5) }).map(
                (_, i) => (
                  <Button
                    key={i + 1}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Scaffold Modal */}
      <ScaffoldView
        job={selectedJobForScaffold}
        onClose={() => setSelectedJobForScaffold(null)}
        onUpdateScaffoldStatus={(applicationId, scaffoldStatus) =>
          updateScaffoldStatusMutation.mutate({
            applicationId,
            scaffoldStatus,
          })
        }
        isUpdating={updateScaffoldStatusMutation.isPending}
      />
    </>
  );
}
