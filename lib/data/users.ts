export interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

/** Shared in-memory user store (used by API routes and server pages). */
export let usersData: UserRecord[] = [
  {
    id: "1",
    firstName: "عرفان",
    lastName: "جلیلیان",
    phoneNumber: "09123456789",
    role: "admin",
    createdAt: "۱۴۰۳/۰۱/۰۱",
    updatedAt: "۱۴۰۳/۰۱/۰۱",
  },
  {
    id: "2",
    firstName: "احمد",
    lastName: "رضایی",
    phoneNumber: "09123456790",
    role: "user",
    createdAt: "۱۴۰۳/۰۱/۱۵",
    updatedAt: "۱۴۰۳/۰۱/۱۵",
  },
  {
    id: "3",
    firstName: "",
    lastName: "",
    phoneNumber: "09123456791",
    role: "user",
    createdAt: "۱۴۰۳/۰۲/۰۵",
    updatedAt: "۱۴۰۳/۰۲/۰۵",
  },
  {
    id: "4",
    firstName: "سارا",
    lastName: "محمدی",
    phoneNumber: "09123456792",
    role: "user",
    createdAt: "۱۴۰۳/۰۲/۱۰",
    updatedAt: "۱۴۰۳/۰۲/۱۰",
  },
  {
    id: "5",
    firstName: "",
    lastName: "",
    phoneNumber: "09123456793",
    role: "user",
    createdAt: "۱۴۰۳/۰۲/۲۰",
    updatedAt: "۱۴۰۳/۰۲/۲۰",
  },
  {
    id: "6",
    firstName: "مهدی",
    lastName: "کریمی",
    phoneNumber: "09123456794",
    role: "user",
    createdAt: "۱۴۰۳/۰۳/۰۱",
    updatedAt: "۱۴۰۳/۰۳/۰۱",
  },
  {
    id: "7",
    firstName: "",
    lastName: "",
    phoneNumber: "09123456795",
    role: "user",
    createdAt: "۱۴۰۳/۰۳/۱۰",
    updatedAt: "۱۴۰۳/۰۳/۱۰",
  },
  {
    id: "8",
    firstName: "زهرا",
    lastName: "حسینی",
    phoneNumber: "09123456796",
    role: "user",
    createdAt: "۱۴۰۳/۰۳/۱۵",
    updatedAt: "۱۴۰۳/۰۳/۱۵",
  },
  {
    id: "9",
    firstName: "علی",
    lastName: "نوری",
    phoneNumber: "09123456797",
    role: "user",
    createdAt: "۱۴۰۳/۰۳/۲۰",
    updatedAt: "۱۴۰۳/۰۳/۲۰",
  },
  {
    id: "10",
    firstName: "",
    lastName: "",
    phoneNumber: "09123456798",
    role: "user",
    createdAt: "۱۴۰۳/۰۴/۰۱",
    updatedAt: "۱۴۰۳/۰۴/۰۱",
  },
];

export function getAllUsers(): UserRecord[] {
  return usersData;
}
