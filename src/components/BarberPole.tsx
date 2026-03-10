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
  const isH = orientation === 'horizontal'

  return (
    <div
      className={`flex-shrink-0 ${className}`}
      style={{
        height: isH ? height : '100%',
        width:  isH ? width  : width,
        background: isH
          ? 'repeating-linear-gradient(90deg, #C1121F 0px, #C1121F 10px, #F8F9FA 10px, #F8F9FA 20px, #023E8A 20px, #023E8A 30px, #F8F9FA 30px, #F8F9FA 40px)'
          : 'repeating-linear-gradient(180deg, #C1121F 0px, #C1121F 10px, #F8F9FA 10px, #F8F9FA 20px, #023E8A 20px, #023E8A 30px, #F8F9FA 30px, #F8F9FA 40px)',
      }}
    />
  )
}
