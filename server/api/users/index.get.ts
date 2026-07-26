import { createSupabaseAdminClientFromEnv } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const authUser = event.context.user as { userId?: string; email?: string } | undefined

  if (!authUser?.userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const supabase = createSupabaseAdminClientFromEnv()
  const { data: profile, error } = await supabase
    .from('users')
    .select('id, username, display_name, avatar_url, created_at, updated_at')
    .eq('id', authUser.userId)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 503, statusMessage: 'Database unavailable' })
  }

  return {
    success: true,
    data: {
      id: authUser.userId,
      email: authUser.email ?? null,
      username: profile?.username ?? null,
      displayName: profile?.display_name ?? null,
      avatarUrl: profile?.avatar_url ?? null,
      createdAt: profile?.created_at ?? null,
      updatedAt: profile?.updated_at ?? null,
    },
  }
})
