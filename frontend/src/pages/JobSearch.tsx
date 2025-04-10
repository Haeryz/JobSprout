import { useEffect, useState } from 'react'
import { useJobsStore } from '@/store/useJobsStore'
import NeonGlow from '@/components/custom/NeonGlow'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Briefcase } from 'lucide-react'
import JobCard, { JobCardSkeleton } from '@/components/custom/JobCard'
import ApplicationCard, { ApplicationCardSkeleton } from '@/components/custom/ApplicationCard'

const JobSearch = () => {
  const { jobs, applications, isLoading, searchJobs, applyToJob, getApplications, updateApplicationStatus } = useJobsStore()
  const [activeTab, setActiveTab] = useState('search')
  const [showJobsLoading, setShowJobsLoading] = useState(true)
  const [showApplicationsLoading, setShowApplicationsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setShowJobsLoading(true)
      setShowApplicationsLoading(true)
      await searchJobs()
      await getApplications()
    }
    
    fetchData()
  }, [searchJobs, getApplications])
  
  // Update loading states when data is available
  useEffect(() => {
    let jobsTimer: number | null = null;
    let appsTimer: number | null = null;
    
    if (!isLoading && jobs.length > 0) {
      // Use a small delay to ensure smooth transition
      jobsTimer = window.setTimeout(() => {
        setShowJobsLoading(false)
      }, 300)
    } else if (!isLoading) {
      // If there are no jobs, still hide the loading after a delay
      jobsTimer = window.setTimeout(() => {
        setShowJobsLoading(false)
      }, 300)
    }
    
    if (!isLoading && applications.length > 0) {
      appsTimer = window.setTimeout(() => {
        setShowApplicationsLoading(false)
      }, 300)
    } else if (!isLoading) {
      appsTimer = window.setTimeout(() => {
        setShowApplicationsLoading(false)
      }, 300)
    }
    
    return () => {
      if (jobsTimer) window.clearTimeout(jobsTimer)
      if (appsTimer) window.clearTimeout(appsTimer)
    }
  }, [isLoading, jobs.length, applications.length])

  // Reset loading states when refreshing data
  const handleRefresh = async () => {
    setShowJobsLoading(true)
    setShowApplicationsLoading(true)
    await searchJobs()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-500'
      case 'interviewing':
        return 'bg-yellow-500'
      case 'accepted':
        return 'bg-green-500'
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="container p-6">
      <Tabs defaultValue="search" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="search">Job Search</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>
          <NeonGlow>
            <Button onClick={handleRefresh} disabled={isLoading}>
              Refresh Jobs
            </Button>
          </NeonGlow>
        </div>

        <TabsContent value="search" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            {showJobsLoading || isLoading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))
            ) : jobs.length > 0 ? (
              jobs.map(job => (
                <JobCard 
                  key={job.job_id}
                  job={job}
                  onApply={applyToJob}
                  isLoading={isLoading}
                />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-xl font-semibold mb-2">No Jobs Found</p>
                  <p className="text-muted-foreground">Try refreshing or check back later for new opportunities.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            {showApplicationsLoading || isLoading ? (
              // Loading skeletons for applications
              Array(3).fill(0).map((_, i) => (
                <ApplicationCardSkeleton key={i} />
              ))
            ) : applications.length > 0 ? (
              applications.map(application => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onStatusChange={updateApplicationStatus}
                  isLoading={isLoading}
                />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-xl font-semibold mb-2">No Applications Yet</p>
                  <p className="text-muted-foreground">Start applying to jobs to track your applications here.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default JobSearch