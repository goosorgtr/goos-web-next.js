// This is a placeholder for toast hook
// Will be implemented with sonner or shadcn toast component

export function useToast() {
  return {
    toast: (message: string) => {
      console.log('Toast:', message)
    },
    success: (message: string) => {
      console.log('Success:', message)
    },
    error: (message: string) => {
      console.error('Error:', message)
    },
  }
}
