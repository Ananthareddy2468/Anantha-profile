import { evaluatePipeline } from './pipeline.mjs';

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointerQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
const effectsToggle = document.querySelector<HTMLButtonElement>('.effects-toggle');
let userRequestedReducedMotion = false;
let effectsReduced = false;

function syncEffects(): boolean {
  const reduced = reducedMotionQuery.matches || userRequestedReducedMotion;
  effectsReduced = reduced;
  document.documentElement.dataset.siteEffects = reduced ? 'off' : 'on';

  if (effectsToggle) {
    effectsToggle.setAttribute('aria-pressed', String(reduced));
    effectsToggle.disabled = reducedMotionQuery.matches;
    const label = effectsToggle.querySelector<HTMLElement>('.effects-label');
    if (label) {
      label.textContent = reducedMotionQuery.matches
        ? 'Reduced by system'
        : reduced
          ? 'Motion paused'
          : 'Motion on';
    }
    effectsToggle.setAttribute(
      'aria-label',
      reducedMotionQuery.matches
        ? 'Reduced motion is enabled by your system preference'
        : reduced
          ? 'Enable site motion'
          : 'Pause site motion',
    );
  }

  return reduced;
}

syncEffects();

if (effectsToggle) {
  effectsToggle.hidden = false;
  effectsToggle.addEventListener('click', () => {
    userRequestedReducedMotion = !userRequestedReducedMotion;
    syncEffects();
  });
}

reducedMotionQuery.addEventListener('change', () => {
  syncEffects();
});

const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const primaryNavigation = document.querySelector<HTMLElement>('#primary-navigation');
const header = document.querySelector<HTMLElement>('.site-header');

