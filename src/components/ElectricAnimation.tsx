import { useEffect } from 'react'

const DURATION = '10s'

interface NoiseGeneratorProps {
  id?: string
  baseFrequency?: number
  numOctaves?: number
  seed?: number
  animated?: boolean
  result?: string
}

const NoiseGenerator = ({
  id = 'noise',
  baseFrequency = 0.2,
  numOctaves = 1,
  seed = 2,
  animated = true,
  result = 'noise'
}: NoiseGeneratorProps) => {
  return (
    <feTurbulence
      type="fractalNoise"
      baseFrequency={baseFrequency}
      numOctaves={numOctaves}
      seed={seed}
      result={result}
      id={id}
    >
      {animated && (
        <animate
          attributeType="XML"
          attributeName="seed"
          from={seed}
          to={seed + 118}
          dur={DURATION}
          repeatCount="indefinite"
        />
      )}
    </feTurbulence>
  )
}

interface GlowBlurProps {
  id?: string
  stdDeviation?: number
  result?: string
}

const GlowBlur = ({
  id = 'glowBlur',
  stdDeviation = 3.5,
  result = 'coloredBlur'
}: GlowBlurProps) => {
  return <feGaussianBlur id={id} stdDeviation={stdDeviation} result={result} />
}

interface StrokeCreatorProps {
  id: string
  baseRadius: number
  strokeWidth?: number
  sourceIn?: string
  displacementScale?: number
  noiseResult?: string
}

const StrokeCreator = ({
  id,
  baseRadius,
  strokeWidth = 1,
  sourceIn = 'SourceGraphic',
  displacementScale = 10,
  noiseResult = 'noise'
}: StrokeCreatorProps) => {
  const baseShapeId = `${id}BaseShape`
  const strokeShapeId = `${id}StrokeShape`
  const strokeResultId = `${id}Stroke`
  const displacedStrokeId = `${id}DisplacedStroke`

  return (
    <>
      <feMorphology
        id={`${id}BaseDilate`}
        in={sourceIn}
        operator="dilate"
        radius={baseRadius}
        result={baseShapeId}
      />
      <feMorphology
        id={`${id}StrokeDilate`}
        in={baseShapeId}
        operator="dilate"
        radius={strokeWidth}
        result={strokeShapeId}
      />
      <feComposite
        operator="out"
        in={strokeShapeId}
        in2={baseShapeId}
        result={strokeResultId}
      />
      <feDisplacementMap
        xChannelSelector="R"
        yChannelSelector="G"
        in={strokeResultId}
        in2={noiseResult}
        result={displacedStrokeId}
        colorInterpolationFilters="sRGB"
        scale={displacementScale}
      />
    </>
  )
}

const ElectricFillStatic = () => {
  return (
    <filter id="electric-fill-static">
      <NoiseGenerator animated={false} />

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

      <GlowBlur />

      {/* Merges the blur effect and the displaced graphic */}
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="displacementMap" />
      </feMerge>
    </filter>
  )
}

const ElectricFill = () => {
  return (
    <filter id="electric-fill">
      <NoiseGenerator />

      <StrokeCreator id="stroke" baseRadius={1.2} />

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

      <GlowBlur />

      {/* Merges the blur effect and the displaced graphic */}
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="displacementMap" />
        <feMergeNode in="strokeDisplacedStroke" />
      </feMerge>
    </filter>
  )
}

const ElectricShock = () => {
  return (
    <filter id="electric-shock">
      <NoiseGenerator />

      <StrokeCreator id="shock" baseRadius={5} />

      <feDisplacementMap
        xChannelSelector="R"
        yChannelSelector="G"
        in="SourceGraphic"
        in2="noise"
        result="fillDisplacementMap"
        colorInterpolationFilters="sRGB"
        scale="10"
      />
      <GlowBlur />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="shockDisplacedStroke" />
        <feMergeNode in="fillDisplacementMap" />
      </feMerge>
    </filter>
  )
}

const ElectricOutline = () => {
  return (
    <filter id="electric-outline">
      <NoiseGenerator />

      <StrokeCreator id="outline" baseRadius={3} />
      <StrokeCreator id="outlineInner" baseRadius={0} />

      <feDisplacementMap
        xChannelSelector="R"
        yChannelSelector="G"
        in="outlineDisplacedStroke"
        in2="noise"
        result="strokeDisplacementMap"
        colorInterpolationFilters="sRGB"
        scale="-10"
      />
      <feDisplacementMap
        xChannelSelector="R"
        yChannelSelector="G"
        in="outlineInnerDisplacedStroke"
        in2="noise"
        result="strokeDisplacementMapInner"
        colorInterpolationFilters="sRGB"
        scale="-10"
      />

      <GlowBlur />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="strokeDisplacementMap" />
        {/* <feMergeNode in="strokeDisplacementMapInner" /> */}
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  )
}

const ElectricOutlineOnly = () => {
  return (
    <filter id="electric-outline-only">
      <NoiseGenerator />

      <StrokeCreator id="outlineOnly" baseRadius={0} />

      <GlowBlur />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="outlineOnlyDisplacedStroke" />
      </feMerge>
    </filter>
  )
}

const Pixelate = () => {
  const getPixelateStrength = (strength: number) => {
    return {
      floodXY: 4 * strength,
      floodSize: 2 * strength,
      compositeSize: 10 * strength,
      morphologyRadius: 5 * strength
    }
  }

  // Choose which strength to use (change this to test different levels)
  const currentStrength = getPixelateStrength(0.24)
  return (
    <filter id="pixelate" x="0" y="0">
      <feFlood
        x={currentStrength.floodXY}
        y={currentStrength.floodXY}
        height={currentStrength.floodSize}
        width={currentStrength.floodSize}
      />

      <feComposite
        width={currentStrength.compositeSize}
        height={currentStrength.compositeSize}
      />

      <feTile result="a" />

      <feComposite in="SourceGraphic" in2="a" operator="in" />

      <feMorphology
        operator="dilate"
        radius={currentStrength.morphologyRadius}
      />
    </filter>
  )
}

const ElectricAnimation = () => {
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
        <Pixelate />

        {/* fill */}
        <ElectricFill />
        <ElectricFillStatic />
        <ElectricShock />
        <ElectricOutline />
        <ElectricOutlineOnly />
      </svg>
    </div>
  )
}

export default ElectricAnimation
