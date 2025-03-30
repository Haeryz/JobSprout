import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import NeonGlow from '@/components/custom/NeonGlow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'

const Profile = () => {
  const { user } = useAuthStore()

  // Profile information
  const [fullName, setFullName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [desiredJobTitle, setDesiredJobTitle] = useState('')
  const [country, setCountry] = useState('')
  const [experience, setExperience] = useState('')
  const [workPreferences, setWorkPreferences] = useState<string[]>([])

  // Additional information
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [currentEmployer, setCurrentEmployer] = useState('')
  const [educationLevel, setEducationLevel] = useState('')
  const [employmentTypePreferences, setEmploymentTypePreferences] = useState<string[]>([])
  const [city, setCity] = useState('')
  const [willingToRelocate, setWillingToRelocate] = useState(false)
  const [howDidYouFindUs, setHowDidYouFindUs] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const [additionalInfo, setAdditionalInfo] = useState('')

  // Demographic information
  const [gender, setGender] = useState('')
  const [hispanicLatino, setHispanicLatino] = useState('')
  const [veteranStatus, setVeteranStatus] = useState('')
  const [disabilityStatus, setDisabilityStatus] = useState('')
  const [workAuthorization, setWorkAuthorization] = useState('')
  const [sponsorshipRequired, setSponsorshipRequired] = useState('')
  const [minimumSalary, setMinimumSalary] = useState(50000)

  const handleWorkPreferenceChange = (value: string) => {
    setWorkPreferences(prev => {
      if (prev.includes(value)) {
        return prev.filter(p => p !== value)
      } else {
        return [...prev, value]
      }
    })
  }

  const handleEmploymentTypeChange = (value: string) => {
    setEmploymentTypePreferences(prev => {
      if (prev.includes(value)) {
        return prev.filter(p => p !== value)
      } else {
        return [...prev, value]
      }
    })
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResume(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this data to your API
    toast.success('Profile saved successfully')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        {/* Profile Information Section */}
        <Card className="mb-8 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-[#22C55E] dark:text-[#4ADE80]">Profile Information</CardTitle>
            <CardDescription>Your basic information and work preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (123) 456-7890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desiredJobTitle">Desired Job Title</Label>
                  <Input 
                    id="desiredJobTitle" 
                    value={desiredJobTitle} 
                    onChange={(e) => setDesiredJobTitle(e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country of Residence</Label>
                  <Input 
                    id="country" 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input 
                    id="experience" 
                    value={experience} 
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="5"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Work Preferences</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remote" 
                        checked={workPreferences.includes('remote')}
                        onCheckedChange={() => handleWorkPreferenceChange('remote')}
                      />
                      <Label htmlFor="remote" className="font-normal">Remote</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="hybrid" 
                        checked={workPreferences.includes('hybrid')}
                        onCheckedChange={() => handleWorkPreferenceChange('hybrid')}
                      />
                      <Label htmlFor="hybrid" className="font-normal">Hybrid</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="onsite" 
                        checked={workPreferences.includes('onsite')}
                        onCheckedChange={() => handleWorkPreferenceChange('onsite')}
                      />
                      <Label htmlFor="onsite" className="font-normal">Onsite</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information Section */}
        <Card className="mb-8 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-[#22C55E] dark:text-[#4ADE80]">Additional Information</CardTitle>
            <CardDescription>This information helps us better match you with opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <Input 
                    id="linkedinUrl" 
                    value={linkedinUrl} 
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Education Level</Label>
                  <Select value={educationLevel} onValueChange={setEducationLevel}>
                    <SelectTrigger id="educationLevel">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="associate">Associate's Degree</SelectItem>
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="San Francisco"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentEmployer">Current Employer</Label>
                  <Input 
                    id="currentEmployer" 
                    value={currentEmployer} 
                    onChange={(e) => setCurrentEmployer(e.target.value)}
                    placeholder="Company Inc."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Employment Type Preferences</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="fullTime" 
                        checked={employmentTypePreferences.includes('fullTime')}
                        onCheckedChange={() => handleEmploymentTypeChange('fullTime')}
                      />
                      <Label htmlFor="fullTime" className="font-normal">Full Time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="partTime" 
                        checked={employmentTypePreferences.includes('partTime')}
                        onCheckedChange={() => handleEmploymentTypeChange('partTime')}
                      />
                      <Label htmlFor="partTime" className="font-normal">Part Time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="contract" 
                        checked={employmentTypePreferences.includes('contract')}
                        onCheckedChange={() => handleEmploymentTypeChange('contract')}
                      />
                      <Label htmlFor="contract" className="font-normal">Contract</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="freelance" 
                        checked={employmentTypePreferences.includes('freelance')}
                        onCheckedChange={() => handleEmploymentTypeChange('freelance')}
                      />
                      <Label htmlFor="freelance" className="font-normal">Freelance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="internship" 
                        checked={employmentTypePreferences.includes('internship')}
                        onCheckedChange={() => handleEmploymentTypeChange('internship')}
                      />
                      <Label htmlFor="internship" className="font-normal">Internship</Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="willingToRelocate">Willing to Relocate</Label>
                  <Switch 
                    id="willingToRelocate" 
                    checked={willingToRelocate}
                    onCheckedChange={setWillingToRelocate}
                  />
                </div>
              </div>
            </div>

            {/* Full-width elements */}
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="howDidYouFindUs">How did you find us?</Label>
                <Select value={howDidYouFindUs} onValueChange={setHowDidYouFindUs}>
                  <SelectTrigger id="howDidYouFindUs">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="friend">From a friend</SelectItem>
                    <SelectItem value="search">Search engine</SelectItem>
                    <SelectItem value="social">Social media</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Upload Resume</Label>
                <Input id="resume" type="file" onChange={handleResumeChange} />
                <p className="text-xs text-gray-500">PDF, DOC, or DOCX files only. Maximum size 5MB.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                <Textarea 
                  id="additionalInfo" 
                  value={additionalInfo} 
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Add any additional information that might help us understand your professional background and goals"
                  className="h-24"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demographic Information Section */}
        <Card className="mb-8 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-[#22C55E] dark:text-[#4ADE80]">Demographic Information</CardTitle>
            <CardDescription>This information is optional and used for diversity and inclusion purposes only</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <RadioGroup id="gender" value={gender} onValueChange={setGender}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="font-normal">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="font-normal">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nonBinary" id="nonBinary" />
                      <Label htmlFor="nonBinary" className="font-normal">Non-binary</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="preferNotToSay" id="preferNotToSay" />
                      <Label htmlFor="preferNotToSay" className="font-normal">Prefer not to say</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hispanicLatino">Hispanic/Latino</Label>
                  <RadioGroup id="hispanicLatino" value={hispanicLatino} onValueChange={setHispanicLatino}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="hispanicYes" />
                      <Label htmlFor="hispanicYes" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="hispanicNo" />
                      <Label htmlFor="hispanicNo" className="font-normal">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="preferNotToSay" id="hispanicPreferNotToSay" />
                      <Label htmlFor="hispanicPreferNotToSay" className="font-normal">Prefer not to say</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="veteranStatus">Veteran Status</Label>
                  <RadioGroup id="veteranStatus" value={veteranStatus} onValueChange={setVeteranStatus}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="veteran" id="veteran" />
                      <Label htmlFor="veteran" className="font-normal">I am a veteran</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="notVeteran" id="notVeteran" />
                      <Label htmlFor="notVeteran" className="font-normal">I am not a veteran</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="preferNotToSay" id="veteranPreferNotToSay" />
                      <Label htmlFor="veteranPreferNotToSay" className="font-normal">Prefer not to say</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="disabilityStatus">Disability Status</Label>
                  <RadioGroup id="disabilityStatus" value={disabilityStatus} onValueChange={setDisabilityStatus}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="disabilityYes" />
                      <Label htmlFor="disabilityYes" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="disabilityNo" />
                      <Label htmlFor="disabilityNo" className="font-normal">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="preferNotToSay" id="disabilityPreferNotToSay" />
                      <Label htmlFor="disabilityPreferNotToSay" className="font-normal">Prefer not to say</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workAuthorization">Work Authorization</Label>
                  <RadioGroup id="workAuthorization" value={workAuthorization} onValueChange={setWorkAuthorization}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="authorized" id="authorized" />
                      <Label htmlFor="authorized" className="font-normal">Authorized to work in the US</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="notAuthorized" id="notAuthorized" />
                      <Label htmlFor="notAuthorized" className="font-normal">Not authorized to work in the US</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sponsorshipRequired">Sponsorship Required</Label>
                  <RadioGroup id="sponsorshipRequired" value={sponsorshipRequired} onValueChange={setSponsorshipRequired}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="sponsorshipYes" />
                      <Label htmlFor="sponsorshipYes" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="sponsorshipNo" />
                      <Label htmlFor="sponsorshipNo" className="font-normal">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Salary Slider */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="minimumSalary">Minimum Salary</Label>
                <span className="text-sm font-medium">${minimumSalary.toLocaleString()}</span>
              </div>
              <Slider
                id="minimumSalary"
                min={30000}
                max={200000}
                step={5000}
                value={[minimumSalary]}
                onValueChange={(values) => setMinimumSalary(values[0])}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>$30,000</span>
                <span>$200,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <NeonGlow className="w-full sm:w-auto">
          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-gradient-to-b from-[#4ADE80] to-[#22C55E] text-white 
            hover:from-[#22C55E] hover:to-[#22C55E]"
          >
            Save Profile
          </Button>
        </NeonGlow>
      </form>
    </div>
  )
}

export default Profile