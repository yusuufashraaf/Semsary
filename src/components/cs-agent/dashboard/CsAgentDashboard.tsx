// src/components/CsAgentDashboard.tsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProperties,
  changePropertyStatus,
  type Property,
} from "@services/PropertiesFetch";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import styles from "./CsAgentDashboard.module.css"; // CSS Module

interface Props {
  jwt: string | null;
  className?: string;
}

const STATUSES: Property["property_state"][] = [
  "Valid",
  "Invalid",
  "Pending",
  "Rented",
  "Sold",
];

/**
 * Ensure the returned URL ends with .pdf (sanitize .tmp -> .pdf and avoid double-appending)
 * Keeps query string if present.
 */
function ensurePdfUrl(url: string | undefined | null): string {
  if (!url) return "";

  // Split to keep query string
  const [pathPart, queryPart] = url.split("?");
  // If already a pdf, return original full url (with query)
  if (/\.pdf$/i.test(pathPart)) {
    return queryPart ? `${pathPart}?${queryPart}` : pathPart;
  }

  // Remove trailing .tmp or any other extension (last dot segment) and append .pdf
  // If there is no extension, just append .pdf
  const cleanedPath = pathPart.replace(/(\.tmppdf|\.tmp|(\.[^/.?#]+$))/i, "");
  const finalPath = cleanedPath + ".pdf";
  return queryPart ? `${finalPath}?${queryPart}` : finalPath;
}

/** Suggest a download filename that ends with .pdf */
function suggestedDownloadName(originalFilename?: string | null, id?: number) {
  if (!originalFilename) return `document-${id ?? "file"}.pdf`;
  return /\.pdf$/i.test(originalFilename) ? originalFilename : `${originalFilename}.pdf`;
}

const CsAgentDashboard: React.FC<Props> = ({ jwt, className }) => {
  const queryClient = useQueryClient();

  const {
    data: propertiesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: () => getProperties(jwt),
    staleTime: 30_000,
    refetchInterval: 60_000,
    enabled: !!jwt,
  });

  const mutation = useMutation({
    mutationFn: (vars: { id: number; status: Property["property_state"] }) =>
      changePropertyStatus(vars.id, vars.status, jwt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const [selected, setSelected] = useState<Record<number, Property["property_state"]>>({});
  const [warning, setWarning] = useState<Record<number, string>>({});

  const properties: Property[] = propertiesResponse?.data ?? [];

  if (!jwt) return <div className={className}>No JWT provided.</div>;
  if (isLoading) return <div className={className}>Loading properties…</div>;

  if (error)
    return (
      <div className={className}>
        <div className="text-red-600 mb-2">
          Failed to load properties: {error instanceof Error ? error.message : "Unknown error"}
        </div>
        <button
          onClick={() => refetch()}
          className="px-3 py-1 bg-[var(--accent-color)] text-white rounded"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {properties.length === 0 ? (
        <div>No properties found.</div>
      ) : (
        properties.map((p) => {
          const current = selected[p.id] ?? "";
          const images = (p as any).images ?? [];
          const documents = (p as any).documents ?? [];

          return (
            <div
              key={p.id}
              className="rounded-2xl border shadow-sm flex flex-col bg-white overflow-hidden"
            >
              {/* 🔹 Image Slider */}
              {images.length > 0 ? (
                <div>
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    navigation
                    modules={[Pagination, Navigation]}
                    className={`${styles.brownSwiper} w-full h-56`}
                  >
                    {images.map((img: any, index: number) => (
                      <SwiperSlide key={img.id} className="relative">
                        <img
                          src={img.url}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-56 object-cover"
                        />
                        <div className={styles.imageCounter}>
                          {index + 1} / {images.length}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="text-center text-sm text-gray-600 mt-1">
                    Total Images: {images.length}
                  </div>
                </div>
              ) : (
                <div className="w-full h-56 flex items-center justify-center text-gray-500">
                  No Images
                </div>
              )}

              {/* 🔹 Card Body */}
              <div className="p-4 flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-gray-600">{p.price}</p>
                </div>

                <div className="text-sm">
                  <p>
                    <span className="font-medium">Owner: </span>
                    {p.owner
                      ? `${(p as any).owner.first_name ?? ""} ${(p as any).owner.last_name ?? ""}`
                      : p.owner_id ?? "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Phone: </span>
                    {(p as any).owner?.phone_number ?? "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Email: </span>
                    {(p as any).owner?.email ?? "N/A"}
                  </p>
                </div>

                {/* 🔹 Documents */}
                <div>
                  <span className="font-medium text-sm">Documents:</span>
                  <ul className="mt-2 space-y-3">
                    {documents.length > 0 ? (
                      documents.map((doc: any) => {
                        // backend field might be "document_url" (preferred) or "url" (fallback)
                        const baseUrl = doc.document_url ?? doc.url ?? "";
                        const docUrl = ensurePdfUrl(baseUrl);
                        const downloadName = suggestedDownloadName(doc.original_filename, doc.id);

                        return (
                          <li key={doc.id} className="flex flex-col gap-1">
                            <a
                              href={docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${styles.docLink}`}
                              // suggest a filename for download; note: cross-origin servers/headers may override this
                              download={downloadName}
                            >
                              {doc.original_filename || "Document"}
                            </a>

                            {/* Inline preview - may still trigger download if server sends Content-Disposition: attachment */}
                            <iframe
                              src={docUrl}
                              className="w-full h-40 border rounded"
                              title={`doc-${doc.id}`}
                            />
                          </li>
                        );
                      })
                    ) : (
                      <li className="text-gray-500 text-sm">No documents</li>
                    )}
                  </ul>
                </div>

                {/* 🔹 Status changer */}
                <div className="mt-auto">
                  <label className="block text-sm font-medium mb-1">Change Status</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={current}
                      onChange={(e) => {
                        setSelected((s) => ({ ...s, [p.id]: e.target.value as Property["property_state"] }));
                        setWarning((w) => ({ ...w, [p.id]: "" }));
                      }}
                      className="p-2 border rounded w-full"
                    >
                      <option value="">-- Select Status --</option>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => {
                        if (!current) {
                          setWarning((w) => ({ ...w, [p.id]: "⚠️ Please choose a status first" }));
                          return;
                        }
                        mutation.mutate({ id: p.id, status: current });
                      }}
                      className="px-3 py-2 bg-[var(--primary-color)] text-white rounded disabled:opacity-60"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Updating…" : "Update"}
                    </button>
                  </div>

                  {warning[p.id] && <div className="text-yellow-600 mt-2 text-sm">{warning[p.id]}</div>}
                  {mutation.error && <div className="text-red-600 mt-2">Update failed</div>}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CsAgentDashboard;
