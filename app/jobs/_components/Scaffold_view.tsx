"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Check, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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

export const JobStatus = Object.freeze([
  "active",
  "assignedToStaffs",
  "completed",
]);

const scaffoldStates = ["submitted", "redo", "accepted"] as const;

interface ScaffoldViewProps {
  job: Job | null;
  onClose: () => void;
  onUpdateScaffoldStatus: (
    applicationId: string,
    scaffoldStatus: string
  ) => void;
  isUpdating: boolean;
}

export function ScaffoldView({
  job,
  onClose,
  onUpdateScaffoldStatus,
  isUpdating,
}: ScaffoldViewProps) {
  return (
    <Dialog
      open={!!job}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {/* scrollable dialog */}
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        {job &&
          (() => {
            // Prefer latestScaffold; fallback to scaffoldApplication
            const scaffoldApp = job.latestScaffold || job.scaffoldApplication;

            if (!scaffoldApp) {
              return (
                <>
                  <DialogHeader>
                    <DialogTitle>Scaffold Application</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-500">
                    No scaffold application found for this job.
                  </p>
                  <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                      Close
                    </Button>
                  </DialogFooter>
                </>
              );
            }

            const currentScaffoldStatus =
              scaffoldApp.scaffoldStatus || scaffoldApp.status || "";

            return (
              <>
                <DialogHeader>
                  <DialogTitle>{job.title} – Scaffold Application</DialogTitle>
                </DialogHeader>

                {/* Assigned staff */}
                <div className="mb-4 text-sm text-gray-700">
                  <p className="font-medium mb-1">Assigned To:</p>
                  {job.assignedTo && job.assignedTo.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {job.assignedTo.map((staff) => (
                        <li key={staff.id}>
                          {staff.username}{" "}
                          <span className="text-gray-500">({staff.email})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Not assigned to any staff.</p>
                  )}
                </div>

                {/* Dropdown for scaffold application status */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Scaffold Application Status
                    {job.latestScaffold ? " (Latest)" : ""}
                  </p>
                  <Select
                    value={currentScaffoldStatus}
                    onValueChange={(value) =>
                      onUpdateScaffoldStatus(scaffoldApp.id, value)
                    }
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {scaffoldStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state.charAt(0).toUpperCase() + state.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Scaffold Application Details */}
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <p className="text-sm text-gray-500">
                    Scaffold Application
                    {job.latestScaffold ? " (Latest)" : ""}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Status: </span>
                      <span className="capitalize">
                        {currentScaffoldStatus || "N/A"}
                      </span>
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
                  </div>

                  {/* Agreements / Flags */}
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <p className="text-sm font-medium mb-2">Agreements</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        {scaffoldApp.termsAccepted ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                        <span>Terms accepted</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {scaffoldApp.methodStatementAgreed ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                        <span>Method statement agreed</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {scaffoldApp.riskAssessmentAgreed ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                        <span>Risk assessment agreed</span>
                      </li>
                    </ul>
                  </div>

                  {/* Photos */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Photos</p>
                    {Array.isArray(scaffoldApp.photos) &&
                    scaffoldApp.photos.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {scaffoldApp.photos.map((photo, index) => (
                          <a
                            key={photo + index}
                            href={photo}
                            target="_blank"
                            rel="noreferrer"
                            className="block"
                          >
                            <div className="relative w-full h-32 rounded-md overflow-hidden border bg-gray-100">
                              <Image
                                src={photo}
                                alt={`Scaffold photo ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No photos uploaded.
                      </p>
                    )}
                  </div>

                  {/* RAMS Docs count */}
                  <div className="space-y-1 text-sm text-gray-700">
                    <span className="font-medium">RAMS Docs: </span>
                    {Array.isArray(scaffoldApp.ramsDocs)
                      ? scaffoldApp.ramsDocs.length
                      : 0}
                  </div>

                  {/* Signature Image */}
                  {scaffoldApp.signatureUrl && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Signature
                      </p>
                      <div className="relative w-64 h-24 border rounded-md overflow-hidden bg-white">
                        <Image
                          src={scaffoldApp.signatureUrl}
                          alt="Signature"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
      </DialogContent>
    </Dialog>
  );
}
