import { StateCrimeData, GeopoliticalZone } from '../types';

export const NIGERIAN_STATES_DATA: StateCrimeData[] = [
  // South West (36,810)
  { state: 'Lagos', zone: 'South West', capital: 'Ikeja', totalCases: 24190, propertyCases: 13540, personsCases: 8750, authorityCases: 1900, lat: 6.5244, lng: 3.3792, riskScore: 38.4, clusterId: 2, trend: '-3.4% YoY' },
  { state: 'Oyo', zone: 'South West', capital: 'Ibadan', totalCases: 5230, propertyCases: 2680, personsCases: 2050, authorityCases: 500, lat: 7.3775, lng: 3.9470, riskScore: 28.1, clusterId: 1, trend: '+1.2% YoY' },
  { state: 'Ogun', zone: 'South West', capital: 'Abeokuta', totalCases: 3920, propertyCases: 2010, personsCases: 1540, authorityCases: 370, lat: 7.1475, lng: 3.3619, riskScore: 24.5, clusterId: 1, trend: '-0.8% YoY' },
  { state: 'Osun', zone: 'South West', capital: 'Osogbo', totalCases: 1820, propertyCases: 920, personsCases: 740, authorityCases: 160, lat: 7.7827, lng: 4.5418, riskScore: 18.2, clusterId: 1, trend: '-2.1% YoY' },
  { state: 'Ondo', zone: 'South West', capital: 'Akure', totalCases: 1120, propertyCases: 560, personsCases: 460, authorityCases: 100, lat: 7.2571, lng: 5.2058, riskScore: 15.6, clusterId: 1, trend: '+0.5% YoY' },
  { state: 'Ekiti', zone: 'South West', capital: 'Ado-Ekiti', totalCases: 530, propertyCases: 270, personsCases: 210, authorityCases: 50, lat: 7.6210, lng: 5.2215, riskScore: 12.0, clusterId: 1, trend: '-1.4% YoY' },

  // North West (28,450)
  { state: 'Kano', zone: 'North West', capital: 'Kano', totalCases: 8420, propertyCases: 4210, personsCases: 3410, authorityCases: 800, lat: 12.0022, lng: 8.5920, riskScore: 34.8, clusterId: 2, trend: '-1.9% YoY' },
  { state: 'Kaduna', zone: 'North West', capital: 'Kaduna', totalCases: 7110, propertyCases: 3500, personsCases: 2950, authorityCases: 660, lat: 10.5105, lng: 7.4165, riskScore: 36.2, clusterId: 2, trend: '+2.4% YoY' },
  { state: 'Katsina', zone: 'North West', capital: 'Katsina', totalCases: 4200, propertyCases: 2120, personsCases: 1710, authorityCases: 370, lat: 12.9908, lng: 7.6018, riskScore: 29.4, clusterId: 1, trend: '+0.9% YoY' },
  { state: 'Jigawa', zone: 'North West', capital: 'Dutse', totalCases: 2980, propertyCases: 1510, personsCases: 1200, authorityCases: 270, lat: 11.7583, lng: 9.3389, riskScore: 21.3, clusterId: 1, trend: '-1.1% YoY' },
  { state: 'Sokoto', zone: 'North West', capital: 'Sokoto', totalCases: 2340, propertyCases: 1190, personsCases: 930, authorityCases: 220, lat: 13.0059, lng: 5.2476, riskScore: 22.8, clusterId: 1, trend: '+1.5% YoY' },
  { state: 'Zamfara', zone: 'North West', capital: 'Gusau', totalCases: 1920, propertyCases: 970, personsCases: 780, authorityCases: 170, lat: 12.1628, lng: 6.6614, riskScore: 31.0, clusterId: 1, trend: '+3.2% YoY' },
  { state: 'Kebbi', zone: 'North West', capital: 'Birnin Kebbi', totalCases: 1480, propertyCases: 760, personsCases: 590, authorityCases: 130, lat: 12.4504, lng: 4.1975, riskScore: 17.5, clusterId: 1, trend: '-0.7% YoY' },

  // North Central (22,190)
  { state: 'FCT Abuja', zone: 'North Central', capital: 'Abuja', totalCases: 11200, propertyCases: 6180, personsCases: 4120, authorityCases: 900, lat: 9.0765, lng: 7.3986, riskScore: 35.6, clusterId: 2, trend: '+0.4% YoY' },
  { state: 'Plateau', zone: 'North Central', capital: 'Jos', totalCases: 3850, propertyCases: 1910, personsCases: 1580, authorityCases: 360, lat: 9.8965, lng: 8.8583, riskScore: 27.9, clusterId: 1, trend: '-1.3% YoY' },
  { state: 'Benue', zone: 'North Central', capital: 'Makurdi', totalCases: 2740, propertyCases: 1360, personsCases: 1120, authorityCases: 260, lat: 7.7303, lng: 8.5211, riskScore: 25.1, clusterId: 1, trend: '+1.1% YoY' },
  { state: 'Niger', zone: 'North Central', capital: 'Minna', totalCases: 2120, propertyCases: 1060, personsCases: 860, authorityCases: 200, lat: 9.6143, lng: 6.5480, riskScore: 23.4, clusterId: 1, trend: '+0.8% YoY' },
  { state: 'Kwara', zone: 'North Central', capital: 'Ilorin', totalCases: 1260, propertyCases: 630, personsCases: 510, authorityCases: 120, lat: 8.4799, lng: 4.5418, riskScore: 16.8, clusterId: 1, trend: '-2.0% YoY' },
  { state: 'Nasarawa', zone: 'North Central', capital: 'Lafia', totalCases: 820, propertyCases: 410, personsCases: 330, authorityCases: 80, lat: 8.4933, lng: 8.5153, riskScore: 19.2, clusterId: 1, trend: '-0.3% YoY' },
  { state: 'Kogi', zone: 'North Central', capital: 'Lokoja', totalCases: 200, propertyCases: 100, personsCases: 80, authorityCases: 20, lat: 7.7969, lng: 6.7405, riskScore: 14.1, clusterId: 1, trend: '-1.7% YoY' },

  // South South (21,430)
  { state: 'Rivers', zone: 'South South', capital: 'Port Harcourt', totalCases: 8920, propertyCases: 4720, personsCases: 3420, authorityCases: 780, lat: 4.8156, lng: 7.0498, riskScore: 37.1, clusterId: 2, trend: '-2.2% YoY' },
  { state: 'Delta', zone: 'South South', capital: 'Asaba', totalCases: 5140, propertyCases: 2680, personsCases: 2010, authorityCases: 450, lat: 5.6806, lng: 5.9221, riskScore: 29.8, clusterId: 1, trend: '+0.6% YoY' },
  { state: 'Edo', zone: 'South South', capital: 'Benin City', totalCases: 3650, propertyCases: 1890, personsCases: 1440, authorityCases: 320, lat: 6.3350, lng: 5.6037, riskScore: 26.5, clusterId: 1, trend: '-1.5% YoY' },
  { state: 'Akwa Ibom', zone: 'South South', capital: 'Uyo', totalCases: 1980, propertyCases: 1020, personsCases: 790, authorityCases: 170, lat: 5.0377, lng: 7.9128, riskScore: 20.4, clusterId: 1, trend: '-1.0% YoY' },
  { state: 'Cross River', zone: 'South South', capital: 'Calabar', totalCases: 1140, propertyCases: 590, personsCases: 450, authorityCases: 100, lat: 5.8702, lng: 8.5988, riskScore: 18.0, clusterId: 1, trend: '+0.2% YoY' },
  { state: 'Bayelsa', zone: 'South South', capital: 'Yenagoa', totalCases: 600, propertyCases: 310, personsCases: 240, authorityCases: 50, lat: 4.7719, lng: 6.0699, riskScore: 16.2, clusterId: 1, trend: '-0.9% YoY' },

  // South East (14,920)
  { state: 'Anambra', zone: 'South East', capital: 'Awka', totalCases: 4820, propertyCases: 2490, personsCases: 1910, authorityCases: 420, lat: 6.2209, lng: 7.0723, riskScore: 30.5, clusterId: 1, trend: '+1.4% YoY' },
  { state: 'Imo', zone: 'South East', capital: 'Owerri', totalCases: 3610, propertyCases: 1850, personsCases: 1450, authorityCases: 310, lat: 5.4836, lng: 7.0332, riskScore: 27.2, clusterId: 1, trend: '-0.8% YoY' },
  { state: 'Enugu', zone: 'South East', capital: 'Enugu', totalCases: 3120, propertyCases: 1610, personsCases: 1240, authorityCases: 270, lat: 6.4584, lng: 7.5464, riskScore: 23.9, clusterId: 1, trend: '-1.6% YoY' },
  { state: 'Abia', zone: 'South East', capital: 'Umuahia', totalCases: 2190, propertyCases: 1130, personsCases: 870, authorityCases: 190, lat: 5.5249, lng: 7.4946, riskScore: 22.0, clusterId: 1, trend: '+0.7% YoY' },
  { state: 'Ebonyi', zone: 'South East', capital: 'Abakaliki', totalCases: 1180, propertyCases: 610, personsCases: 470, authorityCases: 100, lat: 6.2649, lng: 8.0137, riskScore: 16.5, clusterId: 1, trend: '-2.4% YoY' },

  // North East (10,863)
  { state: 'Borno', zone: 'North East', capital: 'Maiduguri', totalCases: 3450, propertyCases: 1720, personsCases: 1430, authorityCases: 300, lat: 11.8333, lng: 13.1500, riskScore: 33.7, clusterId: 2, trend: '+1.8% YoY' },
  { state: 'Bauchi', zone: 'North East', capital: 'Bauchi', totalCases: 2820, propertyCases: 1420, personsCases: 1150, authorityCases: 250, lat: 10.3158, lng: 9.8442, riskScore: 23.1, clusterId: 1, trend: '-0.5% YoY' },
  { state: 'Adamawa', zone: 'North East', capital: 'Yola', totalCases: 2010, propertyCases: 1010, personsCases: 820, authorityCases: 180, lat: 9.3265, lng: 12.3984, riskScore: 21.8, clusterId: 1, trend: '+0.3% YoY' },
  { state: 'Gombe', zone: 'North East', capital: 'Gombe', totalCases: 1240, propertyCases: 630, personsCases: 500, authorityCases: 110, lat: 10.2897, lng: 11.1673, riskScore: 17.9, clusterId: 1, trend: '-1.1% YoY' },
  { state: 'Taraba', zone: 'North East', capital: 'Jalingo', totalCases: 893, propertyCases: 450, personsCases: 360, authorityCases: 83, lat: 8.8937, lng: 11.3596, riskScore: 19.5, clusterId: 1, trend: '+0.9% YoY' },
  { state: 'Yobe', zone: 'North East', capital: 'Damaturu', totalCases: 450, propertyCases: 230, personsCases: 180, authorityCases: 40, lat: 11.7470, lng: 11.9608, riskScore: 24.3, clusterId: 1, trend: '-2.8% YoY' },
];

