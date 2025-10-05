import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {defineDocuments, defineLocations, presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'

const previewUrl = process.env.SANITY_PREVIEW_URL || 'http://localhost:3000'

const mainDocumentRoutes = defineDocuments([
  {
    route: '/blog/:slug',
    resolve: ({params}) =>
      params?.slug
        ? {
            filter: '_type == "post" && slug.current == ',
            params: {slug: params.slug},
          }
        : undefined,
  },
])

const documentLocations = defineLocations({
  post: {
    select: {
      slug: 'slug.current',
      title: 'title',
    },
    resolve: (value) => {
      if (!value?.slug) {
        return {
          message: 'Missing slug – add one to enable Canvas links.',
          tone: 'caution',
        }
      }

      return {
        locations: [
          {
            title: value.title || 'Blog post',
            href: /blog/,
          },
        ],
      }
    },
  },
})

export default defineConfig({
  name: 'default',
  title: 'lior_sanity',

  projectId: '53gqdkzj',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      previewUrl,
      resolve: {
        mainDocuments: mainDocumentRoutes,
        locations: documentLocations,
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  apps: {
    canvas: {
      enabled: true,
      // Provide the deployed Studio origin if you need Canvas links when running locally.
      // fallbackStudioOrigin: 'your-studio.sanity.studio',
    },
  },
})
