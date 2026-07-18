import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { posts } from "@/lib/content/posts";
import { faqs } from "@/lib/content/faqs";
import { testimonials } from "@/lib/content/testimonials";
import { postCover } from "@/lib/images";

/**
 * Seeds the single admin user (from ADMIN_EMAIL / ADMIN_PASSWORD, bcrypt-hashed)
 * plus a few sample posts, FAQs, and testimonials so the site isn't empty.
 * Safe to re-run: the admin is upserted; sample content is only added when the
 * relevant table is empty, so it never clobbers content added in the admin.
 */
async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment to seed the admin user.",
    );
  }

  // ── Admin user ──────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { password: passwordHash, name: process.env.ADMIN_NAME ?? "Admin" },
    create: {
      email,
      password: passwordHash,
      name: process.env.ADMIN_NAME ?? "Admin",
    },
  });
  console.log(`✓ Admin user ready: ${admin.email}`);

  // ── Sample posts (upsert by slug; won't overwrite edits) ────
  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: postCover(post.slug),
        category: post.category,
        status: "PUBLISHED",
        seoTitle: post.title,
        seoDescription: post.excerpt,
        publishedAt: new Date(post.publishedAt),
      },
    });
  }
  console.log(`✓ Posts seeded: ${posts.length}`);

  // ── Sample FAQs (only when empty) ───────────────────────────
  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({
      data: faqs.map((faq, i) => ({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        order: i,
        published: true,
      })),
    });
    console.log(`✓ FAQs seeded: ${faqs.length}`);
  } else {
    console.log("• FAQs already present — skipped");
  }

  // ── Sample testimonials (only when empty) ───────────────────
  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({
      data: testimonials.map((t, i) => ({
        name: t.name,
        role: t.role,
        quote: t.quote,
        order: i,
        published: true,
      })),
    });
    console.log(`✓ Testimonials seeded: ${testimonials.length}`);
  } else {
    console.log("• Testimonials already present — skipped");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
