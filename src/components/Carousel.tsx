import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import React, { useRef, useState, useEffect, Children } from 'react'
import Button from './Buttons/Button'

interface CarouselProps {
  children: React.ReactNode
  className?: string
  visibleItems?: number
  visibleItemsMobile?: number
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  visibleItems = 4,
  visibleItemsMobile = 1,
  className,
  ...props
}) => {
  const carouselRef = useRef<HTMLUListElement>(null)
  const childrenCount = Children.count(children)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(
    childrenCount > visibleItems
  )

  const calculateCurrentPage = (
    scrollLeft: number,
    clientWidth: number,
    scrollWidth: number
  ) => {
    // If we can't scroll, we're always on page 0
    if (scrollWidth <= clientWidth) return 0

    // Calculate the progress through the scrollable area (0 to 1)
    const maxScroll = scrollWidth - clientWidth
    const progress = Math.max(0, Math.min(1, scrollLeft / maxScroll))

    // Convert progress to page number
    return Math.round(progress * (totalPages - 1))
  }

  const updateScrollInfo = () => {
    const carousel = carouselRef.current
    if (carousel) {
      const { scrollLeft, clientWidth, scrollWidth } = carousel

      // Update scroll buttons visibility
      setCanScrollPrev(scrollLeft > 0)
      setCanScrollNext(Math.ceil(scrollLeft + clientWidth) < scrollWidth)

      // Update current page
      const newPage = calculateCurrentPage(scrollLeft, clientWidth, scrollWidth)
      setCurrentPage(newPage)
    }
  }

  // Calculate total pages whenever the content changes
  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      const { clientWidth, scrollWidth } = carousel
      const newTotalPages = Math.max(1, Math.ceil(scrollWidth / clientWidth))
      setTotalPages(newTotalPages)

      // Also update current page when total pages changes
      updateScrollInfo()
    }
  }, [children, visibleItems])

  // Add scroll event listener
  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      const handleScroll = () => {
        requestAnimationFrame(updateScrollInfo)
      }

      carousel.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll, { passive: true })

      // Initial update
      handleScroll()

      return () => {
        carousel.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }
    }
  }, [totalPages]) // Re-run when totalPages changes

  const handleScrollPrev = () => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.scrollLeft -= carousel.clientWidth
    }
  }

  const handleScrollNext = () => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.scrollLeft += carousel.clientWidth
    }
  }

  const scrollToPage = (pageIndex: number) => {
    const carousel = carouselRef.current
    if (carousel) {
      const { clientWidth, scrollWidth } = carousel
      const maxScroll = scrollWidth - clientWidth
      const targetScroll = (maxScroll * pageIndex) / (totalPages - 1)
      carousel.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
    }
  }

  // Calculate item width based on visibleItems
  const itemBasis = Math.floor(100 / visibleItems) + -2 + '%'
  const itemBasisMobile = Math.floor(100 / visibleItemsMobile) + -2 + '%'

  return (
    <div className={cn('grid relative mt-4', className)}>
      <ul
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {Children.map(children, (child, index) => (
          <li
            key={index}
            className="flex-shrink-0 min-w-fit md:min-w-min snap-start"
            style={{
              flexBasis: itemBasis
            }}
          >
            {child}
          </li>
        ))}
      </ul>

      {/* Scroll indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToPage(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                currentPage === index
                  ? 'bg-purple-500 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              )}
              aria-label={`Go to page ${index + 1}`}
              aria-current={currentPage === index ? 'true' : 'false'}
            />
          ))}
        </div>
      )}

      {canScrollPrev && (
        <Button
          variant="primary"
          size="icon"
          rounded={false}
          className="absolute -left-0 top-1/2 -translate-y-1/2 z-10"
          onClick={handleScrollPrev}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}

      {canScrollNext && (
        <Button
          variant="primary"
          size="icon"
          rounded={false}
          className="absolute -right-0 top-1/2 -translate-y-1/2 z-10"
          onClick={handleScrollNext}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export default Carousel
