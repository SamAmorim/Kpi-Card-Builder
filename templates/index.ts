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

// Refined Categories: Executive, Analytics, Dark UI, Grid
// Remapping for better UX
const remappedTemplates = [
  { ...simpleKpi, category: 'Executive' },
  { ...cfoSummary, category: 'Executive' },
  { ...cmoInsight, category: 'Executive' },
  { ...revenueTrend, category: 'Executive' },
  { ...goalTracker, category: 'Executive' },
  
  { ...saasGrowth, category: 'Analytics' },
  { ...ecommerceProduct, category: 'Analytics' },
  { ...profileCard, category: 'Analytics' },
  { ...socialEngagement, category: 'Analytics' }, // New
  { ...trafficSources, category: 'Analytics' }, // New
  
  { ...darkStat, category: 'Dark UI' },
  { ...neonGlass, category: 'Dark UI' },
  { ...serverHealth, category: 'Dark UI' },
  
  { ...inventorySku, category: 'Card' }
] as Template[];

export const LOADED_TEMPLATES: Template[] = remappedTemplates;