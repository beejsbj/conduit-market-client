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

// Individual icon component interface
interface IconProps {
  className?: string
  fill?: string
}

// Create individual icon components
const createIconComponent = (IconComponent: React.ComponentType<any>) => {
  return ({ className, fill }: IconProps) => (
    <picture className={className}>
      <IconComponent className={fill} />
    </picture>
  )
}

// Icon object with all individual components
const Icon = {
  ArrowLeft: createIconComponent(ArrowLeft),
  ArrowRight: createIconComponent(ArrowRight),
  ChevronUp: createIconComponent(ChevronUp),
  ChevronDown: createIconComponent(ChevronDown),
  ChevronLeft: createIconComponent(ChevronLeft),
  ChevronRight: createIconComponent(ChevronRight),
  Heart: createIconComponent(Heart),
  Lock: createIconComponent(Lock),
  Mail: createIconComponent(Mail),
  ShoppingCart: createIconComponent(ShoppingCart),
  Messages: createIconComponent(MessagesSquare),
  Search: createIconComponent(SearchIcon),
  User: createIconComponent(User),
  Wand: createIconComponent(Wand),
  Menu: createIconComponent(Menu),
  X: createIconComponent(X),
  Zap: createIconComponent(Zap),
  Minus: createIconComponent(Minus),
  Plus: createIconComponent(Plus),
  Trash: createIconComponent(Trash),
  ReceiptText: createIconComponent(ReceiptText),
  Ellipsis: createIconComponent(Ellipsis),
  ShoppingBag: createIconComponent(ShoppingBagIcon),
  Star: createIconComponent(Star),
  XIcon: createIconComponent(XIcon),
  Paste: createIconComponent(ClipboardPaste),
  UserPlus: createIconComponent(UserPlus),
  Alert: createIconComponent(TriangleAlert),
  Copy: createIconComponent(Copy),
  Key: createIconComponent(KeyRound),
  ShieldCheck: createIconComponent(LucideShieldCheck),
  Type: createIconComponent(Type),
  Link: createIconComponent(Link),
  PhoneCall: createIconComponent(PhoneCall),
  Share: createIconComponent(Share),
  Landmark: createIconComponent(Landmark),
  Home: createIconComponent(Home),
  MessageCircle: createIconComponent(MessageCircle)
}

export default Icon
