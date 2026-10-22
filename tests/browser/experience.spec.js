import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const browserErrors = new WeakMap();
const navigationItems = [
  ['His life', 'life'],
  ['The five scrolls', 'five-rings'],
  ['The people in his story', 'people'],
  ['His Japan', 'world'],
  ['Reading room', 'reading-room'],
];
const lifeMoments = [
  ['beginning', 'An uncertain beginning'],
  ['kyoto', 'The Yoshioka fights'],
  ['ganryujima', 'Across the water to Kojirō'],
  ['wandering', 'A reputation without a fixed place'],
  ['shimabara', 'A stone at Shimabara'],
  ['kumamoto', 'Tadatoshi makes room for him'],
  ['brush', 'The hand that held the brush'],
  ['reigando', 'Writing at Reigandō'],
  ['death', 'What he left behind'],
];
const connectedPeople = [
  ['nobunaga', 'Oda Nobunaga'],
  ['ieyasu', 'Tokugawa Ieyasu'],
  ['kojiro', 'Sasaki Kojirō'],
  ['tadatoshi', 'Hosokawa Tadatoshi'],
  ['iori', 'Miyamoto Iori'],
];

async function openJournal(page) {
  await page.getByRole('button', { name: 'My journal', exact: true }).click();
  return page.getByRole('dialog', { name: 'Your journal', exact: true });
}

async function checkImageDimensions(images) {
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0))
      .toBe(true);
    const dimensions = await image.evaluate((element) => ({
      declaredWidth: Number(element.getAttribute('width')),
      declaredHeight: Number(element.getAttribute('height')),
      naturalWidth: element.naturalWidth,
      naturalHeight: element.naturalHeight,
    }));
    expect(dimensions.declaredWidth).toBe(dimensions.naturalWidth);
    expect(dimensions.declaredHeight).toBe(dimensions.naturalHeight);
    await expect(image).toHaveAttribute('alt', /\S.{15,}/);
  }
}

async function checkVisibleCopyAndFonts(page) {
  const smallText = await page.evaluate(() => {
    const failures = [];
    const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (textWalker.nextNode()) {
      const text = textWalker.currentNode.textContent.trim();
      const element = textWalker.currentNode.parentElement;
      if (
        !text ||
        !element ||
        !element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
      )
        continue;
      const size = Number.parseFloat(getComputedStyle(element).fontSize);
      if (size < 12) failures.push({ text: text.slice(0, 70), size });
    }
    for (const control of document.querySelectorAll('input, textarea, select')) {
      if (control.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) {
        const size = Number.parseFloat(getComputedStyle(control).fontSize);
        if (size < 12) failures.push({ text: control.tagName, size });
      }
    }
    return failures;
  });
  expect(smallText, 'Every rendered text fragment should be at least 12px').toEqual([]);
  expect(await page.locator('body').innerText()).not.toMatch(/[\u2013\u2014]/);
}

async function checkNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.documentWidth, label).toBeLessThanOrEqual(dimensions.viewportWidth);
}

test.beforeEach(async ({ page }) => {
  const errors = [];
  browserErrors.set(page, errors);
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
});

test.afterEach(async ({ page }) => {
  expect(browserErrors.get(page), 'The reading experience should not produce page errors').toEqual(
    [],
  );
});

