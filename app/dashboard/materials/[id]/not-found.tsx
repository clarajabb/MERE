import Link from "next/link";

export default function MaterialNotFound() {
  return (
    <div className="py-20 text-center">
      <p className="eyebrow">Not found</p>
      <h1 className="mt-4 font-serif text-3xl font-light text-ink">This material could not be found.</h1>
      <p className="mt-3 text-sm text-muted">It may not exist, or it is not visible to your account.</p>
      <Link href="/dashboard" className="mt-8 inline-block text-sm text-forest underline underline-offset-4">
        Back to materials
      </Link>
    </div>
  );
}
