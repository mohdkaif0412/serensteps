import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { posts } from "@/lib/content/posts";
import { faqs } from "@/lib/content/faqs";
import { testimonials } from "@/lib/content/testimonials";
import { postCover } from "@/lib/images";

/**
 * Seeds the single admin user (from ADMIN_EMAIL / ADMIN_PASSWORD, bcrypt-hashed)
 * plus the starting posts, FAQs, and testimonials so the site isn't empty.
 *
 * Safe to re-run, and additive: posts upsert by slug, and FAQs/testimonials are
 * matched against what's already there and only the missing ones inserted. So
 * new seed content (say, a new article or a new FAQ category) reaches an
 * already-populated database without ever overwriting an admin's edits or
 * resurrecting something they deleted on purpose… with one exception — anything
 * deleted in the admin that still exists here WILL come back. Remove it from the
 * seed files too if it should stay gone.
 *
 * Note: re-running also resets the admin password to ADMIN_PASSWORD. That's the
 * documented recovery path, but it means the env value should be the real one.
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

  // ── FAQs (add the missing ones; `question` isn't unique so match by text) ──
  const existingQuestions = new Set(
    (await prisma.faq.findMany({ select: { question: true } })).map(
      (faq) => faq.question,
    ),
  );
  const newFaqs = faqs.filter((faq) => !existingQuestions.has(faq.question));
  if (newFaqs.length > 0) {
    await prisma.faq.createMany({
      data: newFaqs.map((faq, i) => ({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        // Continue the existing ordering rather than restarting at 0.
        order: existingQuestions.size + i,
        published: true,
      })),
    });
  }
  console.log(
    `✓ FAQs: ${newFaqs.length} added, ${existingQuestions.size} already present`,
  );

  // ── Testimonials (matched on the quote itself) ───────────────
  const existingQuotes = new Set(
    (await prisma.testimonial.findMany({ select: { quote: true } })).map(
      (item) => item.quote,
    ),
  );
  const newTestimonials = testimonials.filter((t) => !existingQuotes.has(t.quote));
  if (newTestimonials.length > 0) {
    await prisma.testimonial.createMany({
      data: newTestimonials.map((t, i) => ({
        name: t.name,
        role: t.role,
        quote: t.quote,
        order: existingQuotes.size + i,
        published: true,
      })),
    });
  }
  console.log(
    `✓ Testimonials: ${newTestimonials.length} added, ${existingQuotes.size} already present`,
  );
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
