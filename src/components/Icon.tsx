import {
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Lock,
  Mail,
  ShoppingCart,
  ShoppingBag,
  MessagesSquare,
  SearchIcon,
  User,
  Wand,
  X,
  Type,
  Menu,
  Zap,
  Minus,
  Plus,
  Trash,
  ReceiptText,
  Ellipsis,
  ShoppingBagIcon,
  Star,
  XIcon,
  ClipboardPaste,
  Copy,
  UserPlus,
  TriangleAlert,
  KeyRound,
  LucideShieldCheck,
  Link,
  PhoneCall,
  Share,
  Landmark,
  Home,
  MessageCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Individual icon component interface
interface IconProps {
  className?: string
  fill?: string
}

// Icon map for component lookup
const iconMap = {
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Lock,
  Mail,
  ShoppingCart,
  Messages: MessagesSquare,
  Search: SearchIcon,
  User,
  Wand,
  Menu,
  X,
  Zap,
  Minus,
  Plus,
  Trash,
  ReceiptText,
  Ellipsis,
  ShoppingBag: ShoppingBagIcon,
  Star,
  XIcon,
  Paste: ClipboardPaste,
  UserPlus,
  Alert: TriangleAlert,
  Copy,
  Key: KeyRound,
  ShieldCheck: LucideShieldCheck,
  Type,
  Link,
  PhoneCall,
  Share,
  Landmark,
  Home,
  MessageCircle
} as const

// Icon component that accepts an icon name and applies electric effect styling
const Icon = Object.entries(iconMap).reduce((acc, [name, Component]) => {
  acc[name as keyof typeof iconMap] = ({ className, fill }: IconProps) => (
    <picture
      className={cn(
        className,
        'filter-(--pixelate) group-hover:filter-(--electric-shock)'
      )}
    >
      <Component className={fill} />
    </picture>
  )
  return acc
}, {} as Record<keyof typeof iconMap, React.FC<IconProps>>)

export default Icon
