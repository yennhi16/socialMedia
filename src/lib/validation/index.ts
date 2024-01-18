import * as z from "zod";

export const SignUpValidation = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter your email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must contain at least one uppercase letter.",
    })
    .refine((password) => /\d/.test(password), {
      message: "Password must contain at least one digit.",
    })
    .refine((password) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password), {
      message: "Password must contain at least one special character.",
    }),
});

export const SignInValidation = z.object({
  email: z.string().email({ message: "Please enter your email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must contain at least one uppercase letter.",
    })
    .refine((password) => /\d/.test(password), {
      message: "Password must contain at least one digit.",
    })
    .refine((password) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password), {
      message: "Password must contain at least one special character.",
    }),
});

export const PostValidattion = z.object({
  caption: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(5)
    .max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});
