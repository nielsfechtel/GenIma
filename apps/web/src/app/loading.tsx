export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={
              'w-4 h-4 bg-primary dark:bg-primary-foreground rounded-full animate-pulse'
            }
            style={{
              animationDelay: `${index * 200}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
