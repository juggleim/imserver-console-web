import { request } from './request';
import SERVER_PATH from './api';

const getPerformanceNodes = () => {
  return request(SERVER_PATH.MONITOR_PERFORMANCE_NODES, { method: 'GET' });
};

const getPerformanceCatalog = () => {
  return request(SERVER_PATH.MONITOR_PERFORMANCE_CATALOG, { method: 'GET' });
};

const getPerformanceMetric = (params) => {
  const query = new URLSearchParams(params);
  const url = `${SERVER_PATH.MONITOR_PERFORMANCE_METRICS}?${query.toString()}`;
  return request(url, { method: 'GET' });
};

export default {
  getPerformanceNodes,
  getPerformanceCatalog,
  getPerformanceMetric,
};