test('the homepage follows Musashi with an attributed painting and two distinct starting points', async ({
  page,
}) => {
  await expect(page).toHaveTitle('RŌNIN | Miyamoto Musashi');
  const sectionOrder = await page
    .locator('#main-content > div > section')
    .evaluateAll((sections) => sections.map((section) => section.id));
  expect(sectionOrder).toEqual(['home', 'life', 'five-rings', 'people', 'world', 'reading-room']);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'By his own count, he won more than sixty duels.',
  );
  const hero = page.locator('#home');
  await expect(hero).toContainText('He also painted this.');
  await expect(hero.locator('img')).toHaveAttribute('src', /\/images\/figures\/shrike\.webp$/);
  await expect(hero.locator('figcaption')).toContainText('Miyamoto Musashi');
  await expect(hero.locator('figcaption')).toContainText('Shrike on a Withered Branch');
  await expect(hero.getByRole('link', { name: 'Start his story', exact: true })).toHaveAttribute(
    'href',
    '#life',
  );
  await expect(
    hero.getByRole('link', { name: 'Read the five scrolls', exact: true }),
  ).toHaveAttribute('href', '#five-rings');
  await expect(hero.locator('.hero-buttons a')).toHaveCount(2);
  await expect(hero.locator('.eyebrow [lang="ja"]')).toHaveText('宮本武蔵');
  await expect(hero.locator('.hero-source, .hero-bottom')).toHaveCount(0);
  const paintingWidth = await hero
    .locator('img')
    .evaluate((image) => image.getBoundingClientRect().width);
  const captionWidth = await hero
    .locator('figcaption')
    .evaluate((caption) => caption.getBoundingClientRect().width);
  expect(Math.abs(paintingWidth - captionWidth)).toBeLessThan(1);
  await expect(
    page.locator(
      '.archive-filters, .archive-toolbar, .warrior-grid, .reflection-banner, .introduction',
    ),
  ).toHaveCount(0);
  await expect(page.getByRole('searchbox')).toHaveCount(0);
  await expect(page.locator('br')).toHaveCount(0);
});

