import { useEffect, useState } from 'react'
import { useJobsStore } from '@/store/useJobsStore'
import NeonGlow from '@/components/custom/NeonGlow'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Building2, Clock, MapPin, ArrowRight, Briefcase } from 'lucide-react'

const JobSearch = () => {
  const { jobs, applications, isLoading, searchJobs, applyToJob, getApplications, updateApplicationStatus } = useJobsStore()
  const [activeTab, setActiveTab] = useState('search')

  useEffect(() => {
    searchJobs()
    getApplications()
  }, [searchJobs, getApplications])

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
            <Button onClick={() => searchJobs()} disabled={isLoading}>
              Refresh Jobs
            </Button>
          </NeonGlow>
        </div>

        <TabsContent value="search" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : jobs.length > 0 ? (
              jobs.map(job => (
                <Card key={job.job_id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {job.employer_logo ? (
                          <img 
                            src={job.employer_logo} 
                            alt={`${job.employer_name} logo`}
                            className="h-12 w-12 object-contain"
                          />
                        ) : (
                          <Building2 className="h-12 w-12 text-muted-foreground" />
                        )}
                        <div>
                          <CardTitle className="text-xl">{job.job_title}</CardTitle>
                          <CardDescription>{job.employer_name}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {job.job_employment_type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.job_city || job.job_country}
                      </div>
                    </div>
                    <ScrollArea className="h-24">
                      <p className="text-sm">{job.job_description}</p>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => window.open(job.job_google_link, '_blank')}>
                      View Details
                    </Button>
                    <NeonGlow>
                      <Button onClick={() => applyToJob(job)} disabled={isLoading}>
                        Quick Apply <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </NeonGlow>
                  </CardFooter>
                </Card>
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
            {isLoading ? (
              // Loading skeletons for applications
              Array(3).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-[100px]" />
                  </CardContent>
                </Card>
              ))
            ) : applications.length > 0 ? (
              applications.map(application => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {application.employerLogo ? (
                          <img 
                            src={application.employerLogo} 
                            alt={`${application.companyName} logo`}
                            className="h-12 w-12 object-contain"
                          />
                        ) : (
                          <Building2 className="h-12 w-12 text-muted-foreground" />
                        )}
                        <div>
                          <CardTitle className="text-xl">{application.jobTitle}</CardTitle>
                          <CardDescription>{application.companyName}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {application.jobLocation}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Applied {formatDate(application.appliedAt)}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Button variant="outline" onClick={() => window.open(application.jobUrl, '_blank')}>
                      View Job
                    </Button>
                    <Select
                      value={application.status}
                      onValueChange={(value: any) => updateApplicationStatus(application.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="interviewing">Interviewing</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardFooter>
                </Card>
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