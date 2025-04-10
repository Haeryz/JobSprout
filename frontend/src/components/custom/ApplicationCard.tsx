import { Building2, Clock, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  employerLogo: string | null;
  jobLocation: string;
  employmentType: string;
  jobDescription: string;
  jobUrl: string;
  status: 'applied' | 'interviewing' | 'rejected' | 'accepted';
  appliedAt: string;
  updatedAt: string;
}

interface ApplicationCardProps {
  application?: JobApplication;
  isLoading?: boolean;
  onStatusChange?: (applicationId: string, status: JobApplication['status']) => void;
}

export const ApplicationCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </CardContent>
    </Card>
  )
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

const ApplicationCard = ({ application, isLoading, onStatusChange }: ApplicationCardProps) => {
  if (isLoading || !application) {
    return <ApplicationCardSkeleton />
  }

  return (
    <Card>
      <CardContent className="p-6">
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
              <h3 className="text-xl font-semibold">{application.jobTitle}</h3>
              <p className="text-muted-foreground">{application.companyName}</p>
            </div>
          </div>
          <Badge className={getStatusColor(application.status)}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {application.jobLocation}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Applied {formatDate(application.appliedAt)}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" onClick={() => window.open(application.jobUrl, '_blank')}>
            View Job
          </Button>
          {onStatusChange && (
            <Select
              value={application.status}
              onValueChange={(value: any) => onStatusChange(application.id, value)}
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
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ApplicationCard 