import { Building2, MapPin, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import NeonGlow from '@/components/custom/NeonGlow'

interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  job_city?: string;
  job_country: string;
  job_employment_type: string;
  job_description: string;
  job_google_link: string;
  job_apply_link?: string;
}

interface JobCardProps {
  job?: Job;
  isLoading?: boolean;
  onApply?: (job: Job) => void;
  disableApply?: boolean;
}

export const JobCardSkeleton = () => {
  return (
    <Card>
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
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <Skeleton className="h-3 w-[100px]" />
        </div>
        <Skeleton className="h-20 w-full" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-10 w-[120px]" />
        <Skeleton className="h-10 w-[120px]" />
      </CardFooter>
    </Card>
  )
}

const JobCard = ({ job, isLoading, onApply, disableApply }: JobCardProps) => {
  if (isLoading || !job) {
    return <JobCardSkeleton />
  }

  return (
    <Card>
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
        {onApply && !disableApply && (
          <NeonGlow>
            <Button onClick={() => onApply(job)} disabled={isLoading}>
              Quick Apply <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </NeonGlow>
        )}
      </CardFooter>
    </Card>
  )
}

export default JobCard 