import { Template } from '../types';
import simpleKpi from './simple-kpi';
import profileCard from './profile-card';
import darkStat from './dark-stat';
import neonGlass from './neon-glass';
import saasGrowth from './saas-growth';
import ecommerceProduct from './ecommerce-product';
import revenueTrend from './revenue-trend';
import goalTracker from './goal-tracker';
import serverHealth from './server-health';
import inventorySku from './inventory-sku';
import cfoSummary from './cfo-summary';
import cmoInsight from './cmo-insight';
import socialEngagement from './social-engagement';
import trafficSources from './traffic-sources';
import projectSprint from './project-sprint';
import supportTicket from './support-ticket';
import cryptoAsset from './crypto-asset';
import hrRetention from './hr-retention';
import modernDarkGrid from './modern-dark-grid';
import salesPipeline from './sales-pipeline';

// Refined Categories: Executive, Analytics, Dark UI, Grid
// Remapping for better UX
const remappedTemplates = [
  { ...simpleKpi, category: 'Executive' },
  { ...cfoSummary, category: 'Executive' },
  { ...cmoInsight, category: 'Executive' },
  { ...revenueTrend, category: 'Executive' },
  { ...goalTracker, category: 'Executive' },
  { ...salesPipeline, category: 'Executive' }, // New
  
  { ...saasGrowth, category: 'Analytics' },
  { ...ecommerceProduct, category: 'Analytics' },
  { ...profileCard, category: 'Analytics' },
  { ...socialEngagement, category: 'Analytics' },
  { ...trafficSources, category: 'Analytics' },
  { ...supportTicket, category: 'Analytics' },
  { ...hrRetention, category: 'Analytics' }, // New
  
  { ...darkStat, category: 'Dark UI' },
  { ...neonGlass, category: 'Dark UI' },
  { ...serverHealth, category: 'Dark UI' },
  { ...cryptoAsset, category: 'Dark UI' },
  { ...modernDarkGrid, category: 'Dark UI' }, // New
  
  { ...inventorySku, category: 'Card' },
  { ...projectSprint, category: 'Card' }
] as Template[];

export const LOADED_TEMPLATES: Template[] = remappedTemplates;