'use client';

import clsx from 'clsx';
import { Image as ImageType } from 'lib/umbraco/types';
import Image from 'next/image';
import { useState } from 'react';

export default function Carousel({
    images,
    ...props
  }: {
    images: ImageType[];
  } & React.ComponentProps<'div'>) {
    const [currentImage, setCurrentImage] = useState(0);
  
    return (
      <div className={clsx('absolute inset-0', props?.className )}>
        <div className="relative w-full h-full overflow-hidden">

          {images[currentImage] && (
            <Image
              className='object-contain w-full h-full'
              src={images[currentImage]?.url as string}
              alt={images[currentImage]?.altText as string}
              width={images[currentImage]?.width}
              height={images[currentImage]?.height}
              priority={true}
            />
          )}
          
          {images.length > 1 ? (
            <ul className="absolute bottom-0 pb-8 flex gap-4 justify-center w-full z-20">
              {images.map((image, index) => {
                const isActive = index === currentImage;
                return (
                  <li key={index}>
                    <button
                      aria-label="Enlarge product image"
                      className={clsx('w-4 h-4 rounded-full overflow-hidden indent-60 text-xs transition-colors',
                        isActive ? 'bg-umb-blue cursor-auto' : 'bg-umb-gray hover:bg-umb-blue cursor-pointer')}
                      onClick={() => setCurrentImage(index)}
                      >
                    {index}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

        </div>
        
      </div>
    );
  }