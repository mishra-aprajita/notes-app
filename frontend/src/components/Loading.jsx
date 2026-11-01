// components/Loading.jsx
// Reusable loading spinner component.
// Can be used inline (small) or as a full-screen overlay.

const Loading = ({ fullScreen = false, message = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-lavender border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl">📝</span>
          </div>
        </div>
        <p className="mt-4 text-secondary font-medium text-sm">{message}</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-3 border-lavender border-t-primary animate-spin" />
        <p className="text-secondary text-sm font-medium">{message}</p>
      </div>
    </div>
  )
}

export default Loading
