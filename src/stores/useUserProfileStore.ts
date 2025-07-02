import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getNdk } from '@/services/ndkService'
import type { NDKUserProfile, NDKUser } from '@nostr-dev-kit/ndk'

export interface ExtendedUserProfile extends NDKUserProfile {
  // Core Nostr profile fields
  name?: string
  displayName?: string
  about?: string
  picture?: string
  banner?: string
  website?: string
  nip05?: string

  // Lightning fields
  lud06?: string // LNURL
  lud16?: string // Lightning Address

  // Additional metadata
  location?: string

  // Social links
  twitter?: string
  github?: string
  telegram?: string

  // Timestamps
  created_at?: number
  updated_at?: number
}

interface UserProfileState {
  // Profile data
  profile: ExtendedUserProfile | null
  isLoading: boolean
  error: string | null
  lastFetched: number | null

  // Actions
  fetchProfile: (user: NDKUser) => Promise<void>
  updateProfile: (updates: Partial<ExtendedUserProfile>) => Promise<void>
  clearProfile: () => void
  refreshProfile: (user: NDKUser) => Promise<void>
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,
      lastFetched: null,

      fetchProfile: async (user: NDKUser) => {
        const { lastFetched } = get()
        const now = Date.now()

        // Check if we have recent cached data
        if (
          lastFetched &&
          now - lastFetched < CACHE_DURATION &&
          get().profile
        ) {
          // Using cached profile data
          return
        }

        set({ isLoading: true, error: null })

        try {
          // Fetching fresh profile data

          const userProfile = await user.fetchProfile()

          if (userProfile) {
            const extendedProfile: ExtendedUserProfile = {
              ...userProfile,
              picture: userProfile.image || userProfile.picture,
              updated_at: now
            }

            // Try to parse any additional fields from the profile
            try {
              // Some profiles store additional data as JSON in specific fields
              const additionalData = userProfile as any
              if (additionalData.lud06)
                extendedProfile.lud06 = additionalData.lud06
              if (additionalData.lud16)
                extendedProfile.lud16 = additionalData.lud16
              if (additionalData.location)
                extendedProfile.location = additionalData.location
              if (additionalData.twitter)
                extendedProfile.twitter = additionalData.twitter
              if (additionalData.github)
                extendedProfile.github = additionalData.github
              if (additionalData.telegram)
                extendedProfile.telegram = additionalData.telegram
            } catch (e) {
              console.warn(
                '[UserProfileStore] Could not parse additional profile fields:',
                e
              )
            }

            set({
              profile: extendedProfile,
              isLoading: false,
              lastFetched: now,
              error: null
            })
          } else {
            throw new Error('No profile data returned')
          }
        } catch (error) {
          console.error('[UserProfileStore] Failed to fetch profile:', error)
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : 'Failed to fetch profile'
          })
        }
      },

      updateProfile: async (updates: Partial<ExtendedUserProfile>) => {
        set({ isLoading: true, error: null })

        try {
          const ndk = await getNdk()
          const user = await ndk.signer?.user()

          if (!user) {
            throw new Error('No authenticated user found')
          }

          const currentProfile = get().profile || {}
          const updatedProfile = {
            ...currentProfile,
            ...updates,
            updated_at: Date.now()
          }

          const profileContent = {
            name: updatedProfile.name,
            display_name: updatedProfile.displayName,
            about: updatedProfile.about,
            picture: updatedProfile.picture,
            banner: updatedProfile.banner,
            website: updatedProfile.website,
            nip05: updatedProfile.nip05,
            lud06: updatedProfile.lud06,
            lud16: updatedProfile.lud16,
            location: updatedProfile.location,
            twitter: updatedProfile.twitter,
            github: updatedProfile.github,
            telegram: updatedProfile.telegram
          }

          const cleanContent = Object.fromEntries(
            Object.entries(profileContent).filter(
              ([_, value]) => value !== undefined
            )
          )

          if (user.profile) {
            Object.assign(user.profile, cleanContent)
          } else {
            user.profile = cleanContent
          }

          await user.publish()
          set({
            profile: updatedProfile as ExtendedUserProfile,
            isLoading: false,
            lastFetched: Date.now()
          })
        } catch (error) {
          console.error('[UserProfileStore] Failed to update profile:', error)
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : 'Failed to update profile'
          })
        }
      },

      refreshProfile: async (user: NDKUser) => {
        set({ lastFetched: null })
        await get().fetchProfile(user)
      },

      clearProfile: () => {
        set({
          profile: null,
          isLoading: false,
          error: null,
          lastFetched: null
        })
      }
    }),
    {
      name: 'conduit-user-profile',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        lastFetched: state.lastFetched
      })
    }
  )
)
