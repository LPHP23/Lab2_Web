export interface DataPoint {
  label: string;
  value: number;
  category: string;
  color?: string;
}

export class DataService {
  private colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
  ];
  
  private categories = ['sales', 'revenue', 'users', 'growth'];
  private labels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  generateData(count: number = 8): DataPoint[] {
    const data: DataPoint[] = [];
    
    for (let i = 0; i < count; i++) {
      data.push({
        label: this.labels[i % this.labels.length],
        value: Math.floor(Math.random() * 100) + 20,
        category: this.categories[Math.floor(Math.random() * this.categories.length)],
        color: this.colors[i % this.colors.length]
      });
    }
    
    return data;
  }
  
  filterByCategory(data: DataPoint[], category: string): DataPoint[] {
    if (category === 'all') return data;
    return data.filter(point => point.category === category);
  }
  
  filterByDate(data: DataPoint[], startDate: Date, endDate: Date): DataPoint[] {
    // Mock implementation - in real app would filter by actual dates
    return data;
  }
  
  simulateRealtimeUpdate(currentData: DataPoint[]): DataPoint[] {
    return currentData.map(point => ({
      ...point,
      value: Math.max(0, point.value + Math.floor(Math.random() * 20) - 10)
    }));
  }
}