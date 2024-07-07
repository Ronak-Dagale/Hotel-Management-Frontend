import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { AgCharts } from 'ag-charts-react'
import { useAuth } from '../../store/auth'

const Revenue = () => {
  const [dayData, setDayData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [year, setYear] = useState(new Date().getFullYear())
  const { auth } = useAuth()

  useEffect(() => {
    const fetchDayData = async () => {
      const { token } = auth
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/history/revenue/daily`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setDayData(response.data)
      } catch (error) {
        console.error('Error fetching daily revenue data:', error)
      }
    }

    const fetchMonthlyData = async () => {
      const { token } = auth
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/history/revenue/monthly/${year}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setMonthlyData(response.data)
      } catch (error) {
        console.error('Error fetching monthly revenue data:', error)
        setMonthlyData([]) // Clear existing data on error
      }
    }

    fetchDayData()
    fetchMonthlyData()
  }, [year, auth])

  const dayOptions = {
    title: {
      text: 'Daily Revenue for This Month',
    },
    data: dayData.map(({ date, revenue }) => ({
      date:
        typeof date === 'string' ? date.split('-').reverse().join('-') : date,
      revenue,
    })),
    series: [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'revenue',
        yName: 'Revenue',
      },
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Revenue (Rs)',
        },
      },
    ],
    legend: {
      position: 'bottom',
    },
  }

  const monthOptions = {
    title: {
      text: `Monthly Revenue for ${year}`,
    },
    data: monthlyData,
    series: [
      {
        type: 'line',
        xKey: 'month',
        yKey: 'revenue',
        yName: 'Revenue',
      },
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Revenue (Rs)',
        },
      },
    ],
    legend: {
      position: 'bottom',
    },
  }

  const handleYearChange = (event) => {
    setYear(event.target.value)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2>Daily Revenue</h2>
        <AgCharts options={dayOptions} />
      </div>
      <div>
        <h2>Monthly Revenue</h2>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor='year'>Choose Year: </label>
          <select id='year' value={year} onChange={handleYearChange}>
            {[2022, 2023, 2024].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        {monthlyData.length > 0 ? (
          <AgCharts options={monthOptions} />
        ) : (
          <p>No data available for the selected year</p>
        )}
      </div>
    </div>
  )
}

export default Revenue
