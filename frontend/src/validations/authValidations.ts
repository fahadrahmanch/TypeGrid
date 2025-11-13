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

export function passwordValidation(password: string) {
  if (!password.trim()) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
}

export function confirmPasswordValidation(password: string, confirmPassword: string) {
  if (!confirmPassword.trim()) return "Confirm Password is required";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
}
