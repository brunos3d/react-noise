import { HTMLAttributes, SVGProps, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import styles from './styles.module.css';

export type BlurredCardProps = HTMLAttributes<HTMLElement> & {
  turbulence?: SVGProps<SVGFETurbulenceElement>;
  light?: SVGProps<SVGFESpecularLightingElement>;
};

const fallbackTurbulenceConfig: Partial<SVGProps<SVGFETurbulenceElement>> = {
  type: `turbulence`,
  baseFrequency: `0.2`,
  numOctaves: `4`,
  seed: `15`,
  stitchTiles: `stitch`,
  result: `turbulence`,
};

const fallbackLightConfig: Partial<SVGProps<SVGFESpecularLightingElement>> = {
  surfaceScale: `33`,
  specularConstant: `0.75`,
  specularExponent: `20`,
  lightingColor: `hsl(23, 0%, 100%)`,
  in: `turbulence`,
  result: `specularLighting`,
};

export default function BlurredCard({
  className,
  turbulence,
  light,
  ...rest
}: BlurredCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setSize({
      x: ref.current?.clientWidth || 0,
      y: ref.current?.clientHeight || 0,
    });
  }, []);

  const {
    type = fallbackTurbulenceConfig.type,
    baseFrequency = fallbackTurbulenceConfig.baseFrequency,
    numOctaves = fallbackTurbulenceConfig.numOctaves,
    seed = fallbackTurbulenceConfig.seed,
    stitchTiles = fallbackTurbulenceConfig.stitchTiles,
    result: noiseResult = fallbackTurbulenceConfig.result,
    ...restTurbulenceProps
  } = turbulence || {};

  const {
    surfaceScale = fallbackLightConfig.surfaceScale,
    specularConstant = fallbackLightConfig.specularConstant,
    specularExponent = fallbackLightConfig.specularExponent,
    lightingColor = fallbackLightConfig.lightingColor,
    in: inner = fallbackLightConfig.in,
    result: lightResult = fallbackLightConfig.result,
    ...restLightProps
  } = light || {};

  return (
    <div className={cn(styles.noiseContainer, className)} {...rest} ref={ref}>
      <svg
        viewBox={`0 0 ${size.x} ${size.y}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noiseFilter" colorInterpolationFilters="linearRGB">
          <feTurbulence
            type={type}
            baseFrequency={baseFrequency}
            numOctaves={numOctaves}
            seed={seed}
            stitchTiles={stitchTiles}
            result={noiseResult}
            {...restTurbulenceProps}
          />

          <feSpecularLighting
            surfaceScale={surfaceScale}
            specularConstant={specularConstant}
            specularExponent={specularExponent}
            lightingColor={lightingColor}
            in={inner}
            result={lightResult}
            {...restLightProps}
          >
            <feDistantLight azimuth="3" elevation="154" />
          </feSpecularLighting>
        </filter>

        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
