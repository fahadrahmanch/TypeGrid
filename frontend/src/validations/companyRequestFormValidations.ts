export function nameValidation(name: string) {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 3) return "Name must be at least 3 characters";
  return "";
}

export function emailValidation(email: string) {
  if (!email.trim()) return "Email is required";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Invalid email format";
  return "";
}
export function numberValidation(number: string) {
  if (!number.trim()) return "Phone number is required";
  
  const regex = /^[6-9]\d{9}$/; // Valid Indian mobile format
  if (!regex.test(number)) return "Invalid phone number (10 digits required)";
  
  return "";
}

export function addressValidation(address: string) {
  if (!address.trim()) return "Address is required";
  if (address.trim().length < 5) return "Address must be at least 5 characters";
  
  return "";
}
