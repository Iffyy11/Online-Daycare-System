import type { PaymentMethod, PaymentStatus } from "@/lib/types";

export function paymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case "mpesa":
      return "M-Pesa";
    case "cash":
      return "Cash (at center)";
    default:
      return method;
  }
}

export function paymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case "unpaid":
      return "Unpaid";
    case "pending_verification":
      return "Pending verification";
    case "paid":
      return "Paid";
    default:
      return status;
  }
}