if (menuButton && primaryNavigation && header) {
  header.classList.add('has-menu-script');
  menuButton.hidden = false;
  primaryNavigation.dataset.open = 'false';

  const closeMenu = (restoreFocus = false) => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    primaryNavigation.dataset.open = 'false';
    if (restoreFocus) menuButton.focus();
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    primaryNavigation.dataset.open = String(!isOpen);
  });

  primaryNavigation.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a');
    if (!link) return;

    closeMenu();
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname) {
      return;
    }

    const section = destination.hash
      ? document.querySelector<HTMLElement>(destination.hash)
      : null;
    const heading = section?.matches('h1, h2')
      ? section
      : section?.querySelector<HTMLElement>('h1, h2');
    if (heading) {
      if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1;
      window.requestAnimationFrame(() => heading.focus({ preventScroll: true }));
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu(true);
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (
      menuButton.getAttribute('aria-expanded') === 'true' &&
      event.target instanceof Node &&
      !header.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.matchMedia('(min-width: 561px)').addEventListener('change', () => closeMenu());
}

const systemButtons = document.querySelectorAll<HTMLButtonElement>('[data-system-view]');
const systemPanels = document.querySelectorAll<HTMLElement>('[data-system-panel]');

for (const button of systemButtons) {
  button.hidden = false;
  button.addEventListener('click', () => {
    const selected = button.dataset.systemView;
    for (const candidate of systemButtons) {
      candidate.setAttribute('aria-pressed', String(candidate === button));
    }
    for (const panel of systemPanels) {
      panel.hidden = panel.dataset.systemPanel !== selected;
    }
  });
}

const filterControls = document.querySelector<HTMLElement>('.filter-list');
const projectCards = [...document.querySelectorAll<HTMLElement>('[data-project-card]')];
const filterCount = document.querySelector<HTMLElement>('[data-filter-count]');
const noFilterResults = document.querySelector<HTMLElement>('[data-no-results]');

if (filterControls && projectCards.length > 0 && filterCount && noFilterResults) {
  filterControls.hidden = false;
  for (const button of filterControls.querySelectorAll<HTMLButtonElement>('[data-filter]')) {
    button.addEventListener('click', () => {
      const selected = button.dataset.filter ?? 'All';
      for (const candidate of filterControls.querySelectorAll<HTMLButtonElement>('[data-filter]')) {
        candidate.setAttribute('aria-pressed', String(candidate === button));
      }

      let visibleCount = 0;
      for (const card of projectCards) {
        const categories = card.dataset.categories?.split('|') ?? [];
        const visible = selected === 'All' || categories.includes(selected);
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      }

      filterCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'case study' : 'case studies'}`;
      noFilterResults.hidden = visibleCount !== 0;
    });
  }
}

const sampleSelect = document.querySelector<HTMLSelectElement>('#sample-select');
const labControls = document.querySelector<HTMLElement>('[data-lab-controls]');
const inputRows = document.querySelector<HTMLTableSectionElement>('[data-pipeline-input-rows]');
const outputRows = document.querySelector<HTMLTableSectionElement>('[data-pipeline-output-rows]');
const outputCaption = document.querySelector<HTMLElement>('[data-output-caption]');
const stageName = document.querySelector<HTMLElement>('[data-stage-name]');
const stageTitle = document.querySelector<HTMLElement>('[data-stage-title]');
const stageDescription = document.querySelector<HTMLElement>('[data-stage-description]');
const rowCount = document.querySelector<HTMLElement>('[data-row-count]');
const pipelineStatus = document.querySelector<HTMLElement>('[data-pipeline-status]');
const ruleOutcomes = document.querySelector<HTMLElement>('[data-rule-outcomes]');
const stepBack = document.querySelector<HTMLButtonElement>('[data-step-back]');
const stepForward = document.querySelector<HTMLButtonElement>('[data-step-forward]');
const resetPipeline = document.querySelector<HTMLButtonElement>('[data-reset-pipeline]');
const tableNote = document.querySelector<HTMLElement>('[data-table-note]');
const stageIndicators = [...document.querySelectorAll<HTMLElement>('[data-stage-indicator]')];

const stages = [
  {
    name: 'STAGE 01 / INGEST',
    title: 'Inspect the incoming records',
    description: 'Incoming synthetic events expose their identifiers, categories, timestamps, and readings.',
  },
  {
    name: 'STAGE 02 / VALIDATE',
    title: 'Apply the selected rules',
    description: 'Missing categories, repeated identifiers, and non-numeric readings are counted against enabled checks.',
  },
  {
    name: 'STAGE 03 / TRANSFORM',
    title: 'Normalize accepted values',
    description: 'Accepted categories are normalized. If a rule is relaxed, missing or invalid values remain visible as Unknown or Missing.',
  },
  {
    name: 'STAGE 04 / CURATE',
    title: 'Review the curated records',
    description: 'The final view keeps the validated sample and derives a month partition from its timestamp.',
  },
];

if (
  sampleSelect &&
  labControls &&
  inputRows &&
  outputRows &&
  outputCaption &&
  stageName &&
  stageTitle &&
  stageDescription &&
  rowCount &&
  pipelineStatus &&
  ruleOutcomes &&
  stepBack &&
  stepForward &&
  resetPipeline &&
  tableNote
) {
  labControls.hidden = false;
  let stage = 0;

  const activeRules = () => ({
    missing: document.querySelector<HTMLInputElement>('[data-rule="missing"]')?.checked ?? true,
    duplicate: document.querySelector<HTMLInputElement>('[data-rule="duplicate"]')?.checked ?? true,
    invalid: document.querySelector<HTMLInputElement>('[data-rule="invalid"]')?.checked ?? true,
  });

  const text = (value: string | number | null) => {
    if (value === null || value === '') return 'Missing';
    return String(value);
  };

  const renderTable = (
    body: HTMLTableSectionElement,
    rows: {
      eventId: string;
      category: string;
      normalizedCategory?: string;
      timestamp: string;
      reading: number | string | null;
      numericReading?: number | null;
    }[],
    isOutput: boolean,
  ) => {
    body.replaceChildren();
    if (rows.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 4;
      cell.textContent = 'Advance to validation to compute the output.';
      row.append(cell);
      body.append(row);
      return;
    }

    for (const record of rows.slice(0, 6)) {
      const row = document.createElement('tr');
      const values = [
        record.eventId,
        isOutput
          ? (record.normalizedCategory ?? record.category.toUpperCase()) || 'UNKNOWN'
          : record.category || 'Missing',
        record.timestamp,
        text(isOutput ? record.numericReading ?? null : record.reading),
      ];
      for (const value of values) {
        const cell = document.createElement('td');
        cell.textContent = text(value);
        row.append(cell);
      }
      body.append(row);
    }
  };

  const render = () => {
    const evaluation = evaluatePipeline(sampleSelect.value === 'clean' ? 'clean' : 'issues', activeRules());
    const current = stages[stage];
    const visibleRows =
      stage === 0
        ? []
        : stage === 1
          ? evaluation.acceptedRows
          : evaluation.acceptedRows;

    renderTable(inputRows, evaluation.sourceRows, false);
    renderTable(outputRows, visibleRows, stage >= 2);
    stageName.textContent = current.name;
    stageTitle.textContent = current.title;
    stageDescription.textContent = current.description;
    outputCaption.textContent =
      stage === 0
        ? 'After · advance to validate'
        : stage === 1
          ? 'After · accepted records'
          : stage === 2
            ? 'After · normalized records'
            : 'After · curated records';

    const count = stage === 0 ? evaluation.sourceRows.length : evaluation.acceptedRows.length;
    rowCount.innerHTML = `${count} <span>${count === 1 ? 'record' : 'records'}</span>`;
    pipelineStatus.textContent =
      stage === 0
        ? `${evaluation.sourceRows.length} records ingested. ${evaluation.rejectedCount} would be excluded by the selected rules; continue to inspect the validation result.`
        : stage === 1
          ? `${evaluation.acceptedRows.length} of ${evaluation.sourceRows.length} records passed the selected checks; ${evaluation.rejectedCount} were excluded.`
          : stage === 2
            ? `${evaluation.acceptedRows.length} accepted records were normalized; relaxed rules leave incomplete values visible rather than hiding them.`
            : `${evaluation.acceptedRows.length} synthetic records are ready in the curated view.`;

    ruleOutcomes.replaceChildren();
    const ruleLabels = [
      ['missing', 'Missing category'],
      ['duplicate', 'Repeated event ID'],
      ['invalid', 'Non-numeric reading'],
    ] as const;
    for (const [key, label] of ruleLabels) {
      const outcome = document.createElement('div');
      outcome.className = 'rule-outcome';
      const name = document.createElement('span');
      name.textContent = label;
      const value = document.createElement('strong');
      value.textContent = `${evaluation.flags[key]} flagged · ${activeRules()[key] ? 'enforced' : 'allowed'}`;
      outcome.append(name, value);
      ruleOutcomes.append(outcome);
    }

    for (const indicator of stageIndicators) {
      if (Number(indicator.dataset.stageIndicator) === stage) {
        indicator.setAttribute('aria-current', 'step');
      } else {
        indicator.removeAttribute('aria-current');
      }
    }

    stepBack.disabled = stage === 0;
    stepForward.disabled = stage === stages.length - 1;
    stepForward.innerHTML =
      stage === stages.length - 1 ? 'Pipeline complete' : 'Next stage <span aria-hidden="true">→</span>';
    tableNote.textContent = `${evaluation.sourceRows.length} input · ${evaluation.acceptedRows.length} accepted · ${evaluation.rejectedCount} excluded. All records are synthetic and deterministic.`;
    outputRows.classList.remove('animate-once');
    void outputRows.offsetWidth;
    outputRows.classList.add('animate-once');
  };

  sampleSelect.addEventListener('change', () => {
    stage = 0;
    render();
  });
  for (const checkbox of document.querySelectorAll<HTMLInputElement>('[data-rule]')) {
    checkbox.addEventListener('change', render);
  }
  stepBack.addEventListener('click', () => {
    stage = Math.max(0, stage - 1);
    render();
  });
  stepForward.addEventListener('click', () => {
    stage = Math.min(stages.length - 1, stage + 1);
    render();
  });
  resetPipeline.addEventListener('click', () => {
    sampleSelect.value = 'issues';
    for (const checkbox of document.querySelectorAll<HTMLInputElement>('[data-rule]')) {
      checkbox.checked = true;
    }
    stage = 0;
    render();
  });

  render();
}

const navigationLinks = [...document.querySelectorAll<HTMLAnchorElement>('.primary-navigation a')];
const observedSections = navigationLinks
  .map((link) => {
    const hash = new URL(link.href, window.location.href).hash;
    return hash ? document.querySelector<HTMLElement>(hash) : null;
  })
  .filter((section): section is HTMLElement => section !== null);

if ('IntersectionObserver' in window && observedSections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const currentId = (entry.target as HTMLElement).id;
        for (const link of navigationLinks) {
          const target = new URL(link.href, window.location.href);
          if (target.hash === `#${currentId}`) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        }
      }
    },
    { rootMargin: '-20% 0px -62% 0px', threshold: 0 },
  );
  for (const section of observedSections) sectionObserver.observe(section);
}

