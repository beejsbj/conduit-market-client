import bannerImage from '@/assets/images/banner.png'
import PageSection from '@/layouts/PageSection'
interface BannerProps {
  imageSrc?: string
}

const Banner: React.FC<BannerProps> = ({ imageSrc }) => {
  // resolve image src
  const image = bannerImage

  return (
    <PageSection
      width="wide"
      className=" lg:pl-0 lg:pr-0 pt-10 mt-20 mb-20 pb-10 border-t border-b border-base-800"
    >
      <picture className="banner rounded-lg aspect-[7/1]">
        <img
          src={image}
          alt="Banner"
          className="object-cover h-full w-full object-[50%_25%]"
        />
      </picture>
    </PageSection>
  )
}

export default Banner
