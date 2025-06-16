import { useEffect } from 'react'

const ElectricAnimation = () => {
  const Duration = '10s'

  useEffect(() => {
    const IO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.remove('electric-disabled')
          } else {
            entry.target.classList.add('electric-disabled')
          }
        }
      },
      { threshold: 0.1 }
    )

    // helper that (re)scans the DOM for matching nodes
    const scan = () => {
      document
        .querySelectorAll<HTMLElement>(
          '.electric-shock, .electric-fill, .electric-outline, .electric-outline-only'
        )
        .forEach((el) => {
          el.classList.add('electric-disabled') // start muted
          IO.observe(el)
        })
    }

    scan() // initial scan

    // observe future DOM mutations so lazily-rendered icons are handled
    const MO = new MutationObserver(scan)
    MO.observe(document.body, { childList: true, subtree: true })

    return () => {
      IO.disconnect()
      MO.disconnect()
    }
  }, [])

  return (
    <div className="absolute -z-10 w-0 h-0 invisible pointer-events-none">
      <svg>
        <filter id="electric-fill">
          {/* Creates the noise */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.2"
            numOctaves="1"
            seed="2"
            result="noise"
            id="noise"
          >
            {/* Animates the noise */}
            <animate
              attributeType="XML"
              attributeName="seed"
              from="2"
              to="120"
              dur={Duration}
              repeatCount="indefinite"
            />
          </feTurbulence>

          {/* Takes in source graphic and displaces it with the noise */}
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            in="SourceGraphic"
            in2="noise"
            result="displacementMap"
            colorInterpolationFilters="sRGB"
            scale="10"
          />

          {/* Creates the blur effect */}
          <feGaussianBlur
            id="glowBlur"
            stdDeviation="3.5"
            result="coloredBlur"
          />

          {/* Merges the blur effect and the displaced graphic */}
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="displacementMap" />
          </feMerge>
        </filter>

        {/* outline */}
        <filter id="electric-outline-only">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.2"
            numOctaves="1"
            seed="2"
            result="noise"
            id="noise"
          >
            <animate
              attributeType="XML"
              attributeName="seed"
              from="2"
              to="120"
              dur={Duration}
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feMorphology
            id="morph3"
            in="SourceGraphic"
            operator="dilate"
            radius="0"
            result="morph1"
          />
          <feMorphology
            id="morph4"
            in="morph1"
            operator="dilate"
            radius="1"
            result="morph2"
          />
          <feComposite
            operator="out"
            in="morph2"
            in2="morph1"
            result="strokeText"
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            in="strokeText"
            in2="noise"
            result="displacementMap"
            colorInterpolationFilters="sRGB"
            scale="10"
          />
          <feGaussianBlur
            id="glowBlur"
            stdDeviation="3.5"
            result="coloredBlur"
          />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="displacementMap" />
          </feMerge>
        </filter>
        <filter id="electric-outline">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.2"
            numOctaves="1"
            seed="2"
            result="noise"
            id="noise"
          >
            <animate
              attributeType="XML"
              attributeName="seed"
              from="2"
              to="120"
              dur={Duration}
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feMorphology
            id="morph3"
            in="SourceGraphic"
            operator="dilate"
            radius="5"
            result="morph1"
          />
          <feMorphology
            id="morph4"
            in="morph1"
            operator="dilate"
            radius="1"
            result="morph2"
          />
          <feComposite
            operator="out"
            in="morph2"
            in2="morph1"
            result="strokeText"
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            in="strokeText"
            in2="noise"
            result="strokeDisplacementMap1"
            colorInterpolationFilters="sRGB"
            scale="-10"
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            in="strokeDisplacementMap1"
            in2="noise"
            result="strokeDisplacementMap"
            colorInterpolationFilters="sRGB"
            scale="10"
          />
          <feGaussianBlur
            id="glowBlur"
            stdDeviation="3.5"
            result="coloredBlur"
          />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="strokeDisplacementMap" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="electric-shock">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.2"
            numOctaves="1"
            seed="2"
            result="noise"
            id="noise"
          >
            <animate
              attributeType="XML"
              attributeName="seed"
              from="2"
              to="120"
              dur={Duration}
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feMorphology
            id="morph3"
            in="SourceGraphic"
            operator="dilate"
            radius="5"
            result="morph1"
          />
          <feMorphology
            id="morph4"
            in="morph1"
            operator="dilate"
            radius="1"
            result="morph2"
          />
          <feComposite
            operator="out"
            in="morph2"
            in2="morph1"
            result="strokeText"
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            in="strokeText"
            in2="noise"
            result="strokeDisplacementMap"
            colorInterpolationFilters="sRGB"
            scale="10"
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            in="SourceGraphic"
            in2="noise"
            result="fillDisplacementMap"
            colorInterpolationFilters="sRGB"
            scale="10"
          />
          <feGaussianBlur
            id="glowBlur"
            stdDeviation="3.5"
            result="coloredBlur"
          />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="strokeDisplacementMap" />
            <feMergeNode in="fillDisplacementMap" />
          </feMerge>
        </filter>
      </svg>
    </div>
  )
}

export default ElectricAnimation
