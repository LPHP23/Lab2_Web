/** @jsx createElement */
import { createElement, useState } from './jsx-runtime';
import { Card, Button } from './component';
import { Chart, ChartType } from './chart';
import { DataService, DataPoint } from './data-service';

const dataService = new DataService();

export const Dashboard = () => {
  const [getChartType, setChartType] = useState<ChartType>('bar');
  const [getData, setData] = useState<DataPoint[]>(dataService.generateData());
  const [getCategory, setCategory] = useState<string>('all');
  
  const refreshData = () => {
    setData(dataService.generateData());
  };
  
  const categories = ['all', 'sales', 'revenue', 'users', 'growth'];
  
  // Tính toán dữ liệu
  const filteredData = getCategory() === 'all' 
    ? getData() 
    : getData().filter(d => d.category === getCategory());
      
  // SỬA LỖI 3: Thêm kiểm tra
  const dataLength = filteredData.length;
  const average = dataLength > 0 ? Math.round(filteredData.reduce((sum, d) => sum + d.value, 0) / dataLength) : 0;
  const maxValue = dataLength > 0 ? Math.max(...filteredData.map(d => d.value)) : 0;
  const minValue = dataLength > 0 ? Math.min(...filteredData.map(d => d.value)) : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Analytics Dashboard</h1>
        <p className="subtitle">Real-time data visualization</p>
      </div>
      
      <div className="dashboard-controls">
        <Card title="Chart Type" className="control-card">
          <div className="btn-group">
            <Button 
              className={getChartType() === 'bar' ? 'active' : ''}
              onClick={() => setChartType('bar')}
            >
              📊 Bar
            </Button>
            <Button 
              className={getChartType() === 'line' ? 'active' : ''}
              onClick={() => setChartType('line')}
            >
              📈 Line
            </Button>
            <Button 
              className={getChartType() === 'pie' ? 'active' : ''}
              onClick={() => setChartType('pie')}
            >
              🥧 Pie
            </Button>
          </div>
        </Card>
        
        <Card title="Category Filter" className="control-card">
          <select 
            className="category-select"
            value={getCategory()}
            // SỬA LỖI 2: Dùng (e: Event)
            onChange={(e: Event) => setCategory((e.target as HTMLSelectElement).value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </Card>
        
        <Card title="Actions" className="control-card">
          <Button onClick={refreshData} className="btn-primary">
            🔄 Refresh Data
          </Button>
        </Card>
      </div>
      
      <div className="dashboard-main">
        <Card title={`${getChartType().charAt(0).toUpperCase() + getChartType().slice(1)} Chart - ${getCategory() === 'all' ? 'All Categories' : getCategory()}`} className="chart-card">
          <Chart 
            data={filteredData}
            type={getChartType()}
          />
        </Card>
        
        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-value">{dataLength}</div>
            <div className="stat-label">Data Points</div>
          </Card>
          <Card className="stat-card">
            <div className="stat-value">{average}</div>
            <div className="stat-label">Average</div>
          </Card>
          <Card className="stat-card">
            <div className="stat-value">{maxValue}</div>
            <div className="stat-label">Max Value</div>
          </Card>
          <Card className="stat-card">
            <div className="stat-value">{minValue}</div>
            <div className="stat-label">Min Value</div>
          </Card>
        </div>
      </div>
    </div>
  );
};
