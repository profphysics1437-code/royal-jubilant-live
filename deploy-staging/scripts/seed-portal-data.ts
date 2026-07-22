/**
 * Comprehensive portal-data seed.
 * Populates every CRM / transactional / admin table so that BOTH the admin portal
 * and the agent portal show realistic sample data across all categories.
 *
 * Idempotent: skips creation if records already exist (matches by unique key or
 * by count threshold).
 */
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

// ---------- helpers --------------------------------------------------------
const pick = <T,>(arr: T[], i: number): T => arr[i % arr.length];
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const daysFromNow = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  console.log("🌱 Seeding comprehensive portal data...\n");

  // ---------- fetch existing entities --------------------------------------
  const agentUsers = await db.user.findMany({
    where: { role: "agent" },
    select: { id: true, email: true, name: true },
  });
  const adminUser = await db.user.findFirst({
    where: { role: "admin" },
    select: { id: true, email: true, name: true },
  });
  const properties = await db.property.findMany({
    select: { id: true, reference: true, title: true, price: true, status: true, community: true, agentId: true },
  });
  const communities = await db.community.findMany({ select: { name: true } });

  if (agentUsers.length === 0) throw new Error("No agent users found. Run seed-production.ts first.");
  if (properties.length === 0) throw new Error("No properties found. Run seed-production.ts first.");

  console.log(`Found ${agentUsers.length} agent users, ${properties.length} properties, admin=${adminUser?.email}`);

  // Make sure every agent user has at least 2 listings assigned
  for (const agent of agentUsers) {
    const count = properties.filter((p) => p.agentId === agent.id).length;
    if (count < 2) {
      // Assign 2 unassigned or low-priority properties to this agent
      const toAssign = properties.filter((p) => p.agentId !== agent.id).slice(0, 2 - count);
      for (const p of toAssign) {
        await db.property.update({ where: { id: p.id }, data: { agentId: agent.id } });
        console.log(`  ↳ reassigned property ${p.reference} → ${agent.email}`);
      }
    }
  }

  // ---------- 1. LEADS (24 leads, distributed across agents) ---------------
  const leadCount = await db.lead.count();
  if (leadCount < 20) {
    const leadSources = ["Website", "Property Finder", "Bayut", "Google Ads", "Referral", "WhatsApp", "Instagram", "Walk-in"];
    const leadIntents = ["Buy", "Rent", "Invest", "Off-Plan", "Sell"];
    const leadStatuses = ["new", "contacted", "qualified", "viewing", "negotiating", "won", "lost"];
    const communities2 = communities.map((c) => c.name);

    const leadNames = [
      "Ahmed Al Mansoori", "Sara Khan", "Priya Sharma", "James Wilson", "Fatima Hassan",
      "Daniel Chen", "Olivia Brown", "Rashid Al Falasi", "Maria Garcia", "Hassan Ali",
      "Sophie Martin", "Yusuf Öztürk", "Aisha Mohammed", "David Lee", "Nora Saeed",
      "Vikram Patel", "Elena Petrova", "Omar Khalil", "Linda Wang", "Khalid Al Rashid",
      "Anjali Verma", "Tom Becker", "Layla Saleh", "Ravi Shankar",
    ];

    const createdLeads: any[] = [];
    for (let i = 0; i < leadNames.length; i++) {
      const agent = pick(agentUsers, i);
      const property = pick(properties, i + 2);
      const status = pick(leadStatuses, i);
      const lead = await db.lead.create({
        data: {
          name: leadNames[i],
          email: `lead${i + 1}@example.com`,
          phone: `+9715${String(randInt(10000000, 99999999))}`,
          whatsapp: `9715${String(randInt(10000000, 99999999))}`,
          source: pick(leadSources, i),
          intent: pick(leadIntents, i + 1),
          message: `Interested in ${property.title}. Budget around AED ${Math.round(property.price / 1000) * 1000}. Looking to move in the next 2-3 months.`,
          budget: Math.round(property.price * (0.8 + Math.random() * 0.4) / 10000) * 10000,
          propertyRef: property.reference,
          community: property.community || pick(communities2, i),
          status,
          assignedTo: agent.email,
          notes: status === "won" ? "Deal closed successfully. Commission tracking active."
                : status === "lost" ? "Lost to competitor — budget mismatch."
                : "Following up with tailored shortlist.",
          userId: null,
          propertyId: property.id,
          createdAt: daysAgo(randInt(1, 60)),
        },
      });
      createdLeads.push(lead);
    }
    console.log(`✓ Created ${leadNames.length} leads (assigned across ${agentUsers.length} agents)`);
  } else {
    console.log(`= Leads already populated (${leadCount})`);
  }

  // ---------- 2. APPOINTMENTS (per agent, per lead) -----------------------
  const apptCount = await db.appointment.count();
  if (apptCount < 15) {
    const leads = await db.lead.findMany({ select: { id: true, assignedTo: true, propertyRef: true } });
    const apptTypes = ["Property Viewing", "Office Meeting", "Video Call", "Phone Call", "Signing Meeting"];
    const apptStatuses = ["scheduled", "completed", "cancelled", "rescheduled", "no-show"];

    let created = 0;
    for (let i = 0; i < 20; i++) {
      const lead = pick(leads, i);
      if (!lead.assignedTo) continue;
      const futureOrPast = i % 3 === 0;
      const when = futureOrPast ? daysFromNow(randInt(1, 14)) : daysAgo(randInt(1, 30));
      try {
        await db.appointment.create({
          data: {
            leadId: lead.id,
            agentEmail: lead.assignedTo,
            propertyRef: lead.propertyRef,
            scheduledAt: when,
            type: pick(apptTypes, i),
            status: pick(apptStatuses, i),
            notes: i % 4 === 0 ? "Client requested to see 2-3 similar properties in same community." : null,
            userId: null,
          },
        });
        created++;
      } catch (e) { /* skip duplicates */ }
    }
    console.log(`✓ Created ${created} appointments`);
  } else {
    console.log(`= Appointments already populated (${apptCount})`);
  }

  // ---------- 3. CRM NOTES (per lead, per agent) --------------------------
  const noteCount = await db.crmNote.count();
  if (noteCount < 30) {
    const leads = await db.lead.findMany({ select: { id: true, assignedTo: true, name: true } });
    const noteTemplates = [
      "Initial contact — sent property brochure and community guide.",
      "Client confirmed viewing scheduled. Sent calendar invite.",
      "Discussed budget range. Client will share proof of funds.",
      "Client prefers higher floor with marina view. Adjusted shortlist.",
      "Second viewing completed. Client interested — preparing offer letter.",
      "Sent mortgage pre-approval referral to partner bank.",
      "Negotiating price — seller open to 3% reduction.",
      "Awaiting client's decision after viewing comparable listings.",
      "Client traveling — rescheduled follow-up to next week.",
      "Deal closed! Commission processed and commission record created.",
    ];

    let created = 0;
    for (const lead of leads) {
      if (!lead.assignedTo) continue;
      const agent = agentUsers.find((a) => a.email === lead.assignedTo);
      if (!agent) continue;
      // 1-3 notes per lead
      const n = randInt(1, 3);
      for (let i = 0; i < n; i++) {
        await db.crmNote.create({
          data: {
            agentId: agent.id,
            leadId: lead.id,
            note: pick(noteTemplates, i + created),
            createdAt: daysAgo(randInt(0, 45)),
          },
        });
        created++;
      }
    }
    console.log(`✓ Created ${created} CRM notes`);
  } else {
    console.log(`= CRM notes already populated (${noteCount})`);
  }

  // ---------- 4. COMMISSIONS (per agent, closed/won deals) ----------------
  const commissionCount = await db.commission.count();
  if (commissionCount < 12) {
    const wonLeads = await db.lead.findMany({
      where: { status: "won" },
      select: { id: true, assignedTo: true, propertyRef: true, budget: true },
    });

    let created = 0;
    // Make sure each agent has at least 1 commission
    for (const agent of agentUsers) {
      // Find a won lead assigned to this agent, or use any property
      let lead = wonLeads.find((l) => l.assignedTo === agent.email);
      let dealValue = 1_500_000;
      let propertyRef: string | null = null;

      if (lead) {
        dealValue = lead.budget || 1_500_000;
        propertyRef = lead.propertyRef;
      } else {
        // Use one of the agent's properties
        const propsForAgent = properties.filter((p) => p.agentId === agent.id);
        if (propsForAgent.length > 0) {
          dealValue = propsForAgent[0].price;
          propertyRef = propsForAgent[0].reference;
        }
        // Also create a synthetic lead for this commission
        lead = await db.lead.create({
          data: {
            name: `Commission Lead ${agent.name}`,
            email: `commission.${agent.email}`,
            source: "Direct",
            intent: "Buy",
            message: "Closed deal for commission tracking.",
            budget: dealValue,
            propertyRef,
            status: "won",
            assignedTo: agent.email,
            propertyId: properties.find((p) => p.reference === propertyRef)?.id || null,
            createdAt: daysAgo(randInt(30, 120)),
          },
        });
      }

      const commissionPct = 2.0 + (created % 3); // 2%, 3%, 4%
      const commissionAmt = Math.round((dealValue * commissionPct) / 100);
      const status = pick(["pending", "invoiced", "paid"], created);

      await db.commission.create({
        data: {
          agentId: agent.id,
          propertyRef,
          leadId: lead.id,
          dealValue,
          commissionPct,
          commissionAmt,
          status,
          paidAt: status === "paid" ? daysAgo(randInt(1, 20)) : null,
          createdAt: daysAgo(randInt(15, 90)),
        },
      });
      created++;
    }
    console.log(`✓ Created ${created} commissions (1 per agent)`);
  } else {
    console.log(`= Commissions already populated (${commissionCount})`);
  }

  // ---------- 5. VALUATION REQUESTS ---------------------------------------
  const valCount = await db.valuationRequest.count();
  if (valCount < 8) {
    const valuationNames = [
      "Reem Al Zaabi", "Christopher Adams", "Mei Lin", "Abdullah Khan", "Isabella Rossi",
      "Sandeep Nair", "Karim Bouras", "Yekaterina Volkova",
    ];
    const conditions = ["Excellent", "Very Good", "Good", "Needs Renovation"];
    const ownerships = ["Owner", "Tenant", "Investor"];
    const timelines = ["1-3 months", "3-6 months", "6-12 months", "12+ months"];
    const propTypes = ["Apartment", "Villa", "Townhouse", "Penthouse", "Office"];
    const statuses = ["new", "reviewing", "valuated", "contacted"];

    for (let i = 0; i < valuationNames.length; i++) {
      await db.valuationRequest.create({
        data: {
          name: valuationNames[i],
          email: `valuation${i + 1}@example.com`,
          phone: `+9715${String(randInt(10000000, 99999999))}`,
          whatsapp: `9715${String(randInt(10000000, 99999999))}`,
          propertyType: pick(propTypes, i),
          community: pick(communities.map((c) => c.name), i),
          bedrooms: randInt(1, 5),
          bathrooms: randInt(1, 4),
          area: randInt(800, 4000),
          condition: pick(conditions, i),
          ownership: pick(ownerships, i),
          timeline: pick(timelines, i),
          message: "Looking for a professional valuation to list the property on the market.",
          status: pick(statuses, i),
          createdAt: daysAgo(randInt(1, 45)),
        },
      });
    }
    console.log(`✓ Created ${valuationNames.length} valuation requests`);
  } else {
    console.log(`= Valuation requests already populated (${valCount})`);
  }

  // ---------- 6. MORTGAGE ENQUIRIES ---------------------------------------
  const mortCount = await db.mortgageEnquiry.count();
  if (mortCount < 8) {
    const mortNames = [
      "Hassan Tahir", "Lucas Meyer", "Aarav Mehta", "Emma Thompson", "Yousef Al Khatib",
      "Natalia Ivanova", "Daniel Cooper", "Mariam Al Suwaidi",
    ];
    const employments = ["Salaried", "Self-Employed", "Business Owner", "Freelancer"];
    const residencies = ["UAE Resident", "Non-Resident", "GCC Resident"];
    const statuses = ["new", "pre-approved", "rejected", "contacted"];

    for (let i = 0; i < mortNames.length; i++) {
      const price = pick([1_200_000, 1_800_000, 2_500_000, 3_400_000, 4_700_000, 6_500_000], i);
      const dpPct = pick([0.2, 0.25, 0.3, 0.4], i);
      await db.mortgageEnquiry.create({
        data: {
          name: mortNames[i],
          email: `mortgage${i + 1}@example.com`,
          phone: `+9715${String(randInt(10000000, 99999999))}`,
          propertyPrice: price,
          downPayment: Math.round(price * dpPct),
          loanTenor: pick([15, 20, 25], i),
          employment: pick(employments, i),
          salary: pick([15000, 22000, 35000, 48000, 75000], i),
          residency: pick(residencies, i),
          status: pick(statuses, i),
          createdAt: daysAgo(randInt(1, 50)),
        },
      });
    }
    console.log(`✓ Created ${mortNames.length} mortgage enquiries`);
  } else {
    console.log(`= Mortgage enquiries already populated (${mortCount})`);
  }

  // ---------- 7. NEWSLETTER SUBSCRIBERS -----------------------------------
  const newsCount = await db.newsletterSubscriber.count();
  if (newsCount < 12) {
    const subNames = [
      "Olivia Wright", "Mateo López", "Ava Robinson", "Noah Kim", "Mia Nakamura",
      "Ethan Walker", "Isabella Cruz", "Liam Murphy", "Charlotte Lee", "Lucas Schmidt",
      "Amelia Brown", "Henry Davis",
    ];
    for (let i = 0; i < subNames.length; i++) {
      const email = `subscriber${i + 1}@example.com`;
      try {
        await db.newsletterSubscriber.create({
          data: {
            email,
            name: subNames[i],
            locale: i % 4 === 0 ? "ar" : "en",
            createdAt: daysAgo(randInt(1, 90)),
          },
        });
      } catch (e) { /* unique constraint */ }
    }
    console.log(`✓ Created ${subNames.length} newsletter subscribers`);
  } else {
    console.log(`= Newsletter subscribers already populated (${newsCount})`);
  }

  // ---------- 8. POPUPS (admin-managed) -----------------------------------
  const popupCount = await db.popup.count();
  if (popupCount === 0) {
    const popups = [
      {
        title: "🎉 Limited Offer: 1% Commission on Off-Plan Properties",
        content: "Book any off-plan property through Royal Jubilant this month and pay only 1% agency commission. Limited to first 20 bookings.",
        type: "promotion",
        trigger: "delay",
        delaySeconds: 5,
        position: "center",
        imageUrl: "/team/ahmad-raza.webp",
        buttonText: "View Off-Plan Listings",
        buttonLink: "/?view=off-plan",
        active: true,
        startDate: daysAgo(7),
        endDate: daysFromNow(30),
      },
      {
        title: "Free Property Valuation",
        content: "Get a complimentary, no-obligation valuation of your Dubai property by our RERA-certified advisors. Same-day report.",
        type: "lead",
        trigger: "scroll",
        delaySeconds: 0,
        position: "bottom-right",
        buttonText: "Request Valuation",
        buttonLink: "/?modal=valuation",
        active: true,
      },
      {
        title: "Mortgage Made Easy",
        content: "Pre-approve your mortgage in 24 hours with our partner banks. Rates from 3.99%.",
        type: "info",
        trigger: "exit",
        delaySeconds: 0,
        position: "center",
        buttonText: "Calculate Now",
        buttonLink: "/?modal=mortgage",
        active: false,
      },
    ];
    for (const p of popups) {
      await db.popup.create({ data: p });
    }
    console.log(`✓ Created ${popups.length} popups`);
  } else {
    console.log(`= Popups already populated (${popupCount})`);
  }

  // ---------- 9. EMAIL TEMPLATES ------------------------------------------
  const emailTmplCount = await db.emailTemplate.count();
  if (emailTmplCount === 0) {
    const templates = [
      {
        name: "Welcome Email",
        slug: "welcome",
        subject: "Welcome to Royal Jubilant Real Estate, {{name}}!",
        body: "Dear {{name}},\n\nThank you for joining Royal Jubilant Real Estate. Our team of luxury property advisors is here to help you find your dream home in Dubai.\n\nBest regards,\nThe Royal Jubilant Team",
        category: "transactional",
        variables: '["name"]',
        active: true,
      },
      {
        name: "Lead Acknowledgement",
        slug: "lead-ack",
        subject: "We received your enquiry — Royal Jubilant",
        body: "Hi {{name}},\n\nThank you for your interest in {{propertyRef}}. One of our advisors will contact you within 24 hours.\n\nProperty: {{propertyRef}}\nBudget: {{budget}}\n\nBest regards,\nRoyal Jubilant Real Estate",
        category: "transactional",
        variables: '["name", "propertyRef", "budget"]',
        active: true,
      },
      {
        name: "Appointment Confirmation",
        slug: "appt-confirm",
        subject: "Your viewing is confirmed — {{datetime}}",
        body: "Dear {{name}},\n\nYour property viewing is confirmed for {{datetime}}. Our advisor {{agentName}} will meet you at the property.\n\nProperty: {{propertyRef}}\nAdvisor: {{agentName}}\nPhone: {{agentPhone}}\n\nSee you soon!",
        category: "transactional",
        variables: '["name", "datetime", "propertyRef", "agentName", "agentPhone"]',
        active: true,
      },
      {
        name: "Newsletter — Monthly Market Report",
        slug: "newsletter-monthly",
        subject: "Dubai Real Estate Market Report — {{month}}",
        body: "Hello {{name}},\n\nHere's your monthly Dubai real estate market report.\n\nKey Highlights:\n- Average price growth: +3.2% YoY\n- Top performing community: {{topCommunity}}\n- Best ROI: {{bestRoi}}%\n\nRead the full report on our blog.",
        category: "newsletter",
        variables: '["name", "month", "topCommunity", "bestRoi"]',
        active: true,
      },
      {
        name: "Valuation Report Ready",
        slug: "valuation-ready",
        subject: "Your property valuation report is ready",
        body: "Dear {{name}},\n\nYour valuation report for {{propertyType}} in {{community}} is ready. Estimated market value: AED {{valuation}}.\n\nDownload the full report from your client portal.",
        category: "transactional",
        variables: '["name", "propertyType", "community", "valuation"]',
        active: true,
      },
      {
        name: "Birthday Greeting",
        slug: "birthday",
        subject: "Happy Birthday from Royal Jubilant! 🎂",
        body: "Dear {{name}},\n\nWishing you a wonderful birthday! As a token of appreciation, enjoy 0.5% off agency commission on your next property purchase with us.\n\nWarm wishes,\nThe Royal Jubilant Team",
        category: "marketing",
        variables: '["name"]',
        active: true,
      },
    ];
    for (const t of templates) {
      await db.emailTemplate.create({ data: t });
    }
    console.log(`✓ Created ${templates.length} email templates`);
  } else {
    console.log(`= Email templates already populated (${emailTmplCount})`);
  }

  // ---------- 10. REPORT SNAPSHOTS ----------------------------------------
  const reportCount = await db.reportSnapshot.count();
  if (reportCount === 0) {
    const reports = [
      { type: "sales", period: "2025-Q4", summary: "Q4 2025 sales report: 18 closed deals, AED 87.4M total volume, AED 1.74M total commission. Top performer: Awais Ali (5 deals, AED 23.8M).", generatedBy: adminUser?.email },
      { type: "leads", period: "2026-01", summary: "January 2026 leads report: 142 new leads, 38 qualified, 12 converted. Source breakdown: Property Finder 41%, Website 28%, Bayut 19%, Referral 12%.", generatedBy: adminUser?.email },
      { type: "inventory", period: "2026-01", summary: "Inventory snapshot: 16 active listings, 4 off-plan, 9 sale, 3 rent. Average listing price AED 3.2M. Average days on market: 47.", generatedBy: adminUser?.email },
      { type: "agent-performance", period: "2025-Q4", summary: "Q4 2025 agent performance: 8 active agents, top 3 by closed deals — Awais Ali (5), Muhammad Saleem Khan (4), Naqash Haider (3). Average rating 4.8.", generatedBy: adminUser?.email },
      { type: "marketing", period: "2026-01", summary: "Marketing report January 2026: 4,820 website visits, 312 lead forms submitted, 8.2% conversion rate. Newsletter open rate 24%.", generatedBy: adminUser?.email },
    ];
    for (const r of reports) {
      await db.reportSnapshot.create({ data: { ...r, createdAt: daysAgo(randInt(5, 30)) } });
    }
    console.log(`✓ Created ${reports.length} report snapshots`);
  } else {
    console.log(`= Report snapshots already populated (${reportCount})`);
  }

  // ---------- 11. MESSAGES (per agent) ------------------------------------
  const msgCount = await db.message.count();
  if (msgCount < 20) {
    const subjects = [
      "Following up on your enquiry", "Property viewing feedback", "New listing matching your criteria",
      "Mortgage pre-approval update", "Offer received on your property", "Document request",
      "Welcome to Royal Jubilant", "Market update for your area",
    ];
    const bodies = [
      "Hi, I wanted to follow up on your recent enquiry. Are you available for a call this week?",
      "Thank you for attending yesterday's viewing. As discussed, I'll send you the floor plans shortly.",
      "A new property matching your saved search criteria just hit the market. Want me to arrange a viewing?",
      "Your mortgage pre-approval is ready. Rate offered: 4.25% over 25 years.",
      "We received an offer on your property. Please review and let me know your decision.",
      "Could you please share your Emirates ID and proof of address for the tenancy contract?",
      "Welcome to Royal Jubilant Real Estate! I'll be your dedicated advisor for all property matters.",
      "The market in your community saw a 3.2% price increase last quarter. Now might be a good time to list.",
    ];
    let created = 0;
    for (let i = 0; i < 20; i++) {
      const agent = pick(agentUsers, i);
      await db.message.create({
        data: {
          userId: agent.id,
          fromEmail: `lead${(i % 8) + 1}@example.com`,
          toEmail: agent.email,
          subject: pick(subjects, i),
          body: pick(bodies, i),
          read: i % 3 === 0,
          createdAt: daysAgo(randInt(0, 30)),
        },
      });
      created++;
    }
    console.log(`✓ Created ${created} messages`);
  } else {
    console.log(`= Messages already populated (${msgCount})`);
  }

  // ---------- 12. NOTIFICATIONS (per agent + admin) ----------------------
  const notifCount = await db.notification.count();
  if (notifCount < 20) {
    const titles = [
      "New lead assigned", "Appointment scheduled", "Property viewed", "Commission paid",
      "New valuation request", "New newsletter signup", "Property published",
      "Lead status updated", "Mortgage enquiry received", "Weekly performance report",
    ];
    const bodies = [
      "A new lead has been assigned to you. Check your inbox.",
      "Viewing scheduled for tomorrow at 2 PM.",
      "Your property RJ-PLM-001 received 5 new views this week.",
      "Commission of AED 32,000 has been marked as paid.",
      "A new valuation request has been submitted.",
      "12 new subscribers joined the newsletter this week.",
      "Your new listing is now live on the website.",
      "Lead 'Ahmed Al Mansoori' moved to 'Negotiating' stage.",
      "A mortgage enquiry for AED 2.5M was received.",
      "Your weekly performance summary is ready to view.",
    ];
    const types = ["info", "success", "warning", "lead", "appointment", "commission"];
    let created = 0;
    for (let i = 0; i < 25; i++) {
      const user = i % 4 === 0 ? adminUser : pick(agentUsers, i);
      await db.notification.create({
        data: {
          userId: user?.id,
          title: pick(titles, i),
          body: pick(bodies, i),
          type: pick(types, i),
          read: i % 4 === 0,
          createdAt: daysAgo(randInt(0, 14)),
        },
      });
      created++;
    }
    console.log(`✓ Created ${created} notifications`);
  } else {
    console.log(`= Notifications already populated (${notifCount})`);
  }

  // ---------- 13. ACTIVITY LOGS -------------------------------------------
  const actCount = await db.activityLog.count();
  if (actCount < 40) {
    const actors = [
      ...agentUsers.map((a) => ({ id: a.id, name: a.name || a.email, role: "agent" })),
      { id: adminUser?.id, name: adminUser?.name || "Admin", role: "admin" },
    ].filter((a) => a.id);
    const actions = [
      ["created", "property"], ["updated", "property"], ["published", "property"],
      ["deleted", "blog post"], ["created", "lead"], ["updated", "lead"],
      ["assigned", "lead"], ["created", "appointment"], ["updated", "appointment"],
      ["uploaded", "media"], ["created", "agent"], ["updated", "agent"],
      ["created", "community"], ["updated", "site settings"], ["sent", "newsletter"],
      ["approved", "property"], ["created", "email template"], ["generated", "report"],
      ["logged in", "session"], ["logged out", "session"],
    ];
    let created = 0;
    for (let i = 0; i < 50; i++) {
      const actor = pick(actors, i);
      const [action, entity] = pick(actions, i);
      await db.activityLog.create({
        data: {
          userId: actor.id,
          userName: actor.name,
          userRole: actor.role,
          action,
          entity,
          entityId: properties[i % properties.length]?.id,
          details: `${actor.name} ${action} ${entity}${entity.endsWith("y") ? "" : ""}.`,
          ipAddress: `185.93.${randInt(0, 255)}.${randInt(1, 254)}`,
          createdAt: daysAgo(randInt(0, 21)),
        },
      });
      created++;
    }
    console.log(`✓ Created ${created} activity logs`);
  } else {
    console.log(`= Activity logs already populated (${actCount})`);
  }

  // ---------- 14. AUDIT LOGS ----------------------------------------------
  const audCount = await db.auditLog.count();
  if (audCount < 20) {
    const entities = ["Property", "Lead", "Appointment", "Agent", "Community", "SiteSetting", "User", "BlogPost"];
    const actions = ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "PUBLISH", "UNPUBLISH", "ASSIGN"];
    for (let i = 0; i < 25; i++) {
      await db.auditLog.create({
        data: {
          actor: i % 3 === 0 ? adminUser?.email || "admin" : pick(agentUsers, i).email,
          action: pick(actions, i),
          entity: pick(entities, i),
          entityId: properties[i % properties.length]?.id,
          meta: JSON.stringify({ ip: `185.93.${randInt(0, 255)}.${randInt(1, 254)}`, userAgent: "Mozilla/5.0" }),
          createdAt: daysAgo(randInt(0, 14)),
        },
      });
    }
    console.log(`✓ Created 25 audit logs`);
  } else {
    console.log(`= Audit logs already populated (${audCount})`);
  }

  // ---------- 15. SAVED PROPERTIES (customer-facing) ----------------------
  const savedCount = await db.savedProperty.count();
  if (savedCount < 8) {
    // Get or create a demo customer user
    let customer = await db.user.findUnique({ where: { email: "customer@royaljubilant.ae" } });
    if (!customer) {
      customer = await db.user.create({
        data: {
          email: "customer@royaljubilant.ae",
          name: "Demo Customer",
          role: "customer",
          phone: "+971501234567",
        },
      });
    }
    for (let i = 0; i < 8; i++) {
      const p = pick(properties, i + 1);
      try {
        await db.savedProperty.create({
          data: {
            userId: customer.id,
            propertyId: p.id,
            createdAt: daysAgo(randInt(0, 30)),
          },
        });
      } catch (e) { /* unique */ }
    }
    console.log(`✓ Created 8 saved properties for demo customer`);
  } else {
    console.log(`= Saved properties already populated (${savedCount})`);
  }

  // ---------- 16. SAVED SEARCHES -----------------------------------------
  const searchCount = await db.savedSearch.count();
  if (searchCount < 5) {
    let customer = await db.user.findUnique({ where: { email: "customer@royaljubilant.ae" } });
    if (!customer) {
      customer = await db.user.create({
        data: { email: "customer@royaljubilant.ae", name: "Demo Customer", role: "customer" },
      });
    }
    const searches = [
      { name: "2BR Apartments in Dubai Marina", filters: JSON.stringify({ status: "sale", type: "Apartment", bedrooms: 2, community: "Dubai Marina" }) },
      { name: "Villas under 5M AED", filters: JSON.stringify({ status: "sale", type: "Villa", maxPrice: 5000000 }) },
      { name: "Off-Plan in Business Bay", filters: JSON.stringify({ status: "off-plan", community: "Business Bay" }) },
      { name: "Penthouses for Rent", filters: JSON.stringify({ status: "rent", type: "Penthouse" }) },
      { name: "Dubai Hills Estate listings", filters: JSON.stringify({ community: "Dubai Hills Estate" }) },
    ];
    for (const s of searches) {
      await db.savedSearch.create({
        data: { userId: customer.id, name: s.name, filters: s.filters, createdAt: daysAgo(randInt(1, 21)) },
      });
    }
    console.log(`✓ Created 5 saved searches`);
  } else {
    console.log(`= Saved searches already populated (${searchCount})`);
  }

  // ---------- 17. MEDIA FILES (additional) --------------------------------
  const mediaCount = await db.mediaFile.count();
  if (mediaCount < 20) {
    const mediaItems = [
      { filename: "marina-skyline.jpg", url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80", type: "image", folder: "properties", altTag: "Dubai Marina skyline at sunset" },
      { filename: "downtown-burj.jpg", url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80", type: "image", folder: "properties", altTag: "Downtown Dubai Burj Khalifa" },
      { filename: "palm-jumeirah.jpg", url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=80", type: "image", folder: "properties", altTag: "Palm Jumeirah aerial view" },
      { filename: "luxury-villa-pool.jpg", url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80", type: "image", folder: "properties", altTag: "Luxury villa with infinity pool" },
      { filename: "modern-apartment-living.jpg", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80", type: "image", folder: "interiors", altTag: "Modern apartment living room" },
      { filename: "dubai-hills.jpg", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80", type: "image", folder: "communities", altTag: "Dubai Hills Estate golf course" },
      { filename: "business-bay-towers.jpg", url: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&w=1600&q=80", type: "image", folder: "communities", altTag: "Business Bay towers" },
      { filename: "creek-harbour.jpg", url: "https://images.unsplash.com/photo-1582827439156-1f1c47ed0b6c?auto=format&fit=crop&w=1600&q=80", type: "image", folder: "communities", altTag: "Dubai Creek Harbour" },
      { filename: "luxury-kitchen.jpg", url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80", type: "image", folder: "interiors", altTag: "Modern luxury kitchen" },
      { filename: "bedroom-marina-view.jpg", url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80", type: "image", folder: "interiors", altTag: "Bedroom with marina view" },
      { filename: "logo-gold.png", url: "/logo.svg", type: "svg", folder: "brand", altTag: "Royal Jubilant logo" },
      { filename: "icon-whatsapp.svg", url: "/icons/whatsapp.svg", type: "svg", folder: "icons", altTag: "WhatsApp icon" },
      { filename: "icon-phone.svg", url: "/icons/phone.svg", type: "svg", folder: "icons", altTag: "Phone icon" },
      { filename: "video-tour-marina.mp4", url: "/videos/marina-tour.mp4", type: "video", folder: "videos", altTag: "Marina property video tour" },
    ];
    let created = 0;
    for (const m of mediaItems) {
      const exists = await db.mediaFile.findFirst({ where: { filename: m.filename } });
      if (exists) continue;
      await db.mediaFile.create({
        data: {
          filename: m.filename,
          url: m.url,
          type: m.type,
          folder: m.folder,
          size: randInt(120000, 4800000),
          altTag: m.altTag,
          caption: m.altTag,
          uploadedBy: adminUser?.email,
        },
      });
      created++;
    }
    console.log(`✓ Created ${created} additional media files`);
  } else {
    console.log(`= Media files already populated (${mediaCount})`);
  }

  // ---------- 18. ADDITIONAL SEO META -------------------------------------
  const seoCount = await db.seoMeta.count();
  if (seoCount < 12) {
    const seos = [
      { pageSlug: "buy", metaTitle: "Buy Property in Dubai | Royal Jubilant Real Estate", metaDescription: "Browse 1000+ luxury properties for sale in Dubai. Villas, apartments, penthouses in Downtown, Marina, Palm Jumeirah. RERA-certified advisors.", keywords: "buy property dubai, dubai real estate, luxury apartments dubai" },
      { pageSlug: "rent", metaTitle: "Rent Property in Dubai | Royal Jubilant", metaDescription: "Find premium rental properties in Dubai. Yearly, monthly rentals across all major communities.", keywords: "rent dubai, dubai rentals, apartments for rent dubai" },
      { pageSlug: "off-plan", metaTitle: "Off-Plan Properties Dubai | Royal Jubilant", metaDescription: "Invest in Dubai off-plan projects from top developers. Payment plans, ROI projections, handover dates.", keywords: "off plan dubai, dubai off plan projects, pre-launch properties" },
      { pageSlug: "agents", metaTitle: "Meet Our Property Advisors | Royal Jubilant", metaDescription: "Connect with our RERA-certified luxury property advisors. Multilingual team with deep Dubai market expertise.", keywords: "dubai real estate agents, property advisors dubai" },
      { pageSlug: "valuation", metaTitle: "Free Property Valuation Dubai | Royal Jubilant", metaDescription: "Get a complimentary, no-obligation property valuation from our certified Dubai advisors.", keywords: "property valuation dubai, free valuation dubai" },
    ];
    for (const s of seos) {
      const exists = await db.seoMeta.findUnique({ where: { pageSlug: s.pageSlug } });
      if (exists) continue;
      await db.seoMeta.create({ data: s });
    }
    console.log(`✓ Added SEO meta for key pages`);
  } else {
    console.log(`= SEO meta already populated (${seoCount})`);
  }

  // ---------- FINAL COUNTS -------------------------------------------------
  const finalCounts = {
    users: await db.user.count(),
    agents: await db.agent.count(),
    properties: await db.property.count(),
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
  console.log("\n✅ Portal data seed complete!\n");
  console.log(JSON.stringify(finalCounts, null, 2));

  // Per-agent summary
  console.log("\n--- Per-agent summary ---");
  for (const agent of agentUsers) {
    const [listings, leads, appts, comms, notes] = await Promise.all([
      db.property.count({ where: { agentId: agent.id } }),
      db.lead.count({ where: { assignedTo: agent.email } }),
      db.appointment.count({ where: { agentEmail: agent.email } }),
      db.commission.count({ where: { agentId: agent.id } }),
      db.crmNote.count({ where: { agentId: agent.id } }),
    ]);
    console.log(`  ${agent.email}: listings=${listings}, leads=${leads}, appts=${appts}, commissions=${comms}, notes=${notes}`);
  }
}

main()
  .catch((e) => { console.error("Seed error:", e); process.exit(1); })
  .finally(() => db.$disconnect());
