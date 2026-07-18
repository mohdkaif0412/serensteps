"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { savePost } from "@/actions/posts";
import { initialFormState } from "@/lib/form-state";
import { POST_STATUSES } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import { Field, FormError, SubmitButton, adminField } from "@/components/admin/form-ui";
import { TiptapEditor } from "@/components/admin/TiptapEditor";
import { CoverImageField } from "@/components/admin/CoverImageField";

export type PostFormData = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  category?: string | null;
  status?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: string | null; // YYYY-MM-DD
};

export function PostForm({ post }: { post?: PostFormData }) {
  const [state, action, pending] = useActionState(savePost, initialFormState);
  const fe = state.fieldErrors ?? {};

  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugLocked, setSlugLocked] = useState(Boolean(post?.slug));

  return (
    <form action={action} className="space-y-6">
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      <FormError message={state.error} />

      <Field label="Title" htmlFor="title" required error={fe.title?.[0]}>
        <input
          id="title"
          name="title"
          defaultValue={post?.title}
          className={adminField}
          onChange={(e) => {
            if (!slugLocked) setSlug(slugify(e.target.value));
          }}
        />
      </Field>

      <Field
        label="Web address (slug)"
        htmlFor="slug"
        required
        error={fe.slug?.[0]}
        hint="This becomes /blog/your-slug"
      >
        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugLocked(true);
          }}
          className={adminField}
        />
      </Field>

      <Field
        label="Excerpt"
        htmlFor="excerpt"
        error={fe.excerpt?.[0]}
        hint="A short summary shown on cards and previews."
      >
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          rows={2}
          className={adminField}
        />
      </Field>

      <Field label="Cover image" error={fe.coverImage?.[0]}>
        <CoverImageField name="coverImage" defaultValue={post?.coverImage ?? ""} />
      </Field>

      <Field label="Content" required error={fe.content?.[0]}>
        <TiptapEditor name="content" defaultValue={post?.content ?? ""} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Category" htmlFor="category" error={fe.category?.[0]}>
          <input
            id="category"
            name="category"
            defaultValue={post?.category ?? ""}
            className={adminField}
            placeholder="e.g. Anxiety"
          />
        </Field>
        <Field label="Status" htmlFor="status" error={fe.status?.[0]}>
          <select
            id="status"
            name="status"
            defaultValue={post?.status ?? "DRAFT"}
            className={adminField}
          >
            {POST_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "DRAFT" ? "Draft" : "Published"}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label="Publish date"
        htmlFor="publishedAt"
        error={fe.publishedAt?.[0]}
        hint="Leave blank to use today's date when publishing."
      >
        <input
          id="publishedAt"
          name="publishedAt"
          type="date"
          defaultValue={post?.publishedAt ?? ""}
          className={`${adminField} max-w-xs`}
        />
      </Field>

      <details className="rounded-xl border border-sage-deep/25 bg-sage/20 p-4">
        <summary className="cursor-pointer text-sm font-medium text-pine">
          SEO settings (optional)
        </summary>
        <div className="mt-4 space-y-4">
          <Field label="SEO title" htmlFor="seoTitle" error={fe.seoTitle?.[0]}>
            <input
              id="seoTitle"
              name="seoTitle"
              defaultValue={post?.seoTitle ?? ""}
              className={adminField}
            />
          </Field>
          <Field
            label="SEO description"
            htmlFor="seoDescription"
            error={fe.seoDescription?.[0]}
          >
            <textarea
              id="seoDescription"
              name="seoDescription"
              defaultValue={post?.seoDescription ?? ""}
              rows={2}
              className={adminField}
            />
          </Field>
        </div>
      </details>

      <div className="flex items-center gap-4 pt-2">
        <SubmitButton pending={pending}>
          {post?.id ? "Save changes" : "Create post"}
        </SubmitButton>
        <Link href="/admin/posts" className="text-sm text-muted hover:text-pine">
          Cancel
        </Link>
      </div>
    </form>
  );
}
