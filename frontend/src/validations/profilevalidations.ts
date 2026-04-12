export function nameValidation(name: string) {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 3) return "Name must be at least 3 characters";
  return "";
}
export function numberValidation(number: string) {
  if (!number || !number.trim()) return "";
  const regex = /^[6-9]\d{9}$/;
  if (!regex.test(number)) return "Invalid phone number (10 digits required)";

  return "";
}
export function ageValidation(age: string) {
  if (!age || age.toString().trim() === "") return "";
  if (Number(age) < 9) return "Age must be 9 or above";
  if (Number(age) > 100) return "Age must be below 100";
  return "";
}

export function bioValidation(bio: string) {
  if (!bio || !bio.trim()) return "";
  if (bio.trim().length < 10) return "Bio must be at least 10 characters";
  if (bio.trim().length > 200) return "Bio must be less than 200 characters";
  return "";
}

export function oldPasswordValidation(password: string) {
  if (!password) return "Current password is required";
  return "";
}

export function newPasswordValidation(password: string) {
  if (!password) return "New password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
}

export function confirmPasswordValidation(newPass: string, confirmPass: string) {
  if (!confirmPass) return "Confirm password is required";
  if (newPass !== confirmPass) return "Passwords do not match";
  return "";
}
