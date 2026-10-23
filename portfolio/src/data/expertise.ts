export const expertise = [
  {
    title: 'Data platforms',
    description:
      'Build and operate data flows with explicit validation, reusable processing, and attention to distributed workload behavior.',
    skills: [
      'Python',
      'SQL',
      'PySpark',
      'Apache Spark',
      'Azure Databricks',
      'ETL / ELT',
      'Airflow',
      'Kafka',
      'Data quality',
      'Data modeling',
      'Performance optimization',
    ],
    projects: ['healthcare-data-ai-platform', 'financial-ml-feature-pipelines'],
  },
  {
    title: 'Analytics & storage',
    description:
      'Prepare data and features for analytics across cloud storage, warehouses, and relational systems.',
    skills: [
      'Snowflake',
      'BigQuery',
      'PostgreSQL',
      'SQL Server',
      'Cloud object storage',
      'Dimensional modeling',
      'Feature pipelines',
    ],
    projects: ['public-service-data-api-platform', 'industrial-time-series-analytics'],
  },
  {
    title: 'Applied AI & ML',
    description:
      'Connect data preparation with practical model workflows, retrieval patterns, and evaluation-aware operations.',
    skills: [
      'scikit-learn',
      'XGBoost',
      'MLflow',
      'Model monitoring',
      'RAG',
      'Embeddings',
      'Vector search',
      'LangChain',
      'LangGraph',
    ],
    projects: ['healthcare-data-ai-platform', 'financial-ml-feature-pipelines'],
  },
  {
    title: 'Applications & APIs',
    description:
      'Create clear service boundaries and useful application workflows around data and domain services.',
    skills: ['FastAPI', 'Django', 'Flask', 'React', 'REST', 'API security', 'OAuth2 / JWT'],
    projects: ['public-service-data-api-platform', 'healthcare-data-ai-platform'],
  },
  {
    title: 'Cloud & delivery',
    description:
      'Work across cloud platforms and delivery practices while keeping operational needs visible.',
    skills: [
      'Azure',
      'AWS',
      'GCP',
      'Docker',
      'Kubernetes',
      'Terraform',
      'GitHub Actions',
      'Azure DevOps',
      'Observability',
    ],
    projects: ['healthcare-data-ai-platform', 'public-service-data-api-platform'],
  },
] as const;
