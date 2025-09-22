export type TUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  status: string;
  created_at: string;
};
export type TFullUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  google_id: string | null;
  email_verified_at: string | null;
  email_otp: string | null;
  email_otp_expires_at: string | null;
  id_image_url: string | null;
  role: "user" | "admin" | "owner";
  phone_number: string;
  status: "pending" | "active" | "suspended";
  phone_verified_at: string | null;
  whatsapp_otp: string | null;
  whatsapp_otp_expires_at: string | null;
  created_at: string;
  updated_at: string;
};
export type ChangePasswordFormValues = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};
export type ChangeEmailFormValues = {
  current_email: string;
  email: string;
  password: string;
};