test('eight life chapters pair Japanese with translations and all nine retain folded sources', async ({
  page,
}) => {
  await expect(page.locator('#life .musashi-quote')).toHaveCount(8);
  for (const [chapterId] of lifeMoments) {
    const chapter = page.locator(`#life-${chapterId}`);
    const quotation = chapter.locator('.musashi-quote');
    if (chapterId === 'kumamoto') {
      await expect(quotation).toHaveCount(0);
    } else {
      await expect(quotation).toHaveCount(1);
      await expect(quotation.locator('[lang="ja"]')).toHaveText(/\S+/);
      await expect(quotation.locator('.quote-translation')).toHaveText(/\S+/);
      await expect(quotation.locator('figcaption')).toContainText('Translation for this site.');
      await expect(quotation.getByRole('link')).toHaveAttribute('href', /^https:\/\//);
    }
    const disclosure = chapter.locator('details.chapter-sources');
    const linkCount = await disclosure.locator('a').count();
    await expect(disclosure.locator('summary')).toHaveText(`Sources (${linkCount})`);
    await expect(disclosure).not.toHaveAttribute('open');
    await expect(disclosure.locator('ul')).toBeHidden();
    await disclosure.locator('summary').click();
    await expect(disclosure.locator('ul')).toBeVisible();
    await disclosure.locator('summary').press('Enter');
    await expect(disclosure.locator('ul')).toBeHidden();
  }
});

test('the three set pieces retain the sticky timeline and fit the viewport', async ({ page }) => {
  const timeline = page.getByRole('navigation', { name: 'Musashi life timeline' });
  await timeline.getByRole('button', { name: /Across the water/ }).click();
  const duel = page.locator('#life-ganryujima');
  await expect(duel).toHaveClass(/duel-chapter/);
  await expect(timeline).toHaveAttribute('data-theme', 'ink');
  const printBounds = await duel.locator('img').boundingBox();
  expect(Math.abs(printBounds.x)).toBeLessThan(1);
  expect(Math.abs(printBounds.width - page.viewportSize().width)).toBeLessThan(1);
  await duel.locator('.musashi-quote').scrollIntoViewIfNeeded();
  await expect(timeline).toBeInViewport();
  await timeline.getByRole('button', { name: /The hand that held/ }).click();
  await expect(timeline).toHaveAttribute('data-theme', 'paper');
  const gallery = page.locator('#life-brush .brush-gallery');
  await expect(gallery.locator('figure')).toHaveCount(3);
  await checkImageDimensions(gallery.locator('img'));
  const paintings = await gallery.locator('figure').evaluateAll((figures) =>
    figures.map((figure) => ({
      left: figure.getBoundingClientRect().left,
      top: figure.getBoundingClientRect().top,
    })),
  );
  expect(paintings[1].left).toBeGreaterThan(paintings[0].left);
  expect(Math.abs(paintings[1].top - paintings[0].top)).toBeLessThan(1);
  if (page.viewportSize().width > 760) {
    const alignment = await gallery.locator('figure').evaluateAll((figures) =>
      figures.map((figure) => {
        const image = figure.querySelector('img');
        const imageStyle = getComputedStyle(image);
        return {
          bottom: image.getBoundingClientRect().bottom,
          captionTop: figure.querySelector('figcaption').getBoundingClientRect().top,
          fit: imageStyle.objectFit,
          position: imageStyle.objectPosition,
        };
      }),
    );
    for (const painting of alignment) {
      expect(painting.fit).toBe('contain');
      expect(painting.position).toBe('50% 100%');
      expect(Math.abs(painting.bottom - alignment[0].bottom)).toBeLessThan(1);
      expect(Math.abs(painting.captionTop - alignment[0].captionTop)).toBeLessThan(1);
    }
  }
  await timeline.getByRole('button', { name: /Writing at Reigandō/ }).click();
  await expect(page.locator('#life-reigando')).toHaveClass(/reigando-chapter/);
  await expect(page.locator('#life-reigando .musashi-quote')).toContainText(
    'practice of many years',
  );
  await expect(timeline).toBeInViewport();
  await checkNoOverflow(page, 'Set pieces should fit the viewport');
});

test('navigation matches the reading order and the mobile menu closes after use', async ({
  page,
}) => {
  const navigation = page.getByRole('navigation', { name: 'Main navigation', includeHidden: true });
  const links = navigation.getByRole('link', { includeHidden: true });
  await expect(links).toHaveText(navigationItems.map(([label]) => label));
  for (let index = 0; index < navigationItems.length; index += 1) {
    await expect(links.nth(index)).toHaveAttribute('href', `#${navigationItems[index][1]}`);
  }
  const menuButton = page.getByRole('button', { name: 'Open navigation' });
  const collapsibleNavigation = await menuButton.isVisible();
  if (collapsibleNavigation) {
    await expect(navigation).toBeHidden();
    await menuButton.click();
    await expect(navigation).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(navigation).toBeHidden();
  }
  for (const [label, sectionId] of navigationItems) {
    if (collapsibleNavigation) await page.getByRole('button', { name: 'Open navigation' }).click();
    await navigation.getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${sectionId}$`));
    await expect(page.locator(`#${sectionId}`)).toBeInViewport();
    if (collapsibleNavigation) await expect(navigation).toBeHidden();
  }
});

test('nine timeline choices focus their chapter and follow manual reading', async ({ page }) => {
  const timeline = page.getByRole('navigation', { name: 'Musashi life timeline' });
  await expect(timeline.getByRole('button')).toHaveCount(9);
  for (const [chapterId, title] of lifeMoments) {
    const chapterButton = timeline.getByRole('button', { name: new RegExp(title) });
    await chapterButton.click();
    const chapter = page.locator(`#life-${chapterId}`);
    await expect(
      chapter.getByRole('heading', { level: 3, name: title, exact: true }),
    ).toBeFocused();
    await expect(chapterButton).toHaveAttribute('aria-current', 'step');
    if (page.viewportSize().width <= 760) {
      const headingBounds = await chapter.locator('h3').boundingBox();
      const navigationBounds = await timeline.boundingBox();
      expect(headingBounds.y, `${title} should clear the sticky timeline`).toBeGreaterThanOrEqual(
        navigationBounds.y + navigationBounds.height,
      );
    }
    expect(await chapter.locator(':scope > p:not(.chapter-year)').count()).toBeGreaterThanOrEqual(
      2,
    );
    expect(await chapter.locator(':scope > p:not(.chapter-year)').count()).toBeLessThanOrEqual(4);
    expect(await chapter.locator('.chapter-sources a').count()).toBeGreaterThan(0);
  }
  for (const [chapterId, title] of [...lifeMoments].reverse()) {
    await page
      .locator(`#life-${chapterId}`)
      .evaluate((chapter) => chapter.scrollIntoView({ block: 'start' }));
    await expect(timeline.getByRole('button', { name: new RegExp(title) })).toHaveAttribute(
      'aria-current',
      'step',
    );
    await expect(timeline.locator('[aria-current="step"]')).toHaveCount(1);
  }
  await expect(page.locator('.life-evidence')).toHaveCount(1);
});

test('the five scrolls support keyboard reading and open the matching journal perspective', async ({
  page,
}) => {
  const scrolls = page.locator('#five-rings');
  await scrolls.getByRole('tab', { name: 'Earth', exact: true }).focus();
  for (const [key, name] of [
    ['ArrowRight', 'Water'],
    ['ArrowDown', 'Fire'],
    ['ArrowLeft', 'Water'],
    ['ArrowUp', 'Earth'],
    ['ArrowLeft', 'Void'],
    ['ArrowRight', 'Earth'],
    ['End', 'Void'],
    ['Home', 'Earth'],
  ]) {
    await page.keyboard.press(key);
    const tab = scrolls.getByRole('tab', { name, exact: true });
    await expect(tab).toBeFocused();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(scrolls.getByRole('tabpanel', { name, exact: true })).toBeVisible();
  }
  const storedBeforeOpening = await page.evaluate(() =>
    localStorage.getItem('ronin.reflections.v1'),
  );
  for (const ringName of ['Earth', 'Water', 'Fire', 'Wind', 'Void']) {
    await scrolls.getByRole('tab', { name: ringName, exact: true }).click();
    const panel = scrolls.getByRole('tabpanel', { name: ringName, exact: true });
    await expect(
      panel.getByRole('heading', { name: `The Book of ${ringName}`, exact: true }),
    ).toBeVisible();
    await panel.getByRole('button', { name: 'Write from this scroll', exact: true }).click();
    const journal = page.getByRole('dialog', { name: 'Your journal', exact: true });
    await expect(journal.getByLabel('A perspective to write from')).toHaveValue(ringName);
    await journal.getByRole('button', { name: 'Close dialog' }).click();
    await expect(
      panel.getByRole('button', { name: 'Write from this scroll', exact: true }),
    ).toBeFocused();
    expect(await page.evaluate(() => localStorage.getItem('ronin.reflections.v1'))).toBe(
      storedBeforeOpening,
    );
  }
});

test('journal entries survive closing and reloading and remain deleted after removal', async ({
  page,
}) => {
  const reflection = 'Read the account beside the surviving evidence.';
  let journal = await openJournal(page);
  await journal.getByLabel('A perspective to write from').selectOption('Water');
  await journal.getByLabel('Your reflection').fill(reflection);
  await journal.getByRole('button', { name: 'Save reflection' }).click();
  await expect(journal.getByRole('status')).toHaveText('Reflection saved on this device.');
  await expect(journal.getByLabel('Your reflection')).toHaveValue('');
  await journal.getByRole('button', { name: 'Close dialog' }).click();
  journal = await openJournal(page);
  await expect(journal.locator('.journal-entries li')).toHaveCount(1);
  await expect(journal.locator('.journal-entries')).toContainText(reflection);
  await page.reload();
  journal = await openJournal(page);
  await expect(journal.locator('.journal-entries')).toContainText(reflection);
  await expect(journal.locator('.entry-meta')).toContainText('Water /');
  await journal.getByRole('button', { name: /^Delete reflection:/ }).click();
  await expect(journal.getByRole('status')).toHaveText('Reflection deleted.');
  await expect(journal.getByText('You have no saved reflections.')).toBeVisible();
  await page.reload();
  journal = await openJournal(page);
  await expect(journal.locator('.journal-entries li')).toHaveCount(0);
});

test('journal export contains the saved words and perspective', async ({ page }) => {
  const journal = await openJournal(page);
  const reflection = 'Ask which source supports the detail.';
  await journal.getByLabel('A perspective to write from').selectOption('Wind');
  await journal.getByLabel('Your reflection').fill(reflection);
  await journal.getByRole('button', { name: 'Save reflection' }).click();
  const downloadPromise = page.waitForEvent('download');
  await journal.getByRole('button', { name: 'Export', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('ronin-journal.txt');
  expect(await download.failure()).toBeNull();
  const contents = await readFile(await download.path(), 'utf8');
  expect(contents).toContain(reflection);
  expect(contents).toContain('Wind');
});

test('unavailable storage preserves the unsaved text', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage unavailable', 'SecurityError');
      },
    }),
  );
  await page.reload();
  const journal = await openJournal(page);
  const reflection = 'Keep these words available to copy.';
  await journal.getByLabel('Your reflection').fill(reflection);
  await journal.getByRole('button', { name: 'Save reflection' }).click();
  await expect(journal.getByRole('status')).toContainText('Your browser could not save this note.');
  await expect(journal.getByLabel('Your reflection')).toHaveValue(reflection);
});

