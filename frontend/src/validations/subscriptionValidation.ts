export function nameValidation(name: string) {
  if (!name.trim()) return "Plan name is required";
  if (name.trim().length < 3) return "Name must be at least 3 characters";
  return "";
}

export function priceValidation(price: string) {
  if (!price.trim()) return "Price is required";
  const num = parseFloat(price);
  if (isNaN(num) || num < 0) return "Price must be a positive number";
  return "";
}

export function durationValidation(duration: string) {
  if (!duration.trim()) return "Duration is required";
  const validDurations = ["monthly", "yearly"];
  if (!validDurations.includes(duration)) return "Invalid duration selected";
  return "";
}

export function typeValidation(type: string) {
  if (!type.trim()) return "Plan type is required";
  return "";
}

export function userLimitValidation(type: string, userLimit: string) {
  if (type === "company") {
    if (!userLimit.trim()) return "Number of users is required for company plans";
    const num = parseInt(userLimit);
    if (isNaN(num) || num <= 0) return "User limit must be at least 1";
  }
  return "";
}

export function featuresValidation(type: string, features: string[]) {
  if (type === "normal") {
    if (features.length === 0) return "Please select at least one feature for normal plans";
  }
  return "";
}
