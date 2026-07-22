const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();
(async () => {
  const counts = {
    users: await db.user.count(),
    agents: await db.agent.count(),
    properties: await db.property.count(),
    propertiesWithAgent: await db.property.count({ where: { NOT: { agentId: null } } }),
    communities: await db.community.count(),
    developers: await db.developer.count(),
    testimonials: await db.testimonial.count(),
    awards: await db.award.count(),
    blogPosts: await db.blogPost.count(),
    heroSlides: await db.heroSlide.count(),
    locations: await db.location.count(),
    categories: await db.propertyCategory.count(),
    amenities: await db.amenity.count(),
    menuItems: await db.menuItem.count(),
    popups: await db.popup.count(),
    seoMeta: await db.seoMeta.count(),
    faqs: await db.faq.count(),
    videos: await db.video.count(),
    mediaFiles: await db.mediaFile.count(),
    emailTemplates: await db.emailTemplate.count(),
    landingPages: await db.landingPage.count(),
    reportSnapshots: await db.reportSnapshot.count(),
    newsletterSubs: await db.newsletterSubscriber.count(),
    valuations: await db.valuationRequest.count(),
    mortgages: await db.mortgageEnquiry.count(),
    leads: await db.lead.count(),
    leadsAssigned: await db.lead.count({ where: { NOT: { assignedTo: null } } }),
    appointments: await db.appointment.count(),
    crmNotes: await db.crmNote.count(),
    commissions: await db.commission.count(),
    messages: await db.message.count(),
    notifications: await db.notification.count(),
    activityLogs: await db.activityLog.count(),
    auditLogs: await db.auditLog.count(),
    savedProperties: await db.savedProperty.count(),
    savedSearches: await db.savedSearch.count(),
    siteSettings: await db.siteSetting.count(),
  };
  console.log(JSON.stringify(counts, null, 2));
  console.log("\n--- Agents ---");
  const agents = await db.agent.findMany({ select: { id: true, name: true, email: true, order: true } });
  agents.forEach(a => console.log(`  ${a.id} | ${a.email} | order=${a.order}`));
  console.log("\n--- Users with role agent ---");
  const agentUsers = await db.user.findMany({ where: { role: "agent" }, select: { id: true, email: true, name: true } });
  agentUsers.forEach(u => console.log(`  ${u.id} | ${u.email} | ${u.name}`));
  await db.$disconnect();
})();
