'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { postLogs } from '@/services/logService'
import { useRouter } from "next/navigation";
import useSocket from '@/hooks/useSocket'


type DailyLogFormInputs = {
    date: string
    mood: number
    anxiety: number
    sleepHours: number
    sleepQuality: string
    physicalActivity: string
    activityDuration: number
    socialInteractions: number
    stressLevel: number
    symptoms: string
}

export default function DailyLogForm() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<DailyLogFormInputs>({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            mood: 3,
            anxiety: 2,
            sleepHours: 8,
            sleepQuality: 'Good',
            physicalActivity: '',
            activityDuration: 0,
            socialInteractions: 0,
            stressLevel: 5,
            symptoms: ''
        }
    })
    const router = useRouter();
    const mood = watch('mood')
    const anxiety = watch('anxiety')
    const stressLevel = watch('stressLevel')
    const socket = useSocket('http://localhost:8080');

    

    const onSubmit: SubmitHandler<DailyLogFormInputs> = async (data) => {
        try {
            const response = await postLogs(JSON.stringify(data))
            if (response) {
                alert('Daily log submitted successfully!');
                router.push('/dashboard')
                socket?.emit('dailylog-update',data);
            }

        } catch (error: any) {
            alert(error.message)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Daily Mental Health Log</CardTitle>
                    <CardDescription>Track your daily mental health and well-being</CardDescription>
                </CardHeader>
                <CardContent>
                    <form  className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    type="date"
                                    id="date"
                                    {...register('date', { required: 'Date is required' })}
                                />
                                {errors.date && <span className="text-red-500 text-sm">{errors.date.message}</span>}
                            </div>

                            <div>
                                <Label htmlFor="sleepHours">Hours of Sleep</Label>
                                <Input
                                    type="number"
                                    id="sleepHours"
                                    {...register('sleepHours', {
                                        required: 'Sleep hours are required',
                                        min: { value: 0, message: 'Cannot be negative' },
                                        max: { value: 24, message: 'Cannot exceed 24 hours' }
                                    })}
                                />
                                {errors.sleepHours && <span className="text-red-500 text-sm">{errors.sleepHours.message}</span>}
                            </div>

                            <div>
                                <Label htmlFor="sleepQuality">Sleep Quality</Label>
                                <Select
                                    onValueChange={(value) => setValue('sleepQuality', value)}
                                    defaultValue="Good"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select sleep quality" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Poor">Poor</SelectItem>
                                        <SelectItem value="Fair">Fair</SelectItem>
                                        <SelectItem value="Good">Good</SelectItem>
                                        <SelectItem value="Excellent">Excellent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="physicalActivity">Physical Activity</Label>
                                <Input
                                    type="text"
                                    id="physicalActivity"
                                    placeholder="e.g., Walking, Running, Yoga"
                                    {...register('physicalActivity')}
                                />
                            </div>

                            <div>
                                <Label htmlFor="activityDuration">Activity Duration (minutes)</Label>
                                <Input
                                    type="number"
                                    id="activityDuration"
                                    {...register('activityDuration', { min: 0 })}
                                />
                            </div>

                            <div>
                                <Label htmlFor="socialInteractions">Social Interactions</Label>
                                <Input
                                    type="number"
                                    id="socialInteractions"
                                    {...register('socialInteractions', { min: 0 })}
                                />
                            </div>

                            <div>
                                <Label htmlFor="mood">Mood (1-10)</Label>
                                <Slider
                                    id="mood"
                                    min={1}
                                    max={10}
                                    step={1}
                                    value={[mood]}
                                    onValueChange={(value) => setValue('mood', value[0])}
                                />
                                <span className="text-sm text-muted-foreground">{mood}</span>
                            </div>

                            <div>
                                <Label htmlFor="anxiety">Anxiety Level (1-10)</Label>
                                <Slider
                                    id="anxiety"
                                    min={1}
                                    max={10}
                                    step={1}
                                    value={[anxiety]}
                                    onValueChange={(value) => setValue('anxiety', value[0])}
                                />
                                <span className="text-sm text-muted-foreground">{anxiety}</span>
                            </div>

                            <div>
                                <Label htmlFor="stressLevel">Stress Level (1-10)</Label>
                                <Slider
                                    id="stressLevel"
                                    min={1}
                                    max={10}
                                    step={1}
                                    value={[stressLevel]}
                                    onValueChange={(value) => setValue('stressLevel', value[0])}
                                />
                                <span className="text-sm text-muted-foreground">{stressLevel}</span>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="symptoms">Symptoms of Depression or Anxiety</Label>
                            <Textarea
                                id="symptoms"
                                placeholder="Describe any symptoms you experienced today..."
                                {...register('symptoms')}
                            />
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit(onSubmit)}>Save</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
