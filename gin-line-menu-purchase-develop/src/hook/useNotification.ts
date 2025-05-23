import { useState, useEffect } from 'react'
import { SnackbarKey, useSnackbar } from 'notistack'
import { useAppSelector } from '@/redux/hook'

export default function useNotification() {
    const [notificationId, setNotificationId] = useState<SnackbarKey>('')
    const { message } = useAppSelector(state => state.app)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    useEffect(() => {
        if (message.type) {
            const messageContent = message.content ?? ''
            const key = enqueueSnackbar(messageContent, {
                variant: message.type,
            })
            setNotificationId(key)
        }
    }, [message])

    useEffect(() => {
        // Mounted
        closeSnackbar()
    }, [])

    return {
        notificationId
    }
}