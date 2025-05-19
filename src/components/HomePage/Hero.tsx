import PageSection from '@/layouts/PageSection'
import React from 'react'

const Hero: React.FC = () => {
  return (
    <PageSection width="wide">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1">
          <h1 className="text-4xl font-bold">Hero</h1>
        </div>
      </div>
    </PageSection>
  )
}

export default Hero
