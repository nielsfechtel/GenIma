export default function LoadingAnim() {
  return (
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
  )
}
