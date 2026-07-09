(() => {
  const header = document.querySelector('header');
  const logo = document.querySelector('header img');
  const companyName = document.querySelector('header button div span:first-child');
  const subtitle = document.querySelector('header button div span:last-child');
  const navItems = Array.from(document.querySelectorAll('header nav button')).map(b => b.textContent?.trim().split(/\s+/)[0]);
  const cta = Array.from(document.querySelectorAll('header button')).find(b => b.textContent?.includes('Book Consultation'));
  const phoneLink = document.querySelector('header a[href^="tel:"]');
  const whatsappLink = document.querySelector('header a[href*="wa.me"]');
  const emailLink = document.querySelector('header a[href^="mailto:"]');

  const headerRect = header ? header.getBoundingClientRect() : null;
  const logoRect = logo ? logo.getBoundingClientRect() : null;
  const nameRect = companyName ? companyName.getBoundingClientRect() : null;

  return {
    headerHeight: headerRect ? headerRect.height : 'N/A',
    headerBg: header ? getComputedStyle(header).backgroundColor : 'N/A',
    logoSize: logoRect ? (logoRect.width + 'x' + logoRect.height) : 'N/A',
    logoTop: logoRect ? logoRect.top : 'N/A',
    companyName: companyName ? companyName.textContent : 'N/A',
    companyNameColor: companyName ? getComputedStyle(companyName).color : 'N/A',
    companyNameFont: companyName ? getComputedStyle(companyName).fontFamily.substring(0, 40) : 'N/A',
    companyNameSize: companyName ? getComputedStyle(companyName).fontSize : 'N/A',
    companyNameTop: nameRect ? nameRect.top : 'N/A',
    subtitle: subtitle ? subtitle.textContent : 'N/A',
    subtitleColor: subtitle ? getComputedStyle(subtitle).color : 'N/A',
    navItems: navItems,
    hasCTA: !!cta,
    ctaText: cta ? cta.textContent.trim() : 'N/A',
    hasPhone: !!phoneLink,
    hasWhatsApp: !!whatsappLink,
    hasEmail: !!emailLink,
  };
})()
