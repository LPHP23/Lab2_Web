/** @jsx createElement */
import { createElement, ComponentProps } from './jsx-runtime';
import { DataPoint } from './data-service';

export type ChartType = 'bar' | 'line' | 'pie';

export interface ChartProps extends ComponentProps {
  data: DataPoint[];
  type: ChartType;
}

export const Chart = (props: ChartProps) => {
  const { data, type } = props;
  
  const canvasRef = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (type === 'bar') {
      drawBarChart(ctx, canvas, data);
    } else if (type === 'line') {
      drawLineChart(ctx, canvas, data);
    } else if (type === 'pie') {
      drawPieChart(ctx, canvas, data);
    }
  };
  
  return (
    <div className="chart-container">
      <canvas 
        ref={canvasRef}
        width={700}
        height={400}
        className="chart-canvas"
      />
    </div>
  );
};

function drawBarChart(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: DataPoint[]) {
  const padding = 60;
  const width = canvas.width - padding * 2;
  const height = canvas.height - padding * 2;
  const barWidth = width / data.length;
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  // Draw axes
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height + padding);
  ctx.lineTo(width + padding, height + padding);
  ctx.stroke();
  
  // Draw bars
  data.forEach((point, i) => {
    const barHeight = (point.value / maxValue) * height;
    const x = padding + i * barWidth + barWidth * 0.1;
    const y = height + padding - barHeight;
    const w = barWidth * 0.8;
    
    // Draw bar with gradient
    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, point.color || '#36A2EB');
    gradient.addColorStop(1, adjustColor(point.color || '#36A2EB', -30));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, w, barHeight);
    
    // Draw value on top
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(String(point.value), x + w / 2, y - 5);
    
    // Draw label
    ctx.save();
    ctx.translate(x + w / 2, height + padding + 15);
    ctx.fillText(point.label, 0, 0);
    ctx.restore();
  });
  
  // Draw title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Bar Chart', canvas.width / 2, 30);
}

function drawLineChart(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: DataPoint[]) {
  const padding = 60;
  const width = canvas.width - padding * 2;
  const height = canvas.height - padding * 2;
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  // Draw axes
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height + padding);
  ctx.lineTo(width + padding, height + padding);
  ctx.stroke();
  
  // Calculate points
  const points = data.map((point, i) => ({
    x: padding + (i / (data.length - 1)) * width,
    y: height + padding - (point.value / maxValue) * height
  }));
  
  // Draw line
  ctx.strokeStyle = '#36A2EB';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  
  // Draw points and labels
  points.forEach((point, i) => {
    // Draw point
    ctx.fillStyle = data[i].color || '#FF6384';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw value
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(String(data[i].value), point.x, point.y - 15);
    
    // Draw label
    ctx.fillText(data[i].label, point.x, height + padding + 20);
  });
  
  // Draw title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Line Chart', canvas.width / 2, 30);
}

function drawPieChart(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: DataPoint[]) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) / 3;
  
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = -Math.PI / 2;
  
  data.forEach((point, i) => {
    const sliceAngle = (point.value / total) * Math.PI * 2;
    
    // Draw slice
    ctx.fillStyle = point.color || '#36A2EB';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw label
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${point.value}`, labelX, labelY);
    
    // Draw legend
    const legendX = canvas.width - 120;
    const legendY = 60 + i * 30;
    
    ctx.fillStyle = point.color || '#36A2EB';
    ctx.fillRect(legendX, legendY, 20, 20);
    
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${point.label}: ${point.value}`, legendX + 30, legendY + 14);
    
    currentAngle += sliceAngle;
  });
  
  // Draw title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Pie Chart', canvas.width / 2, 30);
}

function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}