export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, phone,
      propertyPrice, downPayment, loanTenor,
      employment, salary, residency,
    } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const enquiry = await db.mortgageEnquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        propertyPrice: Number(propertyPrice) || 0,
        downPayment: Number(downPayment) || 0,
        loanTenor: loanTenor ? Number(loanTenor) : null,
        employment: employment || null,
        salary: salary ? Number(salary) : null,
        residency: residency || null,
      },
    });

    return NextResponse.json({ success: true, enquiry });
  } catch (err) {
    console.error("[MORTGAGE_POST]", err);
    return NextResponse.json({ error: "Failed to create mortgage enquiry" }, { status: 500 });
  }
}
