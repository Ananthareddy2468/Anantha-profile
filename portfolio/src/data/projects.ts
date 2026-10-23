export type ProjectCategory = 'Data Platforms' | 'AI/ML' | 'APIs & Applications';

export type Project = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  cardDetail: string;
  categories: ProjectCategory[];
  stack: string[];
  problem: string;
  contribution: string;
  architecture: string[];
  decisions: { title: string; detail: string }[];
  reliability: string;
  outcome: string;
};

export const projects: Project[] = [
  {
    slug: 'healthcare-data-ai-platform',
    number: '01',
    title: 'Enterprise Knowledge and Retrieval Systems',
    summary:
      'Making fragmented enterprise information easier to prepare, find, and use through retrieval-focused data workflows and application interfaces.',
    cardDetail: 'Featured case study · Knowledge retrieval & AI applications',
    categories: ['AI/ML', 'APIs & Applications'],
    stack: [
      'Python',
      'Document preparation',
      'Embeddings',
      'Vector search',
      'FastAPI',
      'RAG integration',
      'Monitoring',
    ],
    problem:
      'Useful information can be spread across documents and systems, making it difficult for people and applications to locate relevant context. Retrieval depends on preparing source material carefully and connecting it to a usable application path.',
    contribution:
      'Contributions included ingestion and document preparation, Python data processing, retrieval workflows, vector search, FastAPI services, and integration with AI applications. The summary describes areas of work, not a single confirmed production architecture.',
    architecture: [
      'Enterprise source material',
      'Ingestion & preparation',
      'Retrieval & vector search',
      'API context delivery',
      'AI application',
    ],
    decisions: [
      {
        title: 'Prepare documents before retrieval',
        detail:
          'Consistent parsing and useful metadata help retrieval connect a question to relevant source context. Document handling should reflect the source formats and access requirements.',
      },
      {
        title: 'Keep context traceable to its sources',
        detail:
          'Relevant context is more useful when an application can preserve the relationship to source material and respect established access boundaries.',
      },
      {
        title: 'Integrate through clear service boundaries',
        detail:
          'APIs provide a clear connection between retrieval and an AI application without implying an unverified agent or orchestration design.',
      },
    ],
    reliability:
      'Document preparation, relevant retrieval, source-aware context, and bounded APIs help make knowledge workflows more dependable. Specific evaluation scores or deployment characteristics are not claimed.',
    outcome:
      'The work supported a clearer path from fragmented information to relevant context that AI-enabled applications can use.',
  },
  {
    slug: 'financial-ml-feature-pipelines',
    number: '02',
    title: 'Machine Learning Data and Feature Pipelines',
    summary:
      'Preparing consistent data and reusable features for fraud and risk analytics across batch and streaming workflows.',
    cardDetail: 'Featured case study · Feature engineering & ML lifecycle',
    categories: ['Data Platforms', 'AI/ML'],
    stack: [
      'Python',
      'PySpark',
      'Kafka',
      'SQL',
      'Snowflake',
      'MLflow',
      'Cloud storage',
      'Model monitoring',
    ],
    problem:
      'Fraud and risk analytics rely on consistent inputs. Differences across batch and streaming sources, or between feature preparation and model use, make workflows harder to reproduce and operate.',
    contribution:
      'Work spanned batch and streaming ingestion, Python and PySpark feature processing, SQL and Snowflake, validation and reconciliation, and workflows supporting model tracking, inference services, and drift monitoring.',
    architecture: [
      'Batch & event inputs',
      'Validated processing',
      'Reusable features',
      'Tracked model lifecycle',
      'Inference & monitoring',
    ],
    decisions: [
      {
        title: 'Reconcile inputs before feature use',
        detail:
          'Validation at ingestion and feature boundaries helps expose missing or inconsistent records before they become difficult-to-explain model inputs.',
      },
      {
        title: 'Keep training and inference definitions aligned',
        detail:
          'Reusable feature processing can reduce avoidable differences between offline preparation and serving; the appropriate design depends on the workload.',
      },
      {
        title: 'Make model promotion reviewable',
        detail:
          'Tracking and registry workflows provide a place to compare versions and record promotion decisions without assuming a particular approval topology.',
      },
    ],
    reliability:
      'Validation and reconciliation make data quality visible. Reproducible tracking, inference monitoring, and drift signals support investigation and controlled model lifecycle management.',
    outcome:
      'The engineering supported more consistent datasets and reusable features across model workflows. No accuracy uplift, latency result, or fraud-loss reduction is asserted.',
  },
  {
    slug: 'public-service-data-api-platform',
    number: '03',
    title: 'Cloud Data Platforms and Intelligent Applications',
    summary:
      'Connecting Python services, distributed processing, orchestration, and cloud data to analytics and application workflows.',
    cardDetail: 'Featured case study · Cloud data & applications',
    categories: ['APIs & Applications', 'Data Platforms'],
    stack: [
      'Python',
      'FastAPI',
      'Django',
      'React',
      'REST',
      'GraphQL',
      'PySpark',
      'BigQuery',
      'Cloud Storage',
      'Dataproc',
      'Airflow',
      'PostgreSQL',
      'SQL Server',
    ],
    problem:
      'Operational data often crosses services, storage, and update schedules before it can support analytics or user-facing applications.',
    contribution:
      'Work included Python APIs and applications, Spark processing, cloud storage and data services, orchestration, REST and GraphQL integrations, relational databases, operational logging, and documentation.',
    architecture: [
      'Source services',
      'API & event boundaries',
      'Validated data processing',
      'Reporting datasets',
      'Application workflows',
    ],
    decisions: [
      {
        title: 'Validate at integration boundaries',
        detail:
          'Clear request and event contracts help separate upstream variation from application behavior and reporting expectations.',
      },
      {
        title: 'Optimize queries in context',
        detail:
          'SQL changes should be evaluated against their actual access patterns and correctness needs rather than assuming that one query shape fits every consumer.',
      },
      {
        title: 'Document the operational path',
        detail:
          'Logging and concise run documentation help engineers understand what a service depends on and where to investigate a failure.',
      },
    ],
    reliability:
      'Input validation, logging, operational documentation, and bounded API contracts help make integrations easier to diagnose and maintain.',
    outcome:
      'The work connected data processing and application services into more usable reporting and workflow paths without exposing internal endpoints or service-specific configuration.',
  },
  {
    slug: 'industrial-time-series-analytics',
    number: '04',
    title: 'Industrial Time-Series Analytics',
    summary:
      'Turning operational time-series signals into reusable analytical features and predictive-maintenance insights.',
    cardDetail: 'Experience case study · Time series & predictive modeling',
    categories: ['AI/ML', 'Data Platforms'],
    stack: [
      'Python',
      'PySpark',
      'SQL',
      'Feature engineering',
      'Anomaly detection',
      'Regression & ensembles',
      'ARIMA',
      'Prophet',
      'Dashboards',
    ],
    problem:
      'Operational and sensor readings are most useful when they can be prepared consistently and examined over time, rather than treated as isolated measurements.',
    contribution:
      'Work included ingestion and analysis of operational time series, Python and PySpark processing, SQL, feature engineering, anomaly detection, regression and ensemble methods, ARIMA and Prophet forecasting, orchestration, and dashboards.',
    architecture: [
      'Operational signals',
      'Time-aware preparation',
      'Reusable features',
      'Analytical models',
      'Insight & review',
    ],
    decisions: [
      {
        title: 'Respect time in validation',
        detail:
          'Timestamp parsing, ordering, and gaps matter to time-series features. Validation should reflect the cadence and semantics of each source.',
      },
      {
        title: 'Separate exploration from repeatable processing',
        detail:
          'Exploratory analysis helps test hypotheses; reusable transformations and orchestration make selected features easier to reproduce.',
      },
      {
        title: 'Keep predictions interpretable in context',
        detail:
          'Anomaly and forecast outputs are signals for evaluation, not proof of a specific operational outcome.',
      },
    ],
    reliability:
      'Time-aware checks, reproducible features, and clear dashboards support review of input quality and model output. Equipment identifiers and operational records are intentionally excluded.',
    outcome:
      'The work supported reusable analytical features and predictive-maintenance exploration. No measured maintenance savings or unverified operational outcome is claimed.',
  },
];
