//

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs'
import { ColorGuide } from '@/components/StyleGuide/ColorGuide'
import { VoicesGuide } from '@/components/StyleGuide/VoicesGuide'
import { ButtonGuide } from '@/components/StyleGuide/ButtonGuide'
import { ComponentsGuide } from '@/components/StyleGuide/ComponentsGuide'
import PageSection from '@/layouts/PageSection'
import { useParams } from 'wouter'
import Breadcrumbs from '@/components/Breadcumbs'
export default function StyleGuidePage() {
  const params = useParams()

  return (
    <main className="grid gap-8">
      <PageSection width="wide">
        <div className="mb-8">
          <Breadcrumbs />
          <h1 className="booming-voice mb-6">Style Guide</h1>
          <p className="text-muted-foreground">
            A comprehensive guide to the design system and components.
          </p>
        </div>

        <Tabs defaultValue={params.page || 'all'} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="voices">Typography & Voices</TabsTrigger>
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 grid gap-20">
            <ColorGuide />
            <VoicesGuide />
            <ButtonGuide />
            <ComponentsGuide />
          </TabsContent>

          <TabsContent value="colors" className="mt-6">
            <ColorGuide />
          </TabsContent>
          <TabsContent value="voices" className="mt-6">
            <VoicesGuide />
          </TabsContent>

          <TabsContent value="buttons" className="mt-6">
            <ButtonGuide />
          </TabsContent>

          <TabsContent value="components" className="mt-6">
            <ComponentsGuide />
          </TabsContent>
        </Tabs>
      </PageSection>
    </main>
  )
}
