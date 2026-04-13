import { Booking, ChatMessage, Child, DashboardStats, ProgressEntry } from "@/lib/types";

export const children: Child[] = [
  { id: "c1", name: "Ayaan N.", age: 4, classroom: "Sunflower", parentUserId: "" },
  { id: "c2", name: "Mia K.", age: 3, classroom: "Rainbow", parentUserId: "", allergies: "Peanuts" },
  { id: "c3", name: "Noah T.", age: 5, classroom: "Explorer", parentUserId: "" },
];

export const bookings: Booking[] = [
  {
    id: "b1",
    parentUserId: "",
    parentName: "Fatma Ali",
    parentEmail: "fatma@example.com",
    parentPhone: "+254700000001",
    childName: "Ayaan N.",
    childAge: "4",
    childAllergies: "None",
    emergencyContactName: "Omar Ali",
    emergencyContactPhone: "+254700000002",
    date: "2026-04-14",
    dropOffTime: "08:00",
    pickUpTime: "16:00",
    programType: "Full day",
    notes: "",
    paymentMethod: "mpesa",
    paymentReference: "",
    paymentStatus: "paid",
    status: "approved",
  },
];

export const messages: ChatMessage[] = [
  {
    id: "m1",
    from: "Teacher Grace",
    role: "staff",
    message: "Hello",
    sentAt: "2026-04-13T09:30:00Z",
    threadParentUserId: "",
  },
];

export const progress: ProgressEntry[] = [];

export const stats: DashboardStats = {
  activeChildren: 36,
  pendingBookings: 6,
  unreadMessages: 4,
  occupancyRate: 82,
};
