import { ParentFeedbackForm } from "@/components/parent-feedback-form";
import Link from "next/link";

export const metadata = {
  title: "Share feedback | Parent portal",
};

export default function ParentFeedbackPage() {
  return (
    <>
      <header className="border-b border-violet-100 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">Community</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Share feedback</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Signed-in parents can post a short message that appears on the public homepage so new families hear
          real voices from our community.
        </p>
      </header>
      <div className="mt-8 max-w-xl">
        <ParentFeedbackForm />
        <p className="mt-6 text-sm text-slate-500">
          <Link href="/" className="font-medium text-violet-700 hover:underline">
            View the public site
          </Link>{" "}
          to see how posts appear alongside our featured stories.
        </p>
      </div>
    </>
  );
}
