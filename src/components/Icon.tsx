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

// custom icon components
const SatoshiIcon: React.ComponentType<any> = ( { className, fill }: IconProps) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill} className={cn(className)}
	
	strokeWidth={1}
	stroke='currentColor'
	>
	<path fillRule="evenodd" clipRule="evenodd" d="M12.75 18.5V21H11.25V18.5H12.75Z" />
	<path fillRule="evenodd" clipRule="evenodd" d="M17 16.75H7V15.25H17V16.75Z" />
	<path fillRule="evenodd" clipRule="evenodd" d="M17 12.7499H7V11.2499H17V12.7499Z" />
	<path fillRule="evenodd" clipRule="evenodd" d="M17 8.75H7V7.25H17V8.75Z" />
	<path fillRule="evenodd" clipRule="evenodd" d="M12.75 3V5.5H11.25V3H12.75Z" />
	</svg>
)


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
  MessageCircle: createIconComponent(MessageCircle),
  Satoshi: createIconComponent(SatoshiIcon)
}

export default Icon