for (const [personId, personName] of connectedPeople) {
  test(`${personName} has a short sourced profile connected to Musashi`, async ({ page }) => {
    const people = page.locator('#people');
    await expect(people.locator('.people-card')).toHaveCount(5);
    await people.locator(`a[href="#people/${personId}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#people/${personId}$`));
    const profile = page.locator('#profile-article');
    await expect(
      profile.getByRole('heading', { level: 1, name: personName, exact: true }),
    ).toBeFocused();
    await expect(page).toHaveTitle(`${personName} | RŌNIN`);
    await expect(profile.locator('.profile-introduction')).toContainText('Musashi');
    const chapterCount = await profile.locator('.profile-chapter').count();
    expect(chapterCount).toBeGreaterThanOrEqual(2);
    expect(chapterCount).toBeLessThanOrEqual(3);
    for (const chapter of await profile.locator('.profile-chapter').all()) {
      expect((await chapter.innerText()).split(/\s+/).length).toBeGreaterThan(70);
      expect(await chapter.locator('.chapter-sources a').count()).toBeGreaterThan(0);
    }
    const contents = profile.getByRole('navigation', { name: 'Profile contents' });
    await contents.getByRole('button', { name: 'Connection to Musashi', exact: true }).click();
    await expect(profile.locator('#profile-introduction')).toBeFocused();
    await contents.getByRole('button', { name: 'Sources', exact: true }).click();
    await expect(profile.locator('#profile-sources')).toBeFocused();
    expect(await profile.locator('.profile-sources li').count()).toBeGreaterThan(0);
    await checkImageDimensions(profile.locator('img'));
    await checkVisibleCopyAndFonts(page);
    await checkNoOverflow(page, `${personName} should fit the viewport`);
    await profile.getByRole('link', { name: 'Return to Musashi’s story', exact: true }).click();
    await expect(page).toHaveURL(/#life-/);
    await expect(page.locator('#life')).toBeVisible();
    await expect(page.locator('#profile-article')).toHaveCount(0);
  });
}

