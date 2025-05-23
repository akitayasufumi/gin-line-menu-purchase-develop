import client from '@/api/axiosClient'

export const apiGetMe = () => client.get('/me/profile')
