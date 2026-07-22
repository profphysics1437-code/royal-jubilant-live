"use client";

import { jsPDF } from "jspdf";

interface PropertyPDFData {
  reference: string;
  title: string;
  price: number;
  status: string;
  rentFrequency?: string;
  type: string;
  community: string;
  subCommunity?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit?: string;
  parking: number;
  description: string;
  reraNumber?: string;
  images?: string[];
  agent?: {
    name: string;
    title: string;
    phone: string;
    whatsapp?: string;
    email: string;
    photo?: string;
  };
  location?: {
    address?: string;
  };
}

const NAVY = "#0A1F44";
const GOLD = "#C9A961";
const GRAY = "#6B7280";
const LIGHT_GRAY = "#F9FAFB";
const WHITE = "#FFFFFF";

/**
 * Generates a professional property brochure PDF and triggers download.
 */
export async function generatePropertyPDF(property: PropertyPDFData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // ─── Header bar (navy) ───────────────────────────────────
  doc.setFillColor(NAVY);
  doc.rect(0, 0, pageWidth, 70, "F");

  // Logo text
  doc.setTextColor(GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Royal Jubilant", margin, 35);
  doc.setTextColor(WHITE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Real Estate LLC", margin, 48);

  // Reference number (right side)
  doc.setTextColor(GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(property.reference, pageWidth - margin, 35, { align: "right" });
  doc.setTextColor(WHITE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("RERA-Verified Listing", pageWidth - margin, 48, { align: "right" });

  let y = 90;

  // ─── Property image (if available) ───────────────────────
  if (property.images && property.images.length > 0) {
    try {
      const imgUrl = property.images[0];
      const imgData = await fetchImageAsBase64(imgUrl);
      if (imgData) {
        const imgWidth = contentWidth;
        const imgHeight = 220;
        doc.addImage(imgData, "JPEG", margin, y, imgWidth, imgHeight, undefined, "FAST");
        y += imgHeight + 15;
      }
    } catch {
      // Skip image if it fails
    }
  }

  // ─── Title + price ───────────────────────────────────────
  doc.setTextColor(NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(property.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 20;

  // Price
  doc.setTextColor(GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  const priceText = `AED ${property.price.toLocaleString()}`;
  doc.text(priceText, margin, y);
  if (property.rentFrequency) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`/${property.rentFrequency}`, margin + doc.getTextWidth(priceText) + 5, y);
  }
  y += 25;

  // Community + status
  doc.setTextColor(GRAY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const locationText = `${property.community}${property.subCommunity ? " · " + property.subCommunity : ""}`;
  doc.text(locationText, margin, y);
  doc.text(property.status.toUpperCase(), pageWidth - margin, y, { align: "right" });
  y += 20;

  // ─── Separator line ──────────────────────────────────────
  doc.setDrawColor(GOLD);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  // ─── Key specs grid ──────────────────────────────────────
  const specs = [
    { label: "Type", value: property.type },
    { label: "Bedrooms", value: String(property.bedrooms) },
    { label: "Bathrooms", value: String(property.bathrooms) },
    { label: "Area", value: `${property.area.toLocaleString()} ${property.areaUnit || "sqft"}` },
    { label: "Parking", value: String(property.parking) },
    { label: "Status", value: property.status === "rent" ? "For Rent" : property.status === "sale" ? "For Sale" : property.status },
  ];

  const colWidth = contentWidth / 3;
  const rowHeight = 50;
  specs.forEach((spec, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = margin + col * colWidth;
    const cy = y + row * rowHeight;

    // Background box
    doc.setFillColor(LIGHT_GRAY);
    doc.roundedRect(x + 5, cy, colWidth - 10, rowHeight - 10, 6, 6, "F");

    // Label
    doc.setTextColor(GRAY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(spec.label.toUpperCase(), x + 15, cy + 15);

    // Value
    doc.setTextColor(NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(String(spec.value), x + 15, cy + 32);
  });

  y += Math.ceil(specs.length / 3) * rowHeight + 10;

  // ─── Description ─────────────────────────────────────────
  doc.setTextColor(NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Description", margin, y);
  y += 18;

  doc.setTextColor(GRAY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const descLines = doc.splitTextToSize(property.description, contentWidth);
  const maxDescLines = Math.floor((pageHeight - y - 120) / 13);
  doc.text(descLines.slice(0, maxDescLines), margin, y);
  y += Math.min(descLines.length, maxDescLines) * 13 + 15;

  // ─── RERA permit ─────────────────────────────────────────
  if (property.reraNumber) {
    doc.setFillColor(230, 245, 233);
    doc.roundedRect(margin, y, contentWidth, 30, 6, 6, "F");
    doc.setTextColor(30, 100, 50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`RERA Permit No. ${property.reraNumber} · Government-Verified Property`, margin + 12, y + 19);
    y += 40;
  }

  // ─── Agent section ───────────────────────────────────────
  if (property.agent) {
    if (y > pageHeight - 120) {
      doc.addPage();
      y = 50;
    }

    // Agent card background
    doc.setFillColor(LIGHT_GRAY);
    doc.roundedRect(margin, y, contentWidth, 80, 8, 8, "F");

    // Agent photo (if available)
    let agentImgX = margin + 12;
    if (property.agent.photo) {
      try {
        const agentImg = await fetchImageAsBase64(property.agent.photo);
        if (agentImg) {
          doc.addImage(agentImg, "JPEG", margin + 12, y + 15, 50, 50, undefined, "FAST");
          agentImgX = margin + 75;
        }
      } catch {
        // Skip
      }
    }

    // Agent name + title
    doc.setTextColor(NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(property.agent.name, agentImgX, y + 25);

    doc.setTextColor(GRAY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(property.agent.title, agentImgX, y + 40);

    // Contact info
    doc.setTextColor(NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`Phone: ${property.agent.phone}`, agentImgX, y + 55);

    doc.setTextColor(GRAY);
    doc.setFont("helvetica", "normal");
    doc.text(`Email: ${property.agent.email}`, agentImgX, y + 68);

    y += 95;
  }

  // ─── Footer (on every page) ──────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(NAVY);
    doc.rect(0, pageHeight - 30, pageWidth, 30, "F");
    doc.setTextColor(GOLD);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Royal Jubilant Real Estate LLC · Burjuman Business Tower, Dubai · +971 4 327 8401 · info@royaljubilant.ae", pageWidth / 2, pageHeight - 12, { align: "center" });
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 12, { align: "right" });
  }

  // ─── Download ────────────────────────────────────────────
  const filename = `${property.reference}-Royal-Jubilant-Brochure.pdf`;
  doc.save(filename);
}

/**
 * Fetches an image URL and converts it to base64 for jsPDF.
 */
async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}
