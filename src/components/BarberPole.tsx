interface BarberPoleProps {
  orientation?: 'horizontal' | 'vertical'
  height?: string
  width?: string
  className?: string
}

export default function BarberPole({
  orientation = 'horizontal',
  height = '6px',
  width = '100%',
  className = '',
}: BarberPoleProps) {
  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      className={`overflow-hidden flex-shrink-0 ${className}`}
      style={{
        height: isHorizontal ? height : '100%',
        width: isHorizontal ? width : width,
        minHeight: isHorizontal ? height : undefined,
        minWidth: !isHorizontal ? width : undefined,
      }}
    >
      <div
        className="w-full h-full barber-stripe"
        style={
          !isHorizontal
            ? {
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  #C1121F 0px,  #C1121F 10px,
                  #F8F9FA 10px, #F8F9FA 20px,
                  #023E8A 20px, #023E8A 30px,
                  #F8F9FA 30px, #F8F9FA 40px
                )`,
                backgroundSize: '40px 100%',
                animation: 'stripe-h 1.2s linear infinite',
              }
            : undefined
        }
      />
    </div>
  )
}
