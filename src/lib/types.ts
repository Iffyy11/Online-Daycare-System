export type Child = {
  id: string;
  name: string;
  age: number;
  classroom: string;
  allergies?: string;
  /** Registered parent account; empty = on roster only (not linked to a parent login yet) */
  parentUserId: string;
};

export type BookingStatus = "pending" | "approved" | "declined";

export type PaymentMethod = "mpesa" | "cash";

export type PaymentStatus = "unpaid" | "pending_verification" | "paid";

export type Booking = {
  id: string;
  /** Account that submitted the request (empty if legacy / staff-entered) */
  parentUserId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: string;
  childAllergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  date: string;
  dropOffTime: string;
  pickUpTime: string;
  programType: string;
  notes: string;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
};

export type ChatMessage = {
  id: string;
  from: string;
  role: "parent" | "staff";
  message: string;
  sentAt: string;
  /** Parent user id this thread belongs to; "" = staff-only (not visible to parents) */
  threadParentUserId: string;
};

export type ProgressCategory = "learning" | "social" | "wellbeing" | "general";

export type ProgressEntry = {
  id: string;
  childId: string;
  title: string;
  detail: string;
  category: ProgressCategory;
  recordedAt: string;
  recordedByName: string;
};

export type DashboardStats = {
  activeChildren: number;
  pendingBookings: number;
  unreadMessages: number;
  occupancyRate: number;
};

export type UserRole = "admin" | "teacher" | "parent";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

/** Short quote from a logged-in parent; shown on the public homepage. */
export type CommunityFeedback = {
  id: string;
  authorUserId: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export type AppDatabase = {
  users: User[];
  children: Child[];
  bookings: Booking[];
  messages: ChatMessage[];
  progress: ProgressEntry[];
  communityFeedback: CommunityFeedback[];
};
