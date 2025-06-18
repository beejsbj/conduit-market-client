import Button from './Button'
import Icon from '../Icon'

export const ZapButton: React.FC = () => {
  return (
    <Button variant="ghost" size="icon">
      <Icon.Zap className="text-primary" />
    </Button>
  )
}
