'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getLogs } from '@/services/logService'
import Link from 'next/link'
import useSocket from '@/hooks/useSocket'



export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('7days')
  const [data, setData] = useState<any[]>([]) // Store the fetched data
  const [averages, setAverages] = useState<any>({ mood: 0, anxiety: 0, sleepHours: 0, stressLevel: 0 }) // Store averages
  const [loading, setLoading] = useState<boolean>(false) // Loading state
  const [error, setError] = useState<string | null>(null) // Error state
  const socket = useSocket('http://localhost:8080');

  // Function to fetch data from API
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getLogs(timeRange)
      const fetchedData = response.data
      setData(fetchedData)

      // Calculate averages based on the fetched data
      const calculatedAverages = fetchedData.reduce((acc: any, day: any) => {
        acc.mood += Number(day.mood) || 0
        acc.anxiety += Number(day.anxiety) || 0
        acc.sleepHours += Number(day.sleepHours) || 0
        acc.stressLevel += Number(day.stressLevel) || 0
        return acc
      }, { mood: 0, anxiety: 0, sleepHours: 0, stressLevel: 0 })

      Object.keys(calculatedAverages).forEach(key => {
        calculatedAverages[key] = Number((calculatedAverages[key] / fetchedData.length).toFixed(1))
      })
      setAverages(calculatedAverages)
    } catch (err: any) {
        
    } finally {
      setLoading(false)
    }
  }

  // Fetch data whenever timeRange changes
  useEffect(() => {
    fetchData()
  }, [timeRange])

 

  // Handling the timeRange change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)
  }

  useEffect(() => {
    if (socket) {
      socket.on("dailylog-updated", (newLog) => {
        setData([...data,newLog ])
      });
    }
  }, [socket]);

  // Loading 
  if (loading) {
    return <div className='w-full h-dvh flex justify-center items-center'>
      <svg className='animate-spin' xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="100" height="100">
        <path d="M23.27,16.245c.469,.469,.714,1.143,.73,1.755-.015,.612-.257,1.282-.723,1.747l-2.578,2.522c-.194,.19-.447,.285-.699,.285-.26,0-.519-.101-.715-.301-.386-.395-.379-1.027,.016-1.414l1.881-1.84h-2.181c-1.654,0-3,1.346-3,3v1c0,.553-.447,1-1,1s-1-.447-1-1v-1c0-2.757,2.243-5,5-5h2.181l-1.881-1.84c-.395-.387-.401-1.02-.016-1.414,.388-.395,1.021-.401,1.414-.016l2.57,2.515ZM15,2c-1.103,0-2,.897-2,2v14.5c0,3.032-2.468,5.5-5.5,5.5-2.422,0-4.515-1.556-5.233-3.835-1.408-.921-2.267-2.479-2.267-4.165,0-.886,.235-1.737,.686-2.5-.45-.763-.686-1.614-.686-2.5,0-1.568,.752-3.04,2-3.979v-.021c0-1.897,1.327-3.489,3.102-3.898,.409-1.774,2.002-3.102,3.898-3.102,1.194,0,2.267,.526,3,1.357,.733-.832,1.806-1.357,3-1.357,1.896,0,3.489,1.327,3.898,3.102,1.774,.409,3.102,2.001,3.102,3.898v.021c1.248,.939,2,2.41,2,3.979,0,.425-.056,.848-.165,1.257-.119,.448-.523,.743-.965,.743-.086,0-.172-.011-.259-.034-.533-.142-.851-.69-.708-1.224,.064-.242,.097-.492,.097-.743,0-1.07-.591-2.067-1.543-2.603-.37-.208-.568-.627-.494-1.045,.02-.115,.037-.231,.037-.352,0-1.103-.897-2-2-2-.553,0-1-.448-1-1,0-1.103-.897-2-2-2Zm-4,2c0-1.103-.897-2-2-2s-2,.897-2,2c0,.552-.447,1-1,1-1.103,0-2,.897-2,2,0,.121,.018,.237,.037,.352,.074,.418-.124,.837-.494,1.045-.952,.535-1.543,1.533-1.543,2.603,0,.675,.234,1.322,.679,1.872,.296,.367,.296,.89,0,1.257-.444,.549-.679,1.196-.679,1.871,0,1.096,.611,2.104,1.597,2.631,.254,.137,.437,.376,.502,.657,.368,1.597,1.768,2.712,3.401,2.712,1.93,0,3.5-1.57,3.5-3.5V4Z" />
      </svg>
    </div>
  }

  // Error handling
  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mental Health Dashboard</h1>
      <div className="mb-4 align-baseline flex md:flex-row flex-col">
        <Select onValueChange={handleTimeRangeChange} defaultValue={timeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
        <div className="ms-2">
          <Button asChild>
            <Link href="/dashboard/daily-log">Add New Daily Log</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Average Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{averages?.mood || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Anxiety</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{averages?.anxiety || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Sleep</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{averages?.sleepHours || 0} hrs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Stress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{averages?.stressLevel || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Mental Health Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="mood" stroke="#8884d8" />
                <Line type="monotone" dataKey="anxiety" stroke="#82ca9d" />
                <Line type="monotone" dataKey="stressLevel" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Sleep Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sleepHours" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Daily Logs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Mood</th>
                <th className="px-4 py-2 border">Anxiety</th>
                <th className="px-4 py-2 border">Sleep Hours</th>
                <th className="px-4 py-2 border">Stress Level</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 && data.map((day, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{day.date}</td>
                  <td className="px-4 py-2 border">{day.mood}</td>
                  <td className="px-4 py-2 border">{day.anxiety}</td>
                  <td className="px-4 py-2 border">{day.sleepHours}</td>
                  <td className="px-4 py-2 border">{day.stressLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
