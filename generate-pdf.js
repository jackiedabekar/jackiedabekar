const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();

    const htmlPath = path.resolve(__dirname, 'resume.html');
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    // Wait for fonts and animations to settle
    await page.waitForFunction(() => document.fonts.ready);

    // Force all scroll animations to visible (since there's no scroll in PDF)
    await page.evaluate(() => {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('visible');
        });
    });

    await page.pdf({
        path: path.resolve(__dirname, 'Deepak-V-Dabekar.pdf'),
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    console.log('PDF generated: Deepak-V-Dabekar.pdf');
    await browser.close();
})();