export const GEOPOLITICAL_ZONES: GeopoliticalZone[] = [
  {
    name: 'South West',
    total: 36810,
    states: ['Lagos', 'Oyo', 'Ogun', 'Osun', 'Ondo', 'Ekiti'],
    keyStates: 'Lagos, Oyo, Ogun +',
    primaryOffence: 'Property (55.4%)',
    averageRisk: 22.8
  },
  {
    name: 'North West',
    total: 28450,
    states: ['Kano', 'Kaduna', 'Katsina', 'Jigawa', 'Sokoto', 'Zamfara', 'Kebbi'],
    keyStates: 'Kano, Kaduna, Katsina +',
    primaryOffence: 'Property (50.1%)',
    averageRisk: 27.6
  },
  {
    name: 'North Central',
    total: 22190,
    states: ['FCT Abuja', 'Plateau', 'Benue', 'Niger', 'Kwara', 'Nasarawa', 'Kogi'],
    keyStates: 'FCT Abuja, Plateau +',
    primaryOffence: 'Property (52.2%)',
    averageRisk: 24.8
  },
  {
    name: 'South South',
    total: 21430,
    states: ['Rivers', 'Delta', 'Edo', 'Akwa Ibom', 'Cross River', 'Bayelsa'],
    keyStates: 'Rivers, Delta, Edo +',
    primaryOffence: 'Persons (41.2%)',
    averageRisk: 24.7
  },
  {
    name: 'South East',
    total: 14920,
    states: ['Anambra', 'Imo', 'Enugu', 'Abia', 'Ebonyi'],
    keyStates: 'Anambra, Imo, Enugu +',
    primaryOffence: 'Property (51.5%)',
    averageRisk: 24.0
  },
  {
    name: 'North East',
    total: 10863,
    states: ['Borno', 'Bauchi', 'Adamawa', 'Gombe', 'Taraba', 'Yobe'],
    keyStates: 'Borno, Bauchi, Adamawa +',
    primaryOffence: 'Persons (43.1%)',
    averageRisk: 23.4
  }
];

