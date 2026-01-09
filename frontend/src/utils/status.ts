export function isApproved(status?: string) {
  return status === "approved" || status === "active";
}

export function isRejected(status?: string) {
  return status === "rejected" || status === "reject";
}

export function displayStatus(status?: string) {
  if (isApproved(status)) return "Approved";
  if (isRejected(status)) return "Rejected";
  return status || "Pending";
}

export function badgeClass(status?: string) {
  return isApproved(status)
    ? "bg-green-100 text-green-700"
    : isRejected(status)
    ? "bg-red-100 text-red-700"
    : "bg-yellow-100 text-yellow-700";
}
