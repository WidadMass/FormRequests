// reportWebVitals.js
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';

const reportWebVitals = (metric) => {
  console.log(metric);
};

// Surveillez les différentes métriques
onCLS(reportWebVitals);
onFCP(reportWebVitals);
onFID(reportWebVitals);
onLCP(reportWebVitals);
onTTFB(reportWebVitals);