test('profile history, skip navigation and missing addresses preserve a usable route', async ({
  page,
}) => {
  await page.locator('#people a[href="#people/kojiro"]').click();
  await page.locator('.related-profiles a[href="#people/iori"]').click();
  await expect(page).toHaveURL(/#people\/iori$/);
  await page.goBack();
  await expect(page).toHaveURL(/#people\/kojiro$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Sasaki Kojirō' })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { level: 1, name: 'Miyamoto Iori' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Miyamoto Iori' })).toBeVisible();
  const currentRoute = page.url();
  await page.getByRole('link', { name: 'Skip to content', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  expect(page.url()).toBe(currentRoute);
  await page
    .locator('.profile-hero')
    .getByRole('link', { name: 'Back to the people in his story', exact: true })
    .click();
  await expect(page).toHaveURL(/#people$/);
  await expect(page.locator('#people .people-card')).toHaveCount(5);
  await page.goto('/#people/missing-person');
  await expect(
    page.getByRole('heading', { level: 1, name: 'This person is not in the story.' }),
  ).toBeVisible();
  await page
    .locator('.missing-profile')
    .getByRole('link', { name: 'The people in his story', exact: true })
    .click();
  await expect(page.locator('#people')).toBeInViewport();
});

test('five events explain Musashi’s Japan with pointer and keyboard controls', async ({ page }) => {
  const world = page.locator('#world');
  const events = [
    ['honnoji', 'The struggle for power continues.'],
    ['sekigahara', 'Military service changes hands.'],
    ['osaka', 'A final challenge to Tokugawa rule.'],
    ['shimabara', 'Musashi and Iori join an army.'],
    ['kumamoto', 'A swordsman works within the peace.'],
  ];
  await expect(world.getByRole('tab')).toHaveCount(5);
  for (const [eventId, title] of events) {
    const tab = world.locator(`#era-tab-${eventId}`);
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(
      world.locator(`#era-panel-${eventId}`).getByRole('heading', { name: title, exact: true }),
    ).toBeVisible();
    await expect(world.locator(`#era-panel-${eventId} a`)).toHaveAttribute('href', /^https:\/\//);
  }
  await world.locator('#era-tab-kumamoto').focus();
  for (const [key, eventId] of [
    ['Home', 'honnoji'],
    ['ArrowRight', 'sekigahara'],
    ['ArrowLeft', 'honnoji'],
    ['ArrowLeft', 'kumamoto'],
    ['ArrowRight', 'honnoji'],
    ['End', 'kumamoto'],
  ]) {
    await page.keyboard.press(key);
    await expect(world.locator(`#era-tab-${eventId}`)).toBeFocused();
    await expect(world.locator(`#era-tab-${eventId}`)).toHaveAttribute('aria-selected', 'true');
    await expect(world.locator(`#era-panel-${eventId}`)).toBeVisible();
  }
  await expect(world.locator('.culture-selector, .culture-panel')).toHaveCount(0);
});

test('historical images have truthful dimensions and the reading room exposes records', async ({
  page,
}) => {
  await checkImageDimensions(page.locator('main img:visible'));
  const readingRoom = page.locator('#reading-room');
  const glossary = readingRoom
    .locator('details')
    .filter({ has: page.locator('summary', { hasText: 'Terms in the story' }) });
  await glossary.locator('summary').click();
  await expect(glossary.locator('dl')).toBeVisible();
  expect(await glossary.locator('dt').count()).toBeGreaterThan(3);
  const sourceList = readingRoom
    .locator('details')
    .filter({ has: page.locator('summary', { hasText: 'Sources and further reading' }) });
  await sourceList.locator('summary').click();
  expect(await sourceList.getByRole('link').count()).toBeGreaterThan(5);
  for (const source of await sourceList.getByRole('link').all())
    await expect(source).toHaveAttribute('href', /^https:\/\//);
  const about = readingRoom
    .locator('details')
    .filter({ has: page.locator('summary', { hasText: 'About this site' }) });
  await about.locator('summary').click();
  await expect(about).toContainText('No generated artwork is used.');
  await checkVisibleCopyAndFonts(page);
});

test('reading text and layouts stay legible from narrow phones to desktop', async ({ page }) => {
  const initialViewport = page.viewportSize();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#life');
    await checkVisibleCopyAndFonts(page);
    await checkNoOverflow(page, `Homepage should fit ${width}px`);
    const proseSizes = await page
      .locator('.life-chapter > p:not(.chapter-year)')
      .evaluateAll((paragraphs) =>
        paragraphs.map((paragraph) => Number.parseFloat(getComputedStyle(paragraph).fontSize)),
      );
    expect(
      proseSizes.every((size) => size === 18),
      `Story prose should be 18px at ${width}px`,
    ).toBe(true);
    await page.goto('/#people/nobunaga');
    await expect(page.locator('#profile-article')).toBeVisible();
    await checkVisibleCopyAndFonts(page);
    await checkNoOverflow(page, `Profile should fit ${width}px`);
  }
  await page.setViewportSize(initialViewport);
  const journal = await openJournal(page);
  await journal.getByLabel('Your reflection').fill('A question from the reading.');
  await journal.getByRole('button', { name: 'Save reflection' }).click();
  await checkVisibleCopyAndFonts(page);
  await checkNoOverflow(page, 'Journal should fit the viewport');
});
