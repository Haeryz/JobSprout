import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const Subscription = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Subscription</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>JobSprout Subscriptions</CardTitle>
          <CardDescription>
            Choose the plan that fits your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Subscription content will be implemented soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Subscription