const cursorOrbit = document.querySelector<HTMLElement>('.cursor-orbit');
let pointerFrame = 0;
let pointerX = 0;
let pointerY = 0;

if (cursorOrbit && finePointerQuery.matches) {
  const hideOrbit = () => cursorOrbit.classList.remove('is-visible', 'is-interactive');
  document.addEventListener('keydown', hideOrbit);
  window.addEventListener('blur', hideOrbit);

  document.addEventListener('pointermove', (event) => {
    if (effectsReduced || event.pointerType !== 'mouse') {
      hideOrbit();
      return;
    }

    const target = event.target;
    const isEditing = target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]');
    if (isEditing) {
      hideOrbit();
      return;
    }

    pointerX = event.clientX;
    pointerY = event.clientY;
    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      cursorOrbit.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      cursorOrbit.classList.add('is-visible');
      const overInteractive = target instanceof Element && target.closest('a, button, summary, [role="button"]');
      cursorOrbit.classList.toggle('is-interactive', Boolean(overInteractive));
      pointerFrame = 0;
    });
  });

  document.addEventListener('pointerleave', hideOrbit);
}

if (!reducedMotionQuery.matches && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll<HTMLElement>(
    '.section-heading, .project-card, .lab-panel, .expertise-item, .journey-item, .about-heading, .principles-list li, .case-copy-block, .case-aside-block',
  );
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!syncEffects()) entry.target.classList.add('animate-once');
        revealObserver.unobserve(entry.target);
      }
    },
    { threshold: 0.08 },
  );
  for (const target of revealTargets) revealObserver.observe(target);
}

const intelligenceFlow = document.querySelector<HTMLElement>('[data-flow]');
if (intelligenceFlow) {
  let visible = false;
  const syncFlow = () => { intelligenceFlow.dataset.paused = String(!visible || document.hidden || effectsReduced); };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncFlow(); });
  observer.observe(intelligenceFlow);
  document.addEventListener('visibilitychange', syncFlow);
  reducedMotionQuery.addEventListener('change', syncFlow);
  effectsToggle?.addEventListener('click', syncFlow);
  const stages = intelligenceFlow.querySelectorAll<HTMLDetailsElement>('details');
  for (const stage of stages) stage.addEventListener('toggle', () => {
    if (stage.open) for (const other of stages) if (other !== stage) other.open = false;
  });
}
