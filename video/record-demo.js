async page => {
  const site = 'https://second-cursor-moving-day.zzzzzzzzzz-phoebe.chatgpt.site';
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.screencast.start({
    path: 'video/raw/second-cursor-master.webm',
    size: { width: 1920, height: 1080 },
  });

  await page.goto(site, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);

  await page.screencast.showChapter('ONE WORKSPACE. TWO CURSORS.', {
    description: 'A visible collaboration model for humans and AI',
    duration: 3200,
  });

  await page.getByRole('button', { name: 'Why two cursors?' }).click();
  await page.waitForTimeout(7200);
  await page.getByRole('button', { name: /Enter the shared workspace/ }).click();
  await page.waitForTimeout(1200);

  const visibleIntent = await page.screencast.showOverlay(`
    <div style="position:absolute;top:26px;right:28px;padding:13px 18px;
      color:#0e4bcb;background:rgba(247,249,255,.96);border:1px solid #adc3f3;
      border-radius:10px;font:700 13px/1.2 Manrope,system-ui,sans-serif;
      letter-spacing:.08em;box-shadow:0 10px 28px rgba(20,100,255,.14)">
      VISIBLE INTENT · INTERRUPTIBLE ACTION
    </div>
  `);
  await page.getByRole('button', { name: 'Play demo' }).click();
  await page.waitForTimeout(8500);
  await visibleIntent.dispose();
  await page.waitForTimeout(1200);

  const decision = await page.getByRole('button', { name: 'By the window' }).boundingBox();
  await page.screencast.showOverlay(`
    <div style="position:absolute;left:${decision.x - 7}px;top:${decision.y - 7}px;
      width:${decision.width + 14}px;height:${decision.height + 14}px;
      border:3px solid #1464ff;border-radius:16px;box-shadow:0 0 0 7px rgba(20,100,255,.12)"></div>
    <div style="position:absolute;left:${decision.x}px;top:${decision.y - 52}px;
      padding:10px 14px;color:white;background:#1464ff;border-radius:9px;
      font:700 13px/1.2 Manrope,system-ui,sans-serif">THE AGENT ASKS. THE HUMAN CHOOSES.</div>
  `, { duration: 2700 });
  await page.getByRole('button', { name: 'By the window' }).click();
  await page.waitForTimeout(1700);

  await page.getByRole('button', { name: 'Reset' }).click();
  await page.waitForTimeout(1200);
  await page.getByRole('button', { name: "I'll decide" }).click();
  await page.waitForTimeout(1400);
  await page.getByRole('button', { name: 'Prevent Agent from moving Chair', exact: true }).click();
  await page.waitForTimeout(1700);

  await page.screencast.showChapter('HUMAN AUTHORITY', {
    description: 'The Agent yields. You decide.',
    duration: 3000,
  });
  await page.waitForTimeout(1000);
  await page.screencast.stop();
}