export const TEMPORAL_WAVE_DATA = [
  { quarter: 'Q1 Reference', property: 16200, persons: 12800, authority: 3050, total: 32050 },
  { quarter: 'Q2 Mid-Cycle', property: 18400, persons: 14200, authority: 3250, total: 35850 },
  { quarter: 'Q3 Seasonal Surge', property: 19100, persons: 14900, authority: 3340, total: 37340 },
  { quarter: 'Q4 Reconciliation', property: 14879, persons: 11741, authority: 2803, total: 29423 },
];

export const DESIGN_TOKENS_YAML = `name: Smart Crime Intelligence
colors:
  surface: '#fef7ff'
  surface-dim: '#e0d6e9'
  surface-bright: '#fef7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf0ff'
  surface-container: '#f5eafd'
  surface-container-high: '#efe4f8'
  surface-container-highest: '#e9dff2'
  on-surface: '#1e1926'
  on-surface-variant: '#4c4354'
  inverse-surface: '#342e3c'
  inverse-on-surface: '#f7edff'
  outline: '#7e7385'
  outline-variant: '#cfc2d6'
  surface-tint: '#832ad3'
  primary: '#6200a9'
  on-primary: '#ffffff'
  primary-container: '#7e22ce'
  on-primary-container: '#e4c5ff'
  inverse-primary: '#ddb8ff'
  secondary: '#6e3aca'
  on-secondary: '#ffffff'
  secondary-container: '#8856e5'
  on-secondary-container: '#fffbff'
  tertiary: '#6100a8'
  on-tertiary: '#ffffff'
  tertiary-container: '#8013d7'
  on-tertiary-container: '#e4c4ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#ddb8ff'
  on-primary-fixed: '#2c0051'
  on-primary-fixed-variant: '#6800b4'
  secondary-fixed: '#ebddff'
  secondary-fixed-dim: '#d3bbff'
  on-secondary-fixed: '#250059'
  on-secondary-fixed-variant: '#581db3'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb8ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#6800b4'
  background: '#fef7ff'
  on-background: '#1e1926'
  surface-variant: '#e9dff2'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.005em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  stat-metric:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 2.5rem
  space-4xl: 3rem
  gutter-desktop: 1.5rem
  margin-desktop: 2rem
  gutter-tablet: 1rem
  margin-tablet: 1.5rem
  gutter-mobile: 0.75rem
  margin-mobile: 1rem`;
