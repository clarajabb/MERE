import Link from "next/link";
import { RegistrationForm } from "@/app/dashboard/materials/new/registration-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { requireStaff } from "@/lib/auth";

export default async function NewMaterialPage() {
  await requireStaff();

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-8 text-sm">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-forest">
          <span aria-hidden="true">←</span> Materials
        </Link>
      </nav>

      <PageHeader eyebrow="Registry" title="New material">
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Register a material in the MERE registry. Its MERE ID and registration date are generated when you save.
        </p>
      </PageHeader>

      <RegistrationForm />
    </>
  );
}
