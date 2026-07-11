export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAgent } from "@/lib/agent-guard";

export async function GET() {
  const session = await requireAgent();
  if (!("user" in session)) return session; // unauthorized response
  const userId = session.user.id;

  const [myListings, myLeads, myAppointments, myCommissions, pendingListings, draftListings] = await Promise.all([
    db.property.count({ where: { agentId: userId } }),
    db.lead.count({ where: { assignedTo: session.user.email } }),
    db.appointment.count({ where: { agentEmail: session.user.email } }),
    db.commission.findMany({ where: { agentId: userId } }),
    db.property.count({ where: { agentId: userId, published: false } }),
    db.property.count({ where: { agentId: userId } }),
  ]);

  const totalCommission = myCommissions.reduce((s, c) => s + c.commissionAmt, 0);
  const paidCommission = myCommissions.filter((c) => c.status === "paid").reduce((s, c) => s + c.commissionAmt, 0);
  const pendingCommission = myCommissions.filter((c) => c.status !== "paid").reduce((s, c) => s + c.commissionAmt, 0);
  const totalDealValue = myCommissions.reduce((s, c) => s + c.dealValue, 0);

  return NextResponse.json({
    myListings,
    myLeads,
    myAppointments,
    pendingListings,
    commissions: myCommissions.length,
    totalCommission,
    paidCommission,
    pendingCommission,
    totalDealValue,
  });
}
