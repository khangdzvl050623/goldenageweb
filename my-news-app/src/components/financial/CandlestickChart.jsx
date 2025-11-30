import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {Box, Heading, Text} from '@chakra-ui/react';

const CandlestickChart = ({data = [], title = 'Price Chart'}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Box p={6} borderRadius="lg" bg="white" boxShadow="sm" textAlign="center">
        <Heading as="h3" size="md" mb={3}>
          {title}
        </Heading>
        <Text color="gray.500">Không có dữ liệu biểu đồ.</Text>
      </Box>
    );
  }

  return (
    <Box p={4} borderRadius="lg" bg="white" boxShadow="sm">
      <Heading as="h3" size="md" mb={4}>
        {title}
      </Heading>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{top: 20, right: 30, bottom: 20, left: 60}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="time"/>
          <YAxis yAxisId="left" label={{value: 'Price', angle: -90, position: 'insideLeft'}}/>
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{value: 'Volume', angle: 90, position: 'insideRight'}}
          />
          <Tooltip
            contentStyle={{backgroundColor: '#f3f4f6'}}
            formatter={(value) => (typeof value === 'number' ? value.toFixed(2) : value)}
          />
          <Legend/>
          <Bar yAxisId="right" dataKey="volume" fill="#94a3b8" opacity={0.3} name="Volume"/>
          <Bar
            yAxisId="left"
            dataKey="high"
            name="Giá"
            shape={<CandleStick/>}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

const CandleStick = (props) => {
  const {x, y, width, height, payload} = props;
  if (!payload || typeof payload !== 'object') return null;

  const {open, close, high, low} = payload;
  const priceRange = Math.max(high - low, 0.0001);
  const scale = height / priceRange;

  const yLow = y;
  const yHigh = y - (high - low) * scale;
  const yOpen = y - (open - low) * scale;
  const yClose = y - (close - low) * scale;

  const isUp = close >= open;
  const color = isUp ? '#22c55e' : '#ef4444';
  const bodyWidth = width * 0.5;

  return (
    <g>
      <line
        x1={x + width / 2}
        y1={yHigh}
        x2={x + width / 2}
        y2={yLow}
        stroke={color}
        strokeWidth={1.5}
      />
      <rect
        x={x + (width - bodyWidth) / 2}
        y={Math.min(yOpen, yClose)}
        width={bodyWidth}
        height={Math.abs(yClose - yOpen) || 1}
        fill={color}
        stroke={color}
      />
    </g>
  );
};

export default CandlestickChart;